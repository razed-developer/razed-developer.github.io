export const siteConfig = {
  title: 'Razed Developer',
  subtitle: 'Public developer dashboard, project directory, and markdown notes.',
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME?.trim() || 'razed-developer',
  mode: 'public' as const,
  localEditorEnabled:
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_EDITOR?.trim() === 'true',
};
