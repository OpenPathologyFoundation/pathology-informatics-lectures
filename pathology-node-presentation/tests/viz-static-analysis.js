#!/usr/bin/env node
/* ============================================================
   Visualization Static Analysis — Lightweight Test Harness
   ─────────────────────────────────────────────────────────────
   Validates D3.js visualization code WITHOUT a browser.
   Parses viz-library.js as source text and applies design rules:

   1. Contrast — text fills vs background fills
   2. Font legibility — minimum sizes, hierarchy present
   3. Bauhaus adherence — no gratuitous decoration
   4. Slide JSON integrity — all vizTypes map to functions
   5. Color accessibility — WCAG-aware luminance checks

   Usage:  node tests/viz-static-analysis.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────────────────
const VIZ_LIB_PATH = path.join(__dirname, '..', 'js', 'viz-library.js');
const JSON_PATH = path.join(__dirname, '..', 'data', 'lectures', 'oneit.json');
const CSS_PATH = path.join(__dirname, '..', 'css', 'intro.css');

// ─── UTILITIES ───────────────────────────────────────────────

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

/** Relative luminance per WCAG 2.1 */
function relativeLuminance(rgb) {
    const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** WCAG contrast ratio between two hex colors */
function contrastRatio(hex1, hex2) {
    const l1 = relativeLuminance(hexToRgb(hex1));
    const l2 = relativeLuminance(hexToRgb(hex2));
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/** Approximate effective bg color when fill has opacity on white (#fff) slide */
function blendOnWhite(hex, opacity) {
    const fg = hexToRgb(hex);
    return {
        r: Math.round(fg.r * opacity + 255 * (1 - opacity)),
        g: Math.round(fg.g * opacity + 255 * (1 - opacity)),
        b: Math.round(fg.b * opacity + 255 * (1 - opacity))
    };
}

function rgbToHex(rgb) {
    return '#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('');
}

// ─── TEST FRAMEWORK ──────────────────────────────────────────

let passed = 0, failed = 0, warned = 0;
const failures = [];
const warnings = [];

function pass(msg) { passed++; console.log(`  ✓ ${msg}`); }
function fail(msg, detail) {
    failed++;
    failures.push({ msg, detail });
    console.log(`  ✗ ${msg}`);
    if (detail) console.log(`    → ${detail}`);
}
function warn(msg, detail) {
    warned++;
    warnings.push({ msg, detail });
    console.log(`  ⚠ ${msg}`);
    if (detail) console.log(`    → ${detail}`);
}

function section(title) { console.log(`\n━━━ ${title} ━━━`); }

// ─── LOAD SOURCES ────────────────────────────────────────────

const vizSrc = fs.readFileSync(VIZ_LIB_PATH, 'utf8');
const lectureData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
let cssSrc = '';
try { cssSrc = fs.readFileSync(CSS_PATH, 'utf8'); } catch(e) {}

// ─── EXTRACT FUNCTION BODIES ─────────────────────────────────
// Find each `function name(container, config) { ... }` and extract its body

function extractFunctions(src) {
    const fns = {};
    // Match function declarations: `function name(container, config) {`
    const fnRegex = /function\s+(\w+)\s*\(\s*container\s*,\s*config\s*\)\s*\{/g;
    let match;
    const starts = [];
    while ((match = fnRegex.exec(src)) !== null) {
        starts.push({ name: match[1], start: match.index, bodyStart: match.index + match[0].length });
    }

    for (let i = 0; i < starts.length; i++) {
        const fn = starts[i];
        // Find balanced closing brace
        let depth = 1;
        let pos = fn.bodyStart;
        while (depth > 0 && pos < src.length) {
            if (src[pos] === '{') depth++;
            else if (src[pos] === '}') depth--;
            pos++;
        }
        fns[fn.name] = src.substring(fn.bodyStart, pos - 1);
    }
    return fns;
}

const vizFunctions = extractFunctions(vizSrc);
const vizNames = Object.keys(vizFunctions);

// ─── EXTRACT REGISTRY ────────────────────────────────────────

function extractRegistry(src) {
    const regMatch = src.match(/var\s+registry\s*=\s*\{([^}]+)\}/);
    if (!regMatch) return {};
    const entries = {};
    const lineRegex = /'([^']+)'\s*:\s*(\w+)/g;
    let m;
    while ((m = lineRegex.exec(regMatch[1])) !== null) {
        entries[m[1]] = m[2];
    }
    return entries;
}

