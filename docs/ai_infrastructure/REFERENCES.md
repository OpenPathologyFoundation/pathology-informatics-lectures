# Verified Reference Registry

**Lecture:** *Modern AI & Transformation of Clinical, Operational & Research Infrastructure in Pathology*
**Route:** `/lecture/ai_infrastructure` · **Compiled:** 2026-10-15

**Status legend.** `YES` — primary page, database record, or the project's own controlled document fetched and read on 2026-10-15. `PARTIAL` — bibliographic record confirmed but a specific value was taken from a secondary description. `PARAPHRASE` — the idea is attributable but no verbatim sentence could be verified; the deck attributes without quotation marks. `DO NOT CITE` — searched, not found or not verifiable.

Every number the deck renders resolves to an id below. Visualizations receive those numbers through `vizConfig`; nothing numeric is hard-coded in `viz-library.js`.

---

## 1. The clinical anchor — Dialogue

| id | Reference | Status |
|---|---|---|
| **DLG-1** | Corcoran TP. *Yale Pathology develops AI tool that checks records to ensure accuracy.* Yale School of Medicine news, published 23 Oct 2025 (page updated 28 Oct 2025). https://medicine.yale.edu/news-article/yale-pathology-develops-ai-tool-that-checks-records-to-ensure-accuracy/ | YES |
| DLG-2 | Dialogue design document — internal, not published. The deck takes from it only the architectural statement that the model is hosted inside the institution's perimeter on services approved for high-risk data; nothing numeric and no implementation detail is rendered. | internal |
| DLG-3 | Celano J, Gershkovich P. *Dialogue: A Generative AI System for Error Prevention in Pathology.* Envisioning AI at Yale: An Interdisciplinary Symposium, 2025 (abstract; CV entry). Error classes targeted: laterality errors, mislabeling, copy/paste mistakes, inconsistent specimen descriptions. | PARTIAL (abstract as listed in the CV) |
| **AMD-1** | Parkash V, Domfeh A, Cohen P, Fischbach N, Pronovost M, Haines GK, Gershkovich P. *Are amended surgical pathology reports getting to the correct responsible care provider?* Am J Clin Pathol 2014;142(1):58–63. doi:10.1309/AJCPY55EVINJCLGX · PMID 24926086 | YES |
| H-6 | Friedman CP. *A "fundamental theorem" of biomedical informatics.* JAMIA 2009;16(2):169–170. doi:10.1197/jamia.M3092 — "A person working in partnership with an information resource is 'better' than that same person unassisted." (verified in `docs/ai_operating_system/REFERENCES.md`) | YES |

**What DLG-1 establishes (verbatim facts).** Concept by Peter Gershkovich and Joanna Gibson; built by Joe Celano. It compares the pathologist's report against the patient's record before the report is finalized — the requisition against the operative notes, and the operative notes against the final diagnosis. It flags mismatches such as laterality and site, and ignores minor issues that do not affect the diagnosis. Uma Krishnamurti reported a breast-biopsy laterality error caught before release that would otherwise have required an amendment. The pathologist clicks an icon to run the check; the tool is in a pilot at Yale Pathology; users rate it and leave feedback; automatic checks are planned. About three months to create, about six months more to make usable. Quotes: Gershkovich — "We are not replacing anyone or anything"; Gibson — "There's so much data that unless you know what you are looking for, you may miss something"; Krishnamurti — "I use the AI tool diligently and it's reassuring when it says no errors."

**What AMD-1 establishes.** Of 60 amended reports tracked, 7 had discrepancies between the ordering and treating physician, all involving malignant diagnoses; the amended report was in the treating physician's chart in only one of those seven; no harm was documented; the two EHRs reviewed had no function to alert clinical teams to an amendment.

**Not established, and the deck says so.** No case counts, discrepancy counts, sensitivity, specificity or amendment-rate effect for Dialogue have been published. The deck presents the laterality catch as an illustrative clinical success, not as performance evaluation.

## 2. The operational anchor — specimen custody and frozen-section QA

