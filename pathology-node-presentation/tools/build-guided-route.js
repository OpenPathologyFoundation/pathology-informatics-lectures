#!/usr/bin/env node
// Build the guided route of a lecture from its storyboard.
//
// The storyboard (docs/<lecture>/STORYBOARD.md) is the source of truth for
// the spoken talk: one `## Scene N · \`slide-id\` · M:SS → M:SS` block per
// scene, with bold field labels (**Speaker notes.**, **Pauses.**, ...).
// This script reads it and the base lecture JSON and writes:
//
//   data/lectures/<lecture>_guided.json  — the base slides in storyboard
//       order, each with its speakerNotes replaced by the storyboard's and
//       its optional flag cleared; appendix slides kept but hidden.
//   docs/<lecture>/REHEARSAL.md          — the timed rehearsal: for each
//       scene the allotted time, the words in the notes, the speaking time
//       at the chosen pace plus the scripted pauses, and the slack.
//
// Usage:  node tools/build-guided-route.js [lecture] [--wpm 140]
// Default lecture: ai_infrastructure.

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const lecture = args.find(a => !a.startsWith('--')) || 'ai_infrastructure';
const wpmIdx = args.indexOf('--wpm');
const WPM = wpmIdx >= 0 ? Number(args[wpmIdx + 1]) : 140;

const ROOT = path.join(__dirname, '..');
const BASE = path.join(ROOT, 'data', 'lectures', lecture + '.json');
const OUT = path.join(ROOT, 'data', 'lectures', lecture + '_guided.json');
const STORY = path.join(ROOT, '..', 'docs', lecture, 'STORYBOARD.md');
const REHEARSAL = path.join(ROOT, '..', 'docs', lecture, 'REHEARSAL.md');

const APPENDIX = ['sources'];            // kept in the guided file, hidden by default
const FIELDS = ['Form', 'Audience question', 'Visible', 'Evidence', 'Speaker notes',
    'Actions', 'Pauses', 'Operation', 'Interaction', 'Establishes', 'Sources'];
// Time that is neither speech nor a scripted pause: settling into a scene,
// and each click (the build, and the eye moving to what changed).
const SCENE_ALLOWANCE = 8, CLICK_ALLOWANCE = 3;

function mmss(s) { const a = Math.abs(Math.round(s)); return (s < 0 ? '-' : '') + Math.floor(a / 60) + ':' + String(a % 60).padStart(2, '0'); }
function secs(t) { const m = /^(\d+):(\d{2})$/.exec(t.trim()); if (!m) throw new Error('bad time ' + t); return +m[1] * 60 + +m[2]; }

// ── Parse the storyboard ─────────────────────────────────────────
const md = fs.readFileSync(STORY, 'utf8');
const sceneRe = /^## Scene (\d+) · `([^`]+)` · (\d+:\d{2}) → (\d+:\d{2})[^\n]*$/gm;
const heads = [];
let m;
while ((m = sceneRe.exec(md))) heads.push({ n: +m[1], id: m[2], start: secs(m[3]), end: secs(m[4]), at: m.index, after: m.index + m[0].length });
if (!heads.length) throw new Error('no scenes found in ' + STORY);

const scenes = heads.map((h, i) => {
    const body = md.slice(h.after, i + 1 < heads.length ? heads[i + 1].at : md.indexOf('\n## ', h.after) > 0 ? md.indexOf('\n## ', h.after) : md.length);
    const fields = {};
    const fieldRe = new RegExp('^\\*\\*(' + FIELDS.join('|') + ')\\.\\*\\*\\s*', 'gm');
    const marks = [];
    let f;
    while ((f = fieldRe.exec(body))) marks.push({ name: f[1], at: f.index, after: f.index + f[0].length });
    marks.forEach((mk, k) => {
        const text = body.slice(mk.after, k + 1 < marks.length ? marks[k + 1].at : body.length);
        fields[mk.name] = text.replace(/\s+/g, ' ').trim();
    });
    return Object.assign({}, h, { fields });
});

// ── Compose the guided lecture ───────────────────────────────────
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const byId = {};
base.slides.forEach(s => { byId[s.id] = s; });

const missing = scenes.filter(s => !byId[s.id]).map(s => s.id);
if (missing.length) throw new Error('storyboard names slides the base deck does not have: ' + missing.join(', '));

