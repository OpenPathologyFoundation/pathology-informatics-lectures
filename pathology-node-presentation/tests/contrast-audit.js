// Runtime WCAG contrast audit.
//
// tests/viz-static-analysis.js checks contrast by reading viz-library.js as
// text. That is fast and catches a lot, but it cannot know what is actually
// *behind* a piece of text: it has to guess one background per visualization.
// The guess is wrong in both directions — text on a light card inside a dark
// slide gets failed, and a caption drawn just after a black square gets failed
// even though it sits on white. Geometry is usually an expression, so no
// amount of source parsing fixes this.
//
// This audit renders each deck in a real browser and measures. For every SVG
// <text> node it takes the centre of the glyph box, asks the document for the
// full paint stack at that point (elementsFromPoint), composites those layers
// bottom-up honouring fill-opacity and opacity, and computes the true ratio
// against the real colour behind the glyph. No inference.
//
// Run:  node tests/contrast-audit.js                 (every lecture)
//       LECTURE=oneit node tests/contrast-audit.js   (one lecture)
//       PORT=8123 node tests/contrast-audit.js
//
// Exits 1 if any text fails WCAG AA at its rendered size.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const LECTURE_DIR = path.join(__dirname, '..', 'data', 'lectures');
const LECTURES = process.env.LECTURE
    ? [process.env.LECTURE]
    : fs.readdirSync(LECTURE_DIR).filter(f => f.endsWith('.json'))
        .map(f => f.replace(/\.json$/, '')).sort();

const PRESENTER = JSON.stringify({
    name: 'Peter Gershkovich', credentials: 'MD, MHA',
    institution: 'Yale University School of Medicine', skipped: false
});