| id | Reference | Status |
|---|---|---|
| **FSQA-1** | Gibson JA, Mutnick N, Gershkovich P, Sinard J. *Software solution for integration of frozen section quality assurance into daily practice.* Am J Clin Pathol 2025;163(5):794–802. doi:10.1093/ajcp/aqae188 · PMID 39838842. Published online 22 Jan 2025. https://academic.oup.com/ajcp/article/163/5/794/7966753 | YES |
| **HH-1** | Gershkovich P. Curriculum vitae, November 2025, *Major Software Projects*: Hedgehog (2023–2025) — "developed in response to the pressing issue of specimen loss. Traditional ad-hoc, Excel-based systems had failed twice, lacking the rigidity needed to enforce a consistent workflow and creating gaps in specimen custody. Hedgehog was designed to eliminate these gaps, leveraging large language models to revolutionize code development … articulate their goals and rapidly transform them into formatted software specifications, providing architectural critiques, generating robust frameworks within hours, and challenging developers to refine cybersecurity and architectural soundness." | YES (CV) |
| HH-3 | Gershkovich P, Celano J. *Beyond AI-Coding: Security, Speed, and the Future of Clinical-Grade Software.* Envisioning AI at Yale, 2025 (CV). Hedgehog pipeline as presented: LLMs in CI/CD for code generation, security scanning and hybrid human + LLM review. | PARTIAL |
| **CV-SYS** | CV, *Major Software Projects*: FSLink (2012–) bidirectional OR ↔ frozen-section communication; Pathology Orders in Transit, POinT (2018–) tracks specimens from biopsy/resection to lab arrival; Repetitive Task Scheduling Engine, RTSE (2007–); Histology Asset Tracking (2006–); Pathology Portal (2011–); RELAY (2005–) outreach. System names and dates only; no volumes or job counts are rendered. | YES (CV) |
| R-1 | Gershkovich P, Sinard JH. *Customizing laboratory information systems: closing the functionality gap.* Adv Anat Pathol 2015;22(5):323–330. doi:10.1097/PAP.0000000000000088 · PMID 26262515 | YES |
| R-6 | Sinard JH, Gershkovich P. *Custom software development for use in a clinical laboratory.* J Pathol Inform 2012;3:44. doi:10.4103/2153-3539.104906 · PMID 23372985 | YES |
| R-2 | McQuade JM, Murray RM (co-chairs). *Software Is Never Done.* Defense Innovation Board, 2019. `/assets/software-is-never-done.pdf` | YES (in repo) |

**What FSQA-1 establishes (from the article page, 2026-10-15).** New workflow live October 2022; 9 months before vs 8 months after; post-implementation 2,960 frozen sections in 1,805 cases using 4,390 blocks. Mean time from frozen section to QA scoring fell from about 70 days to about 8 days (P = 8.26 × 10⁻⁷). Documentation of discrepancies in the final report rose from 35% to 75% (P = .0003). FS–permanent discrepancy rate 3.2% → 2.2%, **not significant** (P = .07). Interpretive errors ≈50% of discrepancies before and after. Case-pathologist use of the scoring tool exceeded 95% after a bug fix; after 6 months scoring became a required hard stop at sign-out. Components: FSLink (web, FS diagnosis sent to the OR for acknowledgement, auto-uploaded to the LIS); a custom scoring module in CoPath (agree / margin assurance / defer / disagree; disagreement reasons: interpretation, permanents only, sampling); automated e-mail to FS pathologists after sign-out; a custom weekly review module; quarterly M&M.

**Guardrail.** FSQA-1 is evidence that changing infrastructure changes practice. It is **not** evidence of an AI effect, and the deck says so on the slide.

**Hedgehog caveat.** The requirement "a handoff is not complete because somebody entered a destination; the receiving party must acknowledge receipt", and the behavior/test cards built on it, are an **illustrative formulation** of the custody problem the CV describes. They are labelled as such on the slide. No Hedgehog usage statistics are published.

## 3. The research anchor — IBIS

| id | Reference | Status |
|---|---|---|
| **IBIS-1** | IBIS — Interactive Biomedical Inquiry System. OpenPathologyFoundation/ibis (updated Apr 2026). The repository returns 404 to unauthenticated visitors as of 2026-10-15 — it is not yet public, so the deck links to the organization page instead. https://github.com/OpenPathologyFoundation | YES (repo private) |
| IBIS-2 | IBIS README (private repository): natural language → Lucene translation with an interpretation, a confidence value, extracted entities and suggestions; review and approve before executing; a refine step; 200 synthetic seed cases. The demo slide's field names are illustrative, not the repository's schema. | YES (internal) |

