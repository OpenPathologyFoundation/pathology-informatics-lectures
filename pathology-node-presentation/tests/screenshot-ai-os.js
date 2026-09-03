// Playwright screenshot harness for the ai_operating_system lecture.
// Walks every slide, captures a PNG, and reports elements that spill outside
// the 1200x700 canvas plus any console error. Sixteen of these slides carry
// brand-new D3 code, so "it parsed" is not the same as "it fits".
//
// Run:  node tests/screenshot-ai-os.js            (expects a server on :8000)
//       PORT=8123 node tests/screenshot-ai-os.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const LECTURE = process.env.LECTURE || 'ai_operating_system';
const URL = `http://localhost:${PORT}/lecture.html?lecture=${LECTURE}`;
const OUT = path.join(__dirname, '..', 'pw-results', LECTURE + '-shots');
const VIEWPORT = { width: 1440, height: 900 };

(async () => {
    if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
    const page = await ctx.newPage();

    await page.addInitScript(() => {
        try {
            localStorage.setItem('pathInfoPresenter', JSON.stringify({
                name: 'Peter Gershkovich',
                title: 'M.D., M.H.A.',
                credentials: 'MD, MHA',
                institution: 'Yale University School of Medicine',
                email: 'peter.gershkovich@yale.edu',
                coi: 'Consultant for Applicate Technologies Inc.',
                skipped: false
            }));
        } catch (e) {}
    });

    const consoleErrs = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text()); });
    page.on('pageerror', e => consoleErrs.push('PAGEERROR: ' + e.message));

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    const slides = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.reveal .slides > section'))
            .map(s => s.id || '(no id)'));
    console.log(`Reveal reports ${slides.length} slides.`);

    const report = [];

    for (let i = 0; i < slides.length; i++) {
        await page.evaluate(idx => { if (window.Reveal) window.Reveal.slide(idx); }, i);
        await page.waitForTimeout(4200);   // let the D3 stagger finish

        const metrics = await page.evaluate(() => {
            const cur = document.querySelector('.reveal .slides section.present');
            if (!cur) return { error: 'no current slide' };
            const rect = cur.getBoundingClientRect();
            const overflow = [];
            cur.querySelectorAll('*').forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) return;
                // The takeaway tooltip is absolutely positioned above the bar
                // on hover and legitimately sits outside; skip it.
                const cls = (el.className && el.className.baseVal !== undefined)
                    ? el.className.baseVal : (el.className || '');
                if (String(cls).indexOf('takeaway-comment') >= 0) return;
                if (r.left < rect.left - 2 || r.right > rect.right + 2 ||
                    r.top < rect.top - 2 || r.bottom > rect.bottom + 2) {
                    overflow.push({
                        tag: el.tagName.toLowerCase(),
                        cls: String(cls).slice(0, 40),
                        text: (el.textContent || '').slice(0, 70).trim(),
                        dx: Math.round(Math.max(rect.left - r.left, r.right - rect.right, 0)),
                        dy: Math.round(Math.max(rect.top - r.top, r.bottom - rect.bottom, 0))
                    });
                }
            });
            const svg = cur.querySelector('svg');
            return {
                slideId: cur.id || null,
                viz: cur.getAttribute('data-viz') || null,
                svgNodes: svg ? svg.querySelectorAll('*').length : 0,
                overflowCount: overflow.length,
                overflowSample: overflow.slice(0, 6)
            };
        });

        const file = path.join(OUT, String(i).padStart(2, '0') + '-' + slides[i] + '.png');
        await page.screenshot({ path: file, fullPage: false });
        report.push({ idx: i, id: slides[i], file: path.basename(file), ...metrics });
        console.log(
            String(i).padStart(2, '0'), slides[i].padEnd(32),
            'svg:' + String(metrics.svgNodes).padStart(5),
            'overflow:' + metrics.overflowCount);
    }

    fs.writeFileSync(path.join(OUT, 'report.json'),
        JSON.stringify({ url: URL, consoleErrs, report }, null, 2));
    console.log('\nReport →', path.join(OUT, 'report.json'));
    if (consoleErrs.length) {
        console.log('\nConsole errors:');
        consoleErrs.forEach(e => console.log('  ', e));
    } else {
        console.log('\nNo console errors.');
    }

    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
