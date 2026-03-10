# TODO

## Immediate next steps

- Replace sample repo metadata in [src/data/public/overrides.json](/home/kevin/Projects/Dev/razed-developer.github.io/src/data/public/overrides.json) with real public project entries.
- Replace placeholder links in [src/data/public/links.json](/home/kevin/Projects/Dev/razed-developer.github.io/src/data/public/links.json) with the actual curated resources you want to surface.
- Add a first real batch of wiki notes under [src/data/public/wiki](/home/kevin/Projects/Dev/razed-developer.github.io/src/data/public/wiki).
- Set `VITE_GITHUB_USERNAME` for your real public GitHub account and confirm the fetched repo list is correct.
- Review the current private placeholder cards in [src/data/public/privatePlaceholders.json](/home/kevin/Projects/Dev/razed-developer.github.io/src/data/public/privatePlaceholders.json) and make them match the level of vagueness you want publicly.

## Content and UX polish

- Write a stronger home page intro that matches your public identity and current focus.
- Choose which projects should be `featured` and tune their progress, tags, stack, and status.
- Add more wiki categories and tags so search/filtering becomes genuinely useful.
- Improve empty states and loading states with more intentional copy.
- Add social/profile links or a public contact section if this is intended to be a public-facing landing page.

## Projects page improvements

- Add an explicit filter toggle for featured projects.
- Decide whether archived public repos should be shown by default or hidden unless filtered in.
- Improve sorting by using a normalized status order instead of plain alphabetical order.
- Add repo language/topic normalization so GitHub API output looks cleaner across cards.
- Consider persisting search/filter state in the URL for shareable filtered views.

## Wiki improvements

- Add more code-heavy notes to validate the copy-to-clipboard flow across real content.
- Add a generated wiki index or manifest layer if markdown volume grows.
- Add table-of-contents support for longer articles.
- Add syntax highlighting if you want richer code presentation beyond plain fenced blocks.
- Add “related articles” more systematically rather than only through manual frontmatter links.

## Deployment and reliability

- Verify the site from the real GitHub Pages URL on desktop and mobile.
- Test direct navigation to deep links like `/wiki/<slug>` from a fresh tab to confirm the SPA fallback behaves correctly on Pages.
- Add a small smoke-test checklist to the README for post-deploy verification.
- Remove or refine the current `deploy` npm script if you want a workflow that also enforces a clean git state before pushing.
- Consider adding a lightweight CI check for pull requests that runs `npm run build`.

## Public/private architecture follow-up

- Decide how the future private mode will be launched locally: separate Vite entry, separate config, or separate app bootstrap.
- Define a private data contract that mirrors the public models without requiring UI rewrites.
- Keep private data outside any import path used by [src/main.tsx](/home/kevin/Projects/Dev/razed-developer.github.io/src/main.tsx).
- Add explicit guardrails in the README for contributors so private data never accidentally lands in public JSON or markdown files.
- When private mode begins, add a separate local-only command and keep it completely out of the GitHub Pages workflow.

## Nice-to-have stretch work

- Add a command-palette-style global search across projects, wiki, and links.
- Add a theme toggle if you want a light mode alongside the current dark-friendly design.
- Add lightweight charts or sparkline-style visuals for dashboard summaries.
- Add a better mobile nav if the site will be used often on phones.
- Add a “recent updates” feed sourced from wiki dates and project metadata.

## Possible first milestone after deployment

- Replace all sample data with real public-safe content.
- Confirm GitHub repo fetching is stable against your account.
- Add 5-10 real wiki entries.
- Review card copy and statuses for consistency.
- Do a full pass on mobile layout and spacing.
