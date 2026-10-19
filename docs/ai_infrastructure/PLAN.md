# Lecture Plan — *Modern AI & Transformation of Clinical, Operational & Research Infrastructure in Pathology*

**Format:** JSON-driven interactive lecture on the existing engine, route `/lecture/ai_infrastructure` (`data/lectures/ai_infrastructure.json`).
**Audience / slot:** Pathology grand rounds, Thursday 22 October 2026, noon; about 58 min. 36 slides, 3 of them optional; one live demo (IBIS) with a simulated fallback built into the slide; one poll.
**Presenter:** Peter Gershkovich, MD, MHA — Yale University School of Medicine.
**Companion files:** `REFERENCES.md` (verified registry), `VIZ_SPECS.md` (16 new visualizations + 5 reused).

---

## 1. What this talk is about — and what it is not

Every previous deck in this repository argued a version of *Build as You Speak*: the cost of building fell, so the domain expert can own the arc. The DoM grand rounds made that case for research infrastructure; the AI-OS talk made it for the field's epistemics; the residents' decks made it for a counter and a dashboard.

This talk makes the **clinical** case, and it changes the protagonist. It is not about what computers can now do for pathologists. It is about **what pathologists can now make their systems do** — the shift from pathologists as users of information systems to pathologists as active designers of how pathology works.

The organizing observation: **recognizing what should happen is not the same as having infrastructure that makes it happen.** Three questions a pathologist asks in an ordinary week —

> "Why can't the system check whether these documents describe the same clinical story?"
> "Why can't we make the specimen-handling process work the way we know it should?"
> "Why can't I turn this clinical question into a reproducible search of our own experience?"

— are three manifestations of the same distance. The talk is about how that distance has been closing in one department, with three working systems (Dialogue, Hedgehog, IBIS), and about the intellectual tension that follows: **when implementation becomes easier, defining the right behavior becomes more important.** What counts as a discrepancy? What constitutes a case? When should a system ask rather than proceed? Those are pathology questions.

The **sentence the room should leave with:** *Modern AI is changing not only what computers can do for pathologists, but what pathologists can make their systems do.*

The **closing challenge:** *Think of one recurring problem in your clinical, operational, or research work that you have accepted because changing the software seemed harder than living with the problem. Can you describe what the system should do, what it must never do, and what evidence would convince you that it works?*

## 2. Why the manual differential counter belongs in a grand-rounds talk about infrastructure

WBC ΔΣ (the "MDC", `tessera`) is the smallest clinical application in the portfolio and carries the largest quality system — 71 user requirements, 207 system requirements, 56 hazards, 1,172 tests across three layers and three browsers, 100% bidirectional traceability (REFERENCES WBC-2). In the residents' lecture it was the proof that AI-built software can be defensible. Here it plays a different and more interesting role: **it answers the objection the first three systems provoke.** *You can build this quickly. How do you know it behaves correctly?*

The counter's own public record is the most honest answer available anywhere: at its v2.0 baseline it reported 379 passing tests at a 100% pass rate, **none of which executed the application**, and fourteen real defects sat behind the green build (WBC-3). Its append-only drift log then recorded 52 incidents in which the repository asserted something that had stopped being true — an SOP that told operators to press A for blasts when the shipped layout had A as monocytes — and 42 of those classes are now prevented by checks that fail the build (WBC-5). The remedy was not a better model. It was converting the quality system from prose into code.

That is the one revealing failure the talk needs, and it generalizes to Dialogue, Hedgehog and IBIS: **faster construction makes explicit requirements, expert review and good tests more valuable, not less** — and a quality system only protects anyone when it is executable.

## 3. Learning objectives (`learning-objectives-config`)

Written from the attendee's seat (rewritten 2026-10-19): what a pathologist in the room will be able to do afterwards, in the order the hour takes them. None of the five is a software skill; the fifth is the assignment.

1. **Recognize** a wrong record under a correct diagnosis — side, plausibility, completeness, a pasted sentence — and say which differences matter, which is a pathology question (the cold open; the questions-for-pathologists slide).
2. **Name** the workaround in their own week that exists only because changing the software seemed harder than living with the problem, and say why that is no longer true (three questions; the distance and what closed it).
3. **Distinguish** a model that proposes inside an application (evaluate it; the pathologist decides) from a model that helps build an application that then runs without it (two kinds of AI; Dialogue against Hedgehog).
4. **Ask** which of five claims a system is making — it runs, its tests pass, it meets its requirements, it changed practice, patients did better — and what would prove each, whoever built it (the objection, the green build, the claims ladder).
5. **Write** one page for one recurring problem: what the system should do, what it must never do, what evidence would convince them — the one part of the work nobody can do for them (where knowledge enters; clinically led; the closing exercise).

