#!/usr/bin/env node
/**
 * Link Validation Tests
 * Verifies every external URL referenced in the OneIT presentation
 * (both viz-library.js timeline events and oneit.json sources/slides).
 *
 * Usage:  node tests/validate-links.js
 *
 * Checks:
 *   1. HTTP status 200 (or 301/302 redirect that resolves to 200)
 *   2. Response contains expected content marker (title keyword)
 *   3. No timeouts (10s limit)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ── All links with expected content markers ──────────────────────────
const LINKS = [
    // Tufte Timeline (viz-library.js)
    {
        url: 'https://www.edwardtufte.com/book/the-cognitive-style-of-powerpoint-pitching-out-corrupts-within-ebook/',
        label: 'Tufte – Cognitive Style of PowerPoint (2003)',
        source: 'viz-library.js',
        expect: 'PowerPoint'
    },
    {
        url: 'https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001yB',
        label: 'Tufte – NASA Columbia Analysis',
        source: 'viz-library.js',
        expect: null  // forum page, content loaded dynamically
    },
    {
        url: 'https://www.edwardtufte.com/book/beautiful-evidence/',
        label: 'Tufte – Beautiful Evidence (2006)',
        source: 'viz-library.js',
        expect: 'Beautiful Evidence'
    },
    {
        url: 'https://www.nytimes.com/2010/04/27/world/27powerpoint.html',
        label: 'Bumiller NYT – We Have Met the Enemy (Apr 2010)',
        source: 'viz-library.js',
        expect: 'PowerPoint'
    },
    {
        url: 'https://www.sciencedirect.com/science/article/abs/pii/S0747563211002603',
        label: 'ScienceDirect – Computers in Human Behavior (2011)',
        source: 'viz-library.js',
        expect: 'ScienceDirect'
    },
    {
        url: 'https://www.microsoft.com/en-us/microsoft-365/blog/2015/11/13/the-evolution-of-powerpoint-introducing-designer-and-morph/',
        label: 'Microsoft – PPT Designer & Morph (Nov 2015)',
        source: 'viz-library.js',
        expect: 'Microsoft'
    },
    {
        url: 'https://www.inc.com/carmine-gallo/jeff-bezos-bans-powerpoint-in-meetings-his-replacement-is-brilliant.html',
        label: 'Inc.com – Bezos Bans PowerPoint (2018)',
        source: 'viz-library.js',
        expect: 'Bezos'
    },
    {
        url: 'https://github.blog/2023-03-22-github-copilot-x-the-ai-powered-developer-experience/',
        label: 'GitHub Blog – Copilot X (Mar 2023)',
        source: 'viz-library.js',
        expect: 'Copilot'
    },

    // Sources slide (oneit.json)
    {
        url: 'https://www.microsoft.com/en-us/research/wp-content/uploads/2024/11/Time-Warp-Developer-Productivity-Study.pdf',
        label: 'Microsoft Research – Time Warp Developer Productivity (2024)',
        source: 'oneit.json',
        expect: null  // PDF — just check status
    },
    {
        url: 'https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/',
        label: 'JetBrains – State of Developer Ecosystem 2025',
        source: 'oneit.json',
        expect: 'JetBrains'
    },
    {
        url: 'https://www.infoworld.com/article/3831759/developers-spend-most-of-their-time-not-coding-idc-report.html',
        label: 'InfoWorld – IDC Report: Developers not coding',
        source: 'oneit.json',
        expect: 'developer'
    },
    {
        url: 'https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/',
        label: 'METR – AI Impact on Developer Productivity RCT (2025)',
        source: 'oneit.json',
        expect: 'METR'
    },
    {
        url: 'https://arxiv.org/abs/2507.03156',
        label: 'arXiv – LLM-Assistants Developer Productivity SLR (2025)',
        source: 'oneit.json',
        expect: 'arXiv'
    },
    {
        url: 'https://stackoverflow.co/labs/developer-sentiment-ai-ml/',
        label: 'Stack Overflow – 2025 Developer Survey AI Sentiment',
        source: 'oneit.json',
        expect: 'Stack Overflow'
    },

    // Xenonym link (oneit.json slides)
    {
        url: 'https://xenonym.openpathology.org',
        label: 'Xenonym Live App',
        source: 'oneit.json',
        expect: null
    }
];

// ── HTTP fetch with redirect following ───────────────────────────────
function fetchUrl(url, maxRedirects) {
    if (maxRedirects === undefined) maxRedirects = 5;
    return new Promise(function(resolve) {
        if (maxRedirects <= 0) {
            resolve({ status: 0, error: 'Too many redirects', body: '' });
            return;
        }
        var mod = url.startsWith('https') ? https : http;
        var req = mod.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) LinkValidator/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/pdf,*/*',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 15000
        }, function(res) {
            // Follow redirects
            if ([301, 302, 303, 307, 308].indexOf(res.statusCode) !== -1 && res.headers.location) {
                var loc = res.headers.location;
                if (loc.startsWith('/')) {
                    var parsed = new URL(url);
                    loc = parsed.protocol + '//' + parsed.host + loc;
                }
                res.resume(); // drain
                resolve(fetchUrl(loc, maxRedirects - 1));
                return;
            }
            var chunks = [];
            res.on('data', function(c) { chunks.push(c); });
            res.on('end', function() {
                var body = Buffer.concat(chunks).toString('utf-8').substring(0, 8000);
                resolve({ status: res.statusCode, error: null, body: body, finalUrl: url });
            });
        });
        req.on('error', function(err) {
            resolve({ status: 0, error: err.message, body: '' });
        });
        req.on('timeout', function() {
            req.destroy();
            resolve({ status: 0, error: 'Timeout (15s)', body: '' });
        });
    });
}

