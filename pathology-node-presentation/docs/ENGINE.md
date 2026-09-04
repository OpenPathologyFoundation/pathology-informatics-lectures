# The Slide Engine

Reference for the JSON-driven lecture engine behind `lecture.html`. Ten lectures run on it. If you are adding a lecture or a visualization, this is the contract.

`index.html` and `software_dev_clinical_use.html` are separate, self-contained Reveal.js decks and are **not** covered here.

---

## 1. Load path

`server.js` maps `GET /lecture/:name` to a 302 redirect to `/lecture.html?lecture=<name>`. There is no existence check — a bad name renders "Error loading lecture".

`lecture.html` reads `?lecture=` (default `intro_pathology_informatics`), builds `data/lectures/<name>.json`, and initializes:

```
Presenter.init(cb) → SlideEngine.loadLecture(jsonUrl, cb) → Glossary.init(data.meta.glossary)
  → Reveal.initialize({ width: 1200, height: 700, margin: 0.04, center: false, hash: true })
  → SlideEngine.initWidgets() / initVizOnSlideChange() / initBadgeOverlay() / DockNav.init()
  → Glossary.scanSlides() / addButtons() / initKeyboard() → Presenter.initKeyboard() → HelpOverlay.init()
```

`loadLecture` derives `meta.lectureId` from the filename — this is what live polls key on.

**The canvas is a fixed 1200×700 scaled by CSS transform.** Use px and em in visualizations, never vw/vh.

---

## 2. JSON shape

```jsonc
{
  "meta": {
    "title", "shortTitle", "presenter", "institution", "date",
    "theme": { "primary", "secondary", "accent" },
    "glossary": [ { "term", "definition" } ]
  },
  "slides": [ /* … */ ]
}
```

`meta.title` sets `document.title`. `meta.presenter` / `institution` / `date` are fallbacks only — the Presenter profile in localStorage overrides them.

> `meta.theme` is currently inert. `slide-engine.js` writes `--intro-primary/-secondary/-accent` onto the root element, but no stylesheet reads them. Per-lecture look is set by `bgColor` / `theme: "light"` per slide and by the visualization palettes.

### Keys every slide understands

| Key | Effect |
|---|---|
| `type` | Dispatcher key (§3). Unknown types are warned and dropped. |
| `id` | Becomes `section.id`, and the container ids `viz-<id>`, `poll-<id>`, `vote-<id>`, `timer-<id>`. Must be unique and non-empty. |
| `transition` | `data-transition`; defaults to `fade` (`zoom` for `title` and `qa`). |
| `backgroundGradient` | `data-background-gradient`. |
| `badge` | `data-badge` — see §5. |
| `isOptional` | Adds `.optional-slide`; hidden when the title-slide toggle is off, and shown as a grey ghost dot in the dock. |
| `dockTitle` | Dock hover label for slides with no H2 (full-bleed visualizations need this). |
| `takeaway` | String, or `{ text, comment }` — see §6. |
| `speakerNotes` | Rendered into `<aside class="notes">` for Reveal's `S` speaker view. |

---

## 3. Slide types

Fourteen renderers.

**`title`** — `title`, `subtitle`, `presenter`, `institution`, `date`. Emits the optional-slides toggle (writes `sessionStorage.showOptional`, reloads) and a GitHub source link.

**`content`** — `title`, `subtitle`, `bullets[]` (HTML allowed), `numberedItems[]`, `fragments` (**default true**; set `false` to disable per-bullet reveal), `note`, `takeaway`. Special case: a slide with `id: "coi"` has its bullets replaced by the Presenter profile's COI plus a fixed educational-purposes disclaimer.

**`two-column`** — `title`, `subtitle`, `left`/`right` = `{ heading, bullets[], highlight }`. `highlight: true` adds `.highlight-box`.

**`comparison`** — `left`/`right` = `{ heading, bullets[], style }`. `style` is emitted as a raw class; `good` and `bad` are styled, `muted` and `highlight` are accepted and harmless. Bullets never fragment.

**`poll`** — `title`, `prompt`, `options[]`, `note`. Badge forced to `interactive`. See §7.

**`micro-case`** — `title`, `scenario`, `options[]`, `discussion[]`, `discussionFrame`.

**`timer`** — `title`, `prompt`, `duration` (seconds, default 90), `categories[]`.

**`visualization`** — `title` and `subtitle` both optional, `vizType`, `vizConfig` (default `{}`), `takeaway`. **If neither `title` nor `subtitle` is present the slide gets `.viz-fullbleed`** — this is how the full-canvas Tufte slides are done. Pair it with `dockTitle`.

**`workshop`** — `title`, `instruction`, `groups[] = { heading, items[], start }`.

**`snippets`** — `title`, `snippets[]`, `answers[]` (parallel array; its presence makes each card click-to-expand), `prompt`, `goal`.

**`interactive-list`** — `title`, `darkBg`, `epigraph: { text, attribution }`, `layout`, `items[] = { number, question, detail }`. `detail` produces a hover tooltip and dims siblings.

