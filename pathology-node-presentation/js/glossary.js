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

        // Build regex for each term — word-boundary match.
        // Case-insensitive by default so common nouns ("cohort", "biorepository")
        // light up regardless of casing in slide text. Acronyms still match
        // because their canonical capitalization is preserved in the data-gl
        // attribute used by the tooltip.
        _terms.forEach(function (item) {
            var escaped = item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            item.regex = new RegExp('(?<![\\w-])' + escaped + '(?![\\w-])', 'gi');
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
        // Collect text nodes (skip <code>, <a>, <script>, SVG content,
        // and anything already wrapped). Wrapping SVG <text> content with
        // an HTML <span> silently breaks SVG rendering — the text vanishes
        // because <text> elements only accept <tspan> or text node children.
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                var parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                // Reject ANY text node inside an SVG subtree
                if (parent.namespaceURI === 'http://www.w3.org/2000/svg' ||
                    parent.closest('svg')) {
                    return NodeFilter.FILTER_REJECT;
                }
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
                    var done = false;
                    html = html.replace(item.regex, function (match) {
                        if (done) return match;
                        done = true;
                        replaced = true;
                        section._glWrapped[item.term] = true;
                        // Native title attr is a guaranteed-working fallback
                        // that the browser renders even if our JS tooltip is
                        // suppressed by an overlay or transform issue.
                        var nativeTip = (item.term + ' — ' + item.definition)
                            .replace(/"/g, '&quot;');
                        return '<span class="gl-term" data-gl="' +
                            item.term.replace(/"/g, '&quot;') + '"' +
                            ' title="' + nativeTip + '">' +
                            match + '</span>';
                    });
                }
            });

            if (replaced) {
                var span = document.createElement('span');
                span.innerHTML = html;
                textNode.parentNode.replaceChild(span, textNode);
                // Attach direct per-span listeners as a belt-and-suspenders
                // backup to the document-level delegation. This works even if
                // some Reveal handler swallows mouseover on the document.
                span.querySelectorAll('.gl-term').forEach(function (gt) {
                    gt.addEventListener('mouseenter', function (e) {
                        _onTermEnter({ target: gt });
                    });
                    gt.addEventListener('mouseleave', function (e) {
                        _onTermLeave({ target: gt });
                    });
                });
            }
        });
    }

    // ─── FLOATING TOOLTIP ─────────────────────────────────────
    function _createTooltip() {
        _tooltip = document.createElement('div');
        _tooltip.className = 'gl-tooltip';
        _tooltip.setAttribute('role', 'tooltip');
        _tooltip.innerHTML = '<div class="gl-tooltip-term"></div><div class="gl-tooltip-def"></div>';
        // Append to documentElement (not body) so the tooltip is unaffected by
        // any CSS transforms Reveal applies to body or .reveal — those would
        // turn position:fixed into position:absolute relative to the
        // transformed ancestor, sending the tooltip off-screen. Also bump
        // z-index above every Reveal layer.
        _tooltip.style.zIndex = '999999';
        document.documentElement.appendChild(_tooltip);

        // Event delegation for hover on .gl-term — covers everything wrapped
        // by scanSlides plus anything added later.
        document.addEventListener('mouseover', _onTermEnter, true);
        document.addEventListener('mouseout',  _onTermLeave, true);
        // Touch devices: tap to show, tap elsewhere to hide.
        document.addEventListener('touchstart', function (e) {
            var el = e.target.closest && e.target.closest('.gl-term');
            if (el) { _onTermEnter({ target: el }); }
            else if (_tooltip) { _onTermLeave({ target: document }); }
        }, { passive: true });
    }

    function _onTermEnter(e) {
        var el = e.target.closest && e.target.closest('.gl-term');
        if (!el || !_tooltip) return;

        var termName = el.getAttribute('data-gl');
        var item = _findTerm(termName);
        if (!item) return;

        _tooltip.querySelector('.gl-tooltip-term').textContent = item.term;
        _tooltip.querySelector('.gl-tooltip-def').textContent  = item.definition;

        var rect = el.getBoundingClientRect();
        var tipW = 340;
        var left = rect.left + rect.width / 2 - tipW / 2;
        if (left < 8) left = 8;
        if (left + tipW > window.innerWidth - 8) left = window.innerWidth - tipW - 8;

        _tooltip.style.width = tipW + 'px';
        _tooltip.style.left  = left + 'px';

        // Try ABOVE first
        _tooltip.classList.add('gl-tooltip--visible', 'gl-tooltip--above');
        _tooltip.classList.remove('gl-tooltip--below');
        _tooltip.style.top    = 'auto';
        _tooltip.style.bottom = (window.innerHeight - rect.top + 8) + 'px';

        // If clipped at top, flip BELOW
        var tipRect = _tooltip.getBoundingClientRect();
        if (tipRect.top < 4) {
            _tooltip.classList.remove('gl-tooltip--above');
            _tooltip.classList.add('gl-tooltip--below');
            _tooltip.style.bottom = 'auto';
            _tooltip.style.top    = (rect.bottom + 8) + 'px';
        }

        el.classList.add('gl-term--active');
    }

    function _onTermLeave(e) {
        var el = e.target.closest && e.target.closest('.gl-term');
        if (!_tooltip) return;
        _tooltip.classList.remove('gl-tooltip--visible', 'gl-tooltip--above', 'gl-tooltip--below');
        if (el) el.classList.remove('gl-term--active');
        // Also wipe any active marker that may have been left behind.
        var actives = document.querySelectorAll('.gl-term--active');
        actives.forEach(function (n) { n.classList.remove('gl-term--active'); });
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
