export const siteConfig = {
  title: 'Razed Pages',
  subtitle: 'Public developer landing dashboard, project directory, and markdown wiki.',
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME?.trim() || '',
  mode: 'public' as const,
};
