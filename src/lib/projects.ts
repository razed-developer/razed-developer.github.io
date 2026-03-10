import type { ProjectCardData, ProjectStatus, RepoOverride } from '../types/content';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  archived: boolean;
  topics?: string[];
  language: string | null;
}

const fallbackPublicRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'razed-pages',
    description: 'Public developer landing dashboard and wiki.',
    html_url: 'https://github.com/example/razed-pages',
    homepage: '',
    pushed_at: '2026-03-09T18:00:00Z',
    archived: false,
    topics: ['dashboard', 'wiki', 'react'],
    language: 'TypeScript',
  },
  {
    id: 2,
    name: 'design-system-lab',
    description: 'Component patterns and UI experiments.',
    html_url: 'https://github.com/example/design-system-lab',
    homepage: '',
    pushed_at: '2026-03-06T16:30:00Z',
    archived: false,
    topics: ['ui', 'design-system'],
    language: 'TypeScript',
  },
  {
    id: 3,
    name: 'cli-toolkit',
    description: 'Reusable command-line automation.',
    html_url: 'https://github.com/example/cli-toolkit',
    homepage: '',
    pushed_at: '2026-02-25T11:15:00Z',
    archived: false,
    topics: ['cli', 'automation'],
    language: 'TypeScript',
  },
];

function inferStatus(repo: GitHubRepo, override?: RepoOverride): ProjectStatus {
  if (override?.status) {
    return override.status;
  }

  if (repo.archived) {
    return 'archived';
  }

  return 'active';
}

function formatUpdatedLabel(updatedAt: string): string {
  const date = new Date(updatedAt);

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function mergePublicReposWithOverrides(
  repos: GitHubRepo[],
  overrides: RepoOverride[],
): ProjectCardData[] {
  const overrideMap = new Map(overrides.map((override) => [override.repoName, override]));

  return repos
    .map<ProjectCardData | null>((repo) => {
      const override = overrideMap.get(repo.name);

      if (override?.hidden) {
        return null;
      }

      return {
        id: override?.id || String(repo.id),
        slug: override?.slug || repo.name,
        title: override?.title || repo.name,
        description: override?.description || repo.description || 'Public repository with no custom summary yet.',
        visibility: 'public' as const,
        status: inferStatus(repo, override),
        tags: override?.tags || repo.topics || [],
        stack: override?.stack || ([repo.language].filter(Boolean) as string[]),
        progress: override?.progress ?? 0,
        todoOpen: override?.todoOpen ?? 0,
        todoClosed: override?.todoClosed ?? 0,
        featured: override?.featured ?? false,
        repoUrl: repo.html_url,
        homepageUrl: override?.homepageUrl || repo.homepage || undefined,
        updatedAt: repo.pushed_at,
        lastUpdatedText: override?.lastUpdatedText || formatUpdatedLabel(repo.pushed_at),
      };
    })
    .filter((project): project is ProjectCardData => project !== null);
}

export async function fetchPublicRepos(username: string): Promise<GitHubRepo[]> {
  if (!username) {
    return fallbackPublicRepos;
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
  );

  if (!response.ok) {
    throw new Error(`GitHub API request failed with ${response.status}`);
  }

  const repos = (await response.json()) as GitHubRepo[];
  return repos.filter((repo) => !repo.archived || repo.name);
}

export function getFallbackPublicRepos(): GitHubRepo[] {
  return fallbackPublicRepos;
}
