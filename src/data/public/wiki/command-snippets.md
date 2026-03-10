---
title: Useful Command Snippets
slug: command-snippets
summary: Common commands for development, type checks, and production builds.
category: commands
tags:
  - npm
  - build
  - typescript
updatedAt: 2026-03-10
---

## Project commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Quick tip

Keep the public build reproducible. If private-mode experiments require local-only files, put them behind a separate entry point and do not import them from the public app.