**Guardrail.** The demo slide uses illustrative field names, not the repository's schema. No result counts are rendered; the slide asks which unit is being counted instead of asserting one.

## 4. "How do we know it works?" — WBC ΔΣ and Xenonym

| id | Reference | Status |
|---|---|---|
| **WBC-1** | WBC ΔΣ — Manual Differential Counter. OpenPathologyFoundation/tessera (Apache-2.0; name and logo reserved). https://github.com/OpenPathologyFoundation/tessera · live: https://mdc.openpathology.org | YES (link) |
| **WBC-2** | `tessera/README.md`, v2.24.0 (2026-08-23), generated `qms:fact` fields: **1,172 tests** (722 Node + 450 browser), 7 documented skips; QMS/DHF: **71 user requirements** (URS-001), **207 system requirements** (SRS-001), **56 hazards** (RA-001 FMEA), **803 implemented verification cases** (TP-001), bidirectional traceability **100%** (RTM-001); three verification layers (unit on the shipped engine, behaviour in jsdom, system in Chromium/Firefox/WebKit); rule: no layer verifies a copy of the implementation. | YES |
| **WBC-3** | `tessera/QMS/DHF/DCR/DCR-004-Verification-Integrity-Remediation.md` (2026-08-04): the v2.0 baseline reported "379 passing tests, 100% pass rate"; no test loaded a DOM or ran a single application code path (suites mirrored the algorithms or asserted on source text); the RTM traced to a superseded URS; **fourteen specific defects** survived the green build. | YES |
| WBC-4 | `tessera/QMS/DHF/TR-001-TestResults.md` v4.2 (run 2026-08-23): 1,172 tests, 0 failures, 7 documented skips; evidence bundle stamped with commit hash and tree state. Note: its §1.1 comparison table records 191 tests at the v2.0 baseline where DCR-004 says 379; the deck uses the DCR-004 figure and cites it. | YES (with noted discrepancy) |
| **WBC-5** | `tessera/QMS/DHF/DRIFT-LOG.md` (append-only, as of 2026-08-23): **52 incidents, 42 prevented by an automated check** (QC-027 checks both figures against the rows). Row 31: SOP-001 said "You pressed 'A' (blast)" while the shipped default has A = monocytes. Row 15: three product versions live at once (2.7.1 / 2.14.0 / 2.3.0). Row 16: test totals in four copies, three disagreeing (1,039 vs 939). Row 10: an "Approved" evidence bundle from a tree in no commit. Row 50: the first defect found by someone operating the tool rather than by review. | YES |
| **XEN-1** | Xenonym — synthetic patient and professional data generator. OpenPathologyFoundation/xenonym (repository returns 404 unauthenticated as of 2026-10-15; the deck links to the live site and the organization page) · live: https://xenonym.openpathology.org. README: `realistic` and `stress` modes; JSON / CSV / FHIR R4; schema-driven output via `x-xenonym` annotations; 225+ tests. | YES (repo private) |

**Guardrail.** Xenonym has no cross-record consistency feature. The deck does not claim one; the "records that are individually valid but inconsistent with one another" idea is presented as the next test harness to build, not as a shipped capability. The earlier residents' deck (`custom_software_dev.json`) quotes the Feb 2026 counts (156 tests, 47 URS, 88 SRS, 10 documents); those were true then and are superseded by WBC-2.

## 5. The operating model and governance

