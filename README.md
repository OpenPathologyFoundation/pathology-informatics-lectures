# Pathology Informatics Lectures

Interactive web-based lectures for pathology residents, built with Reveal.js, D3.js, and a custom JSON-driven slide engine.

**Author:** Peter Gershkovich, MD. MHA — Yale University School of Medicine

## Available Lectures

| # | Title | Slides | Type | Docs |
| --- | ----- | ------ | ---- | ---- |
| ★ | **The Transformative Effects of AI-Assisted Software Development** (Yale OneIT) | 29 | Interactive · JSON-driven | — |
| ★ | **Pathology Informatics in the Age of AI** | 37 | Interactive · JSON-driven | — |
| 1 | Relevance of Pathology Informatics | 41 | Interactive · JSON-driven | [Outline](docs/Introduction/intro.md) |
| 2 | Custom Software Development in Pathology | 37 | Interactive · JSON-driven | — |
| 3 | Software Development for Clinical Use (Original) | 14 | Reveal.js | [Outline](docs/software_dev_clinical_outline.md) · [Overview](docs/software_dev_clinical_use.md) |
| 4 | Regulations, Technology, and the Future of Pathology | 30+ | Reveal.js | [Outline](docs/updated_outline.md) · [PRD](docs/PRD.md) |

All interactive lectures feature D3.js visualizations, live polls, and speaker notes.

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
    ├── server.js                  # Express server (port 8000)
    ├── home.html                  # Landing page — lecture selector
    ├── index.html                 # Lecture 1 (self-contained Reveal.js)
    ├── software_dev_clinical_use.html  # Lecture 2
    ├── lecture.html               # Generic shell for JSON-driven lectures
    ├── css/                       # Stylesheets (theme, base, intro)
    ├── js/                        # Slide engine, visualizations, widgets
    └── data/lectures/             # JSON lecture definitions
```

## JSON-Driven Lecture System

The interactive lectures (OneIT, Relevance of Pathology Informatics, Custom Software Development) use a modular architecture:

- **`data/lectures/*.json`** — slide content, structure, speaker notes, and takeaways
- **`js/slide-engine.js`** — renders slides from JSON into Reveal.js sections
- **`js/viz-library.js`** — D3.js visualizations (Tufte timeline, Bauhaus kinetic typography, workflow pipeline, abstraction layers, Xenonym synthesis, and more)
- **`js/widgets.js`** — interactive polls, micro-case voting, timers

To create a new lecture, add a JSON file to `data/lectures/` and access it at `/lecture/<name>`.

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
