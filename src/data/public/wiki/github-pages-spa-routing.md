---
title: GitHub Pages SPA Routing
slug: github-pages-spa-routing
summary: Minimal redirect strategy for preserving deep links on the public dashboard deployed to GitHub Pages.
category: troubleshooting
tags:
  - github-pages
  - deployment
  - routing
updatedAt: 2026-03-10
related:
  - github-pages-app-routing
---

## Problem

GitHub Pages serves static files, so direct requests to `/wiki/some-article` fail unless the host knows how to rewrite that request to `index.html`.

## Minimal fix

Use a `404.html` page that redirects back into the main app with the original path encoded as a query string.

```html
<script>
  const redirectTarget = `/?redirect=${encodeURIComponent(window.location.pathname)}`;
  window.location.replace(redirectTarget);
</script>
```

## Tradeoff

This keeps clean BrowserRouter URLs for the public site, but it is still a static-host workaround rather than a real server-side rewrite.
