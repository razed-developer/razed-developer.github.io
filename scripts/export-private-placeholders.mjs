import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const snapshotPath = path.join(repoRoot, 'private-repos.snapshot.local.json');
const placeholdersPath = path.join(repoRoot, 'src', 'data', 'public', 'privatePlaceholders.json');

function printUsage() {
  console.log(`Usage:
  npm run share:private

Prerequisite:
  Run npm run sync:private first so private-repos.snapshot.local.json exists.`);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function assertValidPublicCard(entry) {
  const requiredFields = [
    'id',
    'slug',
    'status',
    'tags',
    'progress',
    'todoOpen',
    'todoClosed'
  ];

  for (const field of requiredFields) {
    if (!(field in entry)) {
      throw new Error(`publicCard for ${entry.id || 'unknown'} is missing "${field}"`);
    }
  }
}

function formatUpdatedLabel(updatedAt) {
  if (!updatedAt) {
    return 'Updated manually';
  }

  const date = new Date(updatedAt);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function titleFromRepoName(repoName) {
  return repoName
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toPlaceholder(entry) {
  const card = { ...entry.publicCard };
  const useFetched = card.useFetched || {};
  const fetched = entry.fetched || {};
  assertValidPublicCard(card);

  const title = useFetched.repoNameAsTitle
    ? titleFromRepoName(fetched.repoName || entry.repoName)
    : card.title;
  const description = useFetched.description
    ? fetched.description || card.description || 'Private project in progress.'
    : card.description;
  const stack = useFetched.primaryLanguageAsStack
    ? Array.from(new Set([...(card.stack || []), ...(fetched.language ? [fetched.language] : [])]))
    : card.stack;
  const lastUpdatedText = useFetched.updatedAtAsLastUpdatedText
    ? formatUpdatedLabel(fetched.updatedAt)
    : card.lastUpdatedText || 'Updated manually';

  if (!title) {
    throw new Error(`publicCard for ${card.id} needs a title or useFetched.repoNameAsTitle=true`);
  }

  if (!description) {
    throw new Error(`publicCard for ${card.id} needs a description or useFetched.description=true`);
  }

  if (!stack || stack.length === 0) {
    throw new Error(`publicCard for ${card.id} needs stack entries or useFetched.primaryLanguageAsStack=true`);
  }

  return {
    id: card.id,
    slug: card.slug,
    title,
    description,
    visibility: 'private',
    status: 'wip',
    tags: Array.from(new Set([...(card.tags || []), 'private', 'wip'])),
    stack,
    progress: card.progress,
    todoOpen: card.todoOpen,
    todoClosed: card.todoClosed,
    featured: Boolean(card.featured),
    lastUpdatedText
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  let snapshot;
  try {
    snapshot = await readJson(snapshotPath);
  } catch {
    throw new Error('Missing private-repos.snapshot.local.json. Run npm run sync:private first.');
  }

  const currentPlaceholders = await readJson(placeholdersPath);
  const sharedEntries = (snapshot.repos || []).filter((repo) => repo.shareToPublic && repo.publicCard);
  const sharedIds = new Set(sharedEntries.map((repo) => repo.publicCard.id));
  const preservedManualEntries = currentPlaceholders.filter((entry) => !sharedIds.has(entry.id));
  const exportedEntries = sharedEntries.map(toPlaceholder);
  const nextPlaceholders = [...preservedManualEntries, ...exportedEntries];

  await fs.writeFile(placeholdersPath, `${JSON.stringify(nextPlaceholders, null, 2)}\n`, 'utf8');
  console.log(`Exported ${exportedEntries.length} private placeholder cards to src/data/public/privatePlaceholders.json`);
}

main().catch((error) => {
  console.error(`share:private failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
