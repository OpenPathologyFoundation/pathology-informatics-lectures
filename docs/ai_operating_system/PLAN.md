# Lecture Plan — *AI Is Not Updating Pathology — It Is Rewriting the Operating System of Pathology*

**Format:** JSON-driven interactive lecture on the existing engine (`pathology-node-presentation`), route `/lecture/ai_operating_system`.
**Audience / slot:** Pathology grand rounds, 45–50 min (33 slides + 1 optional, two live demos from existing Yale artifacts, one poll).
**Presenter:** Peter Gershkovich, MD, MHA — Yale University School of Medicine.
**Companion files:** `REFERENCES.md` (verified registry), `VIZ_SPECS.md` (14 new visualizations), `TASKS.md` (coding-agent work plan), `research/` (raw verification notes), `pathology-node-presentation/assets/data/ai-os/verified-numbers.json` (every number the deck renders).

---

## 1. Thesis and the sentence the room should leave with

The most important pathology-AI development of 2026 may not be a model that reads slides. It may be the collapse of the old boundaries between asking a question, finding data, writing code, analyzing evidence, publishing an answer, and teaching someone else how to reproduce it.

Closing challenge: *If AI makes it almost effortless to produce papers, code, analyses, and presentations, then our responsibility is no longer merely to produce more. It is to decide what is worth producing, how it should be tested, and whether it changes anything that matters.*

Title options (JSON `meta.title` uses the first):
1. **AI Is Not Updating Pathology — It Is Rewriting the Operating System of Pathology**
2. The Pathology AI Update That Papers Cannot Give You
3. From the Memex to the Model: AI and the New Operating System of Pathology
4. Beyond Slide Reading: What AI Is Actually Changing in Pathology

## 2. Learning objectives (rendered by `learning-objectives-config`, V15)

1. **Distinguish** seeing a capability from reproducing it, reproducing it from deploying it, and deploying it from improving outcomes — the four rungs of the evidence ladder.
2. **Read** a 2026 computational-pathology paper for its engineering lesson (routing, composition, reuse, inspectability) rather than its headline AUROC.
3. **Explain** why a 32-model benchmark whose leaders are statistically indistinguishable means model choice is ceasing to be the main question.
4. **Locate** the current frontier across the three clocks — capability (days–weeks), engineering (weeks–months), clinical evidence (months–years) — and the sources that serve each.
5. **Decide** what is worth producing: draft one question in your own practice whose answer would change a decision, and name the artifact (not necessarily a paper) that would establish it.

## 3. Design principles carried over from the existing lectures

- **The medium demonstrates the argument.** The deck is JSON rendered through a browser application; it is version-controlled, testable, and can be edited during Q&A. The `presentation-architecture` and new `lecture-provenance` (V14) slides say so explicitly (cf. oneit `what-this-is`: "The liberation from PowerPoint did not come from a better argument. It came from the switching cost collapsing.").
- **Tufte, applied not described.** Cream ground, serif display, high data density, no decorative elements, small multiples over hierarchy, every number sourced, every chart with its caveat printed on it. Full-bleed viz slides carry `dockTitle` instead of an H2.
- **Takeaway + comment as the presenter channel.** Every content slide has `takeaway.text` (on screen) and `takeaway.comment` (hover, for the speaker). `speakerNotes` is written for every slide as source-of-truth prose and is rendered into Reveal's speaker view once T0.1 lands.
- **One idea per slide, one verified number per claim.** No slide reads a value that is not in `verified-numbers.json`.
- **Clinical humility, intellectual provocation.** See §7 guardrails.
- **Badges** use the eleven styled values (`evidence`, `framework`, `ai`, `technical`, `meta`, `debate`, `interactive`, `workflow`, `automation`, `data`, `ecosystem`) so dock dots are coloured.

## 4. Narrative arc and slide-by-slide plan

Times are cumulative targets for a 47-minute delivery. Badge column uses the engine's styled values. "Borrow" names existing slides/vizzes whose text or code is reused (see `research/00_repo_audit.md` §7 for the verbatim lines).

