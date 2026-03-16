import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const repoRoot = process.cwd();
const configPath = path.join(repoRoot, 'private-repos.config.local.json');

function printUsage() {
  console.log(`Usage:
  source .env.private
  npm run select:private

What it does:
  1. Fetches all owned private repos from GitHub
  2. Lets you choose which ones to track locally
  3. Writes them into private-repos.config.local.json with safe defaults`);
}

async function fetchJson(url, token) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'razed-developer-private-selector'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} for ${url}`);
  }

  return response.json();
}

async function fetchAllPrivateRepos(owner, token) {
  const repos = [];

  for (let page = 1; page <= 10; page += 1) {
    const pageRepos = await fetchJson(
      `https://api.github.com/user/repos?visibility=private&affiliation=owner&sort=updated&per_page=100&page=${page}`,
      token,
    );

    if (!Array.isArray(pageRepos) || pageRepos.length === 0) {
      break;
    }

    repos.push(...pageRepos.filter((repo) => repo.owner?.login === owner && repo.private));

    if (pageRepos.length < 100) {
      break;
    }
  }

  return repos;
}

async function readExistingConfig() {
  try {
    return JSON.parse(await fs.readFile(configPath, 'utf8'));
  } catch {
    return { repos: [] };
  }
}

function createDefaultEntry(repoName) {
  return {
    repoName,
    enabled: true,
    shareToPublic: false,
    publicCard: {
      id: `private-${repoName}`,
      slug: `private-${repoName}`,
      title: '',
      description: '',
      status: 'wip',
      tags: ['private', 'wip'],
      stack: [],
      progress: 0,
      todoOpen: 0,
      todoClosed: 0,
      featured: false,
      lastUpdatedText: '',
      useFetched: {
        repoNameAsTitle: false,
        description: false,
        primaryLanguageAsStack: false,
        updatedAtAsLastUpdatedText: false,
      },
    },
  };
}

function mergeSelections(existingConfig, selectedRepoNames) {
  const existingMap = new Map((existingConfig.repos || []).map((repo) => [repo.repoName, repo]));
  const nextRepos = [...(existingConfig.repos || [])];

  for (const repoName of selectedRepoNames) {
    if (!existingMap.has(repoName)) {
      nextRepos.push(createDefaultEntry(repoName));
    }
  }

  nextRepos.sort((a, b) => a.repoName.localeCompare(b.repoName));
  return { repos: nextRepos };
}

function parseSelection(inputValue, max) {
  const trimmed = inputValue.trim().toLowerCase();

  if (trimmed === 'all') {
    return Array.from({ length: max }, (_, index) => index + 1);
  }

  return Array.from(
    new Set(
      trimmed
        .split(',')
        .map((part) => Number(part.trim()))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= max),
    ),
  );
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'razed-developer';

  if (!token) {
    throw new Error('GITHUB_TOKEN is required. Load it from a local non-committed env file.');
  }

  const repos = await fetchAllPrivateRepos(owner, token);

  if (repos.length === 0) {
    console.log('No owned private repos found for selection.');
    process.exit(0);
  }

  console.log('Private repos available for local tracking:\n');
  repos.forEach((repo, index) => {
    const language = repo.language ? ` | ${repo.language}` : '';
    const description = repo.description ? ` | ${repo.description}` : '';
    console.log(`${index + 1}. ${repo.name}${language}${description}`);
  });

  const rl = readline.createInterface({ input, output });
  const answer = await rl.question('\nEnter repo numbers separated by commas, or type "all": ');
  rl.close();

  const selection = parseSelection(answer, repos.length);

  if (selection.length === 0) {
    throw new Error('No valid repo selections were provided.');
  }

  const selectedRepoNames = selection.map((index) => repos[index - 1].name);
  const existingConfig = await readExistingConfig();
  const nextConfig = mergeSelections(existingConfig, selectedRepoNames);

  await fs.writeFile(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`, 'utf8');
  console.log(`\nAdded ${selectedRepoNames.length} repo selection(s) to private-repos.config.local.json`);
}

main().catch((error) => {
  console.error(`select:private failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
