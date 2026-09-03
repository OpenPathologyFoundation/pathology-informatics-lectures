# Visualization Specifications

**Lecture:** *AI Is Not Updating Pathology — It Is Rewriting the Operating System of Pathology*
**Engine facts these specs rely on** (from `research/00_repo_audit.md`): `VizLibrary.render(name, container, config)`; canvas 1200×700 with CSS transform scaling (use px/em, never vw/vh); SVG `viewBox` + `preserveAspectRatio="xMidYMid meet"` required; fonts ≥ 8 px (labels ≥ 10 px); WCAG-AA fills; staggered `.delay(600 + i*180)`; the lazy renderer dedups **by vizType**, so every slide needs a distinct vizType; `speakerNotes` is currently not rendered (T0.1 fixes this).

**House style: the cream Tufte palette** used by every 2025–26 viz in the repo:
`bg #faf7f1 · ink #1f1a14 · muted #6b5c48 · rule #a89c85 / #bcb1a0 · copper #a36015 · crimson #7a1f1a · slate #3d5b73`, serif `Georgia, "Iowan Old Style", "Hoefler Text"` for display, `"Inter", system-ui` for labels. Add one new semantic colour for this deck: **iron `#4a4a48`** (the railroad) and **canal blue `#3d5b73`** (reuse slate).

**Data contract.** Every viz that shows a number loads `/assets/data/ai-os/verified-numbers.json` (fetch once, cache on `window.__aiOsData`) and renders from it. A viz must render a visible "data unavailable" state if the fetch fails, never a hard-coded fallback number. Values with `verified: "TODO"` must not render until T1.3 flips them to YES (render a dashed placeholder with the text "verify" if they are still TODO).

**Config contract.** New vizzes read `config` (unlike 77/86 existing ones). Minimum: `{ "hideHeader": bool, "step": int|null, "variant": string }`. Anything content-bearing (labels, lists) is passed through `vizConfig` so the JSON, not the JS, owns the words.

**Reveal.** Step reveal is D3-timed (the repo convention), but each viz should also accept `config.step` so a slide can be duplicated with a different `step` to "build" across two slides without a second animation.

---

## Reused as-is (no new code)

| Slide | vizType | Notes |
|---|---|---|
| IBIS architecture | `ibis-flow` (`{"hideHeader": true}`) | Then switch to the live IBIS demo; recorded fallback in `assets/demos/ibis-fallback.mp4` (T4.1) |
| Xenonym | `xenonym-browser` | Simulated browser; "↗ Open Live" |
| TAT 2006 vs 2026 | `tat-2006-2026` | KPI grid + `D`-key modal to `/assets/dashboards/tat_2006_vs_2026.html` |
| How this lecture is built | `presentation-architecture` | CONTENT LAYER → Slide Engine → RENDER LAYER |
| Tufte timeline (optional slide) | `tufte-timeline` | 2003→2026 PowerPoint dominance / switching cost |

---

## V1 · `eagle-routing-pipeline` — "Route, don't brute-force"

**Argument.** EAGLE's contribution is orchestration: a cheap model routes an expensive one to 25 regions out of ~18,000 tiles. The 2.27 s is *inference only*.

**Data.** `eagle.pipeline[]`, `eagle.seconds_per_slide_total`, `eagle.tiles_reprocessed_fraction`, `eagle.hardware`, `eagle.access_requirements[]`.

**Encoding.** Left-to-right stations on a rail (reuse the `animated-pipeline` idiom, cream palette). Station width ∝ seconds (log scale so 0.36 ms is still a visible sliver, annotated "0.36 ms"). Above the rail: a tile field (a 150×120 grid of 1-px squares = "~18,000 tiles") that collapses to 25 highlighted squares between stations 2 and 3 — the visual core of the slide. Below the rail: a thin second track labelled **"What 2.27 s does not include"**: scanning, tiling, CTransPath feature cache at 2 MPP, weight downloads (Virchow2 gated, CHIEF by request), Docker, storage I/O. This second track is greyed and unmeasured (no numbers — we do not have them).

