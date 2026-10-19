# Modern AI & Transformation of Clinical, Operational & Research Infrastructure in Pathology — lecture workspace

Planning package and build notes for the grand-rounds lecture at `/lecture/ai_infrastructure`
(`pathology-node-presentation/data/lectures/ai_infrastructure.json`, 36 slides, 3 optional). Produced 2026-10-15; opening rebuilt 2026-10-17. The talk is Thursday 22 October 2026 at noon.

| File | What it is | Who reads it |
|---|---|---|
| `PLAN.md` | Thesis, what to talk about and why, 36-slide narrative with types / vizTypes / badges, the live demo and its fallback, guardrails, the visualization strategy relative to the earlier decks, glossary, timing, open questions | Presenter |
| `VIZ_SPECS.md` | One spec per visualization: argument, data contract, encoding, steps, acceptance | Anyone editing the vizzes |
| `REFERENCES.md` | Verified reference registry (YES / PARTIAL / PARAPHRASE / DO NOT CITE), with what each source establishes and what it does not | Everyone |
| `research/OPENING_NOTES.md` | Working notes carried over from the presenter's claude.ai project — what it concluded about the opening and what survived verification. Kept locally; `docs/*/research/` is not committed | Presenter |

## What the talk argues, in one paragraph

It opens on a prediction: Hinton, Toronto, October 2016 — five years, "it might be ten years" — whose ten-year mark is the month of the talk, and on the published split of amended reports, which shows that the prediction aimed at judgment and missed context. Then: not "can a computer recognize what we recognize on a slide?" but "what happens when we can translate our knowledge of how pathology should work into systems that actually work that way?" Three working systems carry it — Dialogue (does this case make sense?), Hedgehog with the frozen-section QA program (why are we still compensating for this workflow?), IBIS (can I interrogate our collective experience?) — and the manual differential counter (WBC ΔΣ, the "MDC") answers the objection they provoke: *you can build this quickly; how do you know it behaves correctly?* Its own public record — 379 passing tests that executed nothing, 52 drift incidents, a quality system that only worked once it became code — is the one revealing failure the talk needs. The closing exercise returns the problem to the room on one page: what should the system do, what must it never do, what evidence would convince you.

## Build notes — what shipped, and where it departs from the plan

Sixteen new config-driven visualizations were added to `js/viz-library.js` (`case-coherence`, `intent-to-behavior`, `two-kinds-of-ai`, `scrutiny-layer`, `custody-translation`, `fsqa-before-after`, `exchange-vs-coordinate`, `ibis-interpretation`, `green-build`, `drift-log`, `clinically-led`, `intent-spec`, `harm-record`, `swiss-cheese`, `feasibility-map`, `prophecy-vs-context`), plus a shared click-to-advance stepper. Five existing visualizations are reused with new content (`learning-objectives-config`, `ibis-flow`, `xenonym-browser`, `evidence-ladder`, `lecture-provenance`).

