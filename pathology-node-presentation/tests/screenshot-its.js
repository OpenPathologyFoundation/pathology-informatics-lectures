// Playwright screenshot harness for the its-leadership lecture.
// Walks every slide, takes a viewport-sized PNG and dumps element metrics.
// Run: node tests/screenshot-its.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'http://localhost:8000/lecture.html?lecture=its-leadership';
const OUT = path.join(__dirname, '..', 'pw-results', 'its-shots');
const VIEWPORT = { width: 1280, height: 720 };

const SLIDES = [
    'title',
    'context-landscape',
    'what-weve-built',
    'velocity-change',
    'xenonym-illustration',
    'presentation-as-code',
    'ibis-demo',
    'the-friction',
    'the-ask',
    'qa'
];

(async () => {
    if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
    const page = await ctx.newPage();

    // Pre-seed presenter so the title slide renders the real header
    await page.addInitScript(() => {
        try {
            localStorage.setItem('pathInfoPresenter', JSON.stringify({
                name: 'Peter Gershkovich',
                title: 'M.D., M.H.A.',
                institution: 'Yale University',
                email: 'peter.gershkovich@yale.edu',
                skipped: false
            }));
        } catch (e) {}
    });

    const consoleErrs = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text()); });
    page.on('pageerror', e => consoleErrs.push('PAGEERROR: ' + e.message));

    await page.goto(URL, { waitUntil: 'networkidle' });
    // Reveal init delay
    await page.waitForTimeout(2500);
    const revealReady = await page.evaluate(() => !!(window.Reveal && typeof window.Reveal.slide === 'function'));
    console.log('Reveal ready:', revealReady);

    const report = [];

    for (let i = 0; i < SLIDES.length; i++) {
        const id = SLIDES[i];

        // Navigate via Reveal API
        await page.evaluate((idx) => {
            if (window.Reveal) window.Reveal.slide(idx);
        }, i);
        await page.waitForTimeout(3500); // let viz animations complete

        // Capture metrics
        const metrics = await page.evaluate(() => {
            const cur = document.querySelector('.reveal .slides section.present');
            if (!cur) return { error: 'no current slide' };
            const rect = cur.getBoundingClientRect();
            const svg = cur.querySelector('svg');
            const svgRect = svg ? svg.getBoundingClientRect() : null;
            // Check for any element overflowing the slide bbox
            const all = cur.querySelectorAll('*');
            let overflow = [];
            all.forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) return;
                if (r.left < rect.left - 2 || r.right > rect.right + 2 ||
                    r.top < rect.top - 2 || r.bottom > rect.bottom + 2) {
                    overflow.push({
                        tag: el.tagName.toLowerCase(),
                        cls: (el.className && el.className.baseVal !== undefined) ? el.className.baseVal : (el.className || ''),
                        text: (el.textContent || '').slice(0, 60).trim(),
                        l: Math.round(r.left), r: Math.round(r.right),
                        t: Math.round(r.top), b: Math.round(r.bottom)
                    });
                }
            });
            return {
                slideId: cur.dataset.slideId || cur.id || null,
                slide: { l: Math.round(rect.left), r: Math.round(rect.right), t: Math.round(rect.top), b: Math.round(rect.bottom), w: Math.round(rect.width), h: Math.round(rect.height) },
                svg: svgRect ? { l: Math.round(svgRect.left), r: Math.round(svgRect.right), t: Math.round(svgRect.top), b: Math.round(svgRect.bottom), w: Math.round(svgRect.width), h: Math.round(svgRect.height) } : null,
                overflowCount: overflow.length,
                overflowSample: overflow.slice(0, 8)
            };
        });

        const file = path.join(OUT, String(i).padStart(2, '0') + '-' + id + '.png');
        await page.screenshot({ path: file, fullPage: false });
        report.push({ idx: i, id, file: path.basename(file), ...metrics });
        console.log('captured', i, id, '— overflow:', metrics.overflowCount);
    }

    fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ consoleErrs, report }, null, 2));
    console.log('\nReport written to', path.join(OUT, 'report.json'));
    if (consoleErrs.length) {
        console.log('\nConsole errors:');
        consoleErrs.forEach(e => console.log('  ', e));
    }

    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
