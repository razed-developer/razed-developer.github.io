import { useEffect, useState } from 'react';
import { siteConfig } from '../config/site';
import { getPrivatePlaceholders, getRepoOverrides } from './content';
import { fetchPublicRepos, getFallbackPublicRepos, mergePublicReposWithOverrides } from './projects';
import type { ProjectCardData } from '../types/content';

interface UseProjectsState {
  projects: ProjectCardData[];
  loading: boolean;
  error: string | null;
}

export function useProjects(): UseProjectsState {
  const [state, setState] = useState<UseProjectsState>({
    projects: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const overrides = getRepoOverrides();
    const privateProjects = getPrivatePlaceholders().map((project) => ({
      ...project,
      featured: project.featured ?? false,
    }));

    async function load(): Promise<void> {
      try {
        const repos = await fetchPublicRepos(siteConfig.githubUsername);

        if (cancelled) {
          return;
        }

        setState({
          projects: [...mergePublicReposWithOverrides(repos, overrides), ...privateProjects],
          loading: false,
          error: null,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          projects: [...mergePublicReposWithOverrides(getFallbackPublicRepos(), overrides), ...privateProjects],
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load GitHub repositories.',
        });
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
