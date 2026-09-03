# Verified Reference Registry

**Lecture:** *AI Is Not Updating Pathology — It Is Rewriting the Operating System of Pathology*
**Compiled:** 2026-09-02. Full verification notes with exact quotes are in `research/01_anchor_papers.md`, `research/02_landscape_2026.md`, `research/03_history_and_epistemics.md`.

**Status legend.** `YES` — primary page/abstract/database fetched and quoted on 2026-09-02. `PARTIAL` — bibliographic record confirmed (Crossref/PubMed/arXiv) but a specific quoted value or the landing page was not re-fetched. `TODO` — needed by the lecture, not yet verified; the coding agent must verify before it is rendered (see `TASKS.md` T1.3). `DO NOT CITE` — could not be located.

Every reference has a short **id** used by `verified-numbers.json` (`source` field), by `VIZ_SPECS.md`, and by the `sources` slide.

---

## 1. Anchor papers (the two 2026 Nature Communications articles)

| id | Reference | Status |
|---|---|---|
| **EAGLE-NatCommun** | Neidlinger P, Lenz T, Foersch S, … Brenner H, Kather JN. *A deep learning framework for efficient pathology image analysis.* **Nat Commun** 17, 5740 (published 1 Jul 2026; accepted 16 Jun 2026). https://doi.org/10.1038/s41467-026-74918-9 · PMID 42386722 | YES |
| EAGLE-arXiv | arXiv:2502.13027 (v1 18 Feb 2025; v2 24 Feb 2026). https://arxiv.org/abs/2502.13027 | YES |
| EAGLE-GitHub | KatherLab/EAGLE (GPL-3.0). Zenodo 10.5281/zenodo.19799127. README: MacBook Air M3 demo ≈3 min, 7 TCGA-CRC slides; requires STAMP CTransPath features @2 MPP, HF-gated Virchow2 token, CHIEF weights by request/Docker. https://github.com/KatherLab/EAGLE | YES |
| **PathBench-NatCommun** | Bareja R, Carrillo-Perez F, Zheng Y, Pizurica M, Nandi TN, Tian L, Shen J, Madduri R, Gevaert O. *A benchmark study of vision and pathology foundation models for computational pathology.* **Nat Commun** 17, 9012 (published 24 Jul 2026; accepted 8 Jul 2026). Stanford + Argonne. https://doi.org/10.1038/s41467-026-76004-6 | YES |
| PathBench-medRxiv | medRxiv 2025.05.08.25327250 (12 May 2025; reported 31 models, journal 32). https://doi.org/10.1101/2025.05.08.25327250 | YES |
| PathBench-code | gevaertlab/benchmarking-path-models (MIT); dashboard https://pathbench.stanford.edu/ (Streamlit; content JS-rendered, not inspected) | PARTIAL |

**Corrections to the brief.** Both titles are sentence case. PathBench "no calibration" is the lecturer's observation (the word never appears in the article), not a stated limitation; the four stated limitations are linear probing, pretraining/evaluation overlap, coarse scaling proxies, mean pooling. The 43-task EAGLE extension uses PathoBench *internal* cross-validation, not external cohorts. The "~3 minutes on a MacBook" figure is from the README, not the paper. Three unrelated things are named "PathBench": Stanford/Gevaert (this paper), HKUST/Hao Chen (arXiv:2505.20202, 19 FMs, 64 tasks), and PathBench-MIL (Leiden, arXiv:2512.17517).

### 1a. Models referenced by the anchor papers