| # | t | id | type / vizType | badge | Purpose · key line · borrow |
|---|---|---|---|---|---|
| 1 | 0:00 | `title` | title | — | Title 1 above. Subtitle: "A 2026 update that the literature cannot give you — and why." |
| 2 | 0:30 | `coi` | content | — | Engine auto-fills COI from presenter profile. |
| 3 | 1:00 | `hook-the-update-you-asked-for` | infographic (dark) | evidence | Four cards: *What I was asked* ("a 2026 update on AI in pathology") · *What the papers show* ("32 models, mean AUROC 0.83, no significant difference") · *What is actually changing* ("the boundaries between asking, finding, coding, analyzing, publishing, teaching") · *What this talk does* ("shows you the railroad, not the boats"). Takeaway: "The two papers are not outdated. They are conceptually incomplete." |
| 4 | 2:30 | `objectives` | visualization `learning-objectives-config` | framework | §2 objectives via `vizConfig.objectives`. |
| 5 | 3:30 | `two-papers` | two-column | evidence | Left: EAGLE (Neidlinger … Kather, Nat Commun 17:5740, 1 Jul 2026). Right: benchmark (Bareja … Gevaert, Nat Commun 17:9012, 24 Jul 2026). Both accepted mid-2026, both excellent, both bounded. Takeaway: "Do not call them outdated; call them conceptually incomplete." |
| 6 | 5:00 | `eagle-pipeline` | visualization **V1** `eagle-routing-pipeline` | technical | ~18,000 tiles → CTransPath 2.01 s → CHIEF 0.36 ms ranks → 25 tiles → Virchow2 0.26 s → one 1280-d embedding. The lower track: what 2.27 s does not include. |
| 7 | 7:00 | `eagle-two-thousandths` | visualization **V2** `auroc-vs-compute` | evidence | 0.742 vs 0.740 on the axis the abstract lives on; 2.27 s vs 191.85 s vs 16 min. Takeaway (brief): "The interesting part of EAGLE is not the two-thousandths improvement over TITAN. It is the transition from brute-force computation to routing, composition, reuse, and inspectable execution." |
| 8 | 9:00 | `eagle-honest-reading` | comparison (good/bad) | debate | Left "What it shows": route cheap→expensive; concentrate compute; reusable embeddings; preserve the 25 regions; speed and reuse as design objectives. Right "What it does not show": L40 inference only (MacBook ≈3 min, three access gates); 25 regions can miss rare/dispersed findings; sparsity ≠ faithful causal explanation; 50 slides, one pathologist; retrospective; authors call for prospective trials; "emulates pathologists" is anthropomorphic — it emulates selective viewing. |
| 9 | 11:00 | `eagle-engineering-principles` | infographic (light) | ai | Five cards: Route · Compose · Reuse · Inspect · Budget. Takeaway: "This is selective computation and model orchestration — closer to AI engineering than to one model doing one task." |
| 10 | 12:30 | `pathbench-what` | infographic (dark) | evidence | 32 models · 4 categories · 41 tasks · 53 datasets · >17,500 WSIs · 19 TCGA + 22 non-TCGA. Frozen features, linear probe, mean pooling, 70/30 patient split, 1,000 bootstraps. |
| 11 | 14:00 | `benchmark-saturation` | visualization **V3** `benchmark-saturation` | evidence | Top five: 0.830 / 0.829 / 0.824 / 0.824 / 0.824 with overlapping CIs; "no statistical differences … based on Wald tests". Takeaway (brief): "Thirty-two models later, the result is not a winner. The result is that choosing a model is ceasing to be the main question." |
| 12 | 16:00 | `what-decides-performance` | visualization **V3** variant `scaling` (vizType `benchmark-scaling`) | framework | Scaling does not uniformly improve; ensemble 0.702 vs 0.696 not significant at task level; the ten things that now matter more than model identity. |
| 13 | 17:30 | `what-benchmarks-cannot-see` | two-column | debate | Left: stated limitations (linear probe, overlap, coarse proxies, mean pooling). Right: not evaluated by design — calibration, decision curves, prospective workflow, pathologist comparison, outcomes — plus de Jong 2025: in 10 FMs the medical center is predicted better than the tissue type. Takeaway: "The benchmark's code, dashboard, dependencies and reproducibility problems may tell us as much about the state of AI as its AUROC tables." |
| 14 | 19:00 | `boundary-collapse` | visualization **V4** `boundary-collapse` | ai | The thesis diagram. Human moves outside the ring holding *Question* and *Judgment*. |
| 15 | 21:00 | `what-modern-ai-is` | infographic (light) | technical | Agentic coding with plan–execute–test–review · tool use / API orchestration · retrieval (local, institutional, public) · connectors to lab/enterprise systems · context engineering & persistent memory · multimodal interaction incl. viewers · model routing / selective computation · reusable embeddings & semantic search · ensembles & modules · synthetic data, labels, captions, tests · continuous evals · drift & workflow monitoring · provenance, audit, permissions, human approval boundaries · open, executable educational artifacts. Borrow the safety boundary lines from `ai-must-not-do`. |
| 16 | 23:00 | `pathology-agents-2026` | visualization **V5** `pathology-agents-timeline` | ai | Jun 2024 PathChat → Feb 2025 PathFinder → Jun SlideSeek → Sep TissueLab → Oct Pathology-CoT (viewer logs) → Nov NOVA (49 tools, writes Python) → Nov PathAgent (ECCV 2026) → Mar 2026 expert review "adoption has lagged" → May PathNavigate/PathoSage. Infrastructure lane: MCP Nov 2024 → Linux Foundation Dec 2025; Claude for Life Sciences Oct 2025 with **no pathology connector**. Anchor papers land after almost every capability event. |
| 17 | 25:30 | `lis-vs-assembling-systems` | comparison (muted/highlight) | workflow | Borrow `wf-management`: "The system recorded it" vs route / surface exceptions / coordinate / enforce / adapt. New right column: "The emerging systems help construct the route while the work is underway." Epic/Beaker/LIS remain necessary; they move predefined records through predefined channels. |
| 18 | 27:00 | `three-clocks` | visualization **V6** `three-clocks` | framework | Capability / engineering / clinical-evidence clocks; the literature pointer on clock 3, read as clock 1. |
| 19 | 29:00 | `evidence-ladder` | visualization **V7** `evidence-ladder` | evidence | See → reproduce → deploy → outcomes with EAGLE, EAGLE README, Articulate Pro (1,613 cases; 5.4% changed; 1.3% management; TAT −30.1 h), and an empty fourth rung. |
| 20 | 30:30 | `regulatory-clock` | visualization **V8** `fda-ai-devices` | data | 1,524 AI devices; radiology 1,164; pathology panel 9; four modern WSI-AI authorizations; 2025 a record 333; pathology AI reviewed as an IVD, not SaMD. Standards footnote: DICOM Sup 145 is from 2010; 2025 Connectathon 32 implementers; IHE DPIA still Trial Implementation. |
| 21 | 32:00 | `poll-where-do-you-look` | poll | interactive | "Where do you get your sense of what AI can do in pathology today?" — journals · preprints · vendor demos · YouTube/social · colleagues · trying tools myself · conferences · I don't. Return to results at slide 27. |
| 22 | 33:30 | `ibis-cohort-discovery` | visualization `ibis-flow` (`hideHeader`) | evidence | **Live demo 1 — IBIS.** Two queries (structured, free-text). "Notice — no SQL was written." Fallback: recorded clip. Borrow the two-column text from `build_as_you_speak.json#ibis-intro` as `speakerNotes`. |
| 23 | 37:00 | `xenonym-live` | visualization `xenonym-browser` | interactive | 60 seconds: the supplementary tool that was never worth building before. "Bobby Tables is not a joke. It is a test case." |
| 24 | 38:00 | `tat-2006-2026` | visualization `tat-2006-2026` | data | **Live demo 2 — dashboard (D key).** Twenty years of tools, same median TAT (89 h → 89 h; volume +23%). Bridge to the canal: "the canal carried more boats every year; it never got faster." |
| 25 | 40:00 | `the-mirror` | visualization **V9** `paper-volume` | debate | PubMed pathology×AI 65 (2018) → 1,055 (2025), 992 by 2 Sep 2026; FM papers 0 → 122; ≥13.5% of 2024 abstracts LLM-processed → 89% of 2025 papers show LLM vocabulary; 70% of journals have policies, no effect. Takeaway (brief): "AI exposes the enormous volume of academically legible but low-marginal-value production within science." |
| 26 | 42:00 | `scarcity-shift` | visualization **V10** `scarcity-shift` | framework | What got cheap vs what stays scarce. Were these papers produced using AI? "AI-produced in a systemic sense, whether or not an AI wrote their sentences." Never infer authorship from style. |
| 27 | 43:00 | `artifact-functions` | visualization **V11** `artifact-functions` | meta | Paper · video · repo · model card · issue tracker · benchmark · regulatory record · implementation · outcomes: each answers one question. "Views measure attention; peer review measures passage through a validation process; neither directly measures clinical usefulness." Show poll results here. |
| 28 | 44:30 | `memex-to-model` | visualization **V12** `memex-to-model` | meta | Bush 1945 → Engelbart → Nelson → Knuth → Victor → Jupyter/Observable/Quarto/marimo → MCP/agents. What AI adds to the memex: constructs trails, translates media, writes and runs code, interrogates data, proposes connections, regenerates for a new audience, preserves the process. |
| 29 | 46:00 | `what-this-lecture-is` | visualization **V14** `lecture-provenance` | meta | How this deck was made: brief → research agents → verified registry → specs → coding agent → tests → commit. "The medium demonstrates the argument." Optional twin: `presentation-architecture`. |
| 30 | 47:00 | `canal-and-railroad` | visualization **V13** `canal-and-railroad` | ecosystem | 1825 the shovel broke · 1828 first boat · 1835 Northampton · 1836 >$1 M lost · 1848 canal closed, Canal Line opened on the right-of-way · 1996 trail. Bottom band: LIS/HL7/DICOM → WSI 2017 → Paige 2021 → FMs 2024 → MCP 2024 → agents 2025–26. Closing line: "My goal is not to provide an inventory of everything travelling on the canal. My goal is to show you that the railroad has arrived." |
| 31 | 48:30 | `takeaways` | takeaways | — | Five items + CTA (§5). |
| 32 | 49:00 | `sources` | content (scoped `<style>` block like `dom-grand-rounds#sources`) | — | Generated from REFERENCES.md §1–§9 (YES/PARTIAL only). |
| 33 | 49:30 | `qa` | qa (with `qrCode` → `/assets/qr/openpathology-lectures.svg`) | — | Opening question: "What is the one question in your practice whose answer would change a decision — and what artifact, not necessarily a paper, would establish it?" |
| opt | — | `tufte-timeline-optional` | visualization `tufte-timeline` (`isOptional: true`) | meta | Kept for audiences that have not seen the OneIT talk. |

