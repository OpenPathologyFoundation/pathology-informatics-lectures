# Visualization Specifications

**Lecture:** *Modern AI & Transformation of Clinical, Operational & Research Infrastructure in Pathology*
**Engine facts these rely on** (`pathology-node-presentation/docs/ENGINE.md`): `VizLibrary.render(name, container, config)`; canvas 1200×700 scaled by CSS transform (px/em only); every SVG via `aiosStage()` (viewBox + `preserveAspectRatio="xMidYMid meet"`, cream background); fonts ≥ 10 px for anything carrying meaning; WCAG-AA against `#faf7f1`; staggered reveals via `aiosReveal()`; the lazy renderer dedups by vizType, so every slide has a distinct vizType; a takeaway bar covers the bottom ~9%, so content stays above `0.90 × H`; no emoji in SVG text.

**House style:** the cream Tufte palette (`TUFTE`): bg `#faf7f1` · ink `#1f1a14` · muted `#6b5c48` · rule `#bcb1a0` · fine `#d8d2c5` · slate `#3d5b73` · copper `#a36015` · crimson `#7a1f1a` · green `#0e3f2c` · amber `#8a5a0c` · violet `#5b2d71`; `SERIF` for display, `SANS` for labels; `tufteTitleBlock`, `tufteSmallCaps`, `tufteRule`, `wsiWrap`, `aiosNote`, `aiosSource`, `aiosArrowDef`.

**Config contract:** every word and number arrives through `vizConfig`. Each viz accepts `title`, `subtitle`, `caption`, `source` and renders a visible "no config" note if its data array is missing. Stepped vizzes accept `config.step` (render at that step, no animation) and otherwise advance on click; a small "click to continue" hint is drawn until the last step.

---

## Reused (no new code)

| Slide | vizType | Config |
|---|---|---|
| 5 objectives | `learning-objectives-config` | `objectives[] = {verb, text}` |
| 18 (optional) | `ibis-flow` | `{ hideHeader: true }` |
| 22 Xenonym | `xenonym-browser` | `{}` |
| 23 claims ladder | `evidence-ladder` | `rungs[] = {rung, claim, evidence, source, empty}`, `verbs[] = {verb, detail}` — new content, same shape |
| 28 (optional) | `lecture-provenance` | `stages[]`, `build{}`, `loopLabel`, `caption` |

## V1 · `case-coherence` — "What does not agree?"

**Argument.** A correct diagnosis is not the same as a coherent clinical record. The room finds the mismatch before the system does; then the system's flag and the pathologist's decision are shown as two different things. Three cases make three different points: a side error anyone catches; a record that is internally consistent and clinically implausible (every document says 30, the diagnosis is Grade Group 2 prostatic adenocarcinoma), which only domain knowledge catches; and an unreported Part B plus a copy-and-paste remnant.

**Data.** `cases[] = { label, tabLabel, documents[] = { label, lines[] = { text, key, tag } }, flag = { label, title, lines[], confidence }, decision = { label, options[] }, lesson }`; `key` of `wording` marks a decoy (a difference that is not an error); any other key (`laterality`, `plausibility`, `omission`, `remnant`) marks a line that participates in the real problem. `prompt` (shown before the decision), `summary` (shown at the closing step), `banner` ("Synthetic cases — no patients"), `step`.

