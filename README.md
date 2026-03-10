# Razed Pages

Static React + Vite dashboard for a public developer landing page, project directory, markdown wiki, and useful links hub. The app is structured so a future local-only private dashboard can reuse the UI with a different data source without exposing private details in the public build.

## Folder structure

```text
.
├── .github/workflows/deploy.yml
├── public/
│   └── 404.html
├── src/
│   ├── components/
│   ├── config/
│   ├── data/
│   │   ├── private/
│   │   └── public/
│   │       ├── wiki/
│   │       ├── links.json
│   │       ├── overrides.json
│   │       └── privatePlaceholders.json
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   ├── main.tsx
│   └── private-main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and set values:

```bash
VITE_GITHUB_USERNAME=your-github-username
VITE_BASE_PATH=/your-repo-name/
```

Use `VITE_BASE_PATH=/` if you deploy to a user or org site such as `username.github.io`.

3. Start the dev server:

```bash
npm run dev
```

## Build

Run a type-safe production build with:

```bash
npm run build
```

Preview the build locally with:

```bash
npm run preview
```

## Editing content

Public project metadata:

- Edit [src/data/public/overrides.json](/home/kevin/Projects/Dev/razed-pages/src/data/public/overrides.json) to customize public repo cards.
- Each override can add tags, stack, progress, todo counts, featured flags, status, custom description, and homepage URL.
- Set `hidden: true` on an override if you want to suppress a fetched public repo.

Private placeholder cards:

- Edit [src/data/public/privatePlaceholders.json](/home/kevin/Projects/Dev/razed-pages/src/data/public/privatePlaceholders.json).
- These cards are safe-by-design placeholders only. Do not include sensitive names, URLs, or implementation details.

Links:

- Edit [src/data/public/links.json](/home/kevin/Projects/Dev/razed-pages/src/data/public/links.json).

Wiki articles:

- Add markdown files under [src/data/public/wiki](/home/kevin/Projects/Dev/razed-pages/src/data/public/wiki).
- Each file uses frontmatter with:

```yaml
---
title: Example Title
slug: example-title
summary: Short summary
category: notes
tags:
  - tag-one
updatedAt: 2026-03-10
related:
  - other-article-slug
---
```

Code blocks in wiki articles render with a copy button in the article page.

## GitHub repo fetching

The projects page uses a simple public GitHub repo fetch layer:

- Username comes from `VITE_GITHUB_USERNAME`.
- The app requests public repos from `https://api.github.com/users/<username>/repos`.
- Fetched repos are merged with local overrides from `overrides.json`.
- If GitHub fetch fails, the UI falls back to local sample repo data so the page still renders.
- The app never attempts to fetch private repositories.

Relevant code:

- [src/lib/projects.ts](/home/kevin/Projects/Dev/razed-pages/src/lib/projects.ts)
- [src/lib/hooks.ts](/home/kevin/Projects/Dev/razed-pages/src/lib/hooks.ts)

## Public vs private safety

GitHub Pages is fully public. Treat everything in the deployed bundle as visible.

Rules for keeping the public build safe:

- Only the public app entry [src/main.tsx](/home/kevin/Projects/Dev/razed-pages/src/main.tsx) is used for the deployed build.
- Future private work should use [src/private-main.tsx](/home/kevin/Projects/Dev/razed-pages/src/private-main.tsx) or another separate entry point.
- Do not import files from [src/data/private](/home/kevin/Projects/Dev/razed-pages/src/data/private) into the public app.
- Keep private data in a local-only source and exclude it from any GitHub Pages workflow.

## GitHub Pages deployment

The workflow at [deploy.yml](/home/kevin/Projects/Dev/razed-pages/.github/workflows/deploy.yml) does the following on pushes to `main`:

1. Installs dependencies with `npm ci`
2. Builds the Vite app
3. Uploads `dist/`
4. Deploys to GitHub Pages

Setup steps:

1. Push this repo to GitHub.
2. In GitHub, enable Pages and select `GitHub Actions` as the source.
3. Optionally add a repository variable named `PUBLIC_GITHUB_USERNAME` if the site should fetch repos from a different public account than the repo owner.
4. Update `.env.local` for local development if needed.

Base path behavior:

- Repo site: workflow sets `VITE_BASE_PATH=/<repo-name>/`
- User/org site: workflow sets `VITE_BASE_PATH=/`

If you rename the repo, update `.env.local` and any docs or badges that reference the old name. The GitHub Actions workflow automatically adjusts the base path in CI for repo-name changes.

## Future private mode

The current app ships in public mode only. A future local-only private dashboard can be added safely by:

1. Creating a separate private data loader that reads local-only sources.
2. Wiring a separate entry point from [src/private-main.tsx](/home/kevin/Projects/Dev/razed-pages/src/private-main.tsx).
3. Keeping private-only imports isolated from the public app entry and public routes.
4. Never deploying the private build to GitHub Pages.

## Warning

Do not place secrets, internal repo names, private URLs, or sensitive notes anywhere that the public build imports. GitHub Pages is static hosting only and offers no backend secrecy.
