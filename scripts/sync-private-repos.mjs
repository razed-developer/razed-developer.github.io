import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const configPath = path.join(repoRoot, 'private-repos.config.local.json');
const snapshotPath = path.join(repoRoot, 'private-repos.snapshot.local.json');

function printUsage() {
  console.log(`Usage:
  source .env.private
  npm run sync:private

Setup:
  1. Copy private-repos.config.example.json to private-repos.config.local.json
  2. Add only the private repo names you want to sync
  3. Set GITHUB_TOKEN in a local non-committed env file`);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function fetchJson(url, token) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'razed-developer-private-sync'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} for ${url}`);
  }

  return response.json();
}

async function fetchRepo(owner, repoName, token) {
  const repo = await fetchJson(`https://api.github.com/repos/${owner}/${repoName}`, token);
  const languages = await fetchJson(repo.languages_url, token);

  return {
    repoName: repo.name,
    fullName: repo.full_name,
    visibility: repo.visibility,
    private: repo.private,
    description: repo.description || '',
    homepageUrl: repo.homepage || '',
    language: repo.language,
    languages,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    defaultBranch: repo.default_branch,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    size: repo.size,
    archived: repo.archived,
    disabled: repo.disabled,
    fork: repo.fork,
    forks: repo.forks_count ?? 0,
    stargazers: repo.stargazers_count ?? 0,
    watchers: repo.watchers_count ?? 0,
    openIssues: repo.open_issues_count ?? 0,
    hasIssues: Boolean(repo.has_issues),
    hasProjects: Boolean(repo.has_projects),
    hasWiki: Boolean(repo.has_wiki),
    hasPages: Boolean(repo.has_pages),
    hasDiscussions: Boolean(repo.has_discussions),
    license: repo.license
      ? {
          key: repo.license.key,
          name: repo.license.name,
          spdxId: repo.license.spdx_id
        }
      : null,
    allowForking: Boolean(repo.allow_forking),
    isTemplate: Boolean(repo.is_template),
    webUrl: repo.html_url,
    apiUrl: repo.url
  };
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

  let config;
  try {
    config = await readJson(configPath);
  } catch {
    throw new Error('Missing private-repos.config.local.json. Copy it from private-repos.config.example.json first.');
  }

  const repos = (config.repos || []).filter((repo) => repo.enabled !== false);

  if (repos.length === 0) {
    throw new Error('No enabled repos found in private-repos.config.local.json');
  }

  const synced = [];

  for (const repo of repos) {
    const repoData = await fetchRepo(owner, repo.repoName, token);
    synced.push({
      repoName: repo.repoName,
      shareToPublic: Boolean(repo.shareToPublic),
      publicCard: repo.publicCard || null,
      fetched: repoData
    });
  }

  await fs.writeFile(
    snapshotPath,
    `${JSON.stringify(
      {
        owner,
        syncedAt: new Date().toISOString(),
        repos: synced
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  console.log(`Synced ${synced.length} private repos to ${path.basename(snapshotPath)}`);
}

main().catch((error) => {
  console.error(`sync:private failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