| id | Reference | Status |
|---|---|---|
| TITAN | Ding T, … Mahmood F. *A multimodal whole-slide foundation model for pathology.* Nat Med 31, 3749–3761 (2025). https://doi.org/10.1038/s41591-025-03982-3 · arXiv:2411.19666 (335,645 WSIs) | YES |
| CHIEF | Wang X, … Yu K-H. *A pathology foundation model for cancer diagnosis and prognosis prediction.* Nature 634, 970–978 (4 Sep 2024). 60,530 WSIs, 19 sites. https://doi.org/10.1038/s41586-024-07894-z · https://github.com/hms-dbmi/CHIEF | YES |
| Virchow2 | Zimmermann E, … Severson K. *Virchow2: Scaling self-supervised mixed magnification models in pathology.* arXiv:2408.00738 (2024). 632 M params, 3.1 M WSIs. https://arxiv.org/abs/2408.00738 · HF paige-ai/Virchow2 (gated) | YES |
| CTransPath | Wang X, … Han X. *Transformer-based unsupervised contrastive learning for histopathological image classification.* Med Image Anal 81, 102559 (2022). https://doi.org/10.1016/j.media.2022.102559 | PARTIAL |
| UNI | Chen RJ, … Mahmood F. *Towards a general-purpose foundation model for computational pathology.* Nat Med 30, 850–862 (2024). https://doi.org/10.1038/s41591-024-02857-3 | PARTIAL |
| CONCH | Lu MY, … Mahmood F. *A visual-language foundation model for computational pathology.* Nat Med 30, 863–874 (2024). https://doi.org/10.1038/s41591-024-02856-4 | PARTIAL |
| Prov-GigaPath | Xu H, … Poon H. *A whole-slide foundation model for digital pathology from real-world data.* Nature 630, 181–188 (2024). 1.3 B tiles / 171,189 WSIs. https://doi.org/10.1038/s41586-024-07441-w | PARTIAL |
| Neidlinger-NBE | Neidlinger P, … Kather JN. *Benchmarking foundation models as feature extractors for weakly supervised computational pathology.* Nat Biomed Eng 10, 1113–1123 (2025). https://doi.org/10.1038/s41551-025-01516-3 | PARTIAL |
| H-optimus-0 | Bioptimus, 2024 (params / WSI count needed for hover) | TODO |
| UNI2 | Mahmood lab, 2025 (params / WSI count needed for hover) | TODO |

---

## 2. Agentic and tool-using AI (theme A)

| id | Reference | Status |
|---|---|---|
| A-1 | Lu MY, … Mahmood F. *A multimodal generative AI copilot for human pathology.* Nature 634 (12 Jun 2024). https://doi.org/10.1038/s41586-024-07618-3 | YES |
| A-2 | Weishaupt LL, … *Evidence-based diagnostic reasoning with multi-agent copilot for human pathology* (PathChat+ / SlideSeek). arXiv:2506.20964 (26 Jun 2025). https://arxiv.org/abs/2506.20964 | YES |
| A-3 | *PathAgent: Toward interpretable analysis of whole-slide pathology images via LLM-based agentic reasoning.* arXiv:2511.17052 (Nov 2025; ECCV 2026 per repo). https://arxiv.org/abs/2511.17052 · https://github.com/G14nTDo4/PathAgent | YES (ECCV: PARTIAL) |
| A-4 | Wang S, … Huang Z. *Pathology-CoT: Learning visual chain-of-thought agent from expert WSI diagnosis behavior* (AI Session Recorder). arXiv:2510.04587 (6 Oct 2025). https://arxiv.org/abs/2510.04587 | YES |
| A-5 | *A co-evolving agentic AI system for medical imaging analysis* (TissueLab). arXiv:2509.20279; Nat Med research briefing 32 (1 Jun 2026) https://doi.org/10.1038/s41591-026-04403-9 · https://github.com/zhihuanglab/TissueLab | PARTIAL |
| A-6 | Vaidya AJ, … Bouzid K. *NOVA: An agentic framework for automated histopathology analysis and discovery.* arXiv:2511.11324 (14 Nov 2025). 49 tools; generates and runs Python; SlideQuest 90 questions. https://arxiv.org/abs/2511.11324 | YES |
| A-7 | Ghezloo F, … *PathFinder* arXiv:2502.08916 (13 Feb 2025) https://arxiv.org/abs/2502.08916 · Lyu X, … *WSI-Agents* arXiv:2507.14680 (19 Jul 2025) https://arxiv.org/abs/2507.14680 | YES |
| A-8 | Yang C et al. *PathNavigate* arXiv:2605.23559 (22 May 2026) · Zhang C et al. *PathoSage* arXiv:2606.07549 (18 May 2026) · Da Q et al. (28 authors) *Computational pathology in the era of emerging foundation and agentic AI — international expert perspectives* arXiv:2603.05884 (6 Mar 2026): "real world adoption has lagged" | YES |
| A-9 | Paige, *Paige unveils Alba* (press, **5 Sep 2024**). https://www.paige.ai/press-releases/paige-unveils-alba | PARTIAL |
| A-10 | Alber S et al. *Atlas* arXiv:2501.05409 (Jan 2025); Atlas 2 arXiv:2601.05148 (Jan 2026) | PARTIAL |
| A-12 | Anthropic, *Claude for Life Sciences* (20 Oct 2025): MCP connectors Benchling, BioRender, PubMed, Wiley, Synapse, 10x; no pathology/WSI connector. https://www.anthropic.com/news/claude-for-life-sciences | YES |
| A-13 | Anthropic, *Introducing the Model Context Protocol* (25 Nov 2024) https://www.anthropic.com/news/model-context-protocol · *Donating MCP … Agentic AI Foundation* (9 Dec 2025) https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation | YES |
| A-14 | Google Research, *Accelerating scientific breakthroughs with an AI co-scientist* (19 Feb 2025). https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/ | YES |
| A-15 | Huang K, … Leskovec J. *Biomni* bioRxiv 2025.05.30.656746 (2 Jun 2025) https://github.com/snap-stanford/biomni · FutureHouse platform (1 May 2025) | YES / PARTIAL |
| A-16 | Google, MedGemma 1.5 model card (WSI support; Jan 2026). https://developers.google.com/health-ai-developer-foundations/medgemma/model-card | PARTIAL |

