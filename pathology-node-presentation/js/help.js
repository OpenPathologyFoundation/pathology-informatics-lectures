/* ============================================================
   Help Overlay
   ─────────────────────────────────────────────────────────────
   Adds a floating "?" button (bottom-right) and a modal overlay
   that lists keyboard shortcuts and how to edit presenter info.
   Press "?" (Shift + /) to toggle.
   ============================================================ */
var HelpOverlay = (function () {

    var _button = null;
    var _overlay = null;
    var _open = false;

    function init() {
        _createButton();
        _createOverlay();
        _bindKeyboard();
    }

    // ─── FLOATING "?" BUTTON ──────────────────────────────────
    function _createButton() {
        _button = document.createElement('button');
        _button.className = 'help-fab';
        _button.setAttribute('aria-label', 'Show keyboard shortcuts and help');
        _button.setAttribute('title', 'Help  (press ? )');
        _button.innerHTML = '?';
        _button.addEventListener('click', function (e) {
            e.preventDefault();
            toggle();
        });
        document.body.appendChild(_button);
    }

    // ─── MODAL OVERLAY CONTENT ────────────────────────────────
    function _createOverlay() {
        _overlay = document.createElement('div');
        _overlay.className = 'help-overlay';
        _overlay.innerHTML =
            '<div class="help-modal">' +
                '<button class="help-close" aria-label="Close help">×</button>' +
                '<h2>Keyboard Shortcuts &amp; Help</h2>' +
                '<div class="help-grid">' +
                    '<section>' +
                        '<h3>Presenter &amp; Identity</h3>' +
                        '<dl>' +
                            '<dt><kbd>P</kbd></dt>' +
                            '<dd>Edit presenter info — name, credentials, institution, email, and conflict-of-interest disclosures. Data is stored locally in your browser only.</dd>' +
                        '</dl>' +
                    '</section>' +
                    '<section>' +
                        '<h3>Navigation</h3>' +
                        '<dl>' +
                            '<dt><kbd>→</kbd> <kbd>Space</kbd></dt><dd>Next slide</dd>' +
                            '<dt><kbd>←</kbd></dt><dd>Previous slide</dd>' +
                            '<dt><kbd>Home</kbd> / <kbd>End</kbd></dt><dd>Jump to first / last slide</dd>' +
                            '<dt><kbd>ESC</kbd> <kbd>O</kbd></dt><dd>Slide overview grid</dd>' +
                        '</dl>' +
                    '</section>' +
                    '<section>' +
                        '<h3>Reference &amp; Tools</h3>' +
                        '<dl>' +
                            '<dt><kbd>G</kbd></dt><dd>Toggle glossary panel (defined terms from the lecture)</dd>' +
                            '<dt><kbd>S</kbd></dt><dd>Open speaker notes window</dd>' +
                            '<dt><kbd>F</kbd></dt><dd>Fullscreen</dd>' +
                            '<dt><kbd>B</kbd> or <kbd>.</kbd></dt><dd>Blank screen (pause)</dd>' +
                        '</dl>' +
                    '</section>' +
                    '<section>' +
                        '<h3>This Help</h3>' +
                        '<dl>' +
                            '<dt><kbd>?</kbd></dt><dd>Toggle this overlay</dd>' +
                            '<dt><kbd>ESC</kbd></dt><dd>Close this overlay</dd>' +
                        '</dl>' +
                    '</section>' +
                '</div>' +
                '<div class="help-footer">' +
                    'Lecture content is communal and lives on GitHub. Your presenter details stay in your browser and are never uploaded.' +
                '</div>' +
            '</div>';
        document.body.appendChild(_overlay);

        _overlay.querySelector('.help-close').addEventListener('click', close);
        _overlay.addEventListener('click', function (e) {
            if (e.target === _overlay) close();
        });
    }

    // ─── KEYBOARD ─────────────────────────────────────────────
    function _bindKeyboard() {
        document.addEventListener('keydown', function (e) {
            var tag = (e.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            // "?" — toggle help (Shift + / on most layouts)
            if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
                e.preventDefault();
                toggle();
                return;
            }
            // ESC closes the overlay only (don't interfere with Reveal overview)
            if (e.key === 'Escape' && _open) {
                e.preventDefault();
                close();
            }
        });
    }

    function open() {
        _overlay.classList.add('help-overlay--open');
        _open = true;
    }

    function close() {
        _overlay.classList.remove('help-overlay--open');
        _open = false;
    }

    function toggle() {
        if (_open) close();
        else open();
    }

    return { init: init, open: open, close: close, toggle: toggle };
})();