**Steps.** `step 0` tile field; `step 1` CHIEF ranking (squares dim, 25 brighten); `step 2` Virchow2 on 25 (station glows, "0.26 s"); `step 3` averaged 1280-d vector (25 squares merge into one bar); `step 4` the "not included" track fades in.

**Interaction.** Hover a station → tooltip with exact quote from the paper (from `verified-numbers.json`) and the source id.

**Accept.** Static-analysis passes; hover tooltips cite `EAGLE-NatCommun`; the 25-tile number, 2.01/0.00036/0.26 s and "L40 (48 GB), inference only" appear verbatim; no invented numbers on the lower track.

---

## V2 · `auroc-vs-compute` — "The two-thousandths"

**Argument.** 0.742 vs 0.740 is not the story; 2.27 s vs 191.85 s vs 16 min is.

**Data.** `eagle.auroc_mean_31_tasks[]` (x = `seconds_per_slide`, y = `auroc`), `eagle.ensemble_of_folds`.

**Encoding.** Scatter, x log-scale seconds/slide (0.1 → 1,000), y AUROC **with the axis drawn 0.5 → 1.0 and a second inset drawn 0.70 → 0.76** ("the axis the abstract lives on"). Points: EAGLE (copper), TITAN (ink), CONCH v1.5 (slate), Prov-GigaPath (slate, x only until its AUROC is verified — render as a dashed vertical tick at x=960 s labelled "16 min/WSI; AUROC: verify"). A copper bracket between EAGLE and TITAN on the y-axis labelled "Δ = 0.002". A horizontal bracket on x between EAGLE and CONCH labelled "84×", and to Prov-GigaPath "423×".

**Steps.** `0` full-axis view (points nearly collinear horizontally); `1` inset zoom animates in; `2` compute brackets.

**Guardrail.** Caption must say "mean AUROC across 31 external tasks; seconds are model inference on an L40, not end-to-end". Never label the Δ as "improvement".

**Accept.** Inset and full axis both present; caption text present; Prov-GigaPath renders as "verify" until T1.3 supplies its AUROC.

---

## V3 · `benchmark-saturation` — "Thirty-two models later"

**Argument.** The leading pathology encoders are statistically indistinguishable; model identity is ceasing to be the main question.

**Data.** `pathbench_stanford.top5_tcga[]` (auroc, ci), `top5_non_tcga[]`, `significance`, `scaling_bins`, `model_facts_for_hover[]`, `ensemble`.

**Encoding.** Dot-and-whisker chart: five models on y (ordered), AUROC on x with **x-domain 0.70 → 0.95** so overlapping CIs are obvious; a translucent copper band spanning the union of the five CIs labelled "Wald tests: no significant difference". Below, a compact strip of 32 small ticks (grey) = all models, with the five highlighted — conveys "32 evaluated, 5 shown". Right-hand panel "What would change the ranking" — the ten factors from the brief (training-data composition, domain similarity, task definition, preprocessing, aggregation, evaluation design, external validation, calibration, workflow integration, compute/operational constraints) as plain serif text (no icons).

**Variants** (`config.variant`): `"tcga"` (default), `"non-tcga"` (CIs TODO → whiskers dashed until verified), `"scaling"` (x = params bin S/B/L, y = AUROC — shows the "does not uniformly improve" finding as three overlapping distributions; render only if T1.3 has supplied per-model params), `"ensemble"` (fusion 0.702 ± 0.111 vs Virchow2 0.696 ± 0.105 balanced accuracy — two overlapping bars, "not significant at task level").

**Interaction.** Hover a model → card: category, params (M), pretraining WSIs, HF gated? (from `model_facts_for_hover`, else "verify").

**Accept.** CIs drawn from data; band label present; x-domain not 0–1 (which would hide the point) and not so narrow it exaggerates (≥ 0.20 wide); a caption states "frozen features + linear probe; mean pooling".

---

## V4 · `boundary-collapse` — the thesis diagram

**Argument.** Eight formerly separate activities (ask → find → code → analyze → visualize → publish → review → teach) collapse into one loop with an agentic system in the middle.

**Data.** `vizConfig.activities[]` (eight labels + one-line descriptions, from JSON), `vizConfig.year_before` ("2016"), `vizConfig.year_after` ("2026").

