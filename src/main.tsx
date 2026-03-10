import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { WikiIndexPage } from './pages/WikiIndexPage';
import { WikiArticlePage } from './pages/WikiArticlePage';
import { LinksPage } from './pages/LinksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/index.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'projects',
          element: <ProjectsPage />,
        },
        {
          path: 'wiki',
          element: <WikiIndexPage />,
        },
        {
          path: 'wiki/:slug',
          element: <WikiArticlePage />,
        },
        {
          path: 'links',
          element: <LinksPage />,
        },
        {
          path: 'not-found',
          element: <NotFoundPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

const redirect = new URLSearchParams(window.location.search).get('redirect');

if (redirect && redirect.startsWith('/')) {
  window.history.replaceState({}, '', redirect);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