| id | Reference | Status |
|---|---|---|
| GOV-1 | Hart SN, Hoffman NG, Gershkovich P, Christenson C, McClintock DS, Miller LJ, Jackups R, Azimi V, Spies N, Brodsky V. *Organizational preparedness for the use of large language models in pathology informatics.* J Pathol Inform 2023;14:100338. doi:10.1016/j.jpi.2023.100338 · PMID 37860713 | YES |
| GOV-2 | Gershkovich P. *Wearing a fur coat in the summertime: should digital pathology redefine medical imaging?* J Pathol Inform 2025;18:100450. doi:10.1016/j.jpi.2025.100450 · PMID 40979690 — the behavioral-interoperability argument. | YES |
| GOV-3 | Lincoln TL, Korpman RA. *Computers, health care, and medical information science.* Science 1980;210(4467):257–263. doi:10.1126/science.6999622 · PMID 6999622. The abstract (Europe PMC, 2026-10-15) does **not** contain "hybrid child of medicine" or "the logical challenge is more important than the technology" as quoted in the CCO deck; the deck attributes the idea without quotation marks. | PARAPHRASE |
| D-6 | CAP, *AI tools make predictions, pathologists make diagnoses* (Sep 2025). https://www.cap.org/advocacy/latest-news-and-practice-data/september-9-2025 (verified in the AI-OS registry) | YES |
| B-8 | Anthropic, *Claude Code best practices* (explore → plan → implement → verify). https://www.anthropic.com/engineering/claude-code-best-practices (verified in the AI-OS registry) | YES |

## 7. Documented harm and the scale of identification error (added 2026-10-16)

| id | Reference | Status |
|---|---|---|
| **HARM-1** | Paddock C. *Woman has double mastectomy after lab mix-up.* Medical News Today, 4 Oct 2007 (reporting ABC News / AP). Darrie Eason, 35, Long Island; biopsy sample mislabelled at CBLPath's Rye Brook laboratory per the New York State health department; the technician no longer employed. https://www.medicalnewstoday.com/articles/84665 | YES |
| **HARM-2** | MPR News, *Taking steps to stop preventable medical errors*, 18 Mar 2008. Methodist Hospital, St. Louis Park, MN: the wrong kidney removed from a cancer patient; Park Nicollet's chief medical officer accepted full responsibility and said the problem originated weeks earlier when the wrong kidney was listed as cancerous on the chart. https://www.mprnews.org/story/2008/03/18/kidney | YES |
| **HARM-3** | Lubin & Meyer, *Beth Israel and Strata Labs named in medical lawsuits*, 2 Aug 2010. Manuel Barros, 60: prostatectomy after another patient's slides were attributed to him; Thomas Cloutman, 53: negative Strata biopsy, cancer found eight months later with a lymph node involved; Strata's disclosure letter admitted a technician mixed up the slides. A law firm page; the hospital's state report is cited within it. https://www.lubinandmeyer.com/news/lab_mixup_lawsuit.html | PARTIAL (law-firm source) |
| **HARM-4** | NBC Connecticut, *Woman sues Yale-New Haven Hospital after doctors remove wrong rib*, 17 Mar 2016. Deborah Craven, 60, Milford; eighth rib marked with metal coils and dye, seventh removed; post-operative X-ray showed the markers; second operation the same day; the hospital "recognized that an error was made". https://nbcconnecticut.com/news/local/woman-sues-yale-new-haven-hospital-after-doctors-remove-wrong-rib-lawsuit/55942 | YES |
| **HARM-5** | AP via Fortune, *Meet a 43-year-old woman who had a hysterectomy...*, 8 Aug 2026. Cassandra Barksdale; biopsy 10 Mar 2025, hysterectomy 15 May 2025, DNA analysis in September 2025 found the sample belonged to another patient; lawsuit filed in Clayton County, GA, the week of 4 Aug 2026. **Allegations in a lawsuit, unproven**; Kaiser: "Ms. Barksdale should not have experienced this." https://fortune.com/2026/08/08/kaiser-permanente-cancer-misdiagnosis-delay-lawsuit/ | YES (allegations) |
| **HARM-6** | NBC Connecticut, *74-year-old army vet sues hospital after surgeons amputate wrong leg*, 30 Sep 2026. Sharon Jacks; Selby General Hospital, Marietta, OH; right leg marked, left amputated, September 2025; intended amputation four months later; hospital called it an "avoidable event". https://www.nbcconnecticut.com/news/national-international/army-vet-sues-ohio-hospital-after-surgeons-amputate-wrong-leg/3780177/ | YES |
| **STAT-1** | The Joint Commission, sentinel event annual review of 2024, released 9 Jul 2025, as reported by Periop Leader: 1,575 events; wrong-surgery 127 (up 13% from 112 in 2023 and 89 in 2022), 8% of events; 68% wrong-site, laterality cited in over half; 51% severe temporary harm, 36% permanent; no deaths. https://www.periopleader.com/briefs/patient-falls-wrong-surgeries-care-delays-lead-rise-in-sentinel-events/ | YES (trade-press report of the review) |
| **STAT-2** | Makary MA, Epstein J, Pronovost PJ, et al. *Surgical specimen identification errors: a new measure of quality in surgical care.* Surgery 2007;141(4):450–455. 21,351 specimens, 91 errors, 4.3 per 1,000; higher for biopsies and outpatient specimens. (PSNet summary and CAP Today, Oct 2007.) | YES |
| **STAT-3** | Nakhleh RE, Idowu MO, Souers RJ, et al. *Mislabeling of cases, specimens, blocks, and slides: a College of American Pathologists study of 136 institutions.* Arch Pathol Lab Med 2011;135(8):969–974. doi:10.5858/2010-0726-CPR. Cumulative mislabeling 0.11%. (PSNet summary.) | YES |
| **STAT-4** | Pfeifer JD, Liu J. *Rate of occult specimen provenance complications in routine clinical practice.* Am J Clin Pathol 2013;139(1):93–100. doi:10.1309/AJCP50WEZHWIFCIV. About 13,000 prostate biopsies, 54 practices; Type 1 transposition 0.26%, Type 2 contamination 0.67% (CAP Today). **Data supplied by Strand Analytical Laboratories, which markets the know error test.** | YES (with conflict noted) |
| **STAT-5** | Dunn EJ, Moga PJ. *Patient misidentification in laboratory medicine: a qualitative analysis of 227 root cause analysis reports in the Veterans Health Administration.* Arch Pathol Lab Med 2010;134(2):244–255. 253 adverse events, 182 misidentification, at all three stages of testing. (PSNet summary.) | YES |
| **SC-1** | Reason J. *Human error: models and management.* BMJ 2000;320(7237):768–770. PMID 10720363. The Swiss cheese sentences on the slide are a **paraphrase**; the full text was not re-fetched. | PARAPHRASE |
| **LLM-1** | Gertz RJ, Dratsch T, Bunck AC, et al. *Potential of GPT-4 for detecting errors in radiology reports: implications for reporting accuracy.* Radiology 2024; doi:10.1148/radiol.232714. RSNA release, April 2024: 200 reports, 150 inserted errors in five categories including side confusion; GPT-4 82.7% (124/150); senior radiologists 89.3%; attendings and residents 80.0%; best single reader 94.7%; GPT-4 faster and cheaper per report. Per-category (side-confusion) rates not in the release. https://www.rsna.org/news/2024/april/gpt4-matches-radiologists | YES (release) |

