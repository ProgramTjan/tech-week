# AGENTS.md — Cursor agent conventions for this repo

## What this repo is

A **single live static-site slot** hosted on GitHub Pages at
<https://programtjan.github.io/tech-week/>.
Each publish **replaces** the root content entirely — there are no weekly
archive folders unless the user explicitly requests them.

The current site is a Dutch-language interactive travel guide (Madeira).
Content changes frequently; the topic is whatever AJ needs next.

## Tech stack

| Layer | Detail |
|-------|--------|
| HTML  | `index.html` at repo root |
| CSS   | `styles.css` (relative link from `index.html`) |
| JS    | `app.js` (vanilla, no framework, no bundler) |
| Build | **None** — no npm, no bundler, no CI workflow |
| Deploy | GitHub Pages, **`main` branch / root** (deploy-from-branch mode) |

There is no `package.json`, no test suite, and no linter configured.
Do **not** introduce a build step unless the user explicitly asks for one.

## How to publish changes

1. Edit or replace `index.html`, `styles.css`, and/or `app.js` in the repo
   root.
2. Keep all asset references **relative** (`href="styles.css"`,
   `src="app.js"`). No leading `/` or absolute URLs for local assets.
3. Commit to `main` (via PR preferred) — GitHub Pages auto-deploys within
   seconds to minutes.

### Adding images or other assets

Place them in the repo root (or a subfolder if many) and reference with
relative paths. Keep filenames lowercase, no spaces.

## Safety rules

- **No force-push** to `main`.
- **No secrets** in committed files.
- **No unrelated refactors** — stay scoped to the requested change.
- Prefer a **PR with clear commits** over direct pushes to `main`.
- **Do not break relative asset links** — if you rename or move a file,
  update every reference.
- Do not delete files that are still referenced by `index.html`.

## Language

User-facing site content is often **Dutch** (Nederlands) when that is the
brief. Agent-facing files (this file, README, commit messages) are English.

## Verification after changes

After modifying the site:

1. If possible, `curl -sS -o /dev/null -w '%{http_code}'
   https://programtjan.github.io/tech-week/` should return **200**.
2. GitHub Pages may cache for up to ~10 minutes. If you get a stale
   response, note the cache delay rather than assuming failure.
3. Validate that `index.html` is well-formed HTML (no unclosed tags,
   valid `<script>`/`<link>` references).

## Repo structure (current)

```
.
├── AGENTS.md      ← this file
├── README.md      ← short project description + live URL
├── index.html     ← the site
├── styles.css     ← styles
└── app.js         ← interactive UI logic (vanilla JS)
```

## Conventions for new content publishes

When the user asks to publish a **new** site (different topic):

1. Replace `index.html` with the new content.
2. Replace or update `styles.css` and `app.js` as needed.
3. Update `README.md` to reflect the new topic and keep the Pages URL.
4. Do **not** archive old content into subfolders unless asked.
