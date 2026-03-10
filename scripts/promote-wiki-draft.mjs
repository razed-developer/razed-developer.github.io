import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const draftsDir = path.join(repoRoot, 'drafts', 'wiki');
const publicWikiDir = path.join(repoRoot, 'src', 'data', 'public', 'wiki');

function printUsage() {
  console.log(`Usage:
  npm run publish:draft -- <draft-file>
  npm run publish:draft -- <draft-file> --copy

Examples:
  npm run publish:draft -- drafts/wiki/my-article.md
  npm run publish:draft -- my-article.md
  npm run publish:draft -- my-article.md --copy`);
}

function resolveDraftPath(input) {
  if (!input) {
    throw new Error('Missing draft file argument.');
  }

  if (path.isAbsolute(input)) {
    return input;
  }

  if (input.startsWith('drafts/')) {
    return path.join(repoRoot, input);
  }

  return path.join(draftsDir, input);
}

function frontmatterValue(markdown, key) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return null;
  }

  const frontmatter = match[1];
  const keyMatch = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));

  return keyMatch ? keyMatch[1].trim() : null;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const keepDraft = args.includes('--copy');
  const draftArg = args.find((arg) => !arg.startsWith('--'));

  if (!draftArg) {
    printUsage();
    throw new Error('A draft markdown file is required.');
  }

  const draftPath = resolveDraftPath(draftArg);
  const markdown = await fs.readFile(draftPath, 'utf8');
  const slug = frontmatterValue(markdown, 'slug');
  const title = frontmatterValue(markdown, 'title');

  if (!markdown.startsWith('---\n')) {
    throw new Error('Draft is missing frontmatter.');
  }

  if (!slug) {
    throw new Error('Draft frontmatter is missing a slug.');
  }

  if (!title) {
    throw new Error('Draft frontmatter is missing a title.');
  }

  const destinationPath = path.join(publicWikiDir, `${slug}.md`);

  try {
    await fs.access(destinationPath);
    throw new Error(`Destination already exists: ${path.relative(repoRoot, destinationPath)}`);
  } catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  if (keepDraft) {
    await fs.copyFile(draftPath, destinationPath);
  } else {
    await fs.rename(draftPath, destinationPath);
  }

  console.log(`${keepDraft ? 'Copied' : 'Moved'} "${title}" to ${path.relative(repoRoot, destinationPath)}`);
}

main().catch((error) => {
  console.error(`publish:draft failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