**Encoding.** Left ("before"): eight boxes in a row, each with its own person icon (a small circle-and-shoulders glyph, no emoji), separated by thick vertical rules labelled with the handoff cost (weeks / a grant / a collaborator / a journal / a reviewer / a course). Right ("after"): the same eight labels arranged on a ring; in the centre a hub labelled "tool-using, code-writing, retrieving, remembering system"; spokes from the hub to each label; a human figure **outside** the ring holding two labels only: *Question* and *Judgment* (this is the guardrail — the human is not removed, they move to the two scarce inputs).

**Steps.** `0` before only; `1` rules dissolve (animated, ruled lines shrink to dots); `2` ring forms; `3` human figure steps outside with the two labels.

**Interaction.** Hover an activity on the ring → which 2025–26 artifact demonstrates it in pathology (NOVA writes code; PathAgent navigates; Pathology-CoT records; Claude for Life Sciences retrieves; AAAI-26 reviews; this lecture teaches) with source ids.

**Accept.** No activity is deleted in the "after" state; the two human labels are present; every hover card carries a source id from REFERENCES.md.

---

## V5 · `pathology-agents-timeline` — "2025–26: the year the pathology agent became a genre"

**Argument.** Capability moves on a days-to-weeks clock, visible in preprints, repos and vendor releases — not in the two anchor papers.

**Data.** `agents_timeline.events[]` (date, name, who, kind, url, verified).

**Encoding.** Tufte timeline idiom (reuse the `tufte-timeline` structure: linear time axis Jun 2024 → Sep 2026, events as ticks with hover tips and click-through URLs). Three swim-lanes by `kind`: **systems** (copilot, multi-agent, code-executing), **infrastructure** (MCP, Agent Skills, context engineering, connectors), **evidence/anchor** (Articulate Pro, EAGLE, PathBench, expert review). Anchor papers rendered as two large copper diamonds; note that both fall *after* almost every capability event on the top lane — the visual point.

**Interaction.** Hover → name, who, one-line "what it actually does", verification badge; click → opens URL in new tab. Tips for `PARTIAL` items show a small "press/secondary" tag.

**Accept.** All events read from JSON; every event has a URL that passes `validate-links.js`; the "adoption has lagged" review is rendered in the evidence lane in crimson as the counterweight; no event lacks a date.

---

## V6 · `three-clocks` — capability · engineering · clinical evidence

**Argument.** Three clocks run at different speeds; the literature serves the slow one but is read as if it were the fast one.

**Data.** `vizConfig.clocks[]`: `{ name, period, question, sources[] }` from JSON (capability: days–weeks, "What can be done today?", sources demos/videos/release notes/model cards/repos/community; engineering: weeks–months, "Can it be made reliable, reproducible, economical, safe?", sources integrations/APIs/connectors/standards/eval suites/issue trackers/shadow deployments; clinical evidence: months–years, "Does it improve clinical work or patient care under a defined intended use?", sources prospective trials/implementation studies/regulatory records/lab and patient outcomes).

**Encoding.** Three clock faces of equal size in a row, cream faces, ink ticks, one hand each. Hands sweep continuously at rates 1 : 1/8 : 1/60 (one full sweep ≈ 6 s, 48 s, 6 min) so during a two-minute stay on the slide the audience literally sees clock 1 lap clock 3 many times. Under each clock: its question in serif and its sources in small caps. A thin copper pointer labelled **"the literature"** sits on clock 3; a dotted arrow shows where it is usually *read* — clock 1.

**Interaction.** Click a clock → the other two dim, sources expand, and a 2026 example appears from `vizConfig.examples` (capability: NOVA / PathAgent; engineering: DICOM Connectathon 32 implementers, IHE DPIA still Trial Implementation, EAGLE README access gates; evidence: Articulate Pro 1,613 cases, 5.4% changed).

**Accept.** Hand rates configurable; `prefers-reduced-motion` stops the sweep; examples cite source ids; clock 3 pointer text present.

---

## V7 · `evidence-ladder` — see it · reproduce it · deploy it · improve outcomes

**Argument.** Four distinct claims, four distinct kinds of evidence; conflating them is the field's habit.