/** Measure every rendered SVG text node on the current slide. */
const PROBE = () => {
    const lum = (r, g, b) => {
        const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const parse = c => {
        const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(c || '');
        return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
    };
    const over = (fg, bg) => ({            // composite fg (with alpha) onto bg
        r: fg.r * fg.a + bg.r * (1 - fg.a),
        g: fg.g * fg.a + bg.g * (1 - fg.a),
        b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1
    });

    const sec = document.querySelector('.reveal .slides section.present');
    if (!sec) return [];
    const out = [];

    sec.querySelectorAll('svg text').forEach(t => {
        const txt = (t.textContent || '').trim();
        if (!txt) return;
        // Emoji are colour glyphs: the font paints them, `fill` is ignored, and
        // an author who never set a fill leaves the computed value at black.
        // Measuring those reports a contrast the viewer never sees.
        if (!/[^\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\s]/u.test(txt)) return;
        let box;
        try { box = t.getBoundingClientRect(); } catch (e) { return; }
        if (box.width < 1 || box.height < 1) return;

        const cs = getComputedStyle(t);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        const opacity = parseFloat(cs.opacity);
        if (opacity < 0.15) return;                    // effectively invisible / mid-animation

        const fg = parse(cs.fill);
        if (!fg) return;

        // What is painted underneath? elementsFromPoint returns the whole
        // paint stack at that point, topmost first — the only reliable way to
        // get this, since an SVG sibling painted below is not an ancestor.
        const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
        const paintOf = el => {
            const s = getComputedStyle(el);
            const tag = el.tagName ? el.tagName.toLowerCase() : '';
            if (tag === 'g' || tag === 'defs' || tag === 'text' || tag === 'tspan') return null;
            let c;
            if (el instanceof SVGElement && tag !== 'svg') {
                if (/none/.test(s.fill)) return null;
                // SVG's initial `fill` is black, so an element the author never
                // gave a fill still computes to rgb(0,0,0) and would be read as
                // an opaque black backdrop. Everything in this library sets its
                // fill deliberately; require that.
                const declared = el.getAttribute('fill') !== null ||
                                 (el.style && el.style.fill) ||
                                 (el.ownerSVGElement && getComputedStyle(el).getPropertyValue('fill') &&
                                  el.closest('[fill]') === el);
                if (!declared) return null;
                if (tag === 'line' || tag === 'polyline') return null;  // stroke-only marks
                c = parse(s.fill);
                // fill-opacity and opacity both attenuate the paint; reading
                // `fill` alone reports a 15%-opacity wash at full strength.
                if (c) c.a *= (parseFloat(s.fillOpacity) || 0) * (parseFloat(s.opacity) || 0);
            } else {
                c = parse(s.backgroundColor);
                if (c) c.a *= (parseFloat(s.opacity) || 0);
            }
            return c && c.a > 0.001 ? c : null;
        };

        const under = document.elementsFromPoint(cx, cy).filter(e => e !== t);

        // If an opaque HTML element sits on top of the glyph, the text is not
        // low-contrast — it is covered. (The takeaway bar overlaps the bottom
        // of some full-bleed visualizations.) That is a layout defect and is
        // reported separately; measuring the colour of whatever is in front
        // would be meaningless.
        const cover = under.find(e => !(e instanceof SVGElement));
        if (cover && under.indexOf(cover) === 0) {
            const cs2 = getComputedStyle(cover);
            const cbg = parse(cs2.backgroundColor);
            if (cbg && cbg.a * (parseFloat(cs2.opacity) || 0) > 0.5) {
                out.push({ text: txt.slice(0, 40), occludedBy: cover.className || cover.tagName });
                return;
            }
        }
        const stack = [];
        for (const el of under) {
            const c = paintOf(el);
            if (!c) continue;
            stack.push(c);
            if (c.a >= 0.999) break;              // opaque: nothing below shows
        }
        let bg = { r: 255, g: 255, b: 255, a: 1 };
        for (let i = stack.length - 1; i >= 0; i--) bg = over(stack[i], bg);

        const fillOp = parseFloat(cs.fillOpacity);
        fg.a *= (isNaN(fillOp) ? 1 : fillOp);

        const fgc = over({ ...fg, a: Math.min(1, fg.a * opacity) }, bg);
        const l1 = lum(fgc.r, fgc.g, fgc.b), l2 = lum(bg.r, bg.g, bg.b);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

        const size = parseFloat(cs.fontSize) || 0;
        const weight = parseInt(cs.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);   // WCAG AA, CSS px
        out.push({
            text: txt.slice(0, 40), ratio: +ratio.toFixed(2),
            required: large ? 3.0 : 4.5, size: +size.toFixed(1), weight,
            fill: cs.fill, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`
        });
    });
    return out;
};

(async () => {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(v => {
        try { localStorage.setItem('pathInfoPresenter', v); } catch (e) {}
    }, PRESENTER);

    let totalFail = 0, totalText = 0;
    const report = {};

    for (const lecture of LECTURES) {
        await page.goto(`http://localhost:${PORT}/lecture.html?lecture=${lecture}`,
            { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        const n = await page.evaluate(() =>
            document.querySelectorAll('.reveal .slides > section').length);

        const fails = [], occluded = [];
        let counted = 0;
        for (let i = 0; i < n; i++) {
            await page.evaluate(idx => { if (window.Reveal) window.Reveal.slide(idx); }, i);
            // Long enough for the slowest stagger in the library to finish.
            // Measuring mid-fade reports a partly-transparent glyph and
            // invents failures that do not exist once the slide settles.
            await page.waitForTimeout(4300);
            const id = await page.evaluate(() => {
                const s = document.querySelector('section.present');
                return s ? (s.id || '(no id)') : '(none)';
            });
            const rows = await page.evaluate(PROBE);
            counted += rows.length;
            rows.filter(r => r.occludedBy).forEach(r => occluded.push({ slide: id, ...r }));
            rows.filter(r => !r.occludedBy && r.ratio < r.required)
                .forEach(r => fails.push({ slide: id, ...r }));
        }

        totalText += counted;
        totalFail += fails.length;
        report[lecture] = { slides: n, textNodes: counted, failures: fails, occluded: occluded };
        console.log(`  ${lecture.padEnd(30)} ${String(counted).padStart(5)} text  ` +
                    `${fails.length ? String(fails.length).padStart(3) + ' FAIL' : '  0 fail'}` +
                    `${occluded.length ? '   ' + occluded.length + ' covered' : ''}`);
        fails.slice(0, 12).forEach(f => console.log(
            `      ${f.slide} — ${f.ratio}:1 < ${f.required}:1  ${f.size}px  ` +
            `${f.fill} on ${f.bg}  "${f.text}"`));
        if (fails.length > 12) console.log(`      … and ${fails.length - 12} more`);
    }

    const out = path.join(__dirname, '..', 'pw-results', 'contrast-audit.json');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(report, null, 2));
    console.log(`\n  ${totalText} text nodes measured, ${totalFail} below WCAG AA`);
    console.log(`  Report → ${out}`);

    await browser.close();
    process.exit(totalFail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
