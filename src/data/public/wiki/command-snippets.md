---
title: Project Commands
slug: command-snippets
summary: Common commands for the public developer site, local verification, and GitHub Pages deployment flow.
category: commands
tags:
  - npm
  - build
  - github-pages
updatedAt: 2026-03-10
---

## Project commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run deploy
```

## Notes

- `npm run deploy` assumes your branch is committed and pushes `main`.
- Keep the public build reproducible and static.
- Any future private mode should stay on a separate local-only entry point and data source.
