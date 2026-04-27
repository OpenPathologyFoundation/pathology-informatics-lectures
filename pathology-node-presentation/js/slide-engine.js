/* ============================================================
   Slide Engine — JSON → Reveal.js renderer
   Reads a lecture JSON file and generates <section> elements
   ============================================================ */

var SlideEngine = (function () {

    var _vizQueue = [];   // visualizations to render on slide entry
    var _rendered = {};   // track which vizs have been drawn
    var _slideMap = [];   // metadata for ALL slides (including hidden optional)
    var _showOptional = sessionStorage.getItem('showOptional') !== 'false'; // default: show all

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

        // Build slide map and render
        _slideMap = [];
        var renderedIndex = 0;
        data.slides.forEach(function (slide, i) {
            var isOpt = !!slide.isOptional;
            var shouldRender = !isOpt || _showOptional;

            _slideMap.push({
                index: i,
                id: slide.id || '',
                title: slide.title || 'Slide ' + (i + 1),
                badge: slide.badge || (slide.type === 'poll' || slide.type === 'micro-case' || slide.type === 'timer' || slide.type === 'workshop' || slide.type === 'snippets' ? 'interactive' : null),
                isOptional: isOpt,
                rendered: shouldRender,
                renderedIndex: shouldRender ? renderedIndex : -1
            });

            if (shouldRender) {
                var section = renderSlide(slide, data.meta);
                if (section) {
                    if (isOpt) section.classList.add('optional-slide');
                    slidesContainer.appendChild(section);
                    renderedIndex++;
                }
            }
        });
    }

    // ─── SLIDE DISPATCHER ────────────────────────────────────
    function renderSlide(slide, meta) {
        var renderers = {
            'title':            renderTitle,
            'content':          renderContent,
            'two-column':       renderTwoColumn,
            'comparison':       renderComparison,
            'poll':             renderPoll,
            'micro-case':       renderMicroCase,
            'timer':            renderTimer,
            'visualization':    renderVisualization,
            'workshop':         renderWorkshop,
            'snippets':         renderSnippets,
            'interactive-list': renderInteractiveList,
            'infographic':      renderInfographic,
            'takeaways':        renderTakeaways,
            'qa':               renderQA
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

        // Use Presenter module if available; fall back to JSON
        var hasPresenter = (typeof Presenter !== 'undefined' && !Presenter.isSkipped());
        var presenter = hasPresenter ? Presenter.getDisplayName() : (slide.presenter || (meta && meta.presenter) || '');
        var institution = hasPresenter ? Presenter.getInstitution() : (slide.institution || (meta && meta.institution) || '');
        var date = (slide.date || (meta && meta.date) || '');

        if (typeof Presenter !== 'undefined' && Presenter.isSkipped()) {
            // Community / anonymous mode
            var banner = el('div', 'community-banner animate-presenter');
            var repoUrl = Presenter.getRepoUrl();
            banner.innerHTML = '<span>📖</span> <span>Community Lecture — <a href="' + repoUrl + '" target="_blank">View Contributors & Source</a></span>';
            content.appendChild(banner);
        } else if (presenter) {
            var box = el('div', 'presenter-box animate-presenter');
            box.innerHTML = '<p><em>' + presenter + '</em><br>' + institution + (date ? ' | ' + date : '') + '</p>';
            content.appendChild(box);
        }

        // Subtle optional-slides toggle
        var toggle = el('div', 'optional-toggle');
        var optCount = 0;
        // Count will be filled after render; use a timeout
        toggle.innerHTML = '<label class="opt-switch">' +
            '<input type="checkbox"' + (_showOptional ? ' checked' : '') + '>' +
            '<span class="opt-slider"></span>' +
            '<span class="opt-label">' + (_showOptional ? 'Full deck' : 'Core slides') + '</span>' +
            '</label>';
        var cb = toggle.querySelector('input');
        cb.addEventListener('change', function () {
            sessionStorage.setItem('showOptional', cb.checked ? 'true' : 'false');
            window.location.reload();
        });
        content.appendChild(toggle);

        // GitHub repo link (bottom-left)
        if (typeof Presenter !== 'undefined') {
            var repoLink = el('a', 'repo-link');
            repoLink.href = Presenter.getRepoUrl();
            repoLink.target = '_blank';
            repoLink.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> Source';
            s.appendChild(repoLink);
        }

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

        // COI slide: override bullets with presenter's disclosures
        if (slide.id === 'coi' && typeof Presenter !== 'undefined') {
            var coiBullets = Presenter.getCOI();
            var disclaimer = 'This presentation is intended solely for educational purposes. All content reflects the presenter\'s independent views and does not represent the official position of any institution or vendor.';
            coiBullets.push(disclaimer);
            s.appendChild(makeBullets(coiBullets, false));
            addTakeaway(s, slide.takeaway);
            return s;
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
        if (slide.title) {
            s.appendChild(el('h2', '', slide.title));
        }

        if (slide.subtitle) {
            var sub = el('p', 'slide-subtitle', slide.subtitle);
            s.appendChild(sub);
        }

        var vizDiv = el('div', 'viz-container');
        vizDiv.id = 'viz-' + slide.id;
        if (!slide.title && !slide.subtitle) {
            vizDiv.classList.add('viz-fullbleed');
        }
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

        var answers = slide.answers || [];
        slide.snippets.forEach(function (snippet, i) {
            var cardWrap = el('div', 'snippet-card-wrap');
            var card = el('div', 'snippet-card');
            card.innerHTML = '<span class="snippet-num">' + (i + 1) + '</span>' + snippet;

            if (answers[i]) {
                card.style.cursor = 'pointer';
                var hint = el('span', 'snippet-reveal-hint');
                hint.textContent = '▼';
                card.appendChild(hint);

                var answer = el('div', 'snippet-answer');
                answer.innerHTML = answers[i];
                card.addEventListener('click', function () {
                    var open = cardWrap.classList.toggle('snippet-open');
                    hint.textContent = open ? '▲' : '▼';
                });
                cardWrap.appendChild(card);
                cardWrap.appendChild(answer);
            } else {
                cardWrap.appendChild(card);
            }
            wrap.appendChild(cardWrap);
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

    // ─── INTERACTIVE LIST (hover-to-reveal, progressive disclosure) ──
    function renderInteractiveList(slide, meta) {
        var s = el('section', 'intro-slide ilist-slide');
        if (slide.darkBg) {
            s.setAttribute('data-background-color', '#0f172a');
            s.classList.add('dark-slide');
        }
        applyBadge(s, 'interactive');
        s.appendChild(el('h2', '', slide.title));

        // Epigraph
        if (slide.epigraph) {
            var bq = el('blockquote', 'ilist-epigraph');
            bq.innerHTML = '"' + slide.epigraph.text + '"';
            if (slide.epigraph.attribution) {
                bq.innerHTML += '<footer>— ' + slide.epigraph.attribution + '</footer>';
            }
            s.appendChild(bq);
        }

        // Grid container
        var items = slide.items || [];
        var isTwoCol = (slide.layout === 'two-column') || items.length > 5;
        var grid = el('div', 'ilist-grid' + (isTwoCol ? ' ilist-two-col' : ''));

        // Tooltip element (shared)
        var tooltip = el('div', 'ilist-tooltip');
        tooltip.style.display = 'none';
        s.appendChild(tooltip);

        items.forEach(function (item, i) {
            var row = el('div', 'ilist-item');
            row.setAttribute('data-index', i);

            var numSpan = el('span', 'ilist-num');
            numSpan.textContent = item.number || (i + 1);

            var qSpan = el('span', 'ilist-question');
            qSpan.innerHTML = item.question;

            row.appendChild(numSpan);
            row.appendChild(qSpan);

            // If there's a detail, add hover behavior
            if (item.detail) {
                row.classList.add('ilist-has-detail');

                // Small hint icon
                var hint = el('span', 'ilist-hint');
                hint.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
                row.appendChild(hint);

                row.addEventListener('mouseenter', function (e) {
                    // Dim siblings
                    grid.querySelectorAll('.ilist-item').forEach(function (sib) {
                        if (sib !== row) sib.classList.add('ilist-dimmed');
                    });
                    row.classList.add('ilist-active');

                    // Show tooltip
                    tooltip.innerHTML = '<div class="ilist-tooltip-inner">' +
                        '<span class="ilist-tooltip-num">' + (item.number || (i + 1)) + '</span>' +
                        '<p>' + item.detail + '</p></div>';
                    tooltip.style.display = 'block';

                    // Use offset-based coords (unaffected by Reveal transform)
                    var rowTop = row.offsetTop + grid.offsetTop;
                    var rowLeft = row.offsetLeft + grid.offsetLeft;
                    var rowW = row.offsetWidth;
                    var rowH = row.offsetHeight;

                    // Default: right of the item
                    tooltip.style.left = (rowLeft + rowW + 12) + 'px';
                    tooltip.style.top = rowTop + 'px';

                    // Clamp within slide (1200×700 canvas)
                    requestAnimationFrame(function () {
                        var tipW = tooltip.offsetWidth;
                        var tipH = tooltip.offsetHeight;
                        var slideW = s.offsetWidth || 1200;
                        var slideH = s.offsetHeight || 700;

                        var left = rowLeft + rowW + 12;
                        var top = rowTop;

                        // If overflows right, flip to left side
                        if (left + tipW > slideW - 20) {
                            left = rowLeft - tipW - 12;
                        }
                        // Clamp bottom
                        if (top + tipH > slideH - 20) {
                            top = slideH - tipH - 20;
                        }
                        // Clamp top
                        if (top < 10) top = 10;

                        tooltip.style.left = left + 'px';
                        tooltip.style.top = top + 'px';
                    });
                });

                row.addEventListener('mouseleave', function () {
                    grid.querySelectorAll('.ilist-item').forEach(function (sib) {
                        sib.classList.remove('ilist-dimmed');
                    });
                    row.classList.remove('ilist-active');
                    tooltip.style.display = 'none';
                });
            }

            grid.appendChild(row);
        });

        s.appendChild(grid);
        addTakeaway(s, slide.takeaway);
        return s;
    }

    // ─── INFOGRAPHIC SLIDE (rich HTML card layout) ──
    // Accepts optional slide.theme === "light" to render on a warm-cream
    // surface using the deck's standard palette instead of the dark default.
    function renderInfographic(slide, meta) {
        var s = el('section', 'intro-slide infographic-slide');
        var isLight = slide.theme === 'light';
        var defaultBg = isLight ? '#faf7f1' : '#0f172a';
        s.setAttribute('data-background-color', slide.bgColor || defaultBg);
        s.classList.add(isLight ? 'light-theme' : 'dark-slide');
        applyBadge(s, slide.badge);

        // Title with gradient
        var titleEl = el('h2', 'infographic-title', slide.title);
        s.appendChild(titleEl);

        if (slide.subtitle) {
            s.appendChild(el('p', 'infographic-subtitle', slide.subtitle));
        }

        // Cards grid
        if (slide.cards && slide.cards.length) {
            var cardGrid = el('div', 'infographic-cards');
            slide.cards.forEach(function (card, i) {
                var cardEl = el('div', 'infographic-card');
                if (card.accentColor) cardEl.style.borderTopColor = card.accentColor;

                var iconLine = '';
                if (card.icon) iconLine = '<span class="infographic-card-icon">' + card.icon + '</span>';
                var labelLine = card.label ? '<span class="infographic-card-label">' + card.label + '</span>' : '';
                var valueLine = card.value ? '<span class="infographic-card-value">' + card.value + '</span>' : '';
                var descLine = card.description ? '<p class="infographic-card-desc">' + card.description + '</p>' : '';

                cardEl.innerHTML = iconLine + labelLine + valueLine + descLine;
                cardGrid.appendChild(cardEl);
            });
            s.appendChild(cardGrid);
        }

        // Optional viz container
        if (slide.vizType) {
            var vizDiv = el('div', 'viz-container');
            vizDiv.id = 'viz-' + slide.id;
            s.appendChild(vizDiv);
            s.setAttribute('data-viz', slide.vizType);

            _vizQueue.push({
                type: 'viz',
                elementId: 'viz-' + slide.id,
                vizType: slide.vizType,
                vizConfig: slide.vizConfig || {},
                slideId: slide.id
            });
        }

        addTakeaway(s, slide.takeaway);
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

        // Use presenter data if available; fall back to JSON contact
        var hasPresenter = (typeof Presenter !== 'undefined' && !Presenter.isSkipped());
        if (hasPresenter) {
            var info = el('div', 'contact-info');
            var contactHtml = '<p>' + Presenter.getDisplayName();
            if (Presenter.getInstitution()) contactHtml += '<br>' + Presenter.getInstitution();
            if (Presenter.getEmail()) contactHtml += '<br>' + Presenter.getEmail();
            contactHtml += '</p>';
            info.innerHTML = contactHtml;
            container.appendChild(info);
        } else if (typeof Presenter !== 'undefined' && Presenter.isSkipped()) {
            var community = el('div', 'contact-info');
            var repoUrl = Presenter.getRepoUrl();
            community.innerHTML = '<p>Community Lecture<br><a href="' + repoUrl + '" target="_blank" style="color:#60a5fa">View on GitHub</a></p>';
            container.appendChild(community);
        } else if (slide.contact) {
            var info2 = el('div', 'contact-info');
            info2.innerHTML = '<p>' + slide.contact + '</p>';
            container.appendChild(info2);
        }

        // GitHub repo link (bottom-left)
        if (typeof Presenter !== 'undefined') {
            var repoLink = el('a', 'repo-link');
            repoLink.href = Presenter.getRepoUrl();
            repoLink.target = '_blank';
            repoLink.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> Source';
            s.appendChild(repoLink);
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
        initBadgeOverlay: initBadgeOverlay,
        getSlideMap: function () { return _slideMap; },
        isShowingOptional: function () { return _showOptional; }
    };
})();