## 3. Agentic-coding evidence (theme B)

| id | Reference | Status |
|---|---|---|
| B-1 | Becker J, Rush N, Barnes E, Rein D. *Measuring the impact of early-2025 AI on experienced open-source developer productivity.* METR, 10 Jul 2025; arXiv:2507.09089. 16 devs, 246 tasks, **+19% slower** (CI +2% to +39%); forecast −24%. https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ | YES |
| B-2 | METR, *We are changing our developer productivity experiment design* (24 Feb 2026). 57 devs/143 repos/800+ tasks; returning devs **−18%** (CI −38% to +9%), new devs −4% (−15% to +9%); 30–50% declined tasks without AI. https://metr.org/blog/2026-02-24-uplift-update/ | YES |
| B-3 | METR, *Self-reported impact of early-2026 AI on technical worker productivity* (11 May 2026). n=349; median value 1.4–2×, speed 3×. https://metr.org/blog/2026-05-11-ai-usage-survey/ | YES |
| B-4 | Anthropic Economic Index, Mar 2026 and Jun 2026 reports. https://www.anthropic.com/research/economic-index-march-2026-report · https://www.anthropic.com/research/economic-index-june-2026-report | YES |
| B-5 | GitHub Octoverse 2025. 1.1 M public repos use an LLM SDK (+178% YoY); 518.7 M PRs. https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/ | YES |
| B-6 | Stack Overflow Developer Survey 2025: 84% use/plan AI; 46% distrust accuracy vs 33% trust. https://survey.stackoverflow.co/2025/ai | YES |
| B-7 | Karpathy A. "vibe coding" post, 2 Feb 2025. https://x.com/karpathy/status/1886192184808149383 | PARTIAL |
| B-8 | Anthropic, *Claude Code best practices* (explore → plan → implement → verify). https://www.anthropic.com/engineering/claude-code-best-practices | YES |

## 4. Standards and interoperability (theme C)