**Data.** `vizConfig.rungs[]` with anchors: **see** — EAGLE 2.27 s / 0.742 (EAGLE-NatCommun); **reproduce** — README: MacBook Air M3 ≈3 min for 7 slides, three access gates (EAGLE-GitHub); Built-to-last: few CPath algorithms reused (E-8); **deploy** — Articulate Pro 1,613 cases, 5.4% Dx/GG changed, 1.3% management, TAT −30.1 h, IHC ORs 0.33–0.50 (E-1); Campanella silent trial AUC 0.890 (E-2); **outcomes** — *no pathology AI patient-outcome trial located* (empty rung, drawn as a dashed outline).

**Encoding.** Four ascending rungs (left low, right high) on a cream ground; each rung is a card with the claim in serif, the evidence anchor in small sans, and the source id. The gap between rungs is annotated with the verb that gets you across: *install* (weights, licences, features), *integrate* (LIS, viewer, HL7), *measure* (prospective, defined intended use). The fourth rung stays dashed and empty with the caption "we did not find one — tell me if you have".

**Accept.** Empty fourth rung rendered exactly as specified (no invented outcome study); all numbers from JSON.

---

## V8 · `fda-ai-devices` — "1,524 AI devices; 9 in the pathology panel"

**Argument.** Regulatory decisions are a slow-clock artifact; pathology AI is regulated as an IVD component, and the count shows it.

**Data.** `fda_ai_devices.by_panel[]`, `by_year[]`, `pathology_entries[]`, `innolitics_2026`, `disclaimer`.

**Encoding.** Left: horizontal bars by lead panel (Radiology 1,164 dominates; Pathology 9 drawn in copper, the rest grey). Right: a small-multiples column: year bars 2019–2026 (2026 partial, hatched, "through 30 Mar"), and beneath it the nine pathology entries as a dotted list on a time axis 1995 → 2025, with the four modern WSI-AI authorizations (Paige 2021, Hologic 2024, Ibex Jan 2025, Artera Jul 2025) in copper and the rest grey. Footer: the FDA disclaimer verbatim, plus "Innolitics (Apr 2026): 51 AI/ML-flagged devices in pathology-relevant panels, 7 analyze WSIs; reviewed as IVD (OHT7), not SaMD."

**Accept.** Counts identical to JSON; disclaimer present; date stamp "list dated 16 Jun 2026, parsed 2 Sep 2026".

---

## V9 · `paper-volume` — "The mirror"

**Argument.** Volume was already rising; LLMs collapse the cost of academically legible output; policy exists but does not change usage.

**Data.** `pubmed_counts.query1[]`, `pubmed_counts.query_fm[]`, `llm_in_writing.*`, `peer_review_2026.*`.

**Encoding.** Main panel: PubMed counts 2018 → 2026 as a bar series (2026 hatched, "to 2 Sep"), a second, smaller series for "foundation model" papers (0 → 122). Right margin annotations (not a second axis): "Kobak 2025: ≥13.5% of 2024 abstracts LLM-processed (lower bound)" and "Holzwarth/Kobak 2026: 89% of 2025 papers show excess LLM vocabulary (full text)" — drawn as two labelled marks with a footnote that the two measures differ. Footer strip: "70% of 5,114 journals have an AI policy — no measurable effect on usage (He & Bu 2025)".

**Variant** `"review"`: replaces the main panel with the peer-review numbers as a four-card row (ICLR 2026: 21% of reviews fully AI; NeurIPS 2026 position track: 70.5% of papers ≥50% AI score, 18.4% desk-rejected; ICML 2026: 497 papers desk-rejected; AAAI-26: an AI review for all 22,977 papers in < 1 day).

**Guardrail.** Title must not say "papers are useless" or "written by AI". Use the brief's formulation: "academically legible but low-marginal-value production."

**Accept.** Query strings shown on hover of the axis title (reproducibility); measures for 13.5% and 89% are labelled as different measures; every number from JSON.

---

## V10 · `scarcity-shift` — what got cheap, what stays scarce

**Argument.** The scarce resources are no longer prose, code, or plots.