| Plan said | What shipped | Why |
|---|---|---|
| Poll slide id `poll-accepted-problem` | `poll` | The vote URL under the QR code is built from the slide id; the short id keeps it readable on a phone. |
| Links to the IBIS and Xenonym GitHub repositories | Links to the organization page, with "(repository not yet public)" | Both repositories return 404 to unauthenticated visitors on 2026-10-15. The live Xenonym site and the public `tessera` repository are linked directly. |
| Content slides with per-bullet reveal | `fragments: false` on the two numbered/bulleted content slides | A screenshot of a fragment slide is blank until the first keypress; the earlier grand-rounds decks also render content slides in full. |
| Green-build baseline "379 tests" | Kept, cited to DCR-004 | TR-001's comparison table records 191 at the same baseline; REFERENCES notes the discrepancy. The slide's claim — zero of them executed the application — holds either way. |
| One cold-open case with a laterality error | Three cases: side, plausibility (every document says 30, the diagnosis is Grade Group 2), completeness plus a pasted sentence; each with a wording-only decoy | A pathologist spots left/right in five seconds and learns nothing about where a check needs their knowledge. The consistent-but-implausible case is the one that teaches it. |
| "Two kinds of AI" as slide 8, before Dialogue and Hedgehog are introduced | Moved to the end of the operational act, after both examples | It argued from examples the audience had not yet seen. |
| A post-demo slide repeating the three questions already on the IBIS figure | "What this means for research" | Redundancy replaced with the research-faculty argument: the observation survives, the unit is yours, the query is a reproducible artifact. |
| No real-world stakes between the cold open and the thesis | Two slides added (2026-10-16): six documented cases of harm from a wrong record with the scale from the literature, and Reason's Swiss cheese drawn for a pathology case | The synthetic cases needed to be shown as realistic; the Swiss cheese explains why nobody notices, and why the inserted layer has holes too. |
| The cold-open case as the first content slide | `the-prediction` first (2026-10-17), the cases second; an optional `prediction-cost` slide between them | The presenter's claude.ai project settled the opening: Hinton's 2016 prediction with the hedge, the ten-year mark landing this month, what the field looks like at that mark, and the Q-Probes amendment split — 14.6% misinterpretation against 85.4% identification, specimen and report defects. The thesis "the prediction aimed at judgment and missed context" now precedes the cases that show what context failures look like. The cost slide carries the three student surveys and is the first cut. |
| Takeaway comments written as presenter notes ("say it once here", "do not let the room hear", "if asked", source and build notes) | All 29 comments rewritten for the audience (2026-10-18): each extends the takeaway with the source, the mechanism or the answer to the obvious objection; the stage directions and verification caveats moved into `speakerNotes` | The presenter's review: the comment is visible to the viewers on hover, so it "should extend the point, not state my goals". |
| Learning objectives written as the builder's list (distinguish · translate · read · separate · write) | Rewritten from the attendee's seat (2026-10-19): recognize · name · distinguish · ask · write, in the order the hour takes them; the shared visualization now wraps before it places the wave, so a five-line statement no longer runs into the title rule, and takes `margin`/`textWidth` | The presenter's review: "What do the attendees will really learn?" Translating a problem into a requirement and a test, or separating a schema-valid record from a passing test, is not something a pathologist in the room will do. |
| Case headings on the cold open as labels only | The three headings are controls (2026-10-19): a click brings that case up at its first step, without walking through the others, and the stage click continues from there | The presenter's request: reach any case directly during the discussion, "not by slide progression on click but by special click on the link". |
| Swiss cheese drawn as outlines with identical holes and the line below the hole centres | Slabs with depth, two stray holes placed differently on every slab, the aligned hole on the line with the line passing through its centre and visible only through holes and gaps; the layers slide apart on click to let the check in (2026-10-17) | The presenter's review: "make all holes in different places except the one that goes through … the line should go through the middle of the hole … it needs some improvement." |
| Dialogue presented only as "what it does" | A third slide added after it: why a coherence check is not routine (five systems, free text, the perimeter, noise, timing, accountability) and what Dialogue does about each | Answers the engineer's objection "if a model can read, why has nobody done this?" with Gertz 2024 for the reading claim and six design decisions for the rest. |

Engine and test changes made along the way (they affect every lecture):

- `css/intro.css`: the reference-link rule (`.reveal .intro-slide a { font-size: 0.85em }`) outranked `.poll-qr-url`, so the vote URL under every poll's QR code rendered at about 40 px and spilled out of the slide. A more specific rule keeps it at the widget's 11 px.
- `docs/ENGINE.md`: lecture and vizType counts updated; the stepper convention documented.
- `js/slide-engine.js`: the interactive-list hover tooltip flipped to the left of a row when it did not fit on the right, which put it off-slide for any question that spans the width. It now drops below the row (or above it near the bottom).
- Two-column slides reveal their bullets one keypress at a time by default (`fragments` defaults to true). The two in this deck set `fragments: false` so they render in full; delete the key to restore progressive reveal.

## Where the opening came from, and how the two projects connect