| id | Reference | Status |
|---|---|---|
| C-1 | DICOM Supplement 145 *Whole Slide Imaging in Pathology* (final text 2010); WG-26. https://dicom.nema.org/dicom/dicomwsi/ | YES |
| C-2 | Cornish TC, Dayal S, Ferber D, Chiweshe J, Monroe R. *The evolving role of DICOM in digital pathology.* J Pathol Inform 21, 100658 (3 Apr 2026). https://doi.org/10.1016/j.jpi.2026.100658 | YES |
| C-3 | Clunie DA, … *Report on the 2025 DICOM WSI Connectathon.* J Pathol Inform 21, 100657 (9 Apr 2026). 32 implementers. https://doi.org/10.1016/j.jpi.2026.100657 | YES |
| C-4 | IHE PaLM *Digital Pathology Workflow – Image Acquisition (DPIA)* Rev 1.3 Trial Implementation (17 Dec 2024). https://wiki.ihe.net/index.php/Digital_Pathology_Workflow_-_Image_Acquisition | YES |
| C-5 | Ardon O, … Hanna MG. *Digital slide scanning at scale: comparison of WSI devices in a clinical setting.* J Pathol Inform 18, 100446 (2025). 347 slides, 16 scanners, 7 vendors. https://doi.org/10.1016/j.jpi.2025.100446 — **"no DICOM-WSI in production" NOT in abstract; do not state unless confirmed in full text** | YES / claim TODO |
| C-6 | Angeloni M, … Fraggetta F. *Closing the gap in the clinical adoption of computational pathology* (HL7-based integration). Genome Med 17:60 (26 May 2025). https://doi.org/10.1186/s13073-025-01484-y | YES |

## 5. Regulatory (theme D)

| id | Reference | Status |
|---|---|---|
| D-1 | FDA, *Artificial Intelligence-Enabled Medical Devices* list (page dated 16 Jun 2026; parsed 2 Sep 2026). 1,524 entries; Radiology 1,164; Pathology 9. https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices | YES |
| D-2 | Innolitics, *AI/ML in digital pathology and the software-as-an-IVD paradigm: 2026 snapshot* (28 Apr 2026). 51 devices; 7 WSI algorithms; regulated as IVD (OHT7). https://innolitics.com/articles/ai-ml-in-digital-pathology-and-the-software-as-an-ivd-paradigm-snapshot/ | YES |
| D-3 | FDA draft guidance, *AI-Enabled Device Software Functions: Lifecycle Management* (6 Jan 2025; still draft). https://www.fda.gov/news-events/press-announcements/fda-issues-comprehensive-draft-guidance-developers-artificial-intelligence-enabled-medical-devices | YES |
| D-4 | FDA final guidance, *Predetermined Change Control Plan for AI-DSF* (4 Dec 2024). https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence | PARTIAL |
| D-5 | EU AI Act (2024/1689) + Digital Omnibus: Annex I high-risk deadline moved to 2 Aug 2028 | PARTIAL |
| D-6 | CAP, *"AI tools make predictions, pathologists make diagnoses"* (Sep 2025). https://www.cap.org/advocacy/latest-news-and-practice-data/september-9-2025 | YES |
| D-9 | FDA/HC/MHRA *Good Machine Learning Practice* 10 principles (27 Oct 2021) https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles · *Transparency for MLMDs* (Jun 2024) https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles | YES |
| D-10 | NCI workshop report, J Pathol Inform 20:100531 (14 Nov 2025): "only three AI/ML SaMD tools have received FDA clearance … a validation dataset gap rather than an absence of regulatory pathways." | PARTIAL |

## 6. Clinical evidence and implementation (theme E)