Optional slides are hidden by the title-slide toggle and appear as ghost dots in the dock.

## 5. Takeaways and CTA (slide 31)

1. The two 2026 Nature Communications papers are excellent and bounded: **EAGLE's lesson is orchestration** (route, compose, reuse, inspect), not two-thousandths of AUROC.
2. **Thirty-two models later, there is no winner** — and that is the finding. Data composition, task definition, evaluation design, calibration and integration now matter more than model identity.
3. The frontier runs on **three clocks**; the literature serves the slowest one but is read as the fastest. Learn to read repos, model cards, issue trackers, standards and regulatory records as evidence — each for what it can establish.
4. AI collapses the cost of academically legible output and thereby **exposes** how much of it was low-marginal-value. The scarce resources are questions, data, judgment, evaluation, integration, accountability and trusted attention.
5. **The railroad has arrived.** The LIS canal still carries every case, and will for years; the transportation logic has changed.

CTA: *Write down one question in your practice whose answer would change a decision. Name the artifact that would establish it. If the honest answer is "a prospective evaluation in my lab", not "a paper", say so — and bring it to your applied informatics team.*

## 6. Live demonstrations and fallbacks

| Demo | Slide | Setup | Fallback |
|---|---|---|---|
| IBIS natural-language cohort discovery | 22 | Local or VPN instance; two pre-tested queries (one structured by IHC/stage, one free-text concept) | `assets/demos/ibis-fallback.mp4` (≤90 s, captioned) autoplaying inside a `consent-form-iframe`-style embed (T4.1); the slide works without it |
| Xenonym | 23 | https://xenonym.openpathology.org | The simulated browser is already the fallback |
| TAT 2006 vs 2026 dashboard | 24 | Press `D` | The KPI grid on the slide |

