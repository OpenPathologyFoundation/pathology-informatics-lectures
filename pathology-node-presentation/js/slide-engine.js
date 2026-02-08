/* ============================================================
   Slide Engine — JSON → Reveal.js renderer
   Reads a lecture JSON file and generates <section> elements
   ============================================================ */

var SlideEngine = (function () {

    var _vizQueue = [];   // visualizations to render on slide entry
    var _rendered = {};   // track which vizs have been drawn

    // ─── MAIN ENTRY POINT ────────────────────────────────────
    function loadLecture(jsonUrl, callback) {
        fetch(jsonUrl)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                // Extract lectureId from URL (e.g., 'data/lectures/intro_pathology_informatics.json' → 'intro_pathology_informatics')
                var match = jsonUrl.match(/([^\/]+)\.json$/);
                if (match && data.meta) data.meta.lectureId = match[1];
                renderLecture(data);
                if (callback) callback(data);
            })
            .catch(function (err) {
                console.error('SlideEngine: failed to load ' + jsonUrl, err);
                document.querySelector('.slides').innerHTML =
                    '<section><h2>Error loading lecture</h2><p>' + err.message + '</p></section>';
            });
    }

    // ─── RENDER FULL LECTURE ─────────────────────────────────
    function renderLecture(data) {
        var slidesContainer = document.querySelector('.reveal .slides');
        if (!slidesContainer) return;
        slidesContainer.innerHTML = '';

        // Set page title
        if (data.meta && data.meta.title) {
            document.title = data.meta.title;
        }

        // Apply theme colors from meta
        if (data.meta && data.meta.theme) {
            var root = document.documentElement;
            var t = data.meta.theme;
            if (t.primary) root.style.setProperty('--intro-primary', t.primary);
            if (t.secondary) root.style.setProperty('--intro-secondary', t.secondary);
            if (t.accent) root.style.setProperty('--intro-accent', t.accent);
        }

        // Render each slide
        data.slides.forEach(function (slide) {
            var section = renderSlide(slide, data.meta);
            if (section) slidesContainer.appendChild(section);
        });
    }

    // ─── SLIDE DISPATCHER ────────────────────────────────────
    function renderSlide(slide, meta) {
        var renderers = {
            'title':         renderTitle,
            'content':       renderContent,
            'two-column':    renderTwoColumn,
            'comparison':    renderComparison,
            'poll':          renderPoll,
            'micro-case':    renderMicroCase,
            'timer':         renderTimer,
            'visualization': renderVisualization,
            'workshop':      renderWorkshop,
            'snippets':      renderSnippets,
            'takeaways':     renderTakeaways,
            'qa':            renderQA
        };

        var fn = renderers[slide.type];
        if (!fn) {
            console.warn('SlideEngine: unknown slide type "' + slide.type + '"');
            return null;
        }

        var section = fn(slide, meta);
        section.id = slide.id || '';
        section.setAttribute('data-transition', slide.transition || 'fade');
        if (slide.backgroundGradient) {
            section.setAttribute('data-background-gradient', slide.backgroundGradient);
        }
        return section;
    }

    // ─── HELPERS ─────────────────────────────────────────────
    function el(tag, className, innerHTML) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (innerHTML) e.innerHTML = innerHTML;
        return e;
    }

    function makeBullets(items, fragment) {
        var ul = el('ul', 'fragment-list');
        items.forEach(function (item) {
            var li = el('li', fragment ? 'fragment' : '', item);
            ul.appendChild(li);
        });
        return ul;
    }

    function applyBadge(section, badge) {
        if (!badge) return;
        section.setAttribute('data-badge', badge);
    }

    function addTakeaway(parent, takeaway) {
        if (!takeaway) return;
        var text = typeof takeaway === 'string' ? takeaway : takeaway.text;
        var comment = typeof takeaway === 'object' ? takeaway.comment : null;

        var div = el('div', 'takeaway-accent' + (comment ? ' has-comment' : ''));
        div.innerHTML = '<strong>Takeaway:</strong> ' + text;

        if (comment) {
            var icon = el('span', 'takeaway-info', ' &#9432;');
            icon.setAttribute('aria-label', 'More info');
            div.appendChild(icon);
            var tip = el('div', 'takeaway-comment');
            tip.innerHTML = comment;
            div.appendChild(tip);
        }

        parent.appendChild(div);
    }

    // ─── TITLE SLIDE ─────────────────────────────────────────
    function renderTitle(slide, meta) {
        var s = el('section', 'title-slide');
        s.setAttribute('data-transition', slide.transition || 'zoom');

        var content = el('div', 'title-content');
        content.appendChild(el('h1', 'animate-title', slide.title));
        if (slide.subtitle) {
            content.appendChild(el('h3', 'animate-subtitle', slide.subtitle));
        }

        var box = el('div', 'presenter-box animate-presenter');
        var presenter = (slide.presenter || (meta && meta.presenter) || '');
        var institution = (slide.institution || (meta && meta.institution) || '');
        var date = (slide.date || (meta && meta.date) || '');
        box.innerHTML = '<p><em>' + presenter + '</em><br>' + institution + (date ? ' | ' + date : '') + '</p>';
        content.appendChild(box);

        s.appendChild(content);
        s.appendChild(el('div', 'slide-background-overlay'));
        return s;
    }

    // ─── CONTENT SLIDE ───────────────────────────────────────
    function renderContent(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, slide.badge);
        s.appendChild(el('h2', '', slide.title));

        if (slide.subtitle) {
            var sub = el('p', 'slide-subtitle', slide.subtitle);
            s.appendChild(sub);
        }

        if (slide.bullets) {
            s.appendChild(makeBullets(slide.bullets, slide.fragments !== false));
        }

        if (slide.numberedItems) {
            var ol = el('ol', 'fragment-list');
            slide.numberedItems.forEach(function (item) {
                var li = el('li', slide.fragments !== false ? 'fragment' : '', item);
                ol.appendChild(li);
            });
            s.appendChild(ol);
        }

        addTakeaway(s, slide.takeaway);

        if (slide.note) {
            var note = el('p', 'slide-note', slide.note);
            s.appendChild(note);
        }

        return s;
    }

    // ─── TWO-COLUMN SLIDE ────────────────────────────────────
    function renderTwoColumn(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, slide.badge);
        s.appendChild(el('h2', '', slide.title));

        var cols = el('div', 'content-columns');

        ['left', 'right'].forEach(function (side) {
            var data = slide[side];
            if (!data) return;
            var col = el('div', side + '-column');
            var box = el('div', 'info-box' + (data.highlight ? ' highlight-box' : ''));
            if (data.heading) box.appendChild(el('h3', '', data.heading));
            if (data.bullets) box.appendChild(makeBullets(data.bullets, slide.fragments !== false));
            col.appendChild(box);
            cols.appendChild(col);
        });

        s.appendChild(cols);
        addTakeaway(s, slide.takeaway);
        return s;
    }

    // ─── COMPARISON SLIDE ────────────────────────────────────
    function renderComparison(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, slide.badge);
        s.appendChild(el('h2', '', slide.title));

        var grid = el('div', 'comparison-grid');

        ['left', 'right'].forEach(function (side) {
            var data = slide[side];
            if (!data) return;
            var col = el('div', 'comparison-col ' + (data.style || ''));
            col.appendChild(el('h3', '', data.heading));
            if (data.bullets) col.appendChild(makeBullets(data.bullets, false));
            grid.appendChild(col);
        });

        s.appendChild(grid);
        addTakeaway(s, slide.takeaway);
        return s;
    }

    // ─── POLL SLIDE ──────────────────────────────────────────
    function renderPoll(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, 'interactive');
        s.appendChild(el('h2', '', slide.title));

        var container = el('div', '');
        container.id = 'poll-' + slide.id;
        s.appendChild(container);

        // Defer widget creation to after Reveal init
        _vizQueue.push({
            type: 'poll',
            elementId: 'poll-' + slide.id,
            config: { prompt: slide.prompt, options: slide.options, lectureId: meta.lectureId || '', slideId: slide.id }
        });

        if (slide.note) {
            var note = el('p', 'slide-note', slide.note);
            s.appendChild(note);
        }

        return s;
    }

    // ─── MICRO-CASE SLIDE ────────────────────────────────────
    function renderMicroCase(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, 'interactive');
        s.appendChild(el('h2', '', slide.title));

        var container = el('div', '');
        container.id = 'vote-' + slide.id;
        s.appendChild(container);

        _vizQueue.push({
            type: 'voting',
            elementId: 'vote-' + slide.id,
            config: {
                scenario: slide.scenario,
                options: slide.options,
                discussion: slide.discussion,
                discussionFrame: slide.discussionFrame
            }
        });

        return s;
    }

    // ─── TIMER SLIDE ─────────────────────────────────────────
    function renderTimer(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, 'interactive');
        s.appendChild(el('h2', '', slide.title));

        var container = el('div', '');
        container.id = 'timer-' + slide.id;
        s.appendChild(container);

        _vizQueue.push({
            type: 'timer',
            elementId: 'timer-' + slide.id,
            config: {
                prompt: slide.prompt,
                duration: slide.duration || 90,
                categories: slide.categories
            }
        });

        return s;
    }

    // ─── VISUALIZATION SLIDE ─────────────────────────────────
    function renderVisualization(slide, meta) {
        var s = el('section', 'intro-slide');
        s.setAttribute('data-viz', slide.vizType);
        applyBadge(s, slide.badge);
        s.appendChild(el('h2', '', slide.title));

        if (slide.subtitle) {
            var sub = el('p', 'slide-subtitle', slide.subtitle);
            s.appendChild(sub);
        }

        var vizDiv = el('div', 'viz-container');
        vizDiv.id = 'viz-' + slide.id;
        s.appendChild(vizDiv);

        addTakeaway(s, slide.takeaway);

        // Register for lazy rendering
        _vizQueue.push({
            type: 'viz',
            elementId: 'viz-' + slide.id,
            vizType: slide.vizType,
            vizConfig: slide.vizConfig || {},
            slideId: slide.id
        });

        return s;
    }

    // ─── WORKSHOP SLIDE ──────────────────────────────────────
    function renderWorkshop(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, 'interactive');
        s.appendChild(el('h2', '', slide.title));

        if (slide.instruction) {
            var instr = el('p', 'slide-subtitle');
            instr.textContent = slide.instruction;
            s.appendChild(instr);
        }

        var grid = el('div', 'checklist-grid');

        slide.groups.forEach(function (group) {
            var card = el('div', 'checklist-group');
            card.appendChild(el('h4', '', group.heading));
            var ol = el('ol', '');
            if (group.start) ol.setAttribute('start', group.start);
            group.items.forEach(function (item) {
                ol.appendChild(el('li', '', item));
            });
            card.appendChild(ol);
            grid.appendChild(card);
        });

        s.appendChild(grid);
        return s;
    }

    // ─── SNIPPETS SLIDE ──────────────────────────────────────
    function renderSnippets(slide, meta) {
        var s = el('section', 'intro-slide');
        applyBadge(s, 'interactive');
        s.appendChild(el('h2', '', slide.title));

        var wrap = el('div', 'snippet-cards');

        slide.snippets.forEach(function (snippet, i) {
            var card = el('div', 'snippet-card');
            card.innerHTML = '<span class="snippet-num">' + (i + 1) + '</span>' + snippet;
            wrap.appendChild(card);
        });

        s.appendChild(wrap);

        if (slide.prompt) {
            var prompt = el('div', 'scenario-card');
            prompt.style.borderLeftColor = '#f39c12';
            prompt.innerHTML = '<strong>Prompt:</strong> ' + slide.prompt;
            s.appendChild(prompt);
        }

        if (slide.goal) {
            var goal = el('p', 'slide-note');
            goal.textContent = slide.goal;
            s.appendChild(goal);
        }

        return s;
    }

    // ─── TAKEAWAYS SLIDE ─────────────────────────────────────
    function renderTakeaways(slide, meta) {
        var s = el('section', 'intro-slide');
        s.appendChild(el('h2', '', slide.title));

        slide.items.forEach(function (item, i) {
            var card = el('div', 'takeaway-card');
            card.innerHTML = '<span class="takeaway-num">' + (i + 1) + '</span>' + item;
            s.appendChild(card);
        });

        if (slide.cta) {
            var box = el('div', 'cta-box');
            box.innerHTML = '<strong>' + (slide.cta.label || 'Call to action:') + '</strong> ' + slide.cta.text;
            s.appendChild(box);
        }

        return s;
    }

    // ─── Q&A SLIDE ───────────────────────────────────────────
    function renderQA(slide, meta) {
        var s = el('section', 'qa-slide');
        s.setAttribute('data-transition', slide.transition || 'zoom');
        // Use data-background so Reveal.js handles it properly
        s.setAttribute('data-background-color', '#1a2e44');

        var container = el('div', 'qa-container');
        var icon = el('div', 'qa-icon');
        icon.innerHTML = '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"/><path d="M12 12V12.01"/><path d="M12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10.5 12 10.5C11.4477 10.5 11 10 11 9.5"/></svg>';
        container.appendChild(icon);
        container.appendChild(el('p', 'qa-text', slide.title || 'Questions & Discussion'));

        if (slide.contact) {
            var info = el('div', 'contact-info');
            info.innerHTML = '<p>' + slide.contact + '</p>';
            container.appendChild(info);
        }

        s.appendChild(container);
        return s;
    }

    // ─── BADGE OVERLAY — lives outside .slides ──────────────
    function initBadgeOverlay() {
        var reveal = document.querySelector('.reveal');
        if (!reveal) return;
        var overlay = document.createElement('div');
        overlay.id = 'badge-overlay';
        overlay.className = 'badge-overlay';
        reveal.appendChild(overlay);

        function updateBadge(slide) {
            var badge = slide ? slide.getAttribute('data-badge') : null;
            if (badge) {
                overlay.textContent = badge.charAt(0).toUpperCase() + badge.slice(1);
                overlay.className = 'badge-overlay badge-overlay--' + badge + ' badge-overlay--visible';
            } else {
                overlay.className = 'badge-overlay';
            }
        }

        if (typeof Reveal !== 'undefined') {
            Reveal.on('slidechanged', function (e) { updateBadge(e.currentSlide); });
            Reveal.on('ready', function (e) { updateBadge(e.currentSlide); });
        }
    }

    // ─── POST-INIT: instantiate widgets and wire viz ─────────
    function initWidgets() {
        _vizQueue.forEach(function (item) {
            var container = document.getElementById(item.elementId);
            if (!container) return;

            if (item.type === 'poll' && typeof Widgets !== 'undefined') {
                Widgets.createPoll(container, item.config);
            }
            if (item.type === 'voting' && typeof Widgets !== 'undefined') {
                Widgets.createVoting(container, item.config);
            }
            if (item.type === 'timer' && typeof Widgets !== 'undefined') {
                Widgets.createTimer(container, item.config);
            }
        });
    }

    function initVizOnSlideChange() {
        if (typeof Reveal === 'undefined') return;

        Reveal.on('slidechanged', function (event) {
            var vizAttr = event.currentSlide.getAttribute('data-viz');
            if (!vizAttr || _rendered[vizAttr]) return;
            _rendered[vizAttr] = true;

            // Find matching viz queue item
            _vizQueue.forEach(function (item) {
                if (item.type === 'viz' && item.vizType === vizAttr) {
                    var vizContainer = document.getElementById(item.elementId);
                    if (vizContainer && typeof VizLibrary !== 'undefined') {
                        VizLibrary.render(item.vizType, vizContainer, item.vizConfig);
                    }
                }
            });
        });

        // Also check the initial slide
        var currentSlide = Reveal.getCurrentSlide();
        if (currentSlide) {
            var vizAttr = currentSlide.getAttribute('data-viz');
            if (vizAttr && !_rendered[vizAttr]) {
                _rendered[vizAttr] = true;
                _vizQueue.forEach(function (item) {
                    if (item.type === 'viz' && item.vizType === vizAttr) {
                        var vizContainer = document.getElementById(item.elementId);
                        if (vizContainer && typeof VizLibrary !== 'undefined') {
                            VizLibrary.render(item.vizType, vizContainer, item.vizConfig);
                        }
                    }
                });
            }
        }
    }

    // ─── PUBLIC API ──────────────────────────────────────────
    return {
        loadLecture: loadLecture,
        initWidgets: initWidgets,
        initVizOnSlideChange: initVizOnSlideChange,
        initBadgeOverlay: initBadgeOverlay
    };
})();