The earlier set (distinguish · translate · read · separate · write) was the builder's list: translating a problem into a requirement and a test, and separating a schema-valid record from a passing test, are things the room will not do, and "read an infrastructure result honestly" is a caveat, not a skill. Those points stay in the talk as guardrails on the slides that carry them.

## 4. Design principles carried over from the earlier decks

- **Start with a case, not an architecture diagram.** Slide 3 is three synthetic documents and a question to the room. The architecture arrives on slide 9, after the audience has a reason to care.
- **The medium demonstrates the argument.** Cream Tufte palette, serif display, config-driven visualizations, every number in `vizConfig` with a source id; an optional provenance slide.
- **Clinical humility, intellectual provocation.** Dialogue is a pilot with a documented catch, not a validated device; FSQA is infrastructure evidence, not AI evidence; the counter's failure is shown before its success; the top rung of the claims ladder is empty.
- **One revealing failure beats another flawless demo.** The green build, the drift log, and the IBIS refinement that changes the answer.
- **Takeaway + comment for the room; speakerNotes for the presenter.** The comment is visible to the audience on hover, so it extends the takeaway — a source, a sharper statement of what the slide is about, the answer to the obvious objection — and never carries stage directions. Every content slide has both.
- **Eleven styled badges only.**

## 5. Narrative arc and slide-by-slide plan

Cumulative times for a 48-minute delivery.

