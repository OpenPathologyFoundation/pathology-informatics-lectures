# AI Is Rewriting the Operating System of Pathology — lecture workspace

Planning package for a new JSON-driven lecture on the existing engine. Produced 2026-09-02 from the development brief, a full audit of the repo, and three verification passes over the literature, vendor/standards/regulatory sources, and historical references.

| File | What it is | Who reads it |
|---|---|---|
| `PLAN.md` | Thesis, objectives, 34-slide narrative with types/vizTypes/badges, demos and fallbacks, guardrails, glossary, timing | Presenter, coding agent |
| `TASKS.md` | Phased, agent-executable task list with acceptance criteria (engine fixes → data → 15 vizzes → JSON → demos → verification → release) | Coding agent |
| `VIZ_SPECS.md` | One spec per visualization: argument, data fields, encoding, steps, interaction, acceptance | Coding agent |
| `REFERENCES.md` | Verified reference registry with status (YES / PARTIAL / TODO / DO NOT CITE) and corrections to the brief | Everyone |
| `../../pathology-node-presentation/assets/data/ai-os/verified-numbers.json` | Every number the deck may render, each with a `source` id and verification status | Vizzes at runtime; tests |
| `research/00_repo_audit.md` | Engine audit: slide types, all 86 vizTypes, tests, CSS, borrowable lines from the other eight lectures | Coding agent |
| `research/01_anchor_papers.md` | EAGLE and PathBench verification with verbatim quotes and section locations | Presenter |
| `research/02_landscape_2026.md` | Agents, agentic-coding evidence, standards, regulatory, clinical evidence, benchmarks, publishing — ~60 items | Presenter |
| `research/03_history_and_epistemics.md` | Bush, Tufte, Farmington Canal, Lincoln & Korpman, model cards, Friedman, Brooks, Knuth → marimo, context engineering | Presenter |

Kickoff for the coding agent: see the last section of `TASKS.md`.

---

## Build notes — what actually shipped

The deck is live at `/lecture/ai_operating_system` (`data/lectures/ai_operating_system.json`, 37 slides). Sixteen new visualizations were added to `js/viz-library.js`. Where the build departs from `PLAN.md` / `VIZ_SPECS.md`, it did so deliberately:

| Spec said | What shipped | Why |
|---|---|---|
| Vizzes `fetch('/assets/data/ai-os/verified-numbers.json')` at render time | Numbers arrive through `vizConfig` in the deck JSON, transcribed from that file | The engine renders synchronously on `slidechanged`; an async fetch races the Playwright and static-analysis passes. The deck JSON is still a single place per value, and `verified-numbers.json` remains the provenance record. |
| V3 `benchmark-scaling` draws per-model scatter by parameter bin | Draws the ensemble-vs-single comparison, the verbatim scaling sentence, and the bin definitions — no scatter | Per-model parameter counts are `TODO` in the registry. A cloud of plausible points is the exact failure the slide argues against; the slide says so on its face. |
| V2 plots Prov-GigaPath | Rendered as a dashed compute-only tick labelled "mean AUROC could not be verified for this review, so it is not plotted" | Its AUROC on EAGLE's 31-task benchmark is still `TODO`. |
| V13 top band = the canal | Top band = the **right-of-way**, with canal / railroad / trail drawn as segments on it | Stronger and more accurate: the corridor is what persists, which is the argument. |
| V14 reads `build-info.json` written by `npm run build-info` | Counts passed through `vizConfig` | T3.6 was not built; the counts are real (37 slides, 16 vizzes, 76 YES / 2 TODO references). |
| Title option 1 ("AI Is Not Updating Pathology — It Is Rewriting…") | Shipped as **"AI Is Rewriting the Operating System of Pathology"** | The negative first clause reads as a swipe at the anchor papers; the positive form states the thesis directly. |
| Guardrails checklist (T5.4) | Enforced in the copy itself | Δ is never called an improvement; "no calibration" is attributed to this review rather than to the authors; the fourth evidence rung stays empty; the mirror slide never infers authorship from style. |

Engine and test changes made along the way (they affect every lecture):

- **`css/backgrounds.css` was leaking into every JSON deck.** Its `section:nth-of-type(N)` rules belong to the legacy `index.html` presentation, where slide N really is the HIPAA slide, the CLIA slide and so on. `lecture.html` loads the same file, so slides 3–13 of *every* JSON lecture were being painted with arbitrary grey, blue, green, red and purple washes — which is why dark infographics were rendering on a light ground. Each positional rule is now scoped with `:not(.intro-slide)`.

- `slide-engine.js` now emits `slide.speakerNotes` into `<aside class="notes">`, so Reveal's `S` speaker view works for the first time across all nine decks.
- `dock-nav.js` `BADGE_COLORS` covers all eleven styled badge values instead of six.
- `intro.css`: `.reveal .intro-slide p` was out-specifying `.infographic-card-desc`, rendering every infographic description at 22 px in near-invisible slate on the dark card; fixed at matching specificity. Four-card grids no longer orphan the fourth card onto its own row.
- `tests/viz-static-analysis.js`: takes a lecture name, supports `--all`, sees single-argument viz functions and `registry['x'] = fn` assignments, exempts DOM-only visualizations from the viewBox rule, and credits helper-based staggering.
- `tests/validate-links.js --all-lectures` harvests every URL from every lecture JSON instead of relying on a hand-maintained list.
- `tests/screenshot-ai-os.js` walks a deck slide by slide, captures a PNG, and reports anything spilling outside the 1200×700 canvas.

Known, pre-existing, not fixed here: `github.com/OpenPathologyFoundation/xenonym` returns 404 and is referenced by four other decks (removed from this one); `--all` static analysis surfaces contrast and font-size failures in older visualizations used by `build_as_you_speak`, `custom_software_dev`, `dom-grand-rounds`, `intro_pathology_informatics` and `pathology_informatics_ai`.

Things the brief got wrong or that could not be verified are listed at the end of `REFERENCES.md`; the four most important: (1) "no calibration" is the presenter's observation, not a PathBench-stated limitation; (2) the EAGLE 43-task extension is internal cross-validation, not external validation; (3) the Lincoln & Korpman sentence is unverified as a quotation; (4) "rich, detailed narrative" is not Tufte's phrase.