**`infographic`** — `title`, `subtitle`, `bgColor`, `theme: "light"`, `cards[] = { icon, label, value, description, accentColor }`, optionally `vizType` + `vizConfig` below the cards, `takeaway`. Three cards per row; four cards get their own four-column row.

**`takeaways`** — `title`, `items[]` (auto-numbered), `cta: { label, text }`.

**`qa`** — `title`, `subtitle`, `contact`, `qrCode: { src, url, label, caption }`. Presenter data overrides `contact`.

---

## 4. Visualizations

`VizLibrary.render(name, container, config)` looks `name` up in the registry and calls `fn(container, config || {})`. Unknown names warn and no-op. **102 vizTypes are registered**, in two places: an object literal (`var registry = { … }`) and a run of `registry['name'] = fn;` assignments at the end of the file. Both forms are equivalent; the assignment block is where anything added since the orchestration lecture lives.

Most of the older visualizations hard-code their content and ignore `config` entirely — they can be reused verbatim but not re-datad from JSON. Everything added for the `ai_operating_system` lecture is config-driven: labels, lists and numbers arrive through `vizConfig` so the deck JSON, not the JS, owns the words.

### Writing one

```js
function myViz(container, config) {
    var W = 1280, H = 700, P = TUFTE;
    var svg = d3.select(container).append('svg')
        .attr('viewBox', '0 0 ' + W + ' ' + H)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('max-width', '100%').style('max-height', '88vh')
        .style('background', P.bg);
    // …
}
registry['my-viz'] = myViz;
```

Rules the static analyzer enforces (§8):

- `viewBox` and `preserveAspectRatio` on every SVG, or delegate to a `…Stage()` helper that sets them.
- Minimum font-size 8 px; 10 px for anything carrying meaning.
- WCAG-AA contrast against the slide background.
- Staggered reveals — computed `.delay(base + i * step)`, or the shared `aiosReveal()` helper.
- No emoji in SVG `<text>`: the glossary scanner skips SVG subtrees, and emoji render inconsistently.

### Things that will bite you

- **Lazy rendering dedups by `vizType`, not slide id.** If two slides share a vizType, both containers are filled the first time either is reached, and the second slide's animation will already have played. Give each slide a distinct vizType.
- **Sizing is viewBox-only.** There is no `ResizeObserver` and no re-render on resize.
- **A takeaway bar covers the bottom ~9% of the SVG box.** On a slide with a `takeaway`, keep content above roughly `0.90 × H`.
- **Reveal fragments are not used inside visualizations.** Step reveals are D3-timed.
- **Respect `prefers-reduced-motion`** for continuous animation (sweeping hands, looping transitions).

### Palettes

Two, and they should not be mixed within a visualization.

*Cream Tufte* (everything from 2025 on, exported as `TUFTE`): background `#faf7f1`, ink `#1f1a14`, muted `#6b5c48`, rule `#bcb1a0`, fine `#d8d2c5`, slate `#3d5b73`, copper `#a36015`, crimson `#7a1f1a`, green `#0e3f2c`, amber `#8a5a0c`, violet `#5b2d71`. Display face `SERIF` (Georgia stack), labels `SANS` (Inter stack). Helpers: `tufteRule`, `tufteSmallCaps`, `tufteTitleBlock`, `tufteStatements`, `wsiWrap`.

*Older dark*: background `#0f172a`, text `#e2e8f0` / `#94a3b8`, accents `#3b82f6 #22c55e #ef4444 #8b5cf6 #f59e0b`.

Shared tooltip helpers: `_createTooltip(container)`, `_showTooltip(tip, html, x, y)`, `_hideTooltip(tip)`. Position with `d3.pointer(event, container)`.

### Visualizations that are not SVG

