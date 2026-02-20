/* ============================================================
   Lecture Widget Library — Polls, Voting, Timers
   Used by the slide engine to instantiate interactive elements
   ============================================================ */

const Widgets = (function () {

    // ─── POLL (Socket.io live) ──────────────────────────────
    var _socket = null;

    function _getSocket() {
        if (!_socket && typeof io !== 'undefined') _socket = io();
        return _socket;
    }

    function createPoll(container, config) {
        var lectureId = config.lectureId || '';
        var slideId   = config.slideId   || '';
        var options   = config.options    || [];

        var wrap = document.createElement('div');
        wrap.className = 'poll-container';

        // ── Layout: left = options, right = QR code ─────────
        var body = document.createElement('div');
        body.className = 'poll-body';

        var leftCol = document.createElement('div');
        leftCol.className = 'poll-left';

        if (config.prompt) {
            var p = document.createElement('p');
            p.className = 'poll-prompt';
            p.textContent = config.prompt;
            leftCol.appendChild(p);
        }

        // Option rows
        var rows = [];
        options.forEach(function (opt, i) {
            var row = document.createElement('div');
            row.className = 'poll-option';
            row.setAttribute('data-index', i);
            row.innerHTML =
                '<div class="poll-bar" style="width:0%"></div>' +
                '<span class="poll-label">' + opt + '</span>' +
                '<span class="poll-count"></span>';
            // Presenter can also click locally
            row.addEventListener('click', function () {
                var sock = _getSocket();
                if (sock) sock.emit('vote', { lectureId: lectureId, slideId: slideId, optionIndex: i });
            });
            leftCol.appendChild(row);
            rows.push(row);
        });

        body.appendChild(leftCol);

        // ── QR code column ──────────────────────────────────
        var rightCol = document.createElement('div');
        rightCol.className = 'poll-right';

        var voteUrl = window.location.origin + '/vote/' + lectureId + '/' + slideId;
        var qrLink = document.createElement('a');
        qrLink.href = voteUrl;
        qrLink.target = '_blank';
        qrLink.className = 'poll-qr';
        qrLink.title = 'Open voting page';
        // Generate QR using the lightweight library (loaded in lecture.html)
        if (typeof QRCode !== 'undefined') {
            new QRCode(qrLink, {
                text: voteUrl,
                width: 220,
                height: 220,
                colorDark: '#0e6e8c',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        } else {
            qrLink.textContent = 'QR unavailable';
        }
        rightCol.appendChild(qrLink);

        var urlLabel = document.createElement('div');
        urlLabel.className = 'poll-qr-label';
        urlLabel.textContent = 'Scan to vote';
        rightCol.appendChild(urlLabel);

        var urlLink = document.createElement('a');
        urlLink.href = voteUrl;
        urlLink.target = '_blank';
        urlLink.className = 'poll-qr-url';
        urlLink.textContent = voteUrl.replace(/^https?:\/\//, '');
        rightCol.appendChild(urlLink);

        var totalEl = document.createElement('div');
        totalEl.className = 'poll-total';
        totalEl.textContent = '0 votes';
        rightCol.appendChild(totalEl);

        body.appendChild(rightCol);
        wrap.appendChild(body);

        // ── Presenter reset (subtle) ────────────────────────
        var resetBtn = document.createElement('button');
        resetBtn.className = 'poll-reset';
        resetBtn.textContent = 'Reset Poll';
        resetBtn.addEventListener('click', function () {
            var sock = _getSocket();
            if (sock) sock.emit('reset-poll', { lectureId: lectureId, slideId: slideId });
        });
        wrap.appendChild(resetBtn);

        container.appendChild(wrap);

        // ── Socket.io: join room + listen for results ───────
        var sock = _getSocket();
        if (sock) {
            sock.emit('join-poll', { lectureId: lectureId, slideId: slideId });

            sock.on('poll-results', function (data) {
                if (data.slideId && data.slideId !== slideId) return; // not our poll
                var total = data.total || 0;
                totalEl.textContent = total + ' vote' + (total !== 1 ? 's' : '');

                rows.forEach(function (row, i) {
                    var count = data.votes[i] || 0;
                    var pct = total > 0 ? (count / total * 100) : 0;
                    row.querySelector('.poll-bar').style.width = pct + '%';
                    row.querySelector('.poll-count').textContent = count > 0 ? count : '';
                });
            });

            sock.on('poll-reset', function (data) {
                if (data && data.slideId && data.slideId !== slideId) return;
                rows.forEach(function (row) {
                    row.querySelector('.poll-bar').style.width = '0%';
                    row.querySelector('.poll-count').textContent = '';
                });
                totalEl.textContent = '0 votes';
            });
        }
    }

    // ─── MICRO-CASE VOTING ───────────────────────────────────
    function createVoting(container, config) {
        // Scenario card
        if (config.scenario) {
            const sc = document.createElement('div');
            sc.className = 'scenario-card';
            sc.innerHTML = '<strong>Scenario:</strong> ' + config.scenario;
            container.appendChild(sc);
        }

        // Vote buttons
        const btnsWrap = document.createElement('div');
        btnsWrap.className = 'vote-options';
        config.options.forEach(function (opt, i) {
            const btn = document.createElement('button');
            btn.className = 'vote-btn';
            btn.textContent = opt;
            btn.addEventListener('click', function () {
                btnsWrap.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
                btn.classList.add('voted');
            });
            btnsWrap.appendChild(btn);
        });
        container.appendChild(btnsWrap);

        // Discussion reveal
        if (config.discussion && config.discussion.length) {
            const revealBtn = document.createElement('button');
            revealBtn.className = 'reveal-btn';
            revealBtn.textContent = 'Reveal Discussion';

            const revealDiv = document.createElement('div');
            revealDiv.className = 'vote-reveal';
            const ul = document.createElement('ul');
            ul.style.textAlign = 'left';
            ul.style.width = '100%';
            config.discussion.forEach(function (point) {
                const li = document.createElement('li');
                li.innerHTML = point;
                ul.appendChild(li);
            });
            revealDiv.appendChild(ul);

            // Discussion frame note (inside reveal so it appears with discussion)
            if (config.discussionFrame) {
                const note = document.createElement('p');
                note.style.cssText = 'font-size:14px;color:#555;font-style:italic;margin:4px 0 0;line-height:1.4;';
                note.innerHTML = config.discussionFrame;
                revealDiv.appendChild(note);
            }

            revealBtn.addEventListener('click', function () {
                revealDiv.classList.toggle('shown');
                revealBtn.textContent = revealDiv.classList.contains('shown')
                    ? 'Hide Discussion' : 'Reveal Discussion';
            });

            container.appendChild(revealBtn);
            container.appendChild(revealDiv);
        }
    }

    // ─── TIMER ───────────────────────────────────────────────
    function createTimer(container, config) {
        var duration = config.duration || 90;
        var remaining = duration;
        var interval = null;

        if (config.prompt) {
            var p = document.createElement('p');
            p.style.fontSize = '0.7em';
            p.style.marginBottom = '12px';
            p.style.color = '#555';
            p.textContent = config.prompt;
            container.appendChild(p);
        }

        var wrap = document.createElement('div');
        wrap.className = 'timer-container';

        var display = document.createElement('div');
        display.className = 'timer-display';
        display.textContent = _fmt(remaining);

        var controls = document.createElement('div');
        controls.className = 'timer-controls';

        var startBtn = document.createElement('button');
        startBtn.className = 'timer-btn timer-start';
        startBtn.textContent = '\u25B6  Start';

        var resetBtn = document.createElement('button');
        resetBtn.className = 'timer-btn timer-reset-btn';
        resetBtn.textContent = '\u21BA  Reset';

        startBtn.addEventListener('click', function () {
            if (interval) {
                clearInterval(interval); interval = null;
                startBtn.textContent = '\u25B6  Start';
                return;
            }
            startBtn.textContent = '\u275A\u275A Pause';
            interval = setInterval(function () {
                remaining--;
                display.textContent = _fmt(remaining);
                if (remaining <= 15 && remaining > 0) display.className = 'timer-display warning';
                if (remaining <= 0) {
                    clearInterval(interval); interval = null;
                    display.className = 'timer-display expired';
                    display.textContent = "Time\u2019s up!";
                    startBtn.textContent = '\u25B6  Start';
                }
            }, 1000);
        });

        resetBtn.addEventListener('click', function () {
            if (interval) { clearInterval(interval); interval = null; }
            remaining = duration;
            display.className = 'timer-display';
            display.textContent = _fmt(remaining);
            startBtn.textContent = '\u25B6  Start';
        });

        controls.appendChild(startBtn);
        controls.appendChild(resetBtn);
        wrap.appendChild(display);
        wrap.appendChild(controls);

        // Categories list — two-column layout: timer left, categories right
        if (config.categories && config.categories.length) {
            var row = document.createElement('div');
            row.className = 'timer-row';

            var leftCol = document.createElement('div');
            leftCol.className = 'timer-left';
            leftCol.appendChild(wrap);

            var catWrap = document.createElement('div');
            catWrap.className = 'timer-categories';
            catWrap.innerHTML = '<strong>Classify responses into:</strong>';
            var ol = document.createElement('ol');
            config.categories.forEach(function (cat) {
                var li = document.createElement('li');
                li.textContent = cat;
                ol.appendChild(li);
            });
            catWrap.appendChild(ol);

            row.appendChild(leftCol);
            row.appendChild(catWrap);
            container.appendChild(row);
        } else {
            container.appendChild(wrap);
        }
    }

    function _fmt(sec) {
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // ─── PUBLIC API ──────────────────────────────────────────
    return {
        createPoll: createPoll,
        createVoting: createVoting,
        createTimer: createTimer
    };
})();