| id | Reference | Status |
|---|---|---|
| **E-1** | *An evaluation of AI-assisted prostate biopsy reporting in the Articulate Pro study.* npj Digit Med (22 May 2026). 1,613 cases; 1,049 AI-assisted; 21/386 (5.4%) Dx/GG changed; 5 (1.3%) management-relevant; TAT −30.1 h at one site; IHC ORs 0.50/0.43/0.33. https://doi.org/10.1038/s41746-026-02592-8 | YES |
| E-2 | Campanella G, … Fuchs TJ. *Real-world deployment of a fine-tuned pathology foundation model for lung cancer biomarker detection.* Nat Med 31 (9 Jul 2025). Silent trial AUC 0.890; up to 43% fewer rapid molecular tests. https://doi.org/10.1038/s41591-025-03780-x | YES |
| E-3 | Deman F, … Dendooven A. Histopathology 87 (2025) https://doi.org/10.1111/his.15481 · Udoh AI et al. J Pathol Inform 22:100675 (2026) · Santa-Rosario JC et al. J Pathol Inform 15:100378 (2024) | YES |
| E-4 | Aggarwal A, … Madabhushi A. *AI in digital pathology — time for a reality check.* Nat Rev Clin Oncol 22:283–291 (2025). https://doi.org/10.1038/s41571-025-00991-6 | YES |
| E-7 | TRIPOD+AI, BMJ 2024;385:e078378 · DECIDE-AI, Nat Med 2022;28:924 · CONSORT-AI, Nat Med 2020;26:1364 | YES / PARTIAL |
| E-8 | Wagner SJ, … Peng T. *Built to last? Reproducibility and reusability of deep learning algorithms in computational pathology.* Mod Pathol 37:100350 (2024; online Oct 2023). https://doi.org/10.1016/j.modpat.2023.100350 | YES |

## 7. Benchmarks and reproducibility (theme F)

| id | Reference | Status |
|---|---|---|
| F-1 | Zhang A, Jaume G, Vaidya A, Ding T, Mahmood F. *Accelerating data processing and benchmarking of AI models for pathology* (Patho-Bench / Trident). arXiv:2502.06750. https://github.com/mahmoodlab/patho-bench | YES |
| F-2 | Ma J, … Chen H. *PathBench: A comprehensive comparison benchmark for pathology foundation models towards precision oncology.* arXiv:2505.20202 (HKUST). https://arxiv.org/abs/2505.20202 · kaiko-ai/eva (MIDL 2024) | YES / PARTIAL |
| F-3 | Marza P, … *THUNDER* arXiv:2507.07860 (NeurIPS 2025 D&B spotlight) | YES |
| **F-4** | de Jong ED, Marcus E, Teuwen J. *Current pathology foundation models are unrobust to medical center differences.* arXiv:2501.18055 (29 Jan 2025). 10 FMs; center predicted better than tissue/cancer type. https://arxiv.org/abs/2501.18055 · Kömen J et al. arXiv:2411.05489 | YES |
| F-5 | Campanella G, … Fuchs TJ. *A clinical benchmark of public self-supervised pathology foundation models.* **Nat Commun** 16 (17 Apr 2025). https://doi.org/10.1038/s41467-025-58796-1 | YES |

## 8. Science of science and publishing (theme G)

