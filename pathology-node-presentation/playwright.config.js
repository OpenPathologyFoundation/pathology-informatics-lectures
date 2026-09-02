// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/* ============================================================
   Playwright configuration — presentation test suite

   Projects are named <browser>-<viewport width>. The specs are
   viewport-agnostic but assert proportional scaling of the
   Reveal.js canvas and its D3 visualizations, so the same suite
   is run at several widths.

     npm test           → chromium-1280 only
     npm run test:all   → every viewport
     npm run test:report→ opens the HTML report
   ============================================================ */

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const BASE_URL = `http://localhost:${PORT}`;

/** Viewports the suite is exercised at. */
const VIEWPORTS = [
    { name: 'chromium-1280', width: 1280, height: 800 },
    { name: 'chromium-1440', width: 1440, height: 900 },
    { name: 'chromium-1920', width: 1920, height: 1080 }
];

module.exports = defineConfig({
    testDir: './tests',

    // tests/ also holds standalone node scripts (validate-links.js,
    // viz-static-analysis.js, screenshot-its.js) that are not Playwright
    // specs — match only *.spec.js so they are never collected.
    testMatch: '**/*.spec.js',

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['list'],
        ['html', { outputFolder: 'test-results/html-report', open: 'never' }]
    ],
    outputDir: 'test-results/artifacts',

    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off'
    },

    projects: VIEWPORTS.map(v => ({
        name: v.name,
        use: { ...devices['Desktop Chrome'], viewport: { width: v.width, height: v.height } }
    })),

    // Boot the Express app for the suite; reuse a server already running locally.
    webServer: {
        command: 'npm start',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 60 * 1000,
        stdout: 'ignore',
        stderr: 'pipe'
    }
});
