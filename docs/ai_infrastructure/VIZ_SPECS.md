# Visualization Specifications

**Lecture:** *Modern AI & Transformation of Clinical, Operational & Research Infrastructure in Pathology*
**Engine facts these rely on** (`pathology-node-presentation/docs/ENGINE.md`): `VizLibrary.render(name, container, config)`; canvas 1200×700 scaled by CSS transform (px/em only); every SVG via `aiosStage()` (viewBox + `preserveAspectRatio="xMidYMid meet"`, cream background); fonts ≥ 10 px for anything carrying meaning; WCAG-AA against `#faf7f1`; staggered reveals via `aiosReveal()`; the lazy renderer dedups by vizType, so every slide has a distinct vizType; a takeaway bar covers the bottom ~9%, so content stays above `0.90 × H`; no emoji in SVG text.

**House style:** the cream Tufte palette (`TUFTE`): bg `#faf7f1` · ink `#1f1a14` · muted `#6b5c48` · rule `#bcb1a0` · fine `#d8d2c5` · slate `#3d5b73` · copper `#a36015` · crimson `#7a1f1a` · green `#0e3f2c` · amber `#8a5a0c` · violet `#5b2d71`; `SERIF` for display, `SANS` for labels; `tufteTitleBlock`, `tufteSmallCaps`, `tufteRule`, `wsiWrap`, `aiosNote`, `aiosSource`, `aiosArrowDef`.

**Config contract:** every word and number arrives through `vizConfig`. Each viz accepts `title`, `subtitle`, `caption`, `source` and renders a visible "no config" note if its data array is missing. Stepped vizzes accept `config.step` (render at that step, no animation) and otherwise advance on click; a small "click to continue" hint is drawn until the last step.

---

## Reused (no new code)

| Slide | vizType | Config |
|---|---|---|
| 5 objectives | `learning-objectives-config` | `objectives[] = {verb, text}`, optional `margin` (node inset, default 130) and `textWidth` (statement wrap width, default 215); the wave drops to clear a statement above it that wraps past four lines |
| 18 (optional) | `ibis-flow` | `{ hideHeader: true }` |
| 22 Xenonym | `xenonym-browser` | `{}` |
| 23 claims ladder | `evidence-ladder` | `rungs[] = {rung, claim, evidence, source, empty}`, `verbs[] = {verb, detail}` — new content, same shape |
| 28 (optional) | `lecture-provenance` | `stages[]`, `build{}`, `loopLabel`, `caption` |

## V1 · `case-coherence` — "What does not agree?"

**Argument.** A correct diagnosis is not the same as a coherent clinical record. The room finds the mismatch before the system does; then the system's flag and the pathologist's decision are shown as two different things. Three cases make three different points: a side error anyone catches; a case accessioned to the wrong patient (the requisition says 70, the clinical history gives no age, the draft report header says 30 over a Grade Group 2 prostatic adenocarcinoma), where the comparison finds the header and domain knowledge says which document to doubt (revised 2026-10-20: the history carries no demographics, so the mismatch is requisition against report); and an unreported Part B plus a copy-and-paste remnant.

**Data.** `cases[] = { label, tabLabel, documents[] = { label, lines[] = { text, key, tag } }, flag = { label, title, lines[], confidence }, decision = { label, options[] }, lesson }`; `key` of `wording` marks a decoy (a difference that is not an error); any other key (`laterality`, `identity`, `plausibility`, `omission`, `remnant`) marks a line that participates in the real problem. `prompt` (shown before the decision), `summary` (shown at the closing step), `banner` ("Synthetic cases — no patients"), `step`.

