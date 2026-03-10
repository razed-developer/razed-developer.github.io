---
title: GitHub Pages App Routing
slug: github-pages-app-routing
summary: Notes for keeping BrowserRouter routes working cleanly on a static GitHub Pages deployment.
category: setup
tags:
  - github-pages
  - react-router
  - deployment
updatedAt: 2026-03-10
related:
  - github-pages-spa-routing
---

## Route layout pattern

Keep one shared layout route for the navbar and footer so pages stay focused on content and GitHub Pages only has to boot a single app shell.

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
    ],
  },
]);
```

## Notes

- Keep page data loading isolated from layout concerns.
- Prefer typed route params for article pages like `/wiki/:slug`.
- For GitHub Pages, pair `BrowserRouter` with a redirect-based `404.html` fallback.
