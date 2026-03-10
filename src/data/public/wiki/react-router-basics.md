---
title: React Router Basics
slug: react-router-basics
summary: Quick notes for route structure, nested layouts, and navigation setup.
category: setup
tags:
  - react
  - routing
  - vite
updatedAt: 2026-03-10
related:
  - github-pages-spa-routing
---

## Route layout pattern

Use a shared layout route for navigation and footer chrome so page routes only focus on content.

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
- Prefer typed route params for article pages.
- For GitHub Pages, add a redirect-based fallback for direct deep links.