**Encoding.** A case strip of small-caps tabs under the title (the active case in copper). Three cream cards side by side with small-caps headers and serif body lines (14.5 px since 2026-10-20, up from 13; cards, flag and decision boxes take the height of their content); each marked line has a margin tag measured before the line is wrapped. Four sub-steps per case: plain · marked (crimson for the real problem, amber for the decoy) · the flag card (copper frame, the lines it compared, what it deliberately did not raise, its confidence) · the decision card (the pathologist's options) with the case's one-line lesson in copper where the prompt was. After the last case a closing summary replaces the lesson. Clicking the stage advances through all 13 steps; the hint reads "click to reveal", "click for the next case", "click to close"; `config.step` renders a fixed step; reduced motion starts at the last. The case headings are controls as well (2026-10-19): clicking a heading brings that case up at its first, unmarked step without walking through the others, a copper underline marks the active heading, and the stage click then continues from there; a heading click never counts as a stage click.

**Accept.** No real identifiers; banner always visible; every case has exactly one amber decoy; the second case's flag names the requisition-against-report age mismatch and the implausible age; the clinical history card carries no age or name; the third case's flag names both the omission and the remnant; every string from JSON.

## V2 · `intent-to-behavior` — the distance

**Argument.** Recognizing what should happen is not the same as having infrastructure that makes it happen; the distance was the cost of implementation, and it changed.

**Data.** `rows[] = { domain, know, instead, system, now }`, `before = { label, cost }`, `after = { label, cost }`.

**Encoding.** Three rows. Left column (serif, ink): *what you know should happen*. Right column: *what happens instead* — the compensation. Between them a bracket spanning a wide gap, labelled with `before.cost` ("a software project · a budget line · a vendor queue · months to years"). Click: the bracket shrinks to a third of its width, relabels with `after.cost` ("a specification · a conversation · a test · weeks"), and the right column cross-fades from the compensation to the built system's name and one-line `now`. Caption from config.

**Accept.** Qualitative — no numeric axis; both states reachable; reduced-motion renders the after state.

## V3 · `two-kinds-of-ai` — the distinction

**Argument.** AI inside the application and AI helping construct the application are different things with different evaluation burdens; some of the most valuable built systems should have no model in the loop at runtime.

**Data.** `left = { heading, app, inputs[], model, output, decider, note }`, `right = { heading, stages[], tool, note }`, `bottom` (the shared sentence), `hover{}` per element.

**Encoding.** Left panel: an application frame (Dialogue) containing a model glyph (circle, "LLM"); inputs flow in from the left, "proposed flags" flow out to a human glyph labelled *pathologist decides*; a note under it: outputs need evaluation appropriate to the task. Right panel: a build pipeline — intended behavior → requirements → AI session (code · tests · docs) → working tool (the Paige integration; Hedgehog until 2026-10-21, when the presenter asked for a pathologist-facing example) → engineering review + validation; the tool frame is annotated *no model inside the integration*. The stage hovers carry the Paige inclusion rule, the risk file’s fifteen risks and the ten weeks; the tool hover says the model it feeds is Paige’s, the left kind, so Paige is both at once. Bottom rule and the shared sentence in serif italic.

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

**Encoding.** Left: a grid of `baseline.tests` small green squares (≈ 25 per row). Step 1: a crimson bracket beneath — "0 of 379 executed the application"; the squares' green dims to a pale wash (the colour was never the evidence). Step 2: the defects list appears in crimson beneath the grid. Step 3 (2026-10-19; until then the right column was on screen from the start, so the success showed before the failure): the right column — three stacked layer bars with counts (722 Node across unit + behaviour, 450 browser) and the total, then the two rules in serif, staggered in. Source lines.

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

## V17 · `dialogue-eras` — "Dialogue was not designed once" (added 2026-10-19)

**Argument.** Dialogue reached its present shape in seven steps over three years, and each changed what it reads, where it sits in the workflow, or what it records. The reviews run each month on the same axis show when clinical use began and how it grew; the presenter explains each transition.

**Data contract.** `eras[] = { chip, name, dates, from, to, could, note, nodes { <key>: { state: new|same|none, text } } }` · `nodes[] = { key, label }` for the eight fixed boxes (`pathologist`, `signin`, `other`, `screens`, `api`, `db`, `cases`, `ai`) · `usage = { label, note, total, golive { date, label }, months[] { m, n, part, label } }` · `range { from, to }` · `frame` · `couldLabel` · `hint` · `source` · `step`. Eras and dates from the repository’s own history; months from the department’s production records (full deck only).

**Encoding.** 1280×720 cream stage. Seven equal-width chips (era number and short name in small caps, dates beneath) fan down onto a proportional time axis, because the last two eras are a few weeks wide; current era copper, past muted, future pale. Slate bars for reviews per month share that axis, the partial first and last months lighter, a crimson go-live tick, the peak labelled. Below: the era number in 56 px copper serif, its name and dates, "What a pathologist could do" (15 px) and a one-line note in italic. On the right, eight boxes in fixed positions with the Dialogue boxes framed; a box new or changed in the era is copper with a wash and pulses once, a box that does not exist yet is dashed, an edge is dashed unless both ends exist.

**Steps.** One per era. A stage click advances; a chip click jumps to that era and does not also advance. Bars grow to the end of the era in focus; the total appears at the last era. Reduced motion starts at the last era.

**Acceptance.** No box label runs past its box; nothing below 0.89 H except the source line and the hint; the chips and bars do not collide at any era; no pull-request numbers, commit hashes, hosts or names on the slide.

## V18 · `changed-after-review` — "One hundred reports, changed before sign-out" (added 2026-10-19)

**Argument.** Pathologists say a Dialogue review changed the report on some cases — from the reviews where they answered an optional question, not from all reviews run (the counts are in the full deck only). Amendments avoided is a range the data cannot narrow. The slide ends on the sentence the numbers support and strikes the one they do not.

**Data contract.** `question { label, text }` · `counts { run, answered, changed, yes, unsure, no, tooLate }` · `blocks[3] { value, caption }` · `answeredKey { changed, unchanged, tooLate }` · `splitKey { yes, unsure, no }` · `wrong` · `right` · `hint` · `source` · `seed` · `step`. Every number from the report's funnel and outcome tables.

**Encoding.** The question in its own words under the title, 22 px italic. Three blocks of squares, one review each, growing in size left to right: every review run (6.5 px cells), the answered (13 px), the changed (22 px). The answered are a seeded scatter in block one, so a fixed step always draws the same picture. Changed copper; unchanged pale slate; the one review found after sign-out outlined in crimson; in block three, crimson for yes, copper hatching for not sure or not answered, pale copper for no. Large numbers head each block. The source line carries "self-reported" and "nothing here measures whether the model was right" at every step.

**Steps.** 0 the question and every review · 1 the answered light up and fly out to block two · 2 the changed turn copper, with the key · 3 the changed fly on to block three and split · 4 the struck headline and the right one. Reduced motion starts at step 4.

**Acceptance.** 38% never appears without 11% on screen; amendments avoided is never shown as 21 or 60 alone; block two shows 102 copper squares, not 100, and the key says why; no pathologist's name anywhere.

## V19 · `paige-architecture` — "The prediction, installed" (added 2026-10-19; rebuilt the same day on the departmental overview's Figure 1)

**Argument.** The kind of AI the 2016 prediction imagined is in our sign-out workflow, bought. It reached clinical use in ten weeks because everything around it but one service was already in use.

**Data contract.** `parts = { portal, aion, stevedore, bridge, paige, lis, archive, directory }`, each `{ name, role, text }` · `infra = { label, text }` · `slot` · `links = { case, register, manifest, read, status, access, launch }` · `path[]` (five labels) · `captions[]` (one per step) · `yaleLabel` · `vendorLabel` · `boundary` · `source` · `hint` · `step`.

**Encoding.** The overview's Figure 1, redrawn in the deck's palette with its topology unchanged. The Yale and YNHH environment is on the left: the Portal across the top in slate; the scheduler, the image mover and the new service in a row; the LIS, the image archive and the designated directory beneath; the shared infrastructure along the foot. The vendor panel is on the right, with a dashed boundary between. Each box states its status in its small-caps role: "already in use", "built new", "bought". Step 0: everything already in use, the new service an empty dashed slot, no connections. Step 1: the service fills in copper with a ring, and the connections draw. Step 2: one biopsy's path lights in copper as five numbered stretches in order (eligible and identity checked; registered with Paige first; then released; read; ready in the worklist), and the decision line appears last. The two arrow labels that would sit under a numbered stop give way to it. Fixed relative to the original: the overlapping legend text, a label sitting on its own arrow, a label crossing the boundary, and the ambiguous "case metadata" label, which belongs to the scheduler-to-Bridge arc.

**Acceptance.** Registration precedes release in the path order; the next slide scores that ordering as a risk. Every text sits inside its box and above 0.89 H, except the source line and hint; path labels clear their lines. No security internals from the overview; no account ID, stain codes, contacts or staff names.

**Public form (2026-10-22).** `omit[]` names parts that are not drawn, and the arrows and path stops that touch them go with it; `parts.filler` takes the middle slot in their place; a stop on an omitted part moves to its `alt` position if it has one (the read in the vendor’s cloud, onto the vendor box). The public deck uses `omit: [stevedore, archive, directory]` with a four-stop path, so the image path and the folder are not on the internet; the full deck draws the figure whole.

## V20 · `risk-file` — "Fifteen risks. Not one is about whether the model reads the slide" (added 2026-10-19)

**Argument.** All fifteen risks in the integration's own hazard analysis are context — identity, selection, ordering, notification, privacy. Whether the FDA-authorized model is right in our hands is outside the file by design, and still open.

**Data contract.** `groups[] = { label, rows[] = { label, s, pre, post } }` · `axis = { label, max, bands[] = { from, to, label, shade } }` · `sevLabel` · `counts[] = { value, label }` · `preLabel` · `postLabel` · `absent = { label, text, note }` · `caption` · `source` · `hint` · `step`. Scores and bands from the integration’s risk documents (internal; the slide is in the full deck only since 2026-10-22).

**Encoding.** A dot plot: one row per risk under four headings in the pathologist's terms (wrong patient or case; pre-read missing or late; wrong status on the worklist; privacy), severity in its own column with 5 in crimson, the risk priority on a 0–30 axis with the Medium band (16–50) shaded. Step 1: each dot moves to its score after controls, leaving a hollow marker where it started and a copper link; the legend switches with it. Step 2: a dashed crimson card — not in this file: whether the model reads the slide correctly — and the caption that returns to the opening.

**Acceptance.** Every score matches the hazard analysis; the band labels match the risk plan; the legend never contradicts the dots; the counts carry no test figure (the verification cases are planned, their results not recorded).

## Cross-cutting acceptance tests

1. `node tests/viz-static-analysis.js ai_infrastructure` passes.
2. Every SVG via `aiosStage` (viewBox + aspect), > 10 elements, min font 8 px (10 px for meaning), WCAG-AA on cream.
3. Numbers on screen appear in `vizConfig` and resolve to REFERENCES ids.
4. No emoji in SVG text; no gradients, shadows or raster images.
5. `prefers-reduced-motion` renders the final step with no transitions.
6. Distinct vizType per slide.
7. `LECTURE=ai_infrastructure node tests/screenshot-ai-os.js` reports no overflow and no console errors.

## V21 · `effort-shift` — "What changed, and what did not" (added 2026-10-20)

**Argument.** What AI-assisted construction changed is not the amount of work but its kind: the mechanical part moved to the machine, the judgment stayed with the pathologist and became decisive, and the magnitude holds only under discipline. Redrawn from the two-orders slide of the DOM grand rounds, with both columns written in this deck's terms.

**Data contract.** `absorbed = { label, sub, items[] }` · `amplified = { label, sub, items[] }` · `center = { label, figure, text, lines[], basis, measured = { label, rows[] } }` · `hinge = { label, without: { label, lines[], note }, with: { label, lines[], note } }` · `closing` · `source` · `title` · `subtitle` · `hint` · `step`. When `measured` has rows, the figure moves up 28 px and the measured label (small caps) and rows (10.5 px serif, three at most, centred 8 px left of the axis) take the place of the lower rule and the basis line.

**Encoding.** Two columns of seven lines in serif, the magnitude between them in copper, the hinge as two washed panels (crimson, green) beneath, a closing line, the source at the foot. Step 0: both columns in ink, nothing between them. Step 1: the left column strikes through from the centre out and fades to muted italic, down-arrows appear; the right column goes bold with up-arrows; the magnitude fades in with the measured block beneath it (or, without `measured`, its basis in small caps). Step 2: the hinge and the closing line.

**Acceptance.** The right column reads as the pathologist's work and previews `where-knowledge-enters`. The magnitude is measured (GIT-1: git.yale.edu, 64 department repositories, 2026-10-20) and the slide says what was counted; the hundredfold is confined to merged changes per working day and the notes call it partly a change of workflow; the engineer's ×2 to ×4 is labelled as his first five weeks. No staff member is named. Every text sits above 0.89 H except the source line and the hint; the contrast audit passes on the panel washes.

## V22 · `questions-to-rules` — "The questions that require your expertise" (added 2026-10-20)

**Argument.** The machine compares everything, every time, without fatigue, and does not know what a difference means. The three cases the room read at the start are read three ways, one row each: the case as it reaches the review; what the machine says about it (differs, agrees, flagged, and nothing more); and the question only a pathologist can answer, which on the last click is replaced in place by that answer written as a rule the chain is tested against. The expert work is the writing-down. Replaces the two-column list of the same name. A first version with five columns and four rows was cut the same day: about 310 words, near 90 seconds to read.

**Data contract.** `columns[] = { head, lines[] = { tag, text, tone, sep }, machine, question, rule }` · `rows = { case, machine, question, rule }` each `{ label, gloss }` · `closing` · `source` · `title` · `subtitle` · `hint` · `step`. `machine` is a string of `glyph word` parts separated by `·`. `tone` is `wording` (amber) or `error` (crimson) and colours the line only at the last step; `sep` draws a hairline before the line (`true`) or a gap after it (`"after"`). The cases are synthetic and match the opening slide (3 cores / three core samples; left / right; Grade Group 2 at thirty; Part B received and not reported). Column width follows the column count.

**Encoding.** Three row bands, each a small-caps label with an italic gloss and a hairline. Row 1: three cards, tag gutter in small caps and the value in sans, all cards the height of the tallest. Row 2: the machine’s output centred under each card in muted sans, with its glyph (≠, =, !). Row 3: a copper question mark and the question in italic serif; at the last step the band relabels in green and each question crossfades into its rule, a green bar at its left, with a bold closing line beneath. Step 0: rows 1 and 2. Step 1: row 3 staggers in, row 2 dims. Step 2: the rules replace the questions, the closing line appears, and the first column’s pairs take their tones.

**Acceptance.** Never more than three rows on screen; about 90 words at any step; every card’s text sits inside its card; no tag collides with its value; every text sits above 0.89 H except the source line and the hint; the machine row uses three words; the rules are labelled as illustrations in the notes; the contrast audit passes on copper, green, amber and crimson text on cream.

## V23 · `security-ratchet` — "Copy one file" (added 2026-10-21)

**Argument.** The image mover the Paige integration reuses is a file copy, and a file copy is the kind of task a room of pathologists would call trivial. Its own record shows five re-asks of "is it secure?" turning two steps and no tests into fifteen steps and eighty tests, each pass surfacing an assumption the one before had no reason to see. The slide is the ratchet: the step count only grows, and tests are the pawl. It stands between the Paige architecture (the box is on screen one slide earlier) and the risk file (fifteen risks, none about the model; here, fifteen steps, none about the image).

**Data contract.** `versions[] = { label, steps, tests, asked, found, gap }` · `maxSteps` (defaults to the largest `steps`) · `stepsLabel` · `testsLabel` · `askedLabel` · `foundLabel` · `closing` · `closingNote` · `source` · `title` · `subtitle` · `hint` · `step`. `gap` on a version draws a dashed hairline in the gap before it with the text beneath the baseline. Column width follows the version count; the question and finding are wrapped to it.

**Encoding.** One column per version: a small-caps label; a slate bar (14 % fill, slate stroke) whose height is `steps / maxSteps` of 112 px on a shared baseline, the step count in 30 px bold serif above it with STEPS in small caps after the number; the test count in green small caps under the baseline (muted when zero). Below: ASKED in copper small caps with the question in italic serif, then SURFACED in crimson small caps with the finding in serif, both wrapped to the column. A closing bold line and an italic note span the width above the source line. Step 0: labels, bars and counts stagger in. Step 1: the first half of the columns’ question and finding. Step 2: the second half. Step 3: the closing lines.

**Acceptance.** Counts and dates match STV-1 (the slide is in the full deck only since 2026-10-22); no server, share or file-system name on the slide; about 65 words at step 0 and about 140 at the last step, all fragments; every finding sits inside its column and above the closing rule; every text above 0.89 H except the source line and the hint; the contrast audit passes on slate, green, copper and crimson text on cream; the static analysis finds the registry entry and a staggered reveal.

## V24 · `knowledge-enters` — "Where the pathologist’s knowledge enters" (added 2026-10-21)

**Argument.** The expert sentence is not one thing that gets added to a system; it enters at a different point in each. One rail across the top (a case enters · the software judges · it acts · it reports) and, under each station, the system whose sentence enters there: Paige Prostate at the door (which cases it may see), Dialogue inside the judgment (what counts as a difference), IBIS before the action (what it shows before acting), WBC ΔΣ in the report (what the report carries). Under each system, what the software does on its own, and then, as a fragment, the sentence a pathologist had to write. Replaces the six-item numbered list of the same name; Hedgehog and the frozen-section scoring are not on this slide.

**Data contract.** `columns[] = { station, stage, system, alone, sentence }` · `closing` · `source` · `title` · `subtitle` · `hint` · `step`. Column width follows the column count; the sentences start on one line across the columns under the longest "alone" line; the closing line sits at the larger of 540 and the longest sentence plus 60.

**Encoding.** The rail is a 1 px ink line with an arrowhead; each station a hollow dot with its label in serif above the line. Under the dot: the stage question in copper small caps, the system in bold serif, what it does on its own in muted italic. A dotted hairline track runs from the dot to the sentence row. The sentence in 15 px serif beside a 2 px copper bar. Step 0: rail, stations, questions, systems. Step 1: the first two sentences stagger in; each column’s track turns solid copper and its dot fills copper as the sentence arrives. Step 2: the last two. Step 3: a rule and the bold closing line.

**Acceptance.** About 95 words at step 0 and fewer than 50 added per click; every sentence sits inside its column; the tracks never cross text (the column text is indented 20 px from the track); every text sits above 0.89 H except the source line and the hint; the contrast audit passes on copper small caps on cream; the provenance of each sentence is in the source line and the notes, and nothing on the slide is presented as a quotation.

## V25 · `safety-boundary` — "The safety boundary" (added 2026-10-21)

**Argument.** The boundary is the subject, so it is drawn: a black diagonal bar across the stage, with what AI does on its left and what it must not on its right. Bauhaus vocabulary, in the deck’s palette: the slate circle for the actions (it moves, it proposes), the crimson square for the prohibitions (it stops), the amber triangle for the two the talk insists on. Replaces the good/bad comparison of the same name; the content is the comparison’s, with the reasons shortened.

**Data contract.** `does = { heading, sub, items[] = { text, systems } }` · `mustNot = { heading, sub, items[] = { verb, text } }` · `emphasis[]` (indexes into `mustNot.items`) · `closing` · `title` · `subtitle` · `hint` · `step`. Text widths follow the bar: each row is measured against the bar’s edge at its own height, so the left column widens and the right column narrows down the slope.

**Encoding.** The bar is an ink polygon 18 px wide, from x 596 at the title rule to x 684 at the closing line. Headings in 26 px heavy sans caps, letter-spaced, each with its shape (a 44 px slate circle, a 44 px crimson square) and a small-caps subtitle. Left rows: a 12 px slate circle, the action in 13.5 px sans, the systems in 9.5 px slate small caps. Right rows: a 12 px crimson square, the verb in bold 14.5 px sans, the reason in muted 13 px. Step 0: title, bar, headings. Step 1: the left rows stagger in. Step 2: the right rows. Step 3: every row but the emphasized two dims to 0.3, their squares turn amber, and the closing line appears in 20 px heavy caps with an amber triangle before it.

**Acceptance.** No text touches the bar at any row (30 px clear on both sides at the row’s first line, more below it); the headings sit on one baseline; every row sits above the closing line at 640; the contrast audit passes on slate small caps and muted sans on cream; about 60 words at step 0, under 70 added per click; the closing line repeats the takeaway’s two words and nothing else.

## V26 · `takeaways-board` — "What to take with you" (added 2026-10-21)

**Argument.** The closing summary in the same vocabulary as the safety boundary: a black spine down the left, heavy numerals, one bold claim per row, the gloss in muted type beneath it, and the challenge as a black band across the width with the amber triangle, the shape the previous slide gave to what the talk insists on. The claims alone are the slide; the glosses are the elaboration; the band is the ask. Replaces the `takeaways` list of the same name; the five claims are the list’s, the glosses shortened, the challenge now pointing at the page the `your-problem` slide just drew.

**Data contract.** `items[] = { claim, gloss }` · `challenge = { label, text }` · `title` · `subtitle` · `hint` · `step`. Rows stack from y 170 with 30 px between a gloss and the next numeral; the spine runs the rows’ length; the band sits 24 px under the last gloss, at most at y 566, and grows to fit its text.

**Encoding.** Spine: a 14 px ink rect. Numerals: 30 px heavy sans in ink. Claims: 17 px bold sans in ink, wrapped to the width. Glosses: 13.5 px muted sans. Band: an ink rect the width of the stage, an amber triangle, the label in amber small caps, the text in cream 13.5 px. Step 0: spine, numerals and claims stagger in. Step 1: the glosses stagger in. Step 2: the band.

**Acceptance.** About 60 words at step 0, about 110 added by the glosses, under 50 by the band; every gloss sits inside the stage width; the band never overlaps a row and ends above the takeaway bar; the contrast audit passes on amber small caps and cream text on ink; the five claims are unchanged from the list they replace.

## V27 · `two-programs` — "AI engineering is still a forecast. Engineering with AI is useful now." (added 2026-10-22)

**Argument.** The claim slide, which was a two-column list of the usual question against this hour’s. Now two programs for AI in pathology drawn on the same ten years, with names and dates instead of sentences and no small labels: the presenter says the words. Above, AI engineering (the model does the pathologist’s work): a horizon line from October 2016 through "five years" and "maybe ten", the May 2025 walk-back as a tick ("May 2025, Hinton: wrong on the timing"), a dotted arrow on past now into the shaded years ahead, and the department’s one entry in that program, a square at May 2026, "Paige Prostate · under evaluation since May 2026", with a dashed open span to now. Below, engineering with AI (the systems we already know we need): each system’s name in 20 px with its date beside it; the ones in use drawn as a translucent bar from that date to now (Hedgehog 2023, Dialogue March 2025, the Paige integration from May 2026 after its copper ten-week build), two more as points (IBIS 2026, the counter Aug 2026), and one measured figure, 10–100×, captioned "my output, per working day". At the last click a copper arrow rises from the ten-week build to the Paige square, unlabelled, and the closing line arrives: "The replacement is still a forecast. The systems are in use today." The picture is the contrast: a forecast that keeps moving against bars that reach today. The thesis sentence is the takeaway bar. Chosen over two alternatives by a two-judge panel; the arrow is the graft from the rhetoric-first design; the cue words, strip labels and grid lines of the first version were removed at the presenter’s request ("remove them all … dates were good for me to recall").

**Data contract.** `axis = { start, end, ticks[] = { date, text, anchor } }` · `dream = { label, gloss, horizons[] = { date, text }, note = { date, text }, instance = { date, text, through, link } }` · `record = { label, gloss, items[] = { date, to, through, lead, when, below, anchor }, measured = { from, to, figure, text } }` · `closing` · `source` · `title` · `subtitle` · `hint` · `step`. Dates are `YYYY-MM`; the decade maps to x 372–1090 on the 1280 stage, the years ahead to 1090–1200. `to` draws a copper period (a build) just above the baseline; `through` a slate bar at 35 % from the item’s date (or the end of its build) to now, so overlapping bars darken where more systems are in use; `when` is the date shown beside the name; `below` labels the item under its mark with `anchor` (end for Hedgehog, middle for Dialogue), the others take a row each beneath with a dotted leader, 34 px apart, shrinking past three rows; `instance.link` true draws the arrow from the build period to the instance square (a string would also label it; the slide passes true).

**Encoding.** Programs: 15 px small caps (amber for the dream, slate for the record, through `textInk`) and a 17 px serif gloss in a 250 px column at the left. The decade: three 13.5 px small-caps ticks with a short tick mark each, a dashed ink line at now, the fine wash beyond; no grid lines. The dream: 2.4 px amber line, solid to the first horizon and dashed to the second, hollow 7.5 px circles, 15 px haloed small caps for the horizon words, a dotted arrow to the stage edge, a 15.5 px italic note, a 16 px square with 17 px bold text and a dashed 2.4 px span to a hollow end at now. The record: 7.5 px slate dots, a 10 px copper period, 8 px bars, 20 px bold names with the date in 16 px muted, the measured bracket in ink with a 30 px figure and a 15 px caption, both 8 px clear of the now line. The arrow: 1.8 px copper with the library’s marker. Closing: 21 px bold serif, one line, at y 640; the source at y 668. Step 0: the frame (programs, glosses, decade). Step 1: the dream. Step 2: the record and the figure. Step 3: the arrow and the closing.

**Acceptance.** About 45 words at step 0 (the source line aside), under 20 added by the dream, about 20 by the record, under 15 by the closing, about 90 in all; no text under 13.5 px except the 10 px source line; every text node inside the stage and the source line inside the 1200 margin; no label touches another or the now line; the measured caption clears the closing line; the period never hides a point; static analysis registers the viz with a 15–30 px hierarchy, AA on cream and a staggered reveal; every date on the slide is one `REFERENCES.md` carries (IBIS and Hedgehog show a year only because no month is documented); the 10–100× is captioned as the presenter’s own.

## V28 · `memory-trail` — "The useful visions said what must be built." (added 2026-10-22; arc form the same morning)

**Argument.** The opening, from the presenter's cue cards, as an arc diagram: nine anchors from 1928 to 2021 on one line, in order but not to scale, and thin arcs above the line for the connections between them, so the form is Bush's own idea, a trail of connections rather than a list of dates. The arcs: publish or perish to the Memex ("from publishing to use"); the Memex to the Web ("the hypertext lineage", a lineage, not a chain); Licklider to ARPANET ("ideas need institutions"); Licklider to AI engineering ("human-centred"); Sculley to AI engineering ("model vs system"); CAMELYON16 to AI engineering ("task vs service"). Below the line each anchor's name and a few words, in two rows with a dotted leader for the lower row, so nine fit without touching. Built in thirds; an arc arrives with the later of its two anchors; the last third, its arcs and its labels in copper because the talk begins there; then the closing line, "Two roles for AI: inside the system, and helping us build the system." The takeaway bar is the opening argument in one sentence. The arc-diagram form follows the D3 and Observable canon (the classic arc diagram, with the nodes on a baseline and the links as half-ellipses above it); the first version of the slide, an alternating timeline with no arcs, was replaced at the presenter's request for something "as elegant as possible, and not ordinary".

**Data contract.** `anchors[] = { year, name, point }` · `links[] = { from, to, label }` (indices into anchors) · `closing` · `source` · `title` · `subtitle` · `hint` · `step`. The line runs x 100–1180 at y 340; anchors at equal intervals from 150 to 1130; the even anchors' blocks start 52 px under the line, the odd ones 172 px under with a leader from 32 px; an arc's height is 42 % of its span, at least 44 and at most 168 px; the thirds are `ceil(n / 3)` anchors each.

**Encoding.** The line in the rule colour, 1.4 px, with 5 px tick marks; 12.5 px haloed small caps for every year under the line at step 0; 7 px dots, slate for the first two thirds and copper for the last; arcs 1 px ink at 50 % for the first two thirds, 1.5 px copper at 90 % for the last, each labelled in 11 px haloed small caps at its apex; 16 px bold sans for the name, wrapped to 164 px; 14 px italic serif in muted ink for the point; the closing in 21 px bold serif at y 640; the source at y 670. Step 0: the line and the years. Steps 1–3: a third each, with the arcs that end in it. Step 3 also brings the closing.

**Acceptance.** About 65 words at step 0 (title, subtitle, years and the source line), about 30 per third, under 15 by the closing; no text node outside the stage; no block touches a neighbour, the line or a leader; no arc label touches another or an arc; the arcs stay under the title rule; static analysis registers the viz with a 11–24 px hierarchy, AA on cream and a staggered reveal; every date on the slide traces to OPN-1 to OPN-9 in `REFERENCES.md`, and every arc to a sentence on the cue cards.

## The objectives on the board (2026-10-22)

`objectives` now renders with `takeaways-board` (V26) instead of the wave: five verb-led claims with glosses and a band, two clicks, so the outline at the start and the contributions at the end share one shape. The data contract is V26's; the band's label is "In the order of the hour".

## Type-size options (added 2026-10-21, for the two densest slides)

- `feasibility-map` (`why-not-routine`): `leadSize` (default 14), `textSize` (12.5), `captionSize` (13). The body line height follows the text size. The slide now sets 16 / 15 / 14.5 with one-line bodies; it had twelve two- and three-line bodies at 12.5px.
- `evidence-ladder` (`claims-ladder`): `evidenceSize` (default 12). The slide sets 14, with each rung's evidence cut to one sentence per system.
- Builds as fragments (`infraBuild`, see `docs/ENGINE.md`): no spec change for any figure, but every `apply(step)` is now also called going backward and must restore the earlier step. Verified by walking the deck forward and back with the arrow keys and comparing first frames: fourteen of sixteen build slides restore pixel-for-pixel; `dialogue-eras` needed a transition interrupt; `case-coherence` differs by one line wrap because the first render measures text during the slide transition, a pre-existing artifact.