**Data.** `vizConfig.cheap[]` (coding, data manipulation, statistical analysis, literature retrieval, figure production, manuscript drafting, language correction, peer-review assistance, reformatting/resubmission) and `vizConfig.scarce[]` (important questions, high-quality data, experimental judgment, reliable evaluation, clinical integration, accountability, trusted attention, distinguishing significance from volume).

**Encoding.** Two columns of typeset "price tags" (serif label, small sans caption). Left column tags animate downward and shrink in weight (font-weight 600 → 300, opacity 1 → 0.55) on `step 1`; right column tags stay fixed and gain a copper underline on `step 2`. No numeric axis — this is a qualitative claim and must look like one (no fake bars).

**Accept.** No numbers rendered; both lists come from JSON; motion respects reduced-motion.

---

## V11 · `artifact-functions` — what each artifact actually establishes

**Argument.** Papers, videos, repos, model cards, issue trackers, benchmarks, regulatory records, implementations and outcome studies each answer a different epistemic question; academic culture asked the paper to answer all of them.

**Data.** `vizConfig.artifacts[]` × `vizConfig.functions[]` with a cell matrix (`"primary"`, `"partial"`, `""`). Rows (9): paper · video · repository · model card · issue tracker · interactive benchmark · regulatory record · prospective implementation · clinical-outcomes study. Columns (9): records a claim & formal evidence · demonstrates a capability / tacit knowledge · shows the method runs · documents intended use & limits · reveals real failure modes · allows continued comparison · defines an approved intended use · tests whether it improves actual work · tests whether it benefits patients. The diagonal is `primary`; a few `partial` off-diagonals (paper→shows it runs = partial; repo→reveals failures = partial via issues; benchmark→records claim = partial).

**Encoding.** Dot matrix, cream ground, ink dots (primary = filled 7 px, partial = 4 px ring). On `step 1`, the **paper** row is highlighted and the whole row fills with faint copper rings labelled "what we have been asking the paper to do"; on `step 2` the diagonal is restored and the line "Views measure attention; peer review measures passage through a validation process; neither directly measures clinical usefulness" types in below.

**Interaction.** Hover a row → the artifact's 2026 example (paper: EAGLE; video: a NOVA/PathChat demo; repo: KatherLab/EAGLE; model card: paige-ai/Virchow2 gated; issue tracker: gevaertlab/benchmarking-path-models issues; benchmark: pathbench.stanford.edu; regulatory: Paige Prostate DEN200080; implementation: Articulate Pro; outcomes: none found).

**Accept.** Matrix from JSON; hover examples carry source ids; the quoted line present verbatim.

---

## V12 · `memex-to-model` — from trails to tool-using systems

**Argument.** Bush imagined a machine that stores, extends, consults and links; modern AI adds constructing trails, translating media, writing/executing code, interrogating data, proposing connections, regenerating explanations, and preserving the process.

**Data.** `memex_to_model.events[]`, `memex_to_model.bush_quotes[]`, `vizConfig.additions[]` (the seven "what AI adds" items).

**Encoding.** A single associative *trail*: a hand-drawn-looking polyline (D3 curveCatmullRom) crossing the canvas left→right, 1945 → 2025, with event nodes as small cream circles and serif labels alternating above/below. The line is copper for Bush → Nelson (ideas), slate for Knuth → marimo (executable documents), iron for MCP → Skills (tool-using systems). Three Bush quotes float as marginalia in the top-left. On the right, a vertical list of the seven additions, each fading in on `step 1`.

**Interaction.** Hover an event → tip with date and a ≤15-word quote; click → source URL.

**Accept.** Bush quotes verbatim from JSON; "WWW 1991" stays dashed until T1.3 verifies a primary page; line colour legend present.

---

## V13 · `canal-and-railroad` — the closing metaphor

**Argument.** The Farmington Canal (1828) was necessary, expensive, and obsolete within twenty years; the railroad reused its right-of-way (1848); the trail reused the railroad (1996). Infrastructure persists; the transportation logic changes. LIS/EHR are the canal; agentic, tool-using systems are the railroad. "My goal is not to inventory everything travelling on the canal. My goal is to show you that the railroad has arrived."

