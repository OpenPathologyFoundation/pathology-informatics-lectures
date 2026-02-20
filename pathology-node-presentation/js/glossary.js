/* ============================================================
   Glossary Engine — term detection, inline tooltips, and panel
   Architecture:
     1. Reads glossary[] from lecture JSON meta
     2. After Reveal init, scans rendered slides for matching terms
     3. Wraps first occurrence per slide in <span class="gl-term">
     4. Shows tooltip on hover with definition
     5. Provides a toggleable full-glossary panel (A-Z index)
     6. Glossary button appears on title slide and Q&A slide
   ============================================================ */

var Glossary = (function () {

    var _terms = [];           // { term, definition, regex }
    var _panel = null;         // the overlay panel element
    var _tooltip = null;       // shared floating tooltip
    var _initialized = false;

    // ─── INIT: receive glossary data from JSON ────────────────
    function init(glossaryData) {
        if (!glossaryData || !glossaryData.length) return;

        // Sort by term length descending so longer terms match first
        // (e.g., "HL7 FHIR" before "HL7")
        _terms = glossaryData.slice().sort(function (a, b) {
            return b.term.length - a.term.length;
        });

        // Build regex for each term — word-boundary match, case-sensitive
        _terms.forEach(function (item) {
            // Escape regex special chars in term
            var escaped = item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // For short acronyms (all caps, ≤5 chars), require word boundaries
            // For longer terms, also use word boundaries
            item.regex = new RegExp('(?<![\\w-])' + escaped + '(?![\\w-])', 'g');
        });

        _createTooltip();
        _createPanel();
        _initialized = true;
    }

    // ─── SCAN SLIDES: wrap terms in <span> ────────────────────
    function scanSlides() {
        if (!_initialized) return;

        var slides = document.querySelectorAll('.reveal .slides section');
        slides.forEach(function (section) {
            _scanNode(section);
        });
    }

    // Walk DOM text nodes, wrap matched terms
    function _scanNode(root) {
        // Collect text nodes (skip <code>, <a>, <script>, already-wrapped)
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                var parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                var tag = parent.tagName.toLowerCase();
                if (tag === 'code' || tag === 'script' || tag === 'style' || tag === 'a') {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.classList.contains('gl-term') || parent.closest('.gl-term')) {
                    return NodeFilter.FILTER_REJECT;
                }
                // Skip title slide text, presenter box, etc.
                if (parent.closest('.title-slide .title-content') && !parent.closest('.presenter-box')) {
                    // Still scan subtitle but not main title
                    if (parent.closest('.animate-title') || parent.tagName === 'H1') {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        var textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);

        // Track which terms have been wrapped in this slide
        var section = root.closest('section') || root;
        if (!section._glWrapped) section._glWrapped = {};

        textNodes.forEach(function (textNode) {
            var text = textNode.nodeValue;
            if (!text || text.trim().length < 2) return;

            var replaced = false;
            var html = text;

            _terms.forEach(function (item) {
                // Only wrap first occurrence of each term per slide
                if (section._glWrapped[item.term]) return;

                item.regex.lastIndex = 0;
                if (item.regex.test(html)) {
                    item.regex.lastIndex = 0;
                    // Replace only the first match
                    var done = false;
                    html = html.replace(item.regex, function (match) {
                        if (done) return match;
                        done = true;
                        replaced = true;
                        section._glWrapped[item.term] = true;
                        return '<span class="gl-term" data-gl="' +
                            item.term.replace(/"/g, '&quot;') + '">' +
                            match + '</span>';
                    });
                }
            });

            if (replaced) {
                var span = document.createElement('span');
                span.innerHTML = html;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
    }

    // ─── FLOATING TOOLTIP ─────────────────────────────────────
    function _createTooltip() {
        _tooltip = document.createElement('div');
        _tooltip.className = 'gl-tooltip';
        _tooltip.innerHTML = '<div class="gl-tooltip-term"></div><div class="gl-tooltip-def"></div>';
        document.body.appendChild(_tooltip);

        // Event delegation for hover on .gl-term
        document.addEventListener('mouseover', function (e) {
            var el = e.target.closest('.gl-term');
            if (!el) return;

            var termName = el.getAttribute('data-gl');
            var item = _findTerm(termName);
            if (!item) return;

            _tooltip.querySelector('.gl-tooltip-term').textContent = item.term;
            _tooltip.querySelector('.gl-tooltip-def').textContent = item.definition;

            // Position near the element
            var rect = el.getBoundingClientRect();
            var tipW = 340;
            var left = rect.left + rect.width / 2 - tipW / 2;
            if (left < 8) left = 8;
            if (left + tipW > window.innerWidth - 8) left = window.innerWidth - tipW - 8;

            var top = rect.top - 8;
            _tooltip.style.width = tipW + 'px';
            _tooltip.style.left = left + 'px';

            // Measure tooltip height to decide above/below
            _tooltip.classList.add('gl-tooltip--visible', 'gl-tooltip--above');
            _tooltip.style.top = 'auto';
            _tooltip.style.bottom = (window.innerHeight - rect.top + 8) + 'px';

            var tipRect = _tooltip.getBoundingClientRect();
            if (tipRect.top < 4) {
                // Not enough room above — show below
                _tooltip.classList.remove('gl-tooltip--above');
                _tooltip.classList.add('gl-tooltip--below');
                _tooltip.style.bottom = 'auto';
                _tooltip.style.top = (rect.bottom + 8) + 'px';
            }

            el.classList.add('gl-term--active');
        });

        document.addEventListener('mouseout', function (e) {
            var el = e.target.closest('.gl-term');
            if (!el) return;
            _tooltip.classList.remove('gl-tooltip--visible', 'gl-tooltip--above', 'gl-tooltip--below');
            el.classList.remove('gl-term--active');
        });
    }

    function _findTerm(name) {
        for (var i = 0; i < _terms.length; i++) {
            if (_terms[i].term === name) return _terms[i];
        }
        return null;
    }

    // ─── FULL GLOSSARY PANEL ──────────────────────────────────
    function _createPanel() {
        _panel = document.createElement('div');
        _panel.className = 'gl-panel';
        _panel.innerHTML =
            '<div class="gl-panel-header">' +
                '<h3>Glossary of Terms</h3>' +
                '<input type="text" class="gl-panel-search" placeholder="Filter terms...">' +
                '<button class="gl-panel-close" aria-label="Close">&times;</button>' +
            '</div>' +
            '<div class="gl-panel-body"></div>';
        document.body.appendChild(_panel);

        // Populate terms alphabetically
        var sorted = _terms.slice().sort(function (a, b) {
            return a.term.toLowerCase().localeCompare(b.term.toLowerCase());
        });

        var body = _panel.querySelector('.gl-panel-body');
        var currentLetter = '';

        sorted.forEach(function (item) {
            var letter = item.term.charAt(0).toUpperCase();
            // If starts with digit or special, group under '#'
            if (!/[A-Z]/.test(letter)) letter = '#';

            if (letter !== currentLetter) {
                currentLetter = letter;
                var letterDiv = document.createElement('div');
                letterDiv.className = 'gl-panel-letter';
                letterDiv.textContent = letter;
                body.appendChild(letterDiv);
            }

            var entry = document.createElement('div');
            entry.className = 'gl-panel-entry';
            entry.setAttribute('data-search', item.term.toLowerCase() + ' ' + item.definition.toLowerCase());
            entry.innerHTML =
                '<span class="gl-panel-term">' + item.term + '</span>' +
                '<span class="gl-panel-def">' + item.definition + '</span>';
            body.appendChild(entry);
        });

        // Close button
        _panel.querySelector('.gl-panel-close').addEventListener('click', function () {
            togglePanel(false);
        });

        // Search filter
        _panel.querySelector('.gl-panel-search').addEventListener('input', function (e) {
            var q = e.target.value.toLowerCase().trim();
            var entries = body.querySelectorAll('.gl-panel-entry');
            var letters = body.querySelectorAll('.gl-panel-letter');

            // Hide all letter dividers first, show as needed
            letters.forEach(function (l) { l.style.display = 'none'; });

            entries.forEach(function (entry) {
                var searchText = entry.getAttribute('data-search');
                var visible = !q || searchText.indexOf(q) !== -1;
                entry.style.display = visible ? '' : 'none';
                if (visible) {
                    // Show the preceding letter divider
                    var prev = entry.previousElementSibling;
                    while (prev && !prev.classList.contains('gl-panel-letter')) {
                        prev = prev.previousElementSibling;
                    }
                    if (prev) prev.style.display = '';
                }
            });
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && _panel.classList.contains('gl-panel--open')) {
                togglePanel(false);
            }
        });
    }

    function togglePanel(forceState) {
        if (!_panel) return;
        var shouldOpen = typeof forceState === 'boolean' ? forceState : !_panel.classList.contains('gl-panel--open');

        if (shouldOpen) {
            _panel.classList.add('gl-panel--open');
            _panel.querySelector('.gl-panel-search').value = '';
            _panel.querySelector('.gl-panel-search').dispatchEvent(new Event('input'));
            setTimeout(function () {
                _panel.querySelector('.gl-panel-search').focus();
            }, 300);
        } else {
            _panel.classList.remove('gl-panel--open');
        }
    }

    // ─── GLOSSARY BUTTON (added to title + QA slides) ────────
    function addButtons() {
        if (!_initialized || !_terms.length) return;

        var count = _terms.length;

        // Title slide button
        var titleSlide = document.querySelector('.title-slide');
        if (titleSlide) {
            var btn = _makeButton(count);
            btn.style.position = 'absolute';
            btn.style.bottom = '16px';
            btn.style.right = '20px';
            titleSlide.appendChild(btn);
        }

        // Q&A slide button
        var qaSlide = document.querySelector('.qa-slide');
        if (qaSlide) {
            var btn2 = _makeButton(count);
            btn2.style.position = 'absolute';
            btn2.style.bottom = '16px';
            btn2.style.right = '20px';
            qaSlide.appendChild(btn2);
        }
    }

    function _makeButton(count) {
        var btn = document.createElement('button');
        btn.className = 'gl-button';
        btn.innerHTML = '<span class="gl-button-icon">📖</span> Glossary <span class="gl-button-count">' + count + '</span>';
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePanel(true);
        });
        return btn;
    }

    // ─── KEYBOARD SHORTCUT ────────────────────────────────────
    function initKeyboard() {
        document.addEventListener('keydown', function (e) {
            // 'G' key (when not in input) toggles glossary
            if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                var tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
                e.preventDefault();
                togglePanel();
            }
        });
    }

    // ─── PUBLIC API ───────────────────────────────────────────
    return {
        init: init,
        scanSlides: scanSlides,
        addButtons: addButtons,
        togglePanel: togglePanel,
        initKeyboard: initKeyboard
    };

})();
