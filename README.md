# Pathology Informatics Lectures

Interactive web-based lectures for pathology residents, built with Reveal.js, D3.js, and a custom JSON-driven slide engine.

**Author:** Peter Gershkovich, MD. MHA — Yale University School of Medicine

## Available Lectures

### Lectures & Talks

Grand rounds, leadership, and conference audiences.

| Title | Slides | Route | Docs |
| ----- | ------ | ----- | ---- |
| **AI Is Rewriting the Operating System of Pathology** | 37 | `/lecture/ai_operating_system` | [Plan](docs/ai_operating_system/PLAN.md) · [References](docs/ai_operating_system/REFERENCES.md) · [Viz specs](docs/ai_operating_system/VIZ_SPECS.md) |
| **From Image Management to Workflow Orchestration** — WSI as a State Machine *(35-min conference version)* | 30 | `/lecture/wsi_orchestration` | — |
| **From "Image Management" to Workflow Orchestration** — The WSI Stack as a State Machine *(full-length version)* | 41 | `/lecture/wsi_state_machine` | — |
| **Build as You Speak** — Modern AI and the Transformation of Research Infrastructure in Medicine | 39 | `/lecture/dom-grand-rounds` | — |
| **Build As You Speak** — Applied Informatics for Clinical Research | 37 | `/lecture/build_as_you_speak` | — |
| **The Transformative Effects of AI-Assisted Software Development** (Yale OneIT) | 29 | `/lecture/oneit` | — |
| **Pathology Informatics in the Age of AI** | 37 | `/lecture/pathology_informatics_ai` | — |
| Pathology Informatics at Yale — The Ask *(ITS leadership; not listed on the landing page)* | 10 | `/lecture/its-leadership` | — |

### Pathology Informatics for Residents

A practical curriculum on workflow, data, digital pathology, LIS/IMS, regulation, and AI in anatomic pathology.

| # | Title | Slides | Route | Docs |
| --- | ----- | ------ | ----- | ---- |
| 1 | Relevance of Pathology Informatics | 41 | `/lecture/intro_pathology_informatics` | [Outline](docs/Introduction/intro.md) |
| 2 | Custom Software Development in Pathology | 37 | `/lecture/custom_software_dev` | — |
| 3 | Software Development for Clinical Use (Original) | 14 | `/software_dev_clinical_use.html` | [Outline](docs/software_dev_clinical_outline.md) · [Overview](docs/software_dev_clinical_use.md) |
| 4 | Regulations, Technology, and the Future of Pathology | 30+ | `/index.html` | [Outline](docs/updated_outline.md) · [PRD](docs/PRD.md) |

Lectures 1–2 and everything under **Lectures & Talks** are JSON-driven and interactive; lectures 3–4 are
self-contained Reveal.js pages. The interactive lectures feature D3.js visualizations, live polls, and
speaker notes. All but *Relevance of Pathology Informatics* also carry a hover glossary.

## Quick Start

```bash
cd pathology-node-presentation
npm install
npm start
```

Open <http://localhost:8000> — you'll see a **landing page** where you can select any lecture.

### Development Mode

For auto-reload on file changes (useful when editing lectures):

```bash
npm run dev
```

This uses [nodemon](https://nodemon.io/) to restart the server automatically when you save changes.

## Project Structure

```text
pathology-informatics-lectures/
├── docs/                          # Lecture outlines and documentation
├── data/                          # Raw data files (breach CSV)
├── ppt_gen/                       # Python scripts for PowerPoint generation
└── pathology-node-presentation/   # Main web application
    ├── server.js                  # Express server (port 8000) + Socket.io polling
    ├── home.html                  # Landing page — lecture selector
    ├── index.html                 # Lecture 4 (self-contained Reveal.js)
    ├── software_dev_clinical_use.html  # Lecture 3 (self-contained Reveal.js)
    ├── lecture.html               # Generic shell for JSON-driven lectures
    ├── vote.html                  # Mobile vote page for live polls
    ├── css/                       # Stylesheets (theme, base, intro)
    ├── js/                        # Slide engine, visualizations, widgets
    └── data/lectures/             # JSON lecture definitions
```

## JSON-Driven Lecture System

All interactive lectures share one modular architecture:

- **`data/lectures/*.json`** — slide content, structure, glossary, speaker notes, and takeaways
- **`js/slide-engine.js`** — renders slides from JSON into Reveal.js sections
- **`js/viz-library.js`** — D3.js visualizations (Tufte timeline, Bauhaus kinetic typography, state-machine diagrams, workflow pipeline, abstraction layers, Xenonym synthesis, and more)
- **`js/widgets.js`** — interactive polls, micro-case voting, timers
- **`js/glossary.js`** — hover definitions driven by each lecture's `meta.glossary`

A slide's `type` must match a renderer in `slide-engine.js` (`title`, `content`, `two-column`,
`comparison`, `poll`, `micro-case`, `timer`, `visualization`, `workshop`, `snippets`,
`interactive-list`, `infographic`, `takeaways`, `qa`), and any `vizType` must exist in the
`viz-library.js` registry.

To create a new lecture, add a JSON file to `data/lectures/` and access it at `/lecture/<name>`.
**[`pathology-node-presentation/docs/ENGINE.md`](pathology-node-presentation/docs/ENGINE.md) is the
full contract**: slide types, the visualization API and its palettes, badges, polls, the test
harness, and the traps worth knowing before you write a visualization.

### Tests

```bash
cd pathology-node-presentation
npm test            # Playwright suite (chromium-1280)
npm run test:viz    # static analysis of every lecture's visualizations
npm run test:links  # validate every URL in every lecture
npm run shots       # screenshot a deck slide by slide, flag overflow
```

## Deployment

The application is a standard Node.js/Express server. To deploy:

1. Clone the repo on your server
2. `cd pathology-node-presentation && npm install --production`
3. `npm start` (or use a process manager like [PM2](https://pm2.keymetrics.io/))
4. Point your reverse proxy (nginx/ALB) at port 8000

Set the `PORT` environment variable to override the default port:

```bash
PORT=3000 npm start
```

## License

- **Content** (slides, text, teaching materials): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Code**: [MIT License](LICENSE)