The presenter thinks in a claude.ai Project named **Grand round lecture** (web and desktop app). Its chat *Pathology informatics and linguistic interfaces* ends with the discussion that produced slide 3: start with the mundane subject of amendments; the 2016 prediction that aimed at judgment; the missing link (amendments are mostly failures of context); the three places a hostile listener will stand; and the attribution fix (the words are Hinton's, Mukherjee carried them and concluded the opposite). `research/OPENING_NOTES.md` (local; the `research/` folders are not committed) is the durable copy, with the figures that did and did not survive verification.

A claude.ai Project is not on disk, so Claude Code cannot read it directly; it was read through the Chrome extension. The connection runs in two directions: conclusions from the project are written into this folder (`research/OPENING_NOTES.md`, `PLAN.md`, `REFERENCES.md`), and the project can see this repository if the folder is added to a project chat in the desktop app ("+" → Add folder). The second chat, *Local lecture project setup*, was that attempt; it reported port 8000 as the image server, which was not the case at the time of this build — `lecture.html` answered 200 on port 8000 throughout.

## Verification run (2026-10-15)

- `node tests/viz-static-analysis.js ai_infrastructure` — 442 passed, 0 failed, 14 warnings (the warnings are drop-shadow notes on older visualizations plus three "weak hierarchy" notes on vizzes whose text goes through shared helpers); `--all` — all 11 lectures pass.
- `LECTURE=ai_infrastructure PORT=8123 node tests/screenshot-ai-os.js` — 31 slides, no console errors, no overflow on any new visualization; the click-revealed steps of the five interactive slides were captured separately and inspected.
- Every URL in the deck fetched: the Yale news article, the Adv Anat Pathol, JPI, CAP and Anthropic pages, the live Xenonym and WBC ΔΣ sites and the `tessera` repository return 200; the four `doi.org` links for AJCP, JAMIA and Science return 403 to scripted fetches (publisher bot blocks; they resolve in a browser).

## Verification run (2026-10-17, after the opening was added)

- `node tests/viz-static-analysis.js ai_infrastructure` — 471 passed, 0 failed, 17 warnings; `--all` — all 11 lectures pass.
- `node tests/validate-links.js --all-lectures` — the two hard failures it found were a wrong DOI for Dunn & Moga 2010 (now `10.5858/134.2.244`) and PubMed answering scripted fetches with HTTP 203 (the 1998 Q-Probes link now points to Europe PMC); the remaining warnings are publisher bot blocks on `doi.org` and AuntMinnie.
- Step screenshots of `the-prediction` (three steps), `prediction-cost`, `takeaways` and `how-this-deck-was-made` inspected; the provenance card that grew with the longer source-verification note was shortened back.
- `LECTURE=ai_infrastructure PORT=8000 node tests/screenshot-ai-os.js` — 36 slides, no console errors, no overflow on any slide except the scrollable sources list (expected).

## Verification run (2026-10-18, after the Swiss cheese rebuild and the comment rewrite)

- `node tests/viz-static-analysis.js ai_infrastructure` — 471 passed, 0 failed, 17 warnings.
- Every takeaway popover hovered in Playwright at 1440×900: all 29 render inside the slide (five lines at most), no console errors. The seven slides without a takeaway are the title, disclosure, objectives, poll, takeaways, sources and Q&A.
- Swiss cheese: both click states screenshot cleanly; the trajectory runs into the centre of each aligned hole and re-emerges at the slab's trailing edge.
- Cold open, case headings: driven in Playwright — clicking heading 2 brings up the prostate case unmarked, a stage click then marks it, heading 3 switches again, four stage clicks reach the closing summary, and heading 1 brings the breast case back with the hint restored; no console errors.
- `node tests/viz-static-analysis.js --all` — every lecture passes.
- `LECTURE=ai_infrastructure PORT=8000 node tests/screenshot-ai-os.js` — 36 slides, no console errors, no overflow except the scrollable sources list.
- Every URL in the deck fetched with a browser user agent: 32 return 200; the eight that return 403 are publisher DOI pages, Europe PMC and AuntMinnie, which block scripted fetches and open in a browser.
- Publication sweep of everything committed (diffs plus the new files) for internal document names and paths, CV metrics, credentials, e-mail addresses and unpublished counts: nothing left but the categories named in "What the published deck leaves out".

## What the published deck leaves out

The repository is public, so the deck and this folder carry only what public sources establish. Left out on purpose (2026-10-19): the contents of Dialogue's internal design document beyond the statement that the model runs inside the institution's perimeter; project metrics from the presenter's CV (contributors, commits, job counts, outreach volumes); the IBIS repository's field names, which the demo slide replaces with illustrative ones; the counter's unpublished manuscript; and the department's own amendment counts. The presenter's working notes live in `research/`, which git ignores.

## Before the session

1. Decide whether to keep the synthetic cold-open case or substitute a de-identified real one (replace `documents[]` in the first visualization's `vizConfig`; remove the SYNTHETIC banner).
2. Confirm the IBIS instance for the room; the slide is its own fallback.
3. If Hedgehog has a written acknowledgement rule or alert threshold, substitute it on slide 12 and drop the "illustrative formulation" tag.
4. Rehearse the click-reveals (the prediction: two clicks; cold open: four per case; green build: two; the others: one).
5. If the department's amended reports can be split by the Meier taxonomy before Thursday — and before/after Dialogue — put those numbers into `the-prediction.vizConfig.split` in place of the Q-Probes benchmark and say so on the slide; that is the strongest slide in the talk.
6. Decide whether to show the optional `prediction-cost` slide (one minute) or leave it hidden.
7. Decide what to say about how long Dialogue has been running; the public sources date the pilot to 2025.