**Encoding.** A case strip of small-caps tabs under the title (the active case in copper). Three cream cards side by side with small-caps headers and serif body lines; each marked line has a margin tag measured before the line is wrapped. Four sub-steps per case: plain · marked (crimson for the real problem, amber for the decoy) · the flag card (copper frame, the lines it compared, what it deliberately did not raise, its confidence) · the decision card (the pathologist's options) with the case's one-line lesson in copper where the prompt was. After the last case a closing summary replaces the lesson. Clicking the stage advances through all 13 steps; the hint reads "click to reveal", "click for the next case", "click to close"; `config.step` renders a fixed step; reduced motion starts at the last. The case headings are controls as well (2026-10-19): clicking a heading brings that case up at its first, unmarked step without walking through the others, a copper underline marks the active heading, and the stage click then continues from there; a heading click never counts as a stage click.

**Accept.** No real identifiers; banner always visible; every case has exactly one amber decoy; the second case's flag says the documents agree; the third case's flag names both the omission and the remnant; every string from JSON.

## V2 · `intent-to-behavior` — the distance

**Argument.** Recognizing what should happen is not the same as having infrastructure that makes it happen; the distance was the cost of implementation, and it changed.

**Data.** `rows[] = { domain, know, instead, system, now }`, `before = { label, cost }`, `after = { label, cost }`.

**Encoding.** Three rows. Left column (serif, ink): *what you know should happen*. Right column: *what happens instead* — the compensation. Between them a bracket spanning a wide gap, labelled with `before.cost` ("a software project · a budget line · a vendor queue · months to years"). Click: the bracket shrinks to a third of its width, relabels with `after.cost` ("a specification · a conversation · a test · weeks"), and the right column cross-fades from the compensation to the built system's name and one-line `now`. Caption from config.

**Accept.** Qualitative — no numeric axis; both states reachable; reduced-motion renders the after state.

## V3 · `two-kinds-of-ai` — the distinction

**Argument.** AI inside the application and AI helping construct the application are different things with different evaluation burdens; some of the most valuable built systems should have no model in the loop at runtime.

**Data.** `left = { heading, app, inputs[], model, output, decider, note }`, `right = { heading, stages[], tool, note }`, `bottom` (the shared sentence), `hover{}` per element.

**Encoding.** Left panel: an application frame (Dialogue) containing a model glyph (circle, "LLM"); inputs flow in from the left, "proposed flags" flow out to a human glyph labelled *pathologist decides*; a note under it: outputs need evaluation appropriate to the task. Right panel: a build pipeline — intended behavior → requirements → AI session (code · tests · docs) → working tool (Hedgehog) → engineering review + validation; the tool frame is annotated *no model in the loop at runtime*. Bottom rule and the shared sentence in serif italic.

**Accept.** The right-hand tool frame contains no model glyph; hover cards from JSON.

## V4 · `scrutiny-layer` — Dialogue in the sign-out rail

**Argument.** Another layer of scrutiny over the relationships that make a diagnosis usable — extending clinical attention, not replacing judgment.

**Data.** `rail[] = ["Draft report", "Coherence check", "Release"]`, `sources[]`, `flags[]`, `loop[]` (accept/dismiss → rate → informatics adjusts), `today`, `planned`, `quote = { text, who }`, `theorem = { text, who }`.

**Encoding.** A horizontal rail; the middle station drawn in copper and slightly raised (the inserted layer). Above it, the five document sources fan in; below it, the flag classes fan out; to the right, the feedback loop as a dashed return arrow. Margin notes: *today: the pathologist clicks an icon · planned: automatic*. Footer: the verbatim quote and Friedman's theorem.

**Accept.** Quote text verbatim from REFERENCES DLG-1; no performance number anywhere on the slide.

## V5 · `custody-translation` — the operational turn

**Argument.** AI does not have to make a clinical decision to change clinical care; it can help build the system that makes the intended workflow possible. The pathologist's knowledge changes the design: a handoff is complete only when acknowledged.

**Data.** `states[] = ["Collected (OR)", "In transit", "Received"]`, `gap = { label }`, `guard`, `cards[] = { stage, text }` (Problem · Requirement · Behavior · Test), `illustrative` (label text).

**Encoding.** Top: the handoff drawn twice. The spreadsheet version: a dashed arrow from *destination entered* straight to *assumed received* with a crimson break labelled "the gap where specimens were lost". The Hedgehog version: a solid state chain with an *acknowledge* transition and a guard pill ("unacknowledged past threshold → alert"). Bottom: four cards joined by copper arrows, text from JSON; a small-caps "ILLUSTRATIVE FORMULATION" tag on the requirement card.

**Accept.** The illustrative tag is present; the crimson gap is drawn only on the spreadsheet version.

## V6 · `fsqa-before-after` — real numbers from one lab

**Argument.** Changing infrastructure changed practice; the slide says explicitly that this is not evidence of an AI effect.

**Data.** `pairs[] = { label, before, after, unit, p, significant }`, `facts[]`, `banner`, `source`.

**Encoding.** Three slope panels. Each: two vertical ticks (BEFORE · AFTER), the value in large serif at each end, a connecting line (ink when significant, dashed muted when not), the P value in small sans beneath. The non-significant panel carries the words "not significant" on its face. Under the panels a fact strip (go-live, periods, counts, participation, hard stop). A crimson-ruled banner with the guardrail sentence. Source line.

**Accept.** The dashed/non-significant treatment applies exactly to the `significant: false` pair; all numbers from JSON and REFERENCES FSQA-1.

## V7 · `exchange-vs-coordinate` — behavioral interoperability

**Argument.** Can these systems merely exchange information, or can they coordinate the next step in the work?

**Data.** `left = { heading, hub, spokes[], note }`, `right = { heading, layer, holds[], links[] = { from, to, via } , note }`, `caption`.

**Encoding.** Left: an LIS hub with message arrows fanning out to EHR, OR, billing, portal — every arrow identical, note "everyone gets a copy; nobody owns the next step". Right: an orchestration band holding state ("what must happen next · who must acknowledge · when to escalate") with bidirectional links labelled by the real systems (FSLink OR ↔ frozen section; POinT OR → intake; Hedgehog lab → lab; RTSE reminders and rare-event detection).

**Accept.** Right-hand links are bidirectional where the system is (FSLink); left-hand arrows are one-way.

## V8 · `ibis-interpretation` — the inspectable intermediate

**Argument.** The important output is not a fluent answer; it is an inspectable, reproducible connection between a question and the evidence. Change one criterion and watch what changes.

**Data.** `question`, `interpretation`, `entities[]`, `query`, `confidence`, `approve`, `refine = { instruction, interpretation, query, changed }` (the substring that changed), `exposes[]` (the three questions), `liveHint`.

**Encoding.** A panel in the house style, not a fake browser: the question in large serif; four labelled rows (INTERPRETATION · ENTITIES as chips · GENERATED QUERY in monospace · CONFIDENCE with "review and approve before executing"). Click: the refinement instruction types in; the query re-renders with the changed clause in copper and the old clause struck through in muted; the interpretation updates. Right margin: the three questions the demo should expose. Footer: live hint.

**Accept.** Illustrative field names in the query, never the live instance's internal schema; no result counts rendered.

## V9 · `green-build` — the revealing failure

**Argument.** A system that passes a test is not the same as a system whose tests execute it.

**Data.** `baseline = { tests, passRate, executing, defects[], label, source }`, `rebuilt = { layers[] = { name, what, count }, total, skips, rules[] }`, `caption`.

**Encoding.** Left: a grid of `baseline.tests` small green squares (≈ 25 per row). Step 1: a crimson bracket beneath — "0 of 379 executed the application"; the squares' green dims to a pale wash (the colour was never the evidence). Step 2: the defects list appears in crimson beneath the grid. Right: three stacked layer bars with counts (722 Node across unit + behaviour, 450 browser) and the total; the two rules in serif. Source lines.

**Accept.** Square count equals `baseline.tests`; counts from JSON only; the defects are the four verbatim classes from DCR-004.

## V10 · `drift-log` — locally correct, globally false

**Argument.** The quality system caught nothing while it was prose; it started catching things when it became code that fails the build.

**Data.** `incidents = { total, prevented, asOf }`, `headline = { claim, truth, where }`, `taxonomy[] = { cause, incident, guard }`, `mechanisms[]`, `caption`, `source`.

**Encoding.** Top: a row of `total` tick marks, `prevented` filled copper and the rest hollow, with the two counts in small caps. Headline incident typeset large (the A-key sentence). Middle: the taxonomy as a three-column text table with hairline rules. Bottom: the four mechanisms as a short list. Caption and source.

**Accept.** Tick counts equal the JSON; headline text matches DRIFT-LOG row 31 (REFERENCES WBC-5).

## V11 · `clinically-led` — the operating model

**Argument.** Neither "everyone becomes a programmer" nor "we no longer need engineering": pathologists contribute intended behavior, meaningful exceptions and acceptance criteria; an accountable team turns those into supported infrastructure.

**Data.** `rejected[] = { heading, why[] }` (two), `model = { heading, pathologists[], team[] }`, `loop[]`, `caption`.

**Encoding.** Three columns; the outer two in muted ink with a thin crimson strike through their headings and their failure modes beneath; the centre in copper with two stacked lists (PATHOLOGISTS CONTRIBUTE · THE TEAM PROVIDES). Under the centre column a small loop of five nodes (intent → specification → build → test → use → revised intent).

**Accept.** Both rejected models visibly struck; the loop closes on itself.

## V12 · `intent-spec` — the closing exercise

**Argument.** Describe what the system should do, what it must never do, and what evidence would convince you that it works. That page is the beginning of infrastructure.

**Data.** `prompt`, `sections[] = { heading, hint }` (three), `example = { title, sections[] }`, `caption`.

**Encoding.** Left two-thirds: a typeset one-page form — three small-caps headings, each followed by three dotted blank lines and an italic hint. Right third: on click, the same three headings filled with a short worked example (specimen custody), in small serif on a slightly inset card labelled "ONE WORKED EXAMPLE". Caption: the closing challenge.

**Accept.** Blank state first; example reachable by click or `config.step`.

## V13 · `harm-record` — "This is not hypothetical"

**Argument.** Documented cases in which the record, not the histology, was wrong; every one was caught by a layer nobody had designed as a check.

**Data.** `cases[] = { year, place, confused, happened, caught }`, `stats[] = { value, label }`, `columns`, `caption`, `source`.

**Encoding.** A casebook table: crimson year with the place in small caps beneath; three wrapped serif columns (what was confused · what happened, headed in crimson · what caught it, in copper italic); hairline rules; rows sized from their own text. Under it a strip of four large numbers with sans captions. Caption and source.

**Accept.** Every case resolves to a REFERENCES HARM-id; the Georgia case says "allegations unproven" on its face; the stats match STAT-1…STAT-5.

## V14 · `swiss-cheese` — "Why they get through"

**Argument.** Reason's model for a pathology case: each layer has holes and assumes the one before it checked; a coherence check is a slice with different holes, not a slice without holes.

**Data.** `layers[] = { label, hole, holes[]? }`, `inserted = { after, label, note, holes[] }`, `errorLabel`, `harm`, `flag`, `quote { text, who }` (paraphrase), `caption`. Hole entries are slice-local `[u across, v down, r]`; a layer without `holes` takes one of eight built-in pairs so no two neighbouring slices look alike. The aligned hole is never configured: it is always at the slice's horizontal centre, on the line.

**Encoding (revised 2026-10-17).** Seven slabs across the stage: a pale face (`#f2eadb`, 72 px wide) with a 12 px side face for depth, holes drawn as filled discs in a darker bore tone. Every slab has three holes: two stray ones (radius 8–13) that differ from slab to slab, and one aligned hole (radius 15) at the horizontal centre whose centre lies exactly on the trajectory line. The crimson trajectory is drawn in segments *on top of* the slabs: each segment runs across the face into the centre of the aligned hole and stops there, and the next one re-emerges at the slab's trailing edge (past the side face), which is what makes the passage read as three-dimensional. The segments draw themselves in sequence at load, ending in a crimson HARM disc. Labels above in small caps, the hole described beneath in crimson italic; the ONE ERROR label sits left of the first slab, which starts far enough right not to collide. Click: the slabs after the `after` index slide right to make room (named transitions, so the move never cancels the entrance reveal), a copper slab fades in with holes off the line, the segment arriving at the next slab shortens to a stop circle just before the new slab's face while every segment beyond it fades with the HARM disc, and a copper pole rises to a pennant and the flag label above the label row. Footer: the paraphrase of Reason (no quotation marks) and the caption.

**Accept.** Every segment ends at the centre of an aligned hole and the next begins at the slab's trailing edge; no two neighbouring slabs have their stray holes in the same places; nothing overlaps the first slab, the flag label, or the next slab's label at either step; the inserted slab's holes are not on the line; the HARM disc is hidden at step 1; the paraphrase is attributed "after Reason".

## V15 · `feasibility-map` — "The capability is not the hard part"

**Argument.** Reading across text is no longer the bottleneck (Gertz 2024); assembly, free text, the perimeter, noise, timing and accountability are, and Dialogue's answers to each are design decisions.

**Data.** `left = { label, items[] = { lead, text } }`, `right = { label, items[] }`, `caption`, `source`.

**Encoding.** Two columns of six paired items, the left leads in ink and the right in copper, joined row by row with a copper arrow; hairlines between rows; rows sized from their own text. Caption and source.

**Accept.** Six pairs; the right column distinguishes what is live ("laterality and site") from what is by design; the source line carries the Gertz numbers.

---

## V16 · `prophecy-vs-context` — "The prediction" (added 2026-10-17)

**Argument.** A dated prediction about judgment (Hinton, Toronto, October 2016, with the hedge), its extension into pathology, and the ten-year mark landing in the month of the talk; then what the field looks like at that mark; then the split of amended reports, which shows that what sends a report back is mostly not judgment but context. The slide ends on the thesis of the hour.

**Data contract.** `quote {lines[], blunt, who}` · `extension {label, text, who}` · `timeline {start, five, ten}` each `{label, note}` · `later {label, items[] {lead, text}}` · `split {label, source, judgment {pct, label, note}, context {pct, label, note, parts[] {pct, label}}}` · `thesis` · `epigram {text, who}` · `source` · `hint` · `step`. Every number resolves to PRED-1..5 and AMD-2 in REFERENCES.md.

**Encoding.** 1280×720 cream stage. Quote in 19 px italic serif, the hedge line in copper bold; the blunt hospital line in 14 px; attribution in 10 px small caps. Extension in the right column. A single timeline with three marks, the ten-year mark crimson with a filled dot. Step 1: a copper small-caps label and four columns, lead number in 22 px serif bold, text 12 px. Step 2: a 24 px-high bar split by percentage, crimson for misinterpretation, slate for the rest with hairline dividers and in-bar labels where they fit; captions under each end; thesis 15.5 px serif, epigram 13.5 px italic copper; source line at 0.889 H.

**Steps.** 0 quote, extension, timeline (staggered reveal) · 1 ten years later · 2 the split and the thesis. Reduced motion: everything visible.

**Acceptance.** Static analysis passes; no element below 0.89 H other than the source line; the step screenshots show no overlap between the four columns and the split block; the hedge is visible at step 0 without a click.

## Cross-cutting acceptance tests

1. `node tests/viz-static-analysis.js ai_infrastructure` passes.
2. Every SVG via `aiosStage` (viewBox + aspect), > 10 elements, min font 8 px (10 px for meaning), WCAG-AA on cream.
3. Numbers on screen appear in `vizConfig` and resolve to REFERENCES ids.
4. No emoji in SVG text; no gradients, shadows or raster images.
5. `prefers-reduced-motion` renders the final step with no transitions.
6. Distinct vizType per slide.
7. `LECTURE=ai_infrastructure node tests/screenshot-ai-os.js` reports no overflow and no console errors.