| # | t | id | type / vizType | badge | Purpose · key line |
|---|---|---|---|---|---|
| 1 | 0:00 | `title` | title | — | Subtitle: "From pathologists as users of information systems to pathologists as designers of how pathology works." |
| 2 | 0:30 | `coi` | content | — | Auto-filled from the presenter profile. |
| 2a | 1:00 | `the-prediction` | viz **V16** `prophecy-vs-context` | evidence | The opening (added 2026-10-17 from the claude.ai "Grand round lecture" project). Hinton, Toronto, October 2016, with the hedge on the slide: five years, "it might be ten years"; carried into pathology by Mukherjee's New Yorker essay. A timeline whose ten-year mark is this month. Click: ten years later — 1,239 diagnostic radiology positions in the 2026 Match, 636 pathology positions, Mayo 260 → 400+, Hinton's May 2025 revision. Click: what actually sends a report back — the Q-Probes split, 14.6% misinterpretation against 85.4% identification, specimen and report defects — and the thesis: the prediction aimed at judgment and missed context. |
| 2b | — | `prediction-cost` | infographic (optional) | evidence | Three student surveys (Canada 2018, UK 2019, US 2020): one in six, 49%, one in six; and Hinton's 2025 revision. "The prediction had a measurable cost years before it had a measurable benefit." Cut first. |
| 3 | 4:00 | `cold-open-case` | viz **V1** `case-coherence` | interactive | Three synthetic cases, three documents each, "What does not agree?" asked before anything is marked. Breast core: a laterality error (side). Prostate biopsy: every document agrees the patient is 30 and the diagnosis is Grade Group 2, so nothing disagrees and only domain knowledge says verify the identity (plausibility). Colon: Part B received but never reported, plus a pasted sentence about mammographic findings (completeness, remnant). Each case carries a wording-only decoy in amber. Four clicks per case: marked · flag · decision · lesson; a closing line ties the three together. |
| 3a | 5:00 | `not-hypothetical` | viz **V13** `harm-record` | evidence | Six documented cases (2007–2026) in which the record, not the histology, was wrong: Long Island, St. Louis Park, Boston, New Haven, Georgia, Ohio — what was confused, what happened, what caught it. The scale strip: 127 wrong-surgery events in 2024; 4.3 per 1,000 specimens; 0.26% / 0.67% of prostate biopsies; 182 of 253 VA events. |
| 3b | 7:30 | `swiss-cheese` | viz **V14** `swiss-cheese` | framework | Reason's model drawn for a pathology case: seven layers with holes, one trajectory. Click: a layer that reads across documents is inserted before release, with holes of its own. |
| 4 | 9:00 | `reframe` | two-column | framework | The usual question vs. today's question. Thesis line as takeaway. |
| 5 | 5:30 | `objectives` | viz `learning-objectives-config` | framework | §3. |
| 6 | 6:30 | `three-questions` | interactive-list | framework | The three "why can't" questions, each with a hover detail naming the compensation pathologists make today. Takeaway: recognizing ≠ infrastructure. |
| 7 | 8:00 | `intent-to-behavior` | viz **V2** `intent-to-behavior` | framework | Three rows (clinical, operational, research): what you know should happen · the distance · what happens instead. Click: the distance relabels from "a project, a budget line, a vendor queue" to "a specification, a conversation, a test", and the compensation becomes the built system. |
| 8 | 10:30 | `dialogue-scrutiny-layer` | viz **V4** `scrutiny-layer` | ai | Dialogue as a layer inserted between draft and release: what it reads, what it flags (now including plausibility for age, sex and history, and completeness), the pathologist's decision, the feedback loop. "We are not replacing anyone or anything." Friedman's theorem as marginalia. |
| 8a | 12:30 | `why-not-routine` | viz **V15** `feasibility-map` | ai | "The capability is not the hard part." Gertz 2024 for the reading claim; then six reasons a coherence check is not routine (five systems, free text, the perimeter, noise, timing, accountability) and what Dialogue does about each. |
| 9 | 15:00 | `why-amendments` | infographic (light) | evidence | Parkash 2014: 60 amended reports; 7 ordering/treating discrepancies, all malignant; 1 of 7 in the treating chart. Yale news 2025: the laterality catch; ~9 months concept → usable; feedback and rating built in. |
| 10 | 14:30 | `questions-for-pathologists` | two-column | debate | What the system can do vs. what only the pathologist can decide (which contradictions matter; whether the diagnosis is plausible for this patient, and if not whether the error is in the diagnosis or the identity; what was available to the system; what to see before accepting a flag; when to ask rather than proceed). |
| 11 | 16:30 | `operational-turn` | viz **V5** `custody-translation` | workflow | The first turn: AI need not make a clinical decision to change care. The custody handoff as a state machine (the spreadsheet gap vs. the acknowledged handoff) and the translation: problem → requirement → behavior → test. Labelled illustrative. |
| 12 | 19:30 | `fsqa-results` | viz **V6** `fsqa-before-after` | evidence | Gibson 2025: 70 → 8 days; 35% → 75%; 3.2% → 2.2% not significant. "Infrastructure and workflow results — not evidence of an AI effect." |
| 13 | 22:00 | `exchange-vs-coordinate` | viz **V7** `exchange-vs-coordinate` | ecosystem | Behavioral interoperability as a practical question: exchange a message vs. coordinate the next step. FSLink, POinT, Hedgehog, RTSE. |
| 14 | 24:00 | `two-kinds-of-ai` | viz **V3** `two-kinds-of-ai` | ai | Placed after both examples have been seen. The one clean distinction: AI inside the application (Dialogue proposes, a pathologist decides) vs. AI helping construct it (Hedgehog, no model in the loop at runtime). "Some of the most valuable systems AI helps us build should behave predictably, without an AI model making their routine decisions." |
| 15 | 26:30 | `poll` | poll | interactive | "Which recurring problem have you accepted because changing the software seemed harder than living with it?" |
| 16 | 28:00 | `ibis-live` | viz **V8** `ibis-interpretation` | interactive | **Live demo.** The inspectable intermediate: question → interpretation → entities → generated query → confidence → approve. Then change one criterion and watch the query change. The three questions the demo should expose sit in the figure's margin. The slide is itself the fallback. |
| 17 | 32:30 | `what-it-means-for-research` | content | debate | For research faculty: the observation survives; the question shapes the data; the unit (patients, specimens, reports) is yours to decide; the query is a reproducible artifact for the methods section; the safety pathway is the same one. |
| 18 | opt | `ibis-architecture` | viz `ibis-flow` (`hideHeader`) | evidence | Optional: the safety pathway (synthetic data, never PHI) for audiences who have not seen it. |
| 19 | 33:30 | `the-objection` | infographic (light) | evidence | "You can build this quickly. How do you know it behaves correctly?" WBC ΔΣ: keyboard-first, browser-only, 71 URS · 207 SRS · 56 hazards · 1,172 tests · 100% traceability. The smallest app with the largest quality system. |
| 20 | 35:30 | `green-build` | viz **V9** `green-build` | evidence | 379 passing, 100%, 0 executing the application, 14 defects behind the build. Then the rebuilt suite: three layers, three browsers, two rules. |
| 21 | 38:00 | `drift-log` | viz **V10** `drift-log` | technical | Locally correct, globally false: 52 incidents, 42 prevented. The A-key incident. Taxonomy and the four mechanisms of an executable QMS. |
| 22 | 40:00 | `xenonym-stress` | viz `xenonym-browser` | interactive | Synthetic test cases that include the records that break pipelines. Schema-valid ≠ clinically valid ≠ private. |
| 23 | 41:30 | `claims-ladder` | viz `evidence-ladder` (reused, new config) | evidence | Schema-valid record → passing test → verified requirement → validated in use → improved outcome (empty). Each of the four systems placed honestly. |
| 24 | 43:00 | `where-knowledge-enters` | content (numbered) | framework | One requirement from each system — the sentence only a pathologist could have written. |
| 25 | 44:30 | `clinically-led` | viz **V11** `clinically-led` | framework | Neither "everyone becomes a programmer" nor "we no longer need engineering". Who contributes what. |
| 26 | 46:00 | `safety-boundary` | comparison (good/bad) | debate | AI does / AI must not — adapted to the four systems. |
| 27 | 47:00 | `your-problem` | viz **V12** `intent-spec` | interactive | The closing exercise as a one-page form: should · must never · evidence — blank, then a worked custody example. |
| 28 | opt | `how-this-deck-was-made` | viz `lecture-provenance` | meta | Optional: this deck's own trail. |
| 29 | 48:00 | `takeaways` | takeaways | — | §6. |
| 30 | 49:00 | `sources` | content (scrolling bibliography) | — | REFERENCES.md, YES/PARTIAL only. |
| 31 | 49:30 | `qa` | qa (QR) | — | The closing challenge as the opening question. |

