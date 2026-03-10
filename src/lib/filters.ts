import type { LinkItem, ProjectCardData, WikiArticle } from '../types/content';

function includesQuery(values: string[], query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return values.some((value) => value.toLowerCase().includes(normalized));
}

export function filterProjects(
  projects: ProjectCardData[],
  options: {
    query: string;
    status: string;
    tag: string;
    stack: string;
    visibility: string;
  },
): ProjectCardData[] {
  return projects.filter((project) => {
    const matchesQuery = includesQuery(
      [project.title, project.description, ...project.tags, ...project.stack],
      options.query,
    );
    const matchesStatus = options.status === 'all' || project.status === options.status;
    const matchesTag = options.tag === 'all' || project.tags.includes(options.tag);
    const matchesStack = options.stack === 'all' || project.stack.includes(options.stack);
    const matchesVisibility =
      options.visibility === 'all' || project.visibility === options.visibility;

    return matchesQuery && matchesStatus && matchesTag && matchesStack && matchesVisibility;
  });
}

export function sortProjects(projects: ProjectCardData[], sortBy: string): ProjectCardData[] {
  const sorted = [...projects];

  sorted.sort((left, right) => {
    if (sortBy === 'progress') {
      return right.progress - left.progress;
    }

    if (sortBy === 'updated') {
      return (right.updatedAt || '').localeCompare(left.updatedAt || '');
    }

    if (sortBy === 'status') {
      return left.status.localeCompare(right.status);
    }

    return left.title.localeCompare(right.title);
  });

  return sorted;
}

export function filterWiki(
  articles: WikiArticle[],
  options: { query: string; category: string; tag: string },
): WikiArticle[] {
  return articles.filter((article) => {
    const matchesQuery = includesQuery(
      [article.title, article.summary, article.category, ...article.tags],
      options.query,
    );
    const matchesCategory = options.category === 'all' || article.category === options.category;
    const matchesTag = options.tag === 'all' || article.tags.includes(options.tag);

    return matchesQuery && matchesCategory && matchesTag;
  });
}

export function filterLinks(
  links: LinkItem[],
  options: { query: string; category: string; tag: string },
): LinkItem[] {
  return links.filter((link) => {
    const matchesQuery = includesQuery(
      [link.title, link.description, link.category, ...link.tags],
      options.query,
    );
    const matchesCategory = options.category === 'all' || link.category === options.category;
    const matchesTag = options.tag === 'all' || link.tags.includes(options.tag);

    return matchesQuery && matchesCategory && matchesTag;
  });
}

export function sortLinks(links: LinkItem[], sortBy: string): LinkItem[] {
  const sorted = [...links];

  sorted.sort((left, right) => {
    if (sortBy === 'pinned') {
      return Number(Boolean(right.pinned)) - Number(Boolean(left.pinned));
    }

    if (sortBy === 'category') {
      return left.category.localeCompare(right.category);
    }

    return left.title.localeCompare(right.title);
  });

  return sorted;
}