**Data.** `farmington_canal.events[]`, `farmington_canal.*` scalars, `pathology_infrastructure_timeline.events[]`.

**Encoding.** Two stacked timelines sharing a horizontal layout. **Top (1820 → 2000):** a stylised north–south route drawn as a horizontal band (New Haven at left, Northampton at right — a map-like ribbon, not a real map). Phase 1 the band is canal blue with lock ticks (60 locks); phase 2 (from 1847) an iron rail overlays the *same* band; phase 3 (1996) a green trail overlays it again. Event markers with serif labels: 1825 shovel broke · 1828 first boat · 1835 Northampton · 1836 >$1 M lost · 1846 railroad authorized · 18 Jan 1848 canal closed / rail opened · 1996 trail. Small marginalia: "toll revenue covered ~20% of expenses; profitable once in ten years" and the Yale line (Hillhouse president; Sheffield financed the railroad and endowed the Sheffield Scientific School). **Bottom (1980 → 2026):** the pathology band — LIS/HL7/DICOM (canal blue) → WSI FDA 2017, Paige 2021 (still canal) → foundation models 2024 → MCP 2024 → agents 2025–26 (iron rail overlay begins). The rail on the bottom band is drawn only to "today" and ends with an arrowhead: the railroad has arrived, it is not finished.

**Steps.** `0` canal only (top), LIS only (bottom); `1` railroad overlay top; `2` trail overlay top; `3` rail overlay bottom; `4` closing line types in.

**Guardrail.** Do not draw the LIS band as ending — the canal *did* close, but the lecture's claim is that infrastructure persists. Caption: "The canal did not become unnecessary the day the railroad opened; the right-of-way outlived both."

**Accept.** Dates from JSON; TODO-dated pathology events render dashed until verified; the closing sentence present verbatim.

---

## V14 · `lecture-provenance` — how this lecture was made (the meta slide)

**Argument.** A lecture about collapsing the boundaries between question, data, code, evidence, publication and teaching should itself be produced that way — and show its own trail.

**Data.** `vizConfig.pipeline[]` populated by the coding agent at build time from the repo: brief (this `PLAN.md`) → research agents (3, with counts of references verified YES/PARTIAL/TODO from REFERENCES.md) → `verified-numbers.json` → viz specs → coding agent tasks (count from TASKS.md) → tests passed (static analysis, link validation, Playwright) → git commit hash → deployed URL. Also the audience-question loop: "ask → agent edits JSON/viz → tests → redeploy".

**Encoding.** The `presentation-architecture` idiom extended: a left-to-right pipeline of six cream cards joined by copper arrows, each card showing a live count (references: e.g. "61 YES · 19 PARTIAL · 6 TODO"), and a loop arrow from the last card back to the first labelled "audience question". The commit hash and build date are read from `/assets/data/ai-os/build-info.json` written by an npm script (T3.6).

**Accept.** Counts are computed at build time, not typed; the commit hash matches `git rev-parse --short HEAD` at build.

---

## V15 · `learning-objectives-config` — refactor (engine improvement)

The existing `learning-objectives` viz is hard-coded to another lecture's five objectives. Add a config-driven twin registered as `learning-objectives-config` that reads `vizConfig.objectives[] = { verb, text }` and reuses the five-stage wave layout. Objectives for this lecture (from PLAN.md §Objectives) are passed through JSON.

---

## Cross-cutting acceptance tests (apply to every V1–V14)

1. `node tests/viz-static-analysis.js` passes for `ai_operating_system.json` (after T0.2 makes the analyzer glob all lectures).
2. Every SVG has `viewBox` and `preserveAspectRatio="xMidYMid meet"`, > 10 elements, min font 8 px, WCAG-AA against `#faf7f1`.
3. Numbers on screen == numbers in `verified-numbers.json` (T5.3 runs a DOM-text vs JSON diff).
4. No emoji in SVG text (the glossary scanner ignores SVG; emoji render inconsistently).
5. `prefers-reduced-motion` disables continuous animation (V6 hands, V10 motion).
6. Every hover card with a claim shows a source id present in REFERENCES.md.
7. Distinct vizType per slide (the lazy renderer dedups by vizType).