- `consent-form-iframe` — a real `<iframe>`; `src` (default `assets/yale-consent-form.html`), `height`, `promptHover`. Generic despite the name: use it to embed any page.
- `tat-2006-2026` — a plain-DOM KPI grid plus a full-window modal (appended to `documentElement` to escape Reveal's transform) that lazily loads `/assets/dashboards/tat_2006_vs_2026.html` on first open. Opens with the `D` key, closes on ESC or slide change.
- `xenonym-browser` — a simulated browser frame drawn in SVG, not an iframe.

---

## 5. Badges

`badge` sets `data-badge`; a single fixed overlay chip outside `.slides` picks it up on slide change. Eleven values are styled in `css/intro.css` and coloured in the dock: `workflow`, `automation`, `data`, `ecosystem`, `ai`, `interactive`, `debate`, `evidence`, `framework`, `technical`, `meta`. Anything else renders as text on the default chip with a grey dock dot — and free-text badges with spaces produce an invalid CSS class, so prefer the eleven.

`poll`, `micro-case`, `timer`, `workshop` and `snippets` force `interactive`.

---

## 6. Takeaways

`takeaway` accepts a string or `{ text, comment }`. It renders as a bar pinned to the slide bottom, prefixed **Takeaway:**. When `comment` is present the bar gains an ⓘ and a hover-only popover — this is the de-facto presenter channel, and the audience can see it on hover too.

---

## 7. Polls

`Widgets.createPoll` opens one shared Socket.io connection. The QR code is generated client-side and points at `<origin>/vote/<lectureId>/<slideId>`.

Protocol: the client emits `join-poll`, `vote` (`{lectureId, slideId, optionIndex, voterId}` — re-voting decrements the previous choice), `reset-poll`, `reset-all`; the server broadcasts `poll-results` and `poll-reset` to the room `` `${lectureId}/${slideId}` ``.

**All poll state is in memory. Restarting the server wipes every poll.**

`GET /api/poll/:lectureId/:slideId/config` reads the lecture JSON off disk and 404s unless that slide's `type` is `poll`.

---

## 8. Tests

```bash
npm test              # Playwright, chromium-1280
npm run test:all      # every viewport (1280 / 1440 / 1920)
npm run test:viz      # static analysis, every lecture
npm run test:links    # link validation, every lecture
npm run test:contrast # measured WCAG contrast, every lecture (needs a server)
npm run shots         # screenshot a deck slide by slide
```

**`tests/viz-static-analysis.js`** parses `viz-library.js` as text — no browser. It checks JSON integrity (unique ids, known types, every `vizType` registered, every registry entry backed by a real function), font legibility, WCAG contrast, viewBox and aspect ratio, and animation discipline. Takes a lecture name (`node tests/viz-static-analysis.js ai_operating_system`), defaults to `oneit`, and `--all` runs every lecture and fails if any does.

**`tests/validate-links.js`** follows redirects and checks for expected content markers. `--all-lectures` harvests every URL out of every lecture JSON rather than relying on the hand-maintained list at the top of the file. Publisher 403s are common and are reported as failures — read the output, don't just check the exit code.

**`tests/contrast-audit.js`** measures contrast instead of inferring it. For every rendered SVG `<text>` it takes the glyph-box centre, asks the browser for the full paint stack there, composites those layers honouring `fill-opacity` and `opacity`, and computes the true ratio against the colour actually behind the glyph. Use it whenever the static rule and your eyes disagree — it is the tie-breaker, and the `LOCAL_BACKGROUNDS` entries above were confirmed with it.

Two things it taught the codebase, worth remembering when writing a visualization:

- **A translucent wash is not the colour you wrote.** A shape at `fill-opacity: 0.15` over a dark slide renders far lighter than its hex suggests; text in the same hue on top of it is fine, and reading the hex alone says otherwise.
- **Opacity is a poor way to de-emphasize text.** Fading a label to 25% to show it "dissolving" leaves it at 1.6:1. Carry that meaning with font-weight, size or position and keep the colour solid — the effect survives and the text stays readable.

**`tests/screenshot-ai-os.js`** drives a deck through Playwright, captures each slide at 1440×900, and reports console errors plus any element spilling outside the slide bounds. `LECTURE=<name> PORT=<port> node tests/screenshot-ai-os.js` works for any deck. This is the fastest way to catch label collisions in a new visualization.

**`tests/oneit-presentation.spec.js`** is the Playwright suite. It is specific to the `oneit` deck: a hand-maintained slide inventory plus per-visualization assertions. A new lecture is not covered by it.

---

## 9. Stylesheets

`css/intro.css` (~1,900 lines) is the real stylesheet for JSON-driven lectures. Palette at the top: `--ip #0e6e8c`, `--is #2980b9`, `--ia #1d8348`, `--ih #d4a017`, `--id #c0392b`, `--im #7f8c8d`, `--ibg #f7f8fa`.

`css/theme.css` and `css/backgrounds.css` belong to the legacy `index.html` deck. `lecture.html` loads them too, which has caused trouble: `backgrounds.css` styles slides by **position** (`section:nth-of-type(3)`, `(4)`, `(6)`…`(13)`), which in a JSON deck lands on whatever slide happens to be third. Those rules are now scoped with `:not(.intro-slide)`. If you add positional rules to that file, scope them the same way.

Watch specificity when styling anything inside a slide: `.reveal .intro-slide p` beats a bare class selector, which is how infographic card descriptions ended up rendering at title size in near-invisible slate.

---

## 10. Adding a lecture

1. Write `data/lectures/<name>.json`. It is reachable at `/lecture/<name>` immediately — no server change.
2. Give every slide a unique non-empty `id` and a known `type`; add `dockTitle` to any full-bleed visualization.
3. Prefer the eleven styled badge values.
4. Use `takeaway: { text, comment }` as the presenter channel; `speakerNotes` for the `S` view.
5. For new visuals, follow §4 and register the function.
6. Add a `<a class="lecture-card" href="/lecture/<name>">` block to `home.html` and a row to the root `README.md`.
7. Run `npm run test:viz`, `npm run test:links`, and `npm run shots` before showing it to anyone.