## 6. Takeaways and CTA

1. **Pathologists are becoming designers of how pathology works.** The distance between recognizing what should happen and having infrastructure that makes it happen was never intellectual; it was the cost of implementation, and that cost has collapsed.
2. **Two kinds of AI, kept separate.** AI inside the application proposes and needs task-appropriate evaluation; AI helping construct the application leaves no model in the loop. The most valuable built systems often should behave predictably.
3. **A correct diagnosis is not a coherent clinical record.** Dialogue extends clinical attention over the relationships that make a diagnosis usable; which contradictions matter is a pathology question.
4. **Infrastructure changes practice; say what the evidence is.** Seventy days to eight is a workflow result. AI changes how fast such infrastructure can be built, tested and revised.
5. **Faster construction makes requirements, review and tests more valuable, not less** — and a quality system protects no one until it is executable. A green build that executes nothing is the failure mode AI makes cheap.

CTA: one recurring problem; what the system should do, what it must never do, what evidence would convince you. Bring the page to the people who can build it.

## 7. The live demonstration

| Demo | Slide | Setup | Fallback |
|---|---|---|---|
| IBIS | 16 | Local or VPN instance; one pre-tested natural-language question; one pre-tested refinement that changes one criterion | The slide itself renders the question, interpretation, generated query and refinement from `vizConfig`; switch to it without apologizing |

Run-book in the slide's `speakerNotes`. Queries use illustrative field names; the live instance shows its own schema.

## 8. Guardrails (enforced in the copy)

- Dialogue's laterality catch is an illustrative clinical success, not a performance evaluation; no sensitivity/specificity is implied.
- FSQA numbers are never attributed to AI; the slide says "not evidence of an AI effect" on its face; the non-significant discrepancy-rate change is drawn as non-significant.
- The Hedgehog requirement/behavior/test triplet is labelled an illustrative formulation.
- The counter's failure is shown before its success; 379 is cited to DCR-004, and the TR-001 discrepancy (191) is recorded in REFERENCES.
- Xenonym is not claimed to generate mutually inconsistent record sets.
- The top rung of the claims ladder stays empty.
- Lincoln & Korpman are paraphrased, not quoted.
- The operating-model slide rejects both "everyone codes" and "no engineering needed".
- No PHI anywhere: the cold-open case is synthetic and says so on the slide.

## 9. Visualization strategy, relative to the earlier decks

What is reused verbatim, what is reused with new content, and what is new — with the reason.

