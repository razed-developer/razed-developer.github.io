export type ProjectStatus = 'idea' | 'active' | 'paused' | 'done' | 'archived' | 'wip';
export type ProjectVisibility = 'public' | 'private';
export type WikiCategory = 'snippets' | 'setup' | 'commands' | 'troubleshooting' | 'notes';

export interface RepoOverride {
  id: string;
  repoName: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  stack: string[];
  progress: number;
  todoOpen: number;
  todoClosed: number;
  featured?: boolean;
  hidden?: boolean;
  status?: ProjectStatus;
  homepageUrl?: string;
  lastUpdatedText?: string;
}

export interface PrivatePlaceholderProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  visibility: 'private';
  status: 'wip' | 'active' | 'idea' | 'paused';
  tags: string[];
  stack: string[];
  progress: number;
  todoOpen: number;
  todoClosed: number;
  featured?: boolean;
  lastUpdatedText?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pinned?: boolean;
}

export interface WikiFrontmatter {
  title: string;
  slug: string;
  summary: string;
  category: WikiCategory;
  tags: string[];
  updatedAt: string;
  related?: string[];
}

export interface WikiArticle extends WikiFrontmatter {
  content: string;
}

export interface ProjectCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  tags: string[];
  stack: string[];
  progress: number;
  todoOpen: number;
  todoClosed: number;
  featured: boolean;
  repoUrl?: string;
  homepageUrl?: string;
  updatedAt?: string;
  lastUpdatedText?: string;
}