// ── Run all checks ───────────────────────────────────────────────────
async function main() {
    console.log('━━━ Link Validation: OneIT Presentation ━━━\n');

    var passed = 0, failed = 0, warnings = 0;
    var failures = [];
    var warns = [];

    for (var i = 0; i < LINKS.length; i++) {
        var link = LINKS[i];
        process.stdout.write('  ' + (i + 1) + '/' + LINKS.length + ' ' + link.label + ' ... ');

        var result = await fetchUrl(link.url);

        if (result.error) {
            console.log('✗ ERROR: ' + result.error);
            failed++;
            failures.push({ link: link, reason: result.error });
            continue;
        }

        if (result.status !== 200) {
            // Some sites return 403 for bots but page exists — treat as warning if 403
            if (result.status === 403 || result.status === 451) {
                console.log('⚠ HTTP ' + result.status + ' (bot-blocked, may work in browser)');
                warnings++;
                warns.push({ link: link, reason: 'HTTP ' + result.status + ' — bot-blocked' });
                continue;
            }
            console.log('✗ HTTP ' + result.status);
            failed++;
            failures.push({ link: link, reason: 'HTTP ' + result.status });
            continue;
        }

        // Content check (skip for PDFs or null expect)
        if (link.expect && result.body.length > 0) {
            if (result.body.toLowerCase().indexOf(link.expect.toLowerCase()) === -1) {
                console.log('⚠ HTTP 200 but content missing "' + link.expect + '"');
                warnings++;
                warns.push({ link: link, reason: 'Content marker "' + link.expect + '" not found' });
                continue;
            }
        }

        console.log('✓ OK');
        passed++;
    }

    // ── Summary ──
    console.log('\n' + '═'.repeat(60));
    console.log('  RESULTS:  ' + passed + ' passed  |  ' + failed + ' failed  |  ' + warnings + ' warnings');
    console.log('═'.repeat(60));

    if (failures.length > 0) {
        console.log('\n  FAILURES (must fix or remove):');
        failures.forEach(function(f, i) {
            console.log('  ' + (i + 1) + '. [' + f.link.source + '] ' + f.link.label);
            console.log('     URL: ' + f.link.url);
            console.log('     Reason: ' + f.reason);
        });
    }

    if (warns.length > 0) {
        console.log('\n  WARNINGS (verify manually in browser):');
        warns.forEach(function(w, i) {
            console.log('  ' + (i + 1) + '. [' + w.link.source + '] ' + w.link.label);
            console.log('     URL: ' + w.link.url);
            console.log('     Reason: ' + w.reason);
        });
    }

    console.log('');
    process.exit(failed > 0 ? 1 : 0);
}

main();