| Need | Choice | Why this, given what the audience may have seen |
|---|---|---|
| Open on clinical stakes | **New V1 `case-coherence`** | No earlier deck opened on a case. Three short cases, each with three document panels and a click-to-reveal sequence, turn the room into the checker before the system is introduced. The three were chosen to be different kinds of disagreement: a side error anyone catches, a consistent-but-implausible age that only domain knowledge catches, and an unreported part plus a pasted sentence. Each carries a wording-only decoy so "which contradictions matter" is asked three times. |
| The thesis | **New V2 `intent-to-behavior`** | The AI-OS deck's `boundary-collapse` ring and the DoM deck's `feedback-loop` already showed cost collapse abstractly. This one is concrete: three rows, three real systems, the distance relabelled on click. |
| The key distinction | **New V3 `two-kinds-of-ai`** | The orchestration deck's `orch-ai-as-participant` showed AI on vs. off the bus. This is the simpler cut the paste asked for: model inside the running app vs. model in the build pipeline. |
| Dialogue | **New V4 `scrutiny-layer`** | A layer inserted into a rail the audience already knows (draft → release). Deliberately not a system diagram. |
| Hedgehog | **New V5 `custody-translation`** | The state-machine idiom from the WSI decks (`case-fsm`, `orch-pattern`) applied to a handoff, plus the four-card translation. |
| FSQA | **New V6 `fsqa-before-after`** | Slope pairs in the house style, with the non-significant result drawn honestly. Replaces the TAT dashboard as the "real numbers from our own lab" moment. |
| Behavioral interoperability | **New V7 `exchange-vs-coordinate`** | A practical question, not standards vocabulary; `orch-orchestration-layer` is the ancestor. |
| IBIS | **New V8 `ibis-interpretation`** + optional `ibis-flow` | `ibis-flow` (three decks) shows architecture. The new one shows the inspectable intermediate and a refinement — the climax the paste asked for. |
| The revealing failure | **New V9 `green-build`** | A wall of 379 green squares that executed nothing is the most memorable picture in the talk. |
| Drift | **New V10 `drift-log`** | Ticks for incidents, a taxonomy, four mechanisms — the `artifact-functions` density idiom. |
| Synthetic data | Reused `xenonym-browser` | Already the fallback for the live site; new framing in the takeaway. |
| The claims | Reused `evidence-ladder` with new rungs | Same shape as the AI-OS evidence ladder, so returning audiences recognize it; the content is about built software rather than published models. |
| Operating model | **New V11 `clinically-led`** | `applied-informatics` and `team-vs-service-center` argued the team; this argues the division of labor between pathologist and team. |
| Closing exercise | **New V12 `intent-spec`** | The one-page spec from `build_as_you_speak`, rendered as a form the audience fills in their heads. |
| Objectives, provenance | Reused `learning-objectives-config`, `lecture-provenance` | Config-driven; no new code. |

## 10. Glossary (`meta.glossary`)

Dialogue · Hedgehog · IBIS · Xenonym · WBC ΔΣ · FSLink · POinT · RTSE · REALM · LIS · EHR · HL7 · requisition · operative note · laterality · amended report · discrepancy · frozen section · FSQA · hard stop · specimen custody · manifest · handoff · acknowledgement · orchestration · behavioral interoperability · state machine · deterministic kernel · large language model · agentic coding · user requirement (URS) · system requirement (SRS) · FMEA · traceability matrix · IEC 62304 · design history file · verification · validation · revert-check · drift · executable QMS · closure sweep · synthetic data · stress mode · schema · Lucene · natural-language search · cohort · confirmation dialog · applied informatics team · functionality gap · PHI · Wilson interval · intended use.

## 11. Timing budget

With the three slides added on 2026-10-16 (documented harm, Swiss cheese, why it is not routine) and the prediction opening added on 2026-10-17, the deck runs about 58 minutes: prediction, cases, stakes and thesis 0–17 · clinical 17–25 · operational 25–34 · research 34–40 · verification 40–51 · model and close 51–58. First cuts if running long: the optional cost-of-the-prediction slide stays hidden, then the exchange-vs-coordinate slide, then the poll; the other two optional slides stay hidden. The talk is Thursday 22 October 2026 at noon.

## 12. Open questions for the presenter

1. The cold-open case is synthetic. If you would rather use a de-identified real case, replace the three `documents[]` arrays in `vizConfig` and remove the SYNTHETIC banner — nothing else changes.
2. IBIS instance for the room: confirm VPN or local; the slide works without it.
3. The Hedgehog requirement sentence is illustrative. If Hedgehog has an actual acknowledgement rule or alert threshold, substitute it and drop the "illustrative" label.
4. Slide 24 quotes one requirement per system; the Dialogue one ("ignore wording differences that do not change the diagnosis") is from the news article's description, not from a written URS. Replace with the real one if it exists.