**Guardrails for this section.** The Georgia case is presented as allegations in a lawsuit. The Ohio case is a surgical-site error with correct marking, included to show that the layers fail even when the record is right. The Boston case rests on a law-firm page that quotes the hospital's state report. Pfeifer and Liu's conflict of interest is stated in the slide's comment and on the sources slide. Reason is paraphrased, not quoted. Gertz is a single-institution study of inserted errors in radiology; the slide claims only that reading across text is no longer the bottleneck.

## 8. The prediction and what it missed (added 2026-10-17)

| id | Reference | Status |
|---|---|---|
| **PRED-1** | Mukherjee S. *A.I. versus M.D.: what happens when diagnosis is automated?* The New Yorker, 3 Apr 2017 issue (online 26–27 Mar 2017). https://www.newyorker.com/magazine/2017/04/03/ai-versus-md — full text fetched 2026-10-17. Verbatim: "I think that if you work as a radiologist you are like Wile E. Coyote in the cartoon … It's just completely obvious that in five years deep learning is going to do better than radiologists … It might be ten years. I said this at a hospital. It did not go down too well."; "Hinton's actual words, in that hospital talk, were blunt: 'They should stop training radiologists now.'"; "In the future, he said, 'learning algorithms will make pathological diagnoses.'"; the automation-bias / spell-check passage; "The algorithm can solve a case. It cannot build a case." Mukherjee's own conclusion is augmentation, not replacement. | YES |
| **PRED-2** | Creative Destruction Lab. *Machine Learning and the Market for Intelligence*, Rotman School of Management, Toronto, 27 Oct 2016 (CDL's own write-up, https://creativedestructionlab.com/blog/overview-of-the-mkt4intel/). The on-stage remark is the clip that circulates as "Geoff Hinton: On Radiology"; Synced Review's conference report (3 Jan 2017) records Hinton opening with the "don't become radiologists, five years" line. The video itself was not re-watched. | YES (date) / PARTIAL (wording) |
| **PRED-3** | Byju A. *The "Godfather of AI" predicted I wouldn't have a job. He was wrong.* The New Republic, 25 Oct 2024. https://newrepublic.com/article/187203/ai-radiology-geoffrey-hinton-nobel-prediction — transcribes the 2016 clip: "It's just completely obvious that within five years deep learning is going to do better than radiologists.… It might be 10 years, but we've got plenty of radiologists already." | YES |
| **PRED-4** | Lohr S. *Your A.I. radiologist will not be with you soon.* The New York Times, 14 May 2025 — **not fetched** (paywall). Reported by AuntMinnie.com (14 May 2025, https://www.auntminnie.com/imaging-informatics/artificial-intelligence/article/15746014/hinton-acknowledges-mistake-in-predicting-ai-replacement-of-radiologists): wrong on the timing, not the direction; spoke too broadly, about image analysis only; "a whole lot more efficient"; and by The Decoder (Bastian M, 15 May 2025): "a whole lot more efficient in addition to improving accuracy"; Mayo Clinic radiologists "around 260 in 2016" to "over 400" in 2025 (55%). | PARTIAL (secondary) |
| **PRED-5** | National Resident Matching Program. *Results and Data: 2026 Main Residency Match.* May 2026, Table 1 (PDF fetched 2026-10-17, https://www.nrmp.org/wp-content/uploads/2026/05/Main_Match_Results_and_Data-2026.pdf). Radiology-Diagnostic PGY-1: 156 offered, 148 filled (94.9%); PGY-2: 1,083 offered, 1,066 filled (98.4%); combined 1,239 offered, 1,214 filled (98.0%). Pathology: 174 programs, 636 offered, 634 filled (99.7%). "Most in five years" is from AuntMinnie's five-year table (Carey L, 20 Mar 2026), whose PGY-1 fill figure (98%) disagrees with the NRMP table (94.9%); the slide uses the NRMP numbers. | YES |
| **AMD-2** | Volmar KE, Idowu MO, Hunt JL, Souers RJ, Meier FA, Nakhleh RE. *Surgical pathology report defects: a College of American Pathologists Q-Probes study of 73 institutions.* Arch Pathol Lab Med 2014;138(5):602–612. doi:10.5858/arpa.2013-0099-CP · PMID 24786118. Abstract (Europe PMC): 1,688 defects in 360,218 cases, 4.7 per 1,000; **14.6% misinterpretations, 13.3% misidentifications, 13.7% specimen defects, 58.4% other report defects**; misidentifications most often discovered by clinicians (44.6%); misidentification rate 0.0 vs 0.6 per 1,000 when all malignancies had a second pathologist before sign-out. | YES |
| **AMD-3** | Meier FA, Zarbo RJ, Varney RC, et al. *Amended reports: development and validation of a taxonomy of defects.* Am J Clin Pathol 2008;130(2):238–246. doi:10.1309/9UPELFVQU5WLCUHX · PMID 18628093. Misinterpretation 23–29%, misidentification 20–38%, specimen defects 4–10%, report defects 29–48%; pathologists discover most misinterpretations, clinicians most misidentifications. | YES |
| **AMD-4** | Nakhleh RE, Zarbo RJ. *Amended reports in surgical pathology and implications for diagnostic error detection and avoidance: a CAP Q-Probes study of 1,667,547 accessioned cases in 359 laboratories.* Arch Pathol Lab Med 1998;122(4):303–309. PMID 9648896 (linked via Europe PMC; PubMed answers scripted fetches with HTTP 203). 3,147 amended reports, 1.9 per 1,000; 19.2% patient identification, 38.7% change of final diagnosis, 15.6% change of preliminary diagnosis, 26.5% other clinically significant information. | YES |
| **SURV-1** | Gong B, Nugent JP, Guest W, et al. *Influence of artificial intelligence on Canadian medical students' preference for radiology specialty: a national survey study.* Acad Radiol 2019;26(4):566–577. doi:10.1016/j.acra.2018.10.007 · PMID 30424998. March 2018, all 17 schools, 322 respondents; 48.6% of first-choice respondents agreed AI caused anxiety; one-sixth of would-be first-choice respondents would not consider radiology; 67.7% expected reduced demand, 29.3% replacement. | YES |
| **SURV-2** | Sit C, Srinivasan R, Amlani A, et al. *Attitudes and perceptions of UK medical students towards artificial intelligence and radiology: a multicentre survey.* Insights Imaging 2020;11:14. doi:10.1186/s13244-019-0830-7 · PMID 32025951. 484 responses, 19 schools; 49% less likely to consider radiology because of AI; 45 students had any AI teaching. | YES |
| **SURV-3** | Reeder K, Lee H. *Impact of artificial intelligence on US medical students' choice of radiology.* Clin Imaging 2022;81:67–71. doi:10.1016/j.clinimag.2021.09.018 · PMID 34619566. 32 schools, survey Feb–Apr 2020 (463 respondents per Radiology Business); one-sixth of would-be first-choice students did not choose radiology because of AI; about half of top-three considerers remained concerned. | YES |

**Guardrails for this section.** The quote is Hinton's; Mukherjee carried it and concluded the opposite, so the slide attributes the words to Hinton and the essay to Mukherjee. The hedge ("It might be ten years") stays on the slide. The ten-year mark is October 2026 from the Toronto date; the talk is on 22 October 2026. The amendment split is the Q-Probes benchmark, not the department's own; if the department's amendments are split by the same taxonomy before the talk, those numbers replace the benchmark. The surveys measure students' stated intentions, not Match outcomes.

## 9. Measured on the department's git server (added 2026-10-20)

| id | Reference | Status |
|---|---|---|
| **GIT-1** | Commit and pull-request counts on git.yale.edu, organization PathologyInformatics (64 repositories), measured 2026-10-20 from the 51 repositories cloned locally (fetched that day) and the API for the other 13; non-merge commits on all fetched branches, deduplicated by sha; lines added plus deleted excluding lockfiles, vendored and build directories, binaries, minified files and SVG, capped at 2,000 lines per file per commit; merged pull requests from the search API; bots (renovate, github-actions, dependabot) excluded; author display names only, none rendered. The full report, the analysis script and the extracted data are kept locally in the repository root’s `.dev-notes/` (`2026-10-20-git-yale-productivity-stats.md`), which git ignores. | internal (measured) |

**What GIT-1 establishes.** The speaker, calendar 2024 against 2026-04-17 to 2026-10-20: commits 80 → 2,303; days with a commit 44 → 130; lines changed 21,271 → 1,244,873; merged pull requests 3 → 950. Per day with a commit: commits ×10, lines ×20, merged pull requests ×100 — the last partly a change of workflow, since in 2024 most commits went to the main branch without a pull request. The speaker's monthly commits in 2026 step up in June (April 63, May 17, June 226, August 867), not at the April load. One senior engineer, the 13 weeks before 2026-09-15 against the five weeks after: commits 43 → 151 a week, lines 16,600 → 70,000 a week, days with a commit 4.2 → 6.2 a week; per such day ×2.3 and ×2.8; his baseline was already partly AI-assisted. Everyone except the speaker and bots: merged pull requests 53 → 127 a week over the same five weeks (78 in all of 2024). One team member stopped committing after 2026-09-14, so group totals are shown per person. Counts measure activity, not value; the deck renders only the per-day ratios for the speaker and the ×2 to ×4 range for the engineer.

## 10. The image mover's security record (added 2026-10-21)

| id | Reference | Status |
|---|---|---|
| **STV-1** | The image mover’s security record — internal, unpublished. The full deck renders its version dates, step and test counts and findings in plain words on a hidden slide; the public deck does not include the slide, the counts or the record’s titles. | internal |

**What STV-1 establishes.** A forty-line file copy, in production, was re-asked "is it secure?" five times over two and a half years, and each pass surfaced an assumption the previous pass had no reason to see. The findings, the published disciplines the record ties each of them to, and the version dates are in the full deck’s hidden slide and its notes, not in this repository.

## 11. The opening trail (added 2026-10-22, from the presenter's cue cards)

The `opening-trail` slide draws nine anchors, 1928 to 2021, in order and not to scale. Every date and attribution below is as the presenter's cue cards give it; the cautions in the slide's notes are the cards' own.

| id | source | status |
|---|---|---|
| OPN-1 | "Publish or perish": Case CM, *Scholarship in Sociology* (1928); Wilson L, *The Academic Man* (1942); historical tracing by Vladimir Moskovkin, Leiden CWTS, 4 June 2024. Not the first use; no inventor claimed. | YES (cue cards) |
| OPN-2 | Bush V. *As We May Think*. The Atlantic, July 1945; Computer History Museum, Memex conceptual sketch. Proposed, not built; anticipated hypertext, not the Internet's networking. | YES (cue cards) |
| OPN-3 | Licklider JCR. *Man-Computer Symbiosis*. IRE Transactions on Human Factors in Electronics, March 1960; full text hosted by MIT CSAIL. | YES (cue cards) |
| OPN-4 | DARPA official histories: ARPA founded 1958; IPTO 1962; first ARPANET host-to-host message 29 October 1969; renamed DARPA 1972. | YES (cue cards) |
| OPN-5 | Tufte ER. *The Visual Display of Quantitative Information*, 1983 (official book page; Yale faculty biography). Norman DA. *The Psychology of Everyday Things*, 1988, later *The Design of Everyday Things* (preface, revised edition 2013). | YES (cue cards) |
| OPN-6 | Berners-Lee T. *The World Wide Web: Past, Present and Future*, 1996, W3C. Proposed the Web at CERN in 1989; the Web, not the Internet. | YES (cue cards) |
| OPN-7 | Sculley D et al. *Hidden Technical Debt in Machine Learning Systems*. NIPS 2015. The diagram is conceptual, not a measured share of cost or code. | YES (cue cards) |
| OPN-8 | Ehteshami Bejnordi B et al. *Diagnostic Assessment of Deep Learning Algorithms for Detection of Lymph Node Metastases in Women With Breast Cancer*. JAMA 2017;318:2199–2210. doi:10.1001/jama.2017.14585. A simulated, time-constrained evaluation; clinical evaluation still needed. | YES (cue cards) |
| OPN-9 | Software Engineering Institute. *AI Engineering: An Emergent Discipline for Human-Centered, Robust and Secure, and Scalable AI*. 27 April 2021. Not the birth of systems engineering. | YES (cue cards) |

## 6. Borrowed from the repository's other decks (already verified there)

| id | What | Where |
|---|---|---|
| X-1 | The safety-boundary columns ("AI does / AI must not") | `pathology_informatics_ai.json#ai-must-not-do`, `build_as_you_speak.json#safety-boundary` |
| X-2 | The one-page spec structure | `build_as_you_speak.json#the-one-page-spec` |
| X-3 | "Software should be a reflection of your workflow, your logic, your judgment" | `dom-grand-rounds.json#governing-principle` |
| X-4 | The lecture-provenance idiom | `ai_operating_system.json#what-this-lecture-is` |
| X-5 | Deterministic kernel + LLM layer; AI as a workflow participant | `wsi_orchestration.json#fast-vs-slow-thinking`, `#ai-as-workflow-participant` |

---

## DO NOT CITE (searched 2026-10-15)

- Any published performance figure for Dialogue (sensitivity, specificity, cases screened, amendments prevented) — none exists.
- Hedgehog usage counts, specimens tracked, or losses prevented — none published.
- "Hybrid child of medicine" / "the logical challenge is more important than the technology" as Lincoln & Korpman quotations — not in the abstract; full text not re-checked.
- Any claim that Xenonym generates mutually inconsistent record sets — it does not.
- The 156-test / 47-URS / 88-SRS counts for WBC ΔΣ — superseded (WBC-2).
- "56% worried" / "16% abandoned radiology" for the Canadian survey — secondary-coverage figures that do not match the abstract (SURV-1: 48.6% and one-sixth).
- "Mukherjee predicted the end of pathologists" — he did not; the lines are Hinton's (PRED-1).
- A 98% PGY-1 fill rate for diagnostic radiology in 2026 — AuntMinnie's figure; the NRMP table gives 94.9% (PRED-5).
- Hinton's exact words to The New York Times beyond the fragments quoted by AuntMinnie and The Decoder — the article was not fetched (PRED-4).