| id | Reference | Status |
|---|---|---|
| G-1 | Hanson MA, Barreiro PG, Crosetto P, Brockington D. *The strain on scientific publishing.* Quant Sci Stud 5(4):823–843 (2024). +47% articles 2016→2022. https://doi.org/10.1162/qss_a_00327 | YES |
| **G-2** | Kobak D, González-Márquez R, Horvát EÁ, Lause J. *Delving into LLM-assisted writing in biomedical publications through excess vocabulary.* Sci Adv 11(27):eadt3813 (2 Jul 2025). ≥13.5% of 2024 abstracts. https://doi.org/10.1126/sciadv.adt3813 · Holzwarth L, González-Márquez R, Kobak D. *Most biomedical publications show signs of LLM-assisted writing.* arXiv:2608.10715 (11 Aug 2026): 89% of 2025 papers. | YES |
| G-3 | Park M, Leahey E, Funk RJ. Nature 613:138–144 (2023) https://doi.org/10.1038/s41586-022-05543-x (contested — cite with caveat) · Chu JSG, Evans JA. PNAS 118(41):e2021636118 (2021) | PARTIAL |
| G-4 | ICMJE, *Use of AI by authors*. https://www.icmje.org/recommendations/browse/artificial-intelligence/ai-use-by-authors.html · He Y, Bu Y. *Academic journals' AI policies fail to curb the surge in AI-assisted academic writing.* arXiv:2512.06705 (2025): 5,114 journals, 70% with policy, no effect | YES |
| G-5 | Pangram, *21% of ICLR reviews are AI-generated* (18 Nov 2025) https://www.pangram.com/blog/pangram-predicts-21-of-iclr-reviews-are-ai-generated · NeurIPS blog, *AI-generated papers in the NeurIPS 2026 position paper track* (2 Jun 2026) https://blog.neurips.cc/2026/06/02/ai-generated-papers-in-the-neurips-2026-position-paper-track/ · ICML blog (18 Mar 2026) | YES / PARTIAL |
| G-6 | Biswas J et al. *AI-assisted peer review at scale: the AAAI-26 AI review pilot.* arXiv:2604.13940 (2026) · Fichtl AM et al. arXiv:2608.03581 (2026) | YES |
| G-7 | PubMed E-utilities counts (run 2 Sep 2026); reproducible query strings in `research/02_landscape_2026.md` §G-7 | YES |

## 9. Historical and epistemic foundations (theme H)

| id | Reference | Status |
|---|---|---|
| **H-1** | Bush V. *As We May Think.* The Atlantic, July 1945. https://www.theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/ · Life, 10 Sep 1945 (illustrated) · Engelbart DC. *Augmenting Human Intellect* (SRI, Oct 1962) https://www.dougengelbart.org/pubs/augment-3906.html · Nelson TH (1965) https://doi.org/10.1145/800197.806036 · Nyce JM, Kahn P (eds). *From Memex to Hypertext* (1991) | YES |
| **H-2** | Tufte ER. *The Cognitive Style of PowerPoint* (Graphics Press, May 2003; 2nd ed Apr 2006). https://www.edwardtufte.com/book/the-cognitive-style-of-powerpoint-pitching-out-corrupts-within-ebook/ · Tufte, *PowerPoint Is Evil*, Wired 11.09 (1 Sep 2003) https://www.wired.com/2003/09/ppt2/ · CAIB Report Vol. I (Aug 2003) p.191 "endemic use of PowerPoint briefing slides" https://ehss.energy.gov/deprep/archive/documents/0308_caib_report_volume1.pdf — **"rich, detailed narrative" is NOT Tufte's phrase; use "anti-narrative with choppy continuity" or paraphrase** | YES (quote caveat) |
| **H-3** | Farmington Canal: DeLuca R. *New England's grand ambition: the Farmington Canal.* ConnecticutHistory.org https://connecticuthistory.org/the-farmington-canal/ · Farmington Canal Heritage Trail, *History* https://fchtrail.org/history/ · Wikipedia *New Haven and Northampton Canal* / *Railroad* (secondary). Groundbreaking 4 Jul 1825; open 1828; Northampton 1835; >$1 M loss 1836; railroad authorized May 1846; canal closed 18 Jan 1848; trail 1996. Length 80–86 mi depending on source. | YES |
| H-4 | Lincoln TL, Korpman RA. *Computers, health care, and medical information science.* Science 210(4467):257–263 (17 Oct 1980). https://doi.org/10.1126/science.6999622 — **the sentence "software should be the immediate result of your thought" could not be verified (paywalled); treat as attributed paraphrase until checked against the PDF** | PARTIAL |
| H-5 | Mitchell M et al. *Model cards for model reporting.* FAT* '19 (now FAccT). https://doi.org/10.1145/3287560.3287596 · Gebru T et al. *Datasheets for datasets.* CACM 64(12):86–92 (2021). https://doi.org/10.1145/3458723 · Hugging Face model-card docs https://huggingface.co/docs/hub/model-cards | YES |
| H-6 | Friedman CP. *A "fundamental theorem" of biomedical informatics.* JAMIA 16(2):169–170 (2009). https://doi.org/10.1197/jamia.M3092 — "A person working in partnership with an information resource is 'better' than that same person unassisted." | YES |
| H-7 | Brooks FP. *No Silver Bullet — essence and accidents of software engineering.* Computer 20(4):10–19 (1987). https://doi.org/10.1109/MC.1987.1663532 · Boehm BW. *A spiral model of software development and enhancement.* Computer 21(5):61–72 (1988). https://doi.org/10.1109/2.59 | YES |
| H-8 | McLuhan M. *Understanding Media* (McGraw-Hill, 1964), ch. 1. | YES |
| H-9 | Knuth DE. *Literate programming.* Comput J 27(2):97–111 (1984) https://doi.org/10.1093/comjnl/27.2.97 · Victor B. *Explorable Explanations* (10 Mar 2011) https://worrydream.com/ExplorableExplanations/ · Jupyter (Jul 2014) · Observable (28 Apr 2017) · Quarto 1.0 (28 Jul 2022) · marimo 0.1.0 (14 Aug 2023) | YES |
| H-10 | Anthropic engineering: *Building effective agents* (19 Dec 2024) https://www.anthropic.com/engineering/building-effective-agents · *Effective context engineering for AI agents* (29 Sep 2025) https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents · *Agent Skills* (16 Oct 2025) https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | YES |