Rule (from `build_as_you_speak.json#ibis-flow`): if the live demo is unavailable, switch to the recorded fallback without apologizing.

## 7. Intellectual and rhetorical guardrails (enforced as a checklist in T5.4)

- Do not present small AUROC improvements as transformation (V2 never labels Δ as "improvement").
- Do not equate retrospective benchmark performance with clinical utility (V7's empty fourth rung stays empty).
- Do not call the papers chronologically outdated; call them conceptually incomplete (slides 3, 5).
- Do not infer AI authorship from writing style (slide 26 states the systemic-sense claim only).
- Do not dismiss the literature; define the function it serves (V11 keeps the paper's primary cell filled).
- Do not treat video popularity as proof (V11 line).
- Distinguish diagnostic image models from generative and agentic AI (slide 15 vs slides 6–13).
- Distinguish seeing → reproducing → deploying → improving outcomes (V7).
- Quote only verified sentences; where a sentence could not be verified (Lincoln & Korpman; Tufte "rich, detailed narrative") use attributed paraphrase.
- Prefer concrete demonstrations over speculative claims: every capability claim on slide 16 links to a repo or paper that passes `validate-links.js`.

## 8. Glossary (meta.glossary — ≈40 terms, written in T3.2)

Foundation model · embedding · tile / patch · multiple-instance learning (MIL) · attention (CHIEF/ABMIL) · AUROC · 95% CI / Wald test · linear probe · mean pooling · TCGA · CPTAC · external validation · calibration · decision curve · batch effect / site signature · benchmark saturation · agent · tool use · plan–execute–test–review loop · retrieval (RAG) · context engineering · Model Context Protocol (MCP) · Agent Skills · connector · model card · datasheet · issue tracker · silent trial · prospective evaluation · intended use · PCCP · IVD vs SaMD · DICOM WSI (Sup 145) · IHE PaLM DPIA · HL7 · Memex · associative trail · literate programming · explorable explanation · Farmington Canal · Canal Line · right-of-way · IBIS · Xenonym · REALM · TAT.

## 9. Engine improvements folded into this lecture (approved)

- **T0.1** Render `slide.speakerNotes` into `<aside class="notes">` so the `S` speaker view works for all nine lectures.
- **T0.2** `tests/viz-static-analysis.js` globs `data/lectures/*.json` instead of hard-coding `oneit.json`.
- **T0.3** `tests/validate-links.js` additionally extracts every `href` and every `url` field from all lecture JSONs and from `verified-numbers.json`.
- **T0.4** `learning-objectives-config` (V15) — first config-driven objectives viz.
- **T0.5** `dock-nav.js` `BADGE_COLORS` extended to all eleven styled badges (currently six).
- **T3.6** `npm run build-info` writes `/assets/data/ai-os/build-info.json` (commit, date, counts) for V14.

## 10. Timing budget

Opening + papers 0–19 min · thesis + agents + clocks 19–33 min · demos 33–40 min · mirror + memex 40–47 min · canal + close 47–50 min. Rehearsal target 47 min; the poll and slide 12 are the first cuts if running long.

## 11. Open questions for the presenter

1. Slide 3 vs a Sheckley-style epigraph cold open — the brief says open with the two papers; keep unless you want the epigraph as slide 0.
2. IBIS demo environment on grand-rounds Wi-Fi: confirm VPN or local instance; record the fallback clip in T4.1 regardless.
3. Is the Lincoln & Korpman sentence a quotation? If you have the PDF, T1.3 records the page; otherwise slides use "as Lincoln and Korpman argued in 1980".
4. Do you want the HKUST PathBench (19 FMs, 64 tasks, 10 hospitals) mentioned on slide 12 as a second congested benchmark? It strengthens "saturation" but adds a naming confusion to explain.
