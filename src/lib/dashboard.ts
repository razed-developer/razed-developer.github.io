import type { ProjectCardData, WikiArticle } from '../types/content';

export function getCompletionRate(projects: ProjectCardData[]): number {
  if (projects.length === 0) {
    return 0;
  }

  const total = projects.reduce((sum, project) => sum + project.progress, 0);
  return Math.round(total / projects.length);
}

export function getTodoSummary(projects: ProjectCardData[]): { open: number; closed: number } {
  return projects.reduce(
    (accumulator, project) => ({
      open: accumulator.open + project.todoOpen,
      closed: accumulator.closed + project.todoClosed,
    }),
    { open: 0, closed: 0 },
  );
}

export function getRecentArticles(articles: WikiArticle[], count = 3): WikiArticle[] {
  return [...articles]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, count);
}