const registry = extractRegistry(vizSrc);

// ─── PARSE ATTR CALLS FROM FUNCTION BODY ─────────────────────

function extractAttrs(body) {
    const attrs = [];
    // Match .attr('key', 'value') or .attr('key', value)
    const attrRegex = /\.attr\(\s*'([^']+)'\s*,\s*(?:'([^']*)'|"([^"]*)"|(\d+(?:\.\d+)?)|([^)]+))\s*\)/g;
    let m;
    while ((m = attrRegex.exec(body)) !== null) {
        attrs.push({
            key: m[1],
            value: m[2] || m[3] || m[4] || m[5] || '',
            raw: m[0],
            pos: m.index
        });
    }
    return attrs;
}

/** Extract fill/text pairs by analyzing sequential .attr chains */
function extractTextElements(body) {
    const texts = [];
    // Find text element creation: .append('text')...chain of attrs
    const textBlockRegex = /\.append\(\s*'text'\s*\)([\s\S]*?)(?=\.append\(|\.transition\(|;\s*\n|var\s|\})/g;
    let m;
    while ((m = textBlockRegex.exec(body)) !== null) {
        const chain = m[1];
        const fillMatch = chain.match(/\.attr\(\s*'fill'\s*,\s*'([^']+)'\s*\)/);
        const sizeMatch = chain.match(/\.attr\(\s*'font-size'\s*,\s*(?:'(\d+)px'|(\d+))\s*\)/);
        const weightMatch = chain.match(/\.attr\(\s*'font-weight'\s*,\s*(?:'?(\d+)'?)\s*\)/);
        const textMatch = chain.match(/\.text\(\s*(?:'([^']*)'|"([^"]*)")/);
        texts.push({
            fill: fillMatch ? fillMatch[1] : null,
            fontSize: sizeMatch ? parseInt(sizeMatch[1] || sizeMatch[2]) : null,
            fontWeight: weightMatch ? parseInt(weightMatch[1]) : null,
            text: textMatch ? (textMatch[1] || textMatch[2] || '') : null,
            raw: chain.substring(0, 120)
        });
    }
    return texts;
}

/** Extract rect fills and opacities */
function extractRects(body) {
    const rects = [];
    const rectBlockRegex = /\.append\(\s*'rect'\s*\)([\s\S]*?)(?=\.append\(|\.transition\(|;\s*\n|var\s|\})/g;
    let m;
    while ((m = rectBlockRegex.exec(body)) !== null) {
        const chain = m[1];
        const fillMatch = chain.match(/\.attr\(\s*'fill'\s*,\s*'([^']+)'\s*\)/);
        const opacityMatch = chain.match(/\.attr\(\s*'fill-opacity'\s*,\s*(\d+\.?\d*)\s*\)/);
        rects.push({
            fill: fillMatch ? fillMatch[1] : null,
            fillOpacity: opacityMatch ? parseFloat(opacityMatch[1]) : 1.0,
        });
    }
    return rects;
}

// ─── TEST 1: SLIDE JSON INTEGRITY ────────────────────────────

section('Slide JSON Integrity');

const slides = lectureData.slides;
const vizSlides = slides.filter(s => s.type === 'visualization');

// Every slide must have an id
let allHaveIds = true;
slides.forEach((s, i) => {
    if (!s.id) { allHaveIds = false; fail(`Slide at index ${i} missing id`); }
});
if (allHaveIds) pass(`All ${slides.length} slides have IDs`);

// Every slide must have a type
const typelessSlides = slides.filter(s => !s.type);
if (typelessSlides.length === 0) pass(`All slides have type field`);
else fail(`${typelessSlides.length} slides missing type`);

// No duplicate IDs
const ids = slides.map(s => s.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length === 0) pass(`No duplicate slide IDs`);
else fail(`Duplicate IDs: ${dupes.join(', ')}`);

// Every vizType maps to a registered function
vizSlides.forEach(s => {
    if (registry[s.vizType]) {
        pass(`vizType "${s.vizType}" → function "${registry[s.vizType]}" registered`);
    } else {
        fail(`vizType "${s.vizType}" on slide "${s.id}" has no registry entry`);
    }
});

// Every registry entry maps to an actual function
Object.entries(registry).forEach(([key, fnName]) => {
    if (vizFunctions[fnName]) {
        pass(`Registry "${key}" → function ${fnName}() exists`);
    } else {
        fail(`Registry "${key}" → function ${fnName}() NOT FOUND in source`);
    }
});


// ─── TEST 2: FONT SIZE LEGIBILITY ───────────────────────────

section('Font Size Legibility');

const MIN_FONT = 8;  // absolute floor for any text in SVG
const MIN_LABEL_FONT = 10;  // min for labels that carry meaning

vizSlides.forEach(s => {
    const fnName = registry[s.vizType];
    if (!fnName || !vizFunctions[fnName]) return;
    const texts = extractTextElements(vizFunctions[fnName]);

    const fontSizes = texts.filter(t => t.fontSize).map(t => t.fontSize);
    if (fontSizes.length === 0) {
        warn(`"${s.vizType}" — no font-size attributes found (may use CSS or variables)`);
        return;
    }

    const minSize = Math.min(...fontSizes);
    const maxSize = Math.max(...fontSizes);

    if (minSize < MIN_FONT) {
        fail(`"${s.vizType}" has font ${minSize}px — below ${MIN_FONT}px legibility floor`);
    } else {
        pass(`"${s.vizType}" min font: ${minSize}px ≥ ${MIN_FONT}px`);
    }

    // Check typographic hierarchy exists
    if (fontSizes.length > 1 && maxSize / minSize >= 1.2) {
        pass(`"${s.vizType}" type hierarchy: ${minSize}px → ${maxSize}px (ratio ${(maxSize/minSize).toFixed(1)})`);
    } else if (fontSizes.length > 1) {
        warn(`"${s.vizType}" weak hierarchy: ${minSize}px → ${maxSize}px (ratio ${(maxSize/minSize).toFixed(1)})`);
    }
});


// ─── TEST 3: TEXT-ON-BACKGROUND CONTRAST ─────────────────────

section('Text Contrast (WCAG)');

// For each viz function, find text fills and compare against likely backgrounds.
// Backgrounds are either: slide bg (white #ffffff), or rect fills with opacity.

const SLIDE_BG = '#ffffff';  // Reveal.js white theme
const DARK_BG_FUNCTIONS = ['animatedPipeline', 'systemsEcosystem']; // dark-bg slides
const WCAG_AA_RATIO = 4.5;  // normal text
const WCAG_AA_LARGE = 3.0;  // large text (≥18px or ≥14px bold)

vizSlides.forEach(s => {
    const fnName = registry[s.vizType];
    if (!fnName || !vizFunctions[fnName]) return;
    const body = vizFunctions[fnName];
    const texts = extractTextElements(body);
    const rects = extractRects(body);

    // Determine effective background
    const isDarkBg = DARK_BG_FUNCTIONS.includes(fnName) ||
                     body.includes("fill', '#0f172a") || body.includes("fill', '#1e293b");
    const baseBg = isDarkBg ? '#1e293b' : SLIDE_BG;

    let issueCount = 0;
    texts.forEach(t => {
        if (!t.fill || !t.fill.startsWith('#')) return;

        // Large text threshold
        const isLarge = (t.fontSize && t.fontSize >= 18) ||
                        (t.fontSize && t.fontSize >= 14 && t.fontWeight && t.fontWeight >= 700);
        const threshold = isLarge ? WCAG_AA_LARGE : WCAG_AA_RATIO;

        // Check against base slide background
        const ratio = contrastRatio(t.fill, baseBg);
        if (ratio < threshold) {
            const desc = t.text ? `"${t.text.substring(0, 30)}"` : `(${t.fontSize || '?'}px text)`;
            fail(
                `"${s.vizType}" — contrast ${ratio.toFixed(1)}:1 < ${threshold}:1 — ${desc}`,
                `fill=${t.fill} on bg=${baseBg}`
            );
            issueCount++;
        }
    });

    if (issueCount === 0) {
        pass(`"${s.vizType}" — all text meets WCAG AA contrast on ${isDarkBg ? 'dark' : 'light'} bg`);
    }
});


// ─── TEST 4: VIEWBOX PRESENCE & ASPECT RATIO ────────────────

section('SVG ViewBox & Proportionality');

Object.entries(vizFunctions).forEach(([fnName, body]) => {
    const vbMatch = body.match(/viewBox['"]\s*,\s*['"](\d+)\s+(\d+)\s+(\d+)\s+(\d+)['"]/);
    if (!vbMatch) {
        // Try alternate format: '0 0 ' + W + ' ' + H
        const dynMatch = body.match(/viewBox.*?['"]0 0 /);
        if (dynMatch) {
            pass(`${fnName}() — dynamic viewBox (0 0 W H)`);
        } else {
            fail(`${fnName}() — no viewBox found`);
        }
        return;
    }
    const [, x, y, w, h] = vbMatch.map(Number);
    const aspect = w / h;
    pass(`${fnName}() — viewBox ${w}×${h} (${aspect.toFixed(2)}:1)`);

    // Check preserveAspectRatio present
    if (body.includes('preserveAspectRatio')) {
        pass(`${fnName}() — preserveAspectRatio set`);
    } else {
        warn(`${fnName}() — missing preserveAspectRatio`);
    }
});


// ─── TEST 5: ANIMATION STAGGER (BAUHAUS: PURPOSEFUL MOTION) ─

section('Animation Discipline');

vizSlides.forEach(s => {
    const fnName = registry[s.vizType];
    if (!fnName || !vizFunctions[fnName]) return;
    const body = vizFunctions[fnName];

    const delays = [];
    const delayRegex = /\.delay\(\s*(\d+)/g;
    let m;
    while ((m = delayRegex.exec(body)) !== null) {
        delays.push(parseInt(m[1]));
    }

    if (delays.length === 0) {
        // Check for computed delays (e.g., 300 + i * 100)
        const computedDelay = /\.delay\([^)]*\*[^)]*\)/g;
        if (computedDelay.test(body)) {
            pass(`"${s.vizType}" — uses computed staggered delays`);
        } else {
            warn(`"${s.vizType}" — no animation delays found`);
        }
    } else {
        const uniqueDelays = new Set(delays);
        if (uniqueDelays.size > 1 || /\.delay\([^)]*\*[^)]*\)/.test(body)) {
            pass(`"${s.vizType}" — staggered animation (${uniqueDelays.size} unique static delays)`);
        } else {
            warn(`"${s.vizType}" — all delays identical (${delays[0]}ms) — no stagger`);
        }
    }
});


// ─── TEST 6: BAUHAUS — NO GRATUITOUS DECORATION ─────────────

section('Bauhaus: Form Follows Function');

Object.entries(vizFunctions).forEach(([fnName, body]) => {
    // Check for drop shadows, gradients, decorative patterns
    const hasShadow = /filter.*shadow|drop-shadow/i.test(body);
    const hasGradient = /linearGradient|radialGradient/.test(body);
    const hasClipArt = /image\/|\.png|\.jpg|\.gif|clipPath.*decorat/i.test(body);

    if (hasShadow) warn(`${fnName}() — uses drop-shadow (review for necessity)`);
    if (hasGradient) warn(`${fnName}() — uses gradient (ensure it encodes data, not decoration)`);
    if (hasClipArt) fail(`${fnName}() — embeds raster image (violates Bauhaus principle)`);

    if (!hasShadow && !hasGradient && !hasClipArt) {
        pass(`${fnName}() — clean vector rendering, no decorative extras`);
    }
});


// ─── TEST 7: DATA-INK RATIO ─────────────────────────────────

section('Tufte Data-Ink Ratio');

vizSlides.forEach(s => {
    const fnName = registry[s.vizType];
    if (!fnName || !vizFunctions[fnName]) return;
    const body = vizFunctions[fnName];
    const rects = extractRects(body);

    if (rects.length < 3) return; // not enough rects to analyze

    const subtleFills = rects.filter(r =>
        r.fillOpacity < 0.5 || r.fill === 'none' || r.fill === 'white' ||
        (r.fill && r.fill.includes('rgba'))
    ).length;

    const ratio = subtleFills / rects.length;
    if (ratio >= 0.3) {
        pass(`"${s.vizType}" — ${(ratio * 100).toFixed(0)}% subtle fills (${subtleFills}/${rects.length} rects)`);
    } else {
        warn(`"${s.vizType}" — only ${(ratio * 100).toFixed(0)}% subtle fills — consider reducing solid fills`);
    }
});


// ─── TEST 8: CSS VIZ-CONTAINER ───────────────────────────────

section('CSS Container Configuration');

if (cssSrc) {
    if (cssSrc.includes('.viz-container')) {
        pass('CSS defines .viz-container');
        if (cssSrc.includes('max-height')) pass('.viz-container has max-height constraint');
        else warn('.viz-container missing max-height');
        if (cssSrc.match(/position\s*:\s*relative/)) pass('.viz-container has position: relative');
        else warn('.viz-container missing position: relative');
    } else {
        fail('No .viz-container in intro.css');
    }
} else {
    warn('Could not read intro.css');
}


// ─── TEST 9: PRESENTATION META INTEGRITY ─────────────────────

section('Presentation Metadata');

if (lectureData.meta) {
    const meta = lectureData.meta;
    if (meta.title) pass(`Title: "${meta.title}"`);
    else fail('Missing meta.title');
    if (meta.theme) pass(`Theme defined`);
    else warn('No theme in meta');
    if (meta.glossary && Object.keys(meta.glossary).length > 0) {
        pass(`Glossary: ${Object.keys(meta.glossary).length} terms`);
    } else {
        warn('No glossary terms defined');
    }
} else {
    fail('No meta object in lecture JSON');
}


// ─── TEST 10: TRANSITION COVERAGE ────────────────────────────

section('Slide Transition Coverage');

const validTransitions = ['fade', 'convex', 'zoom', 'slide', 'concave', 'none'];
let missingTransitions = 0;
slides.forEach(s => {
    if (!s.transition) {
        missingTransitions++;
    } else if (!validTransitions.includes(s.transition)) {
        fail(`Slide "${s.id}" has invalid transition: "${s.transition}"`);
    }
});
if (missingTransitions === 0) {
    pass(`All ${slides.length} slides have valid transitions`);
} else {
    warn(`${missingTransitions} slides missing explicit transition (will use default)`);
}


// ─── TEST 11: TUFTE-TIMELINE LAYOUT VERIFICATION ──────────

section('Tufte Timeline Layout');

const tufteBody = vizFunctions['tufteTimeline'];
if (tufteBody) {
    // Extract margin constants
    const marginMatch = tufteBody.match(/var margin = \{([^}]+)\}/);
    if (marginMatch) {
        const marginStr = marginMatch[1];
        const getVal = (key) => {
            const m = marginStr.match(new RegExp(key + '\\s*:\\s*(\\d+)'));
            return m ? parseInt(m[1]) : null;
        };

        const bandTop = getVal('bandTop');
        const bandH = getVal('bandH');
        const eventY = getVal('eventY');
        const costTop = getVal('costTop');
        const costH = getVal('costH');
        const bottom = getVal('bottom');
        const left = getVal('left');
        const right = getVal('right');
        const H = 460; // from source: var W = 1100, H = 460

        const bandMid = bandTop + bandH / 2;
        // PPT band extends ±30-34 from mid; alt band starts at bandMid+34, extends up to 28
        const altBandBottom = bandMid + 34 + 28;

        // Event dots at eventY - 16, labels at eventY to eventY+26, icons at ~eventY+30
        const eventDotY = eventY - 16;
        const eventLabelBottom = eventY + 2 * 13 + 4 + 11; // 2 lines + icon gap + icon font

        // 1. Event dots must be below alt band
        if (eventDotY > altBandBottom) {
            pass(`Event dots (y=${eventDotY}) below alt band bottom (y=${altBandBottom}), gap=${eventDotY - altBandBottom}px`);
        } else {
            fail(`Event dots (y=${eventDotY}) overlap alt band bottom (y=${altBandBottom})`,
                 `gap=${eventDotY - altBandBottom}px — increase eventY or shrink bands`);
        }

        // 2. Cost chart top must be below event label bottom
        const costEventGap = costTop - eventLabelBottom;
        if (costEventGap >= 8) {
            pass(`Cost chart (y=${costTop}) below event labels (y=${eventLabelBottom}), gap=${costEventGap}px`);
        } else if (costEventGap >= 0) {
            warn(`Cost chart (y=${costTop}) very close to event labels (y=${eventLabelBottom}), gap=${costEventGap}px`);
        } else {
            fail(`Cost chart (y=${costTop}) overlaps event labels (y=${eventLabelBottom})`,
                 `overlap=${-costEventGap}px — increase costTop or move events up`);
        }

        // 3. Cost chart bottom must be above x-axis
        const costBottom = costTop + costH;
        const axisY = H - bottom + 10;
        if (costBottom < axisY) {
            pass(`Cost chart bottom (y=${costBottom}) above x-axis (y=${axisY}), gap=${axisY - costBottom}px`);
        } else {
            fail(`Cost chart bottom (y=${costBottom}) at/below x-axis (y=${axisY})`);
        }

        // 4. X-axis + year labels must fit within SVG height
        const axisLabelBottom = axisY + 14; // year labels below axis
        if (axisLabelBottom < H - 10) {
            pass(`X-axis labels (y=${axisLabelBottom}) fit within SVG (H=${H}), room for annotation`);
        } else {
            warn(`X-axis labels (y=${axisLabelBottom}) very close to SVG bottom (H=${H})`);
        }
    } else {
        fail('Could not parse margin constants from tufteTimeline');
    }

    // Extract events and check for label overlap
    const eventsMatch = tufteBody.match(/var events = \[([\s\S]*?)\];/);
    if (eventsMatch) {
        const eventRegex = /year:\s*([\d.]+),\s*label:\s*'([^']*)'/g;
        const parsedEvents = [];
        let em;
        while ((em = eventRegex.exec(eventsMatch[1])) !== null) {
            parsedEvents.push({ year: parseFloat(em[1]), label: em[2] });
        }

        if (parsedEvents.length > 0) {
            pass(`Found ${parsedEvents.length} events in tufte-timeline`);
        } else {
            fail('Could not parse events from tufteTimeline');
        }

        // Compute approximate x positions
        const W = 1100, marginLeft = 70, marginRight = 40;
        const plotW = W - marginLeft - marginRight;
        const xScale = (yr) => marginLeft + (yr - 2003) / (2026 - 2003) * plotW;
        const CHAR_WIDTH = 5; // approximate px per char at 9px font

        let overlapCount = 0;
        for (let i = 0; i < parsedEvents.length - 1; i++) {
            const curr = parsedEvents[i];
            const next = parsedEvents[i + 1];
            const x1 = xScale(curr.year);
            const x2 = xScale(next.year);
            const gap = x2 - x1;

            // Get widest line in each label
            const currLines = curr.label ? curr.label.split('\\n') : [];
            const nextLines = next.label ? next.label.split('\\n') : [];
            const currMaxLen = currLines.length > 0 ? Math.max(...currLines.map(l => l.length)) : 0;
            const nextMaxLen = nextLines.length > 0 ? Math.max(...nextLines.map(l => l.length)) : 0;

            // Both labels are center-anchored
            const currHalfW = (currMaxLen * CHAR_WIDTH) / 2;
            const nextHalfW = (nextMaxLen * CHAR_WIDTH) / 2;
            const minGap = currHalfW + nextHalfW + 4; // 4px breathing room

            if (curr.label === '' || next.label === '') {
                pass(`Events ${curr.year}→${next.year}: hidden label — no overlap risk`);
            } else if (gap >= minGap) {
                pass(`Events ${curr.year}→${next.year}: gap ${gap.toFixed(0)}px ≥ ${minGap.toFixed(0)}px needed`);
            } else {
                overlapCount++;
                fail(`Events ${curr.year}→${next.year}: gap ${gap.toFixed(0)}px < ${minGap.toFixed(0)}px — labels may overlap`,
                     `"${curr.label.replace(/\\n/g, ' ')}" ↔ "${next.label.replace(/\\n/g, ' ')}"`);
            }
        }

        if (overlapCount === 0 && parsedEvents.length > 1) {
            pass('All adjacent event labels have sufficient horizontal spacing');
        }
    } else {
        warn('Could not extract events array from tufteTimeline');
    }
} else {
    fail('tufteTimeline function not found in viz-library.js');
}


// ─── RESULTS SUMMARY ─────────────────────────────────────────

console.log('\n' + '═'.repeat(60));
console.log(`  RESULTS:  ${passed} passed  |  ${failed} failed  |  ${warned} warnings`);
console.log('═'.repeat(60));

if (failures.length > 0) {
    console.log('\n  FAILURES:');
    failures.forEach((f, i) => {
        console.log(`  ${i + 1}. ${f.msg}`);
        if (f.detail) console.log(`     ${f.detail}`);
    });
}

if (warnings.length > 0) {
    console.log('\n  WARNINGS:');
    warnings.forEach((w, i) => {
        console.log(`  ${i + 1}. ${w.msg}`);
        if (w.detail) console.log(`     ${w.detail}`);
    });
}

process.exit(failed > 0 ? 1 : 0);
