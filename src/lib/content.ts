import linksData from '../data/public/links.json';
import overridesData from '../data/public/overrides.json';
import privatePlaceholdersData from '../data/public/privatePlaceholders.json';
import type {
  LinkItem,
  PrivatePlaceholderProject,
  RepoOverride,
  WikiArticle,
  WikiFrontmatter,
} from '../types/content';

const wikiModules = import.meta.glob('../data/public/wiki/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseScalar(value: string): string {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

function parseFrontmatter(raw: string): WikiArticle {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    throw new Error('Markdown file is missing frontmatter.');
  }

  const [, frontmatterBlock, content] = match;
  const lines = frontmatterBlock.split('\n');
  const frontmatter: Record<string, string | string[]> = {};
  let activeListKey: string | null = null;

  for (const line of lines) {
    if (line.startsWith('  - ') && activeListKey) {
      const current = (frontmatter[activeListKey] as string[]) ?? [];
      current.push(parseScalar(line.replace('  - ', '')));
      frontmatter[activeListKey] = current;
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);

    if (!keyValueMatch) {
      activeListKey = null;
      continue;
    }

    const [, key, rawValue] = keyValueMatch;

    if (rawValue === '') {
      frontmatter[key] = [];
      activeListKey = key;
      continue;
    }

    frontmatter[key] = parseScalar(rawValue);
    activeListKey = null;
  }

  return {
    ...(frontmatter as unknown as WikiFrontmatter),
    content: content.trim(),
  };
}

export function getLinks(): LinkItem[] {
  return linksData as LinkItem[];
}

export function getRepoOverrides(): RepoOverride[] {
  return overridesData as RepoOverride[];
}

export function getPrivatePlaceholders(): PrivatePlaceholderProject[] {
  return privatePlaceholdersData as PrivatePlaceholderProject[];
}

export function getWikiArticles(): WikiArticle[] {
  return Object.values(wikiModules)
    .map((raw) => parseFrontmatter(raw))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function getWikiArticleBySlug(slug: string): WikiArticle | undefined {
  return getWikiArticles().find((article) => article.slug === slug);
}