const guided = JSON.parse(JSON.stringify(base));
guided.meta = Object.assign({}, base.meta, {
    title: base.meta.title + ' — guided route',
    shortTitle: (base.meta.shortTitle || base.meta.title) + ' · guided',
    optionalDefault: 'hidden',
    guidedRoute: {
        builtFrom: path.relative(ROOT, BASE),
        storyboard: path.relative(ROOT, STORY),
        builtOn: new Date().toISOString().slice(0, 10),
        scenes: scenes.length,
        plannedEnd: mmss(scenes[scenes.length - 1].end)
    }
});
guided.slides = scenes.map(sc => {
    const s = JSON.parse(JSON.stringify(byId[sc.id]));
    delete s.isOptional;
    if (sc.fields['Speaker notes']) s.speakerNotes = sc.fields['Speaker notes'];
    return s;
});
APPENDIX.forEach(id => {
    if (!byId[id] || scenes.some(sc => sc.id === id)) return;
    const s = JSON.parse(JSON.stringify(byId[id]));
    s.isOptional = true;
    guided.slides.push(s);
});
fs.writeFileSync(OUT, JSON.stringify(guided, null, 2) + '\n');

// ── The timed rehearsal ──────────────────────────────────────────
function words(t) { return t ? t.split(/\s+/).filter(Boolean).length : 0; }
function pauseSeconds(t) { let s = 0; (t || '').replace(/(\d+)\s*s\b/g, (_, n) => { s += +n; return _; }); return s; }

function clicks(t) { return ((t || '').match(/\bclick\b/gi) || []).length; }

const rows = scenes.map(sc => {
    const w = words(sc.fields['Speaker notes']);
    const p = pauseSeconds(sc.fields['Pauses']);
    const op = pauseSeconds(sc.fields['Operation']);
    const k = clicks(sc.fields['Speaker notes']);
    const speak = Math.round(w / WPM * 60);
    const allow = SCENE_ALLOWANCE + k * CLICK_ALLOWANCE;
    const need = speak + p + op + allow;
    const allot = sc.end - sc.start;
    return { n: sc.n, id: sc.id, start: sc.start, allot, w, speak, p, op, k, allow, need, slack: allot - need };
});
const total = rows.reduce((a, r) => a + r.allot, 0);
const need = rows.reduce((a, r) => a + r.need, 0);

let out = '# Timed rehearsal — ' + lecture + ' guided route\n\n';
out += 'Generated by `tools/build-guided-route.js` from `STORYBOARD.md` on ' + new Date().toISOString().slice(0, 10) + '. ';
out += 'Speaking time is the word count of each scene’s speaker notes at ' + WPM + ' words a minute. ';
out += 'Pauses are the scripted silences; operation is the demonstration’s typing and waiting; the allowance is ' + SCENE_ALLOWANCE + ' s a scene for settling plus ' + CLICK_ALLOWANCE + ' s a click (clicks counted from the word “click” in the notes). ';
out += 'Slack is the allotted time minus all of that; a negative slack is a scene that will run over unless the notes are cut or the pace is faster. ';
out += 'A rehearsal with a stopwatch replaces this table; it does not replace the rehearsal.\n\n';
out += '| # | scene | starts | allotted | words | speaking | pauses | operation | clicks | allowance | needs | slack |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n';
rows.forEach(r => {
    out += `| ${r.n} | \`${r.id}\` | ${mmss(r.start)} | ${mmss(r.allot)} | ${r.w} | ${mmss(r.speak)} | ${r.p ? r.p + ' s' : '—'} | ${r.op ? r.op + ' s' : '—'} | ${r.k || '—'} | ${r.allow} s | ${mmss(r.need)} | ${r.slack < 0 ? '**' + mmss(r.slack) + '**' : mmss(r.slack)} |\n`;
});
out += `| | **total** | | **${mmss(total)}** | ${rows.reduce((a, r) => a + r.w, 0)} | ${mmss(rows.reduce((a, r) => a + r.speak, 0))} | ${rows.reduce((a, r) => a + r.p, 0)} s | ${rows.reduce((a, r) => a + r.op, 0)} s | ${rows.reduce((a, r) => a + r.k, 0)} | ${rows.reduce((a, r) => a + r.allow, 0)} s | **${mmss(need)}** | **${mmss(total - need)}** |\n\n`;
const over = rows.filter(r => r.slack < 0);
out += over.length
    ? 'Scenes over budget: ' + over.map(r => '`' + r.id + '` (' + mmss(-r.slack) + ' over)').join(', ') + '.\n'
    : 'No scene is over budget at this pace.\n';
out += '\nThe talk is planned to end at ' + mmss(scenes[scenes.length - 1].end) + '; what remains of the slot is for questions, with the final display still up.\n';
fs.writeFileSync(REHEARSAL, out);

console.log('guided route: ' + guided.slides.length + ' slides (' + scenes.length + ' scenes + ' + (guided.slides.length - scenes.length) + ' hidden) → ' + path.relative(ROOT, OUT));
console.log('rehearsal: ' + mmss(need) + ' needed of ' + mmss(total) + ' allotted at ' + WPM + ' wpm; ' + (over.length ? over.length + ' scene(s) over budget: ' + over.map(r => r.id).join(', ') : 'no scene over budget') + ' → ' + path.relative(ROOT, REHEARSAL));
