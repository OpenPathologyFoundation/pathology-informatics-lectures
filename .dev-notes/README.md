# .dev-notes/ — local working notes

This directory is for **local, uncommitted** working material. Only this `README.md` is tracked; everything else you drop in here stays out of git.

This repository is public (OpenPathologyFoundation). The IRB and the security review keep internal documents, department data and people's names off it. That material has two local homes: `docs/<lecture>/research/` for the notes behind one lecture, and this directory for everything else.

## What goes here

- Measurements and analyses behind a slide that cannot be published as they are: per-person numbers, internal documents, institution data. The slide carries the aggregate; the working copy lives here.
- Session notes: what was asked, what was decided, what was left open.
- Scratch scripts with their outputs, when they would otherwise disappear with the session scratchpad.
- Draft pull-request descriptions before the pull request is opened.

## What does not

- Anything that should ship with a lecture → `docs/<lecture>/{README,PLAN,REFERENCES,VIZ_SPECS}.md`, with the internal details left out.
- Secrets. Not a credential, not a token, not a connection string. Untracked is not private: these files sit in the working copy and in every backup of it.
- Names on slides. The rule for this repository's lectures is aggregate figures and roles on the slide; the names stay in a note here.

## Convention

- **Filename:** `YYYY-MM-DD-short-slug.md` — the date of the work plus a three-to-five-word slug naming the outcome (e.g. `2026-10-20-git-yale-productivity-stats.md`).
- A note's scripts and data go in a subfolder named for the note's subject (e.g. `gitstats/`), with the note saying how to run them again.
- **Suggested sections:** Summary · Why · Method · What went into the deck · Follow-ups.
- Nothing here is authoritative. A decision that must outlive the session belongs in the lecture's `docs/` folder.

## How this directory stays tracked but empty

The repository `.gitignore` carries:

```
.dev-notes/*
!.dev-notes/README.md
```

That keeps the directory in every fresh clone while ignoring everything else inside it. To version a file here for real, move it out of `.dev-notes/`.
