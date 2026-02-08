/* ============================================================
   Dock Navigation — macOS-style fisheye slide navigator
   Full-width bar at bottom; dots have fixed positions and
   scale upward on hover (no sideways push).
   ============================================================ */

var DockNav = (function () {

    // ─── CONFIGURATION ──────────────────────────────────────
    var BASE_SIZE   = 6;      // dot diameter at rest (px)
    var MAX_SCALE   = 4.5;    // peak magnification factor
    var RADIUS      = 200;    // influence radius (px) — wider = smoother
    var EDGE_PAD    = 32;     // left/right page margin (px)

    // Badge → color map (matches intro.css palette)
    var BADGE_COLORS = {
        workflow:    '#0e6e8c',
        automation:  '#d4a017',
        data:        '#2980b9',
        ecosystem:   '#1d8348',
        ai:          '#c0392b',
        interactive: '#8e44ad'
    };
    var DEFAULT_COLOR = '#7f8c8d';

    var _dock      = null;
    var _rail      = null;
    var _dots      = [];
    var _centers   = [];   // fixed X center for each dot
    var _label     = null;
    var _current   = 0;

    // ─── BUILD ──────────────────────────────────────────────
    function init() {
        if (typeof Reveal === 'undefined') return;

        var slides = document.querySelectorAll('.reveal .slides > section');
        if (!slides.length) return;

        // Create dock container (full-width, fixed at bottom)
        _dock = document.createElement('div');
        _dock.className = 'dock-nav';

        // Rail — holds all dots, positioned relatively
        _rail = document.createElement('div');
        _rail.className = 'dock-rail';

        // Floating label (no background — just teal text)
        _label = document.createElement('div');
        _label.className = 'dock-label';
        _dock.appendChild(_label);

        // Build dots from slide map (includes hidden optional slides)
        var slideMap = (typeof SlideEngine !== 'undefined' && SlideEngine.getSlideMap)
            ? SlideEngine.getSlideMap() : [];

        if (slideMap.length > 0) {
            // Use the full slide map — shows ghost dots for hidden optional
            slideMap.forEach(function (entry) {
                var dot = document.createElement('div');
                dot.className = 'dock-dot';

                if (!entry.rendered) {
                    // Ghost dot for hidden optional slide
                    dot.classList.add('dock-dot--ghost');
                    dot.style.background = '#ccc';
                    dot.setAttribute('data-slide-title', entry.title + ' (optional)');
                } else {
                    dot.style.background = BADGE_COLORS[entry.badge] || DEFAULT_COLOR;
                    dot.setAttribute('data-slide-title', entry.title);
                    // Click → navigate to the rendered index
                    (function (ri) {
                        dot.addEventListener('click', function () {
                            Reveal.slide(ri);
                        });
                    })(entry.renderedIndex);
                }

                dot.setAttribute('data-slide-index', entry.index);
                dot.setAttribute('data-rendered-index', entry.renderedIndex);

                _rail.appendChild(dot);
                _dots.push(dot);
            });
        } else {
            // Fallback: no slide map, build from DOM as before
            slides.forEach(function (section, i) {
                var dot = document.createElement('div');
                dot.className = 'dock-dot';
                var badge = section.getAttribute('data-badge');
                dot.style.background = BADGE_COLORS[badge] || DEFAULT_COLOR;
                var title = section.querySelector('h1, h2');
                dot.setAttribute('data-slide-index', i);
                dot.setAttribute('data-slide-title', title ? title.textContent.trim() : 'Slide ' + (i + 1));
                dot.addEventListener('click', function () { Reveal.slide(i); });
                _rail.appendChild(dot);
                _dots.push(dot);
            });
        }

        _dock.appendChild(_rail);
        document.body.appendChild(_dock);

        // Compute fixed center positions (evenly spaced, full width)
        _layoutDots();
        window.addEventListener('resize', _layoutDots);

        // Mark current slide
        _updateCurrent(Reveal.getIndices().h);

        // ─── EVENTS ─────────────────────────────────────────
        _dock.addEventListener('mouseenter', function () {
            _dock.classList.add('dock-nav--active');
        });
        _dock.addEventListener('mouseleave', function () {
            _dock.classList.remove('dock-nav--active');
            _resetDots();
            _label.style.opacity = '0';
        });
        _dock.addEventListener('mousemove', _onMouseMove);

        Reveal.on('slidechanged', function (e) {
            _updateCurrent(e.indexh);
        });

        // ─── EDGE CLICK ZONES (5% left/right) ──────────────
        _initEdgeZones();
    }

    function _initEdgeZones() {
        ['left', 'right'].forEach(function (side) {
            var zone = document.createElement('div');
            zone.className = 'dock-edge dock-edge--' + side;
            zone.addEventListener('click', function () {
                if (side === 'right') Reveal.next();
                else Reveal.prev();
            });
            document.body.appendChild(zone);
        });
    }

    // ─── LAYOUT: compute fixed X positions ──────────────────
    function _layoutDots() {
        var w = window.innerWidth;
        var n = _dots.length;
        var usable = w - EDGE_PAD * 2;
        _centers = [];

        _dots.forEach(function (dot, i) {
            // Evenly distribute centers across usable width
            var cx = EDGE_PAD + (usable * (i + 0.5)) / n;
            _centers.push(cx);

            // Position each dot absolutely at its fixed center
            dot.style.left = cx + 'px';
        });
    }

    // ─── FISHEYE — scale upward only, fixed positions ───────
    function _onMouseMove(e) {
        var mouseX = e.clientX;

        var peakIndex = -1;
        var peakT = 0;

        _dots.forEach(function (dot, i) {
            var dist = Math.abs(mouseX - _centers[i]);

            // Smooth cosine bell: 0 at RADIUS, 1 at center
            var t = dist < RADIUS
                ? 0.5 * (1 + Math.cos(Math.PI * dist / RADIUS))
                : 0;

            var scale = 1 + (MAX_SCALE - 1) * t;
            dot.style.transform = 'translate(-50%, 0) scale(' + scale + ')';

            if (t > peakT) {
                peakT = t;
                peakIndex = i;
            }
        });

        // Show floating label for the closest dot
        if (peakIndex >= 0 && peakT > 0.15) {
            var peakDot = _dots[peakIndex];
            var scale = 1 + (MAX_SCALE - 1) * peakT;
            var labelY = BASE_SIZE * scale + 10;

            _label.textContent = peakDot.getAttribute('data-slide-title');
            _label.style.opacity = '1';
            _label.style.left = _centers[peakIndex] + 'px';
            _label.style.bottom = labelY + 'px';
        } else {
            _label.style.opacity = '0';
        }
    }

    function _resetDots() {
        _dots.forEach(function (dot) {
            dot.style.transform = 'translate(-50%, 0) scale(1)';
        });
    }

    // ─── CURRENT SLIDE MARKER ───────────────────────────────
    function _updateCurrent(index) {
        _current = index;
        _dots.forEach(function (dot) {
            var ri = parseInt(dot.getAttribute('data-rendered-index'), 10);
            dot.classList.toggle('dock-dot--current', ri === index);
        });
    }

    // ─── PUBLIC API ─────────────────────────────────────────
    return { init: init };

})();