## 10. Already in the repo (borrowed lectures' verified sources)

| id | Reference | Where |
|---|---|---|
| R-1 | Gershkovich P, Sinard JH. *Customizing laboratory information systems: closing the functionality gap.* Adv Anat Pathol 2015;22(5):323–330. PMID 26262515 | build_as_you_speak.json, pathology_informatics_ai.json |
| R-2 | McQuade et al. *Software Is Never Done* (Defense Innovation Board, 2019) — `/assets/software-is-never-done.pdf` | dom-grand-rounds |
| R-3 | Hersh WR et al. *Caveats for the use of operational EHR data in comparative effectiveness research.* Med Care 2013 | dom-grand-rounds `hersh-caveats` |
| R-4 | Tufte timeline URLs (Wired 2003, NYT 2010, Bezos memo 2018) | `tests/validate-links.js` |
| R-5 | TAT April 2006 vs April 2026 dashboard (Yale internal, de-identified) | `/assets/dashboards/tat_2006_vs_2026.html` |

---

## DO NOT CITE (searched, not found or not verifiable on 2026-09-02)

- Any FDA/CDRH 2025–2026 workshop on "technical vs diagnostic performance linkage" in digital pathology — none found. Closest: FDA 2016 *Technical Performance Assessment of Digital Pathology WSI Devices* guidance and the NCI workshop report (D-10).
- A prospective Karolinska pathology-AI trial 2024–2026 — not found (their work is retrospective validation + microsimulation).
- A Google "pathology agent" product — none; MedGemma 1.5 WSI support (A-16) is the closest.
- "Ardon et al.: no DICOM-WSI in MSK production" — not in the abstract (C-5).
- Stack Overflow 2025 "45% almost right / 66% debugging" figures — not on the fetched survey page.
- Tufte "rich, detailed narrative" — not his words.
- Lincoln & Korpman "immediate result of your thought" as a *quotation* — unverified; attribute as paraphrase.

## TODO — verify before render (owned by TASKS.md T1.3)

- Prov-GigaPath mean AUROC on EAGLE's 31-task benchmark; Virchow2 full-tiling seconds/slide (EAGLE Fig./Table).
- PathBench non-TCGA top-5 95% CIs.
- Param counts / pretraining WSI counts for UNI, UNI2, H-optimus-0, Prov-GigaPath (for hover cards).
- HL7 founding year (1987), DICOM 3.0 (1993), Philips IntelliSite FDA WSI primary-diagnosis authorization (Apr 2017), WWW public (1991) — well known; fetch a primary page for each.
