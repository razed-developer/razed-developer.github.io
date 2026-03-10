---
title: GitHub Pages SPA Routing
slug: github-pages-spa-routing
summary: Minimal redirect trick to keep client-side routes working on GitHub Pages.
category: troubleshooting
tags:
  - github-pages
  - deployment
  - routing
updatedAt: 2026-03-10
related:
  - react-router-basics
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

This keeps BrowserRouter URLs, but it is still a static-site workaround, not a full server rewrite.
