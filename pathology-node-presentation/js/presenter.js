/* ============================================================
   Presenter Configuration
   ─────────────────────────────────────────────────────────────
   Shows a configuration form before the lecture starts.
   Stores presenter identity in localStorage so it persists.
   Provides data to the slide engine for title, COI, and Q&A.

   Design principles:
     • Lecture content is communal (GitHub); presenter is ephemeral
     • "Skip" → anonymous / community mode (no name shown)
     • GitHub contributors link shown in community mode
     • Form only appears once; can be re-opened via keyboard (P)
   ============================================================ */

var Presenter = (function () {

    var STORAGE_KEY = 'pathInfoPresenter';
    var REPO_URL = 'https://github.com/OpenPathologyFoundation/pathology-informatics-lectures';
    var _data = null;         // { name, credentials, institution, email, coi, skipped }
    var _overlay = null;
    var _onReady = null;      // callback when form is submitted/skipped

    // ─── PUBLIC: get presenter data ───────────────────────────
    function getData() {
        return _data;
    }

    function getRepoUrl() {
        return REPO_URL;
    }

    function isSkipped() {
        return !_data || _data.skipped;
    }

    // Full display name: "Name, Credentials" or "Community Lecture"
    function getDisplayName() {
        if (isSkipped()) return '';
        var parts = [_data.name];
        if (_data.credentials) parts[0] += ', ' + _data.credentials;
        return parts[0];
    }

    function getInstitution() {
        if (isSkipped()) return '';
        return _data.institution || '';
    }

    function getEmail() {
        if (isSkipped()) return '';
        return _data.email || '';
    }

    function getCOI() {
        if (isSkipped()) return [];
        if (!_data.coi || !_data.coi.trim()) return ['No conflicts of interest to disclose.'];
        // Split by newlines into separate bullets
        return _data.coi.split('\n').filter(function (line) { return line.trim(); });
    }

    // ─── INIT: check localStorage or show form ───────────────
    function init(callback) {
        _onReady = callback;
        var stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            try {
                _data = JSON.parse(stored);
                if (_onReady) _onReady(_data);
                return;
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        // No stored data → show form
        _showForm();
    }

    // ─── FORM OVERLAY ─────────────────────────────────────────
    function _showForm(prefill) {
        if (_overlay) _overlay.remove();

        var d = prefill || _data || {};

        _overlay = document.createElement('div');
        _overlay.className = 'presenter-overlay';
        _overlay.innerHTML =
            '<div class="presenter-form">' +
                '<div class="presenter-form-header">' +
                    '<h2>Presenter Configuration</h2>' +
                    '<p>This lecture is an open-source community resource. Enter your details to present, or skip for anonymous mode.</p>' +
                '</div>' +
                '<div class="presenter-form-body">' +
                    '<div class="presenter-field">' +
                        '<label for="pf-name">Full Name</label>' +
                        '<input type="text" id="pf-name" placeholder="e.g., Jane Smith" value="' + _esc(d.name || '') + '">' +
                    '</div>' +
                    '<div class="presenter-field">' +
                        '<label for="pf-cred">Credentials</label>' +
                        '<input type="text" id="pf-cred" placeholder="e.g., MD, PhD" value="' + _esc(d.credentials || '') + '">' +
                    '</div>' +
                    '<div class="presenter-field">' +
                        '<label for="pf-inst">Institution</label>' +
                        '<input type="text" id="pf-inst" placeholder="e.g., University Medical Center" value="' + _esc(d.institution || '') + '">' +
                    '</div>' +
                    '<div class="presenter-field">' +
                        '<label for="pf-email">Contact Email <span class="presenter-optional">(optional)</span></label>' +
                        '<input type="email" id="pf-email" placeholder="e.g., jane.smith@university.edu" value="' + _esc(d.email || '') + '">' +
                    '</div>' +
                    '<div class="presenter-field">' +
                        '<label for="pf-coi">Conflict of Interest Disclosures</label>' +
                        '<textarea id="pf-coi" rows="3" placeholder="One disclosure per line, or leave empty for none">' + _esc(d.coi || '') + '</textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="presenter-form-footer">' +
                    '<button class="presenter-btn presenter-btn--skip" type="button">Skip — Present Anonymously</button>' +
                    '<button class="presenter-btn presenter-btn--save" type="button">Save &amp; Present</button>' +
                '</div>' +
                '<div class="presenter-form-note">' +
                    'Press <kbd>P</kbd> during the lecture to change these settings. ' +
                    'Data is stored locally in your browser — never uploaded.' +
                '</div>' +
            '</div>';

        document.body.appendChild(_overlay);

        // Focus first field
        setTimeout(function () {
            var nameInput = _overlay.querySelector('#pf-name');
            if (nameInput) nameInput.focus();
        }, 100);

        // Save button
        _overlay.querySelector('.presenter-btn--save').addEventListener('click', function () {
            _data = {
                name: _overlay.querySelector('#pf-name').value.trim(),
                credentials: _overlay.querySelector('#pf-cred').value.trim(),
                institution: _overlay.querySelector('#pf-inst').value.trim(),
                email: _overlay.querySelector('#pf-email').value.trim(),
                coi: _overlay.querySelector('#pf-coi').value.trim(),
                skipped: false
            };

            // Require at least a name
            if (!_data.name) {
                _overlay.querySelector('#pf-name').style.borderColor = '#e74c3c';
                _overlay.querySelector('#pf-name').focus();
                return;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
            _closeForm();
            if (_onReady) _onReady(_data);
        });

        // Skip button
        _overlay.querySelector('.presenter-btn--skip').addEventListener('click', function () {
            _data = { skipped: true };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
            _closeForm();
            if (_onReady) _onReady(_data);
        });

        // Enter key submits
        _overlay.querySelectorAll('input').forEach(function (input) {
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    _overlay.querySelector('.presenter-btn--save').click();
                }
            });
        });
    }

    function _closeForm() {
        if (_overlay) {
            _overlay.classList.add('presenter-overlay--closing');
            setTimeout(function () {
                if (_overlay) _overlay.remove();
                _overlay = null;
            }, 300);
        }
    }

    function _esc(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    // ─── RE-OPEN FORM (keyboard shortcut P) ──────────────────
    function initKeyboard() {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'p' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                var tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
                // Only if glossary panel isn't open
                if (document.querySelector('.gl-panel--open')) return;
                e.preventDefault();
                _showForm(_data);
                // On re-open, callback reloads the page to re-render slides
                _onReady = function () {
                    window.location.reload();
                };
            }
        });
    }

    // ─── CLEAR stored data ────────────────────────────────────
    function clear() {
        localStorage.removeItem(STORAGE_KEY);
        _data = null;
    }

    // ─── PUBLIC API ───────────────────────────────────────────
    return {
        init: init,
        getData: getData,
        getRepoUrl: getRepoUrl,
        isSkipped: isSkipped,
        getDisplayName: getDisplayName,
        getInstitution: getInstitution,
        getEmail: getEmail,
        getCOI: getCOI,
        initKeyboard: initKeyboard,
        clear: clear
    };

})();
