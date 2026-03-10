import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { PageContainer } from '../components/PageContainer';
import { SectionHeader } from '../components/SectionHeader';
import { siteConfig } from '../config/site';

type WikiCategory = 'snippets' | 'setup' | 'commands' | 'troubleshooting' | 'notes';

interface EditorState {
  title: string;
  slug: string;
  summary: string;
  category: WikiCategory;
  tags: string;
  related: string;
  updatedAt: string;
  content: string;
}

interface TemplateDefinition {
  label: string;
  category: WikiCategory;
  title: string;
  summary: string;
  tags: string;
  content: string;
}

interface ValidationResult {
  errors: string[];
  normalizedSlug: string;
}

const draftStorageKey = 'wiki-editor-draft-v1';

const templates: Record<string, TemplateDefinition> = {
  blank: {
    label: 'Blank',
    category: 'notes',
    title: '',
    summary: '',
    tags: '',
    content: `## Summary

Write the core note here.

\`\`\`ts
console.log('hello wiki');
\`\`\`
`,
  },
  snippet: {
    label: 'Snippet',
    category: 'snippets',
    title: 'Useful Snippet',
    summary: 'Short explanation for a reusable snippet.',
    tags: 'snippet, code, reference',
    content: `## Problem

Briefly describe what this snippet solves.

## Snippet

\`\`\`ts
export function example() {
  return 'update me';
}
\`\`\`

## Notes

- Mention constraints.
- Mention where this is useful.
`,
  },
  setup: {
    label: 'Setup',
    category: 'setup',
    title: 'Setup Guide',
    summary: 'Steps for getting a tool, repo, or environment running.',
    tags: 'setup, tooling',
    content: `## Requirements

- Requirement one
- Requirement two

## Steps

1. First step
2. Second step
3. Verification step

## Troubleshooting

- Common issue and fix
`,
  },
  troubleshooting: {
    label: 'Troubleshooting',
    category: 'troubleshooting',
    title: 'Troubleshooting Note',
    summary: 'Capture a problem, symptoms, and the working fix.',
    tags: 'troubleshooting, fix',
    content: `## Symptoms

- What failed
- What you observed

## Cause

Explain the root issue here.

## Fix

\`\`\`bash
echo "replace me"
\`\`\`

## Follow-up

- Add prevention note
`,
  },
};

function createInitialState(): EditorState {
  return {
    title: templates.blank.title,
    slug: '',
    summary: templates.blank.summary,
    category: templates.blank.category,
    tags: templates.blank.tags,
    related: '',
    updatedAt: new Date().toISOString().slice(0, 10),
    content: templates.blank.content,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseList(raw: string): string[] {
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildMarkdown(state: EditorState): string {
  const tags = parseList(state.tags);
  const related = parseList(state.related);
  const lines = [
    '---',
    `title: ${state.title || 'Untitled Article'}`,
    `slug: ${state.slug || slugify(state.title) || 'untitled-article'}`,
    `summary: ${state.summary || 'Add a short summary.'}`,
    `category: ${state.category}`,
    'tags:',
    ...(tags.length > 0 ? tags.map((tag) => `  - ${tag}`) : ['  - example']),
    `updatedAt: ${state.updatedAt}`,
  ];

  if (related.length > 0) {
    lines.push('related:', ...related.map((item) => `  - ${item}`));
  }

  lines.push('---', '', state.content.trim());

  return lines.join('\n');
}

function buildPreview(state: EditorState): string {
  return state.content;
}

function validateEditorState(state: EditorState): ValidationResult {
  const errors: string[] = [];
  const normalizedSlug = state.slug || slugify(state.title);

  if (!state.title.trim()) {
    errors.push('Title is required.');
  }

  if (!normalizedSlug) {
    errors.push('Slug is required.');
  }

  if (normalizedSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
    errors.push('Slug must use lowercase letters, numbers, and hyphens only.');
  }

  if (!state.summary.trim()) {
    errors.push('Summary is required.');
  }

  if (parseList(state.tags).length === 0) {
    errors.push('At least one tag is required.');
  }

  if (!state.updatedAt.trim()) {
    errors.push('Updated date is required.');
  }

  if (!state.content.trim()) {
    errors.push('Markdown body cannot be empty.');
  }

  return { errors, normalizedSlug };
}

export function WikiEditorPage() {
  const [state, setState] = useState<EditorState>(createInitialState);
  const [copyLabel, setCopyLabel] = useState('Copy Markdown');
  const [draftStatus, setDraftStatus] = useState('Draft not saved yet');
  const markdown = useMemo(() => buildMarkdown(state), [state]);
  const preview = useMemo(() => buildPreview(state), [state]);
  const validation = useMemo(() => validateEditorState(state), [state]);

  if (!siteConfig.localEditorEnabled) {
    return (
      <PageContainer>
        <SectionHeader
          eyebrow="Local Only"
          title="Wiki editor unavailable"
          description="This editor is intended for local authoring only and is not enabled in the public build."
        />
      </PageContainer>
    );
  }

  useEffect(() => {
    const raw = window.localStorage.getItem(draftStorageKey);

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as EditorState;
      setState(parsed);
      setDraftStatus('Draft restored from local storage');
    } catch {
      setDraftStatus('Saved draft could not be restored');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(state));
  }, [state]);

  function updateField<Key extends keyof EditorState>(key: Key, value: EditorState[Key]): void {
    setState((current) => {
      const next = { ...current, [key]: value };

      if (key === 'title' && (!current.slug || current.slug === slugify(current.title))) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  }

  function applyTemplate(templateKey: string): void {
    const template = templates[templateKey];

    if (!template) {
      return;
    }

    setState({
      title: template.title,
      slug: slugify(template.title),
      summary: template.summary,
      category: template.category,
      tags: template.tags,
      related: '',
      updatedAt: new Date().toISOString().slice(0, 10),
      content: template.content,
    });
    setDraftStatus(`Loaded ${template.label.toLowerCase()} template`);
  }

  function insertAtEnd(snippet: string): void {
    setState((current) => ({
      ...current,
      content: `${current.content.replace(/\s*$/, '')}\n\n${snippet}\n`,
    }));
    setDraftStatus('Inserted helper block');
  }

  async function handleCopy(): Promise<void> {
    if (validation.errors.length > 0) {
      setDraftStatus('Resolve validation errors before copying');
      return;
    }

    await navigator.clipboard.writeText(markdown);
    setCopyLabel('Copied');
    window.setTimeout(() => setCopyLabel('Copy Markdown'), 1500);
  }

  function handleDownload(): void {
    if (validation.errors.length > 0) {
      setDraftStatus('Resolve validation errors before downloading');
      return;
    }

    const filename = `${validation.normalizedSlug || 'wiki-article'}.md`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleReset(): void {
    setState(createInitialState());
    setCopyLabel('Copy Markdown');
    setDraftStatus('Draft reset');
    window.localStorage.removeItem(draftStorageKey);
  }

  function handleSaveDraft(): void {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(state));
    setDraftStatus(`Draft saved at ${new Date().toLocaleTimeString()}`);
  }

  function handleRestoreDraft(): void {
    const raw = window.localStorage.getItem(draftStorageKey);

    if (!raw) {
      setDraftStatus('No saved draft found');
      return;
    }

    try {
      const parsed = JSON.parse(raw) as EditorState;
      setState(parsed);
      setDraftStatus('Draft restored');
    } catch {
      setDraftStatus('Saved draft is invalid');
    }
  }

  return (
    <PageContainer>
      <section>
        <SectionHeader
          eyebrow="Local Authoring"
          title="Wiki article editor"
          description="Create frontmatter-backed markdown locally, preview it with the live renderer, then copy or download the final file."
        />
        <div className="page-actions">
          <Link className="button" to="/wiki">
            Back to Wiki
          </Link>
          <button className="button" type="button" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button className="button" type="button" onClick={handleRestoreDraft}>
            Restore Draft
          </button>
          <button className="button button--primary" type="button" onClick={() => void handleCopy()}>
            {copyLabel}
          </button>
          <button className="button" type="button" onClick={handleDownload}>
            Download .md
          </button>
          <button className="button" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
        <p className="inline-notice">{draftStatus}</p>
        {validation.errors.length > 0 ? (
          <div className="editor-validation card">
            <h3>Validation</h3>
            <ul>
              {validation.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="editor-validation editor-validation--ok card">
            <strong>Validation passed</strong>
            <span>Ready to copy, download, or save into `drafts/wiki/`.</span>
          </div>
        )}
      </section>

      <section className="editor-grid">
        <div className="card editor-panel">
          <h3>Article metadata</h3>
          <div className="editor-toolbar">
            <span className="detail-label">Templates</span>
            <div className="tag-row">
              {Object.entries(templates).map(([key, template]) => (
                <button key={key} className="button button--small" type="button" onClick={() => applyTemplate(key)}>
                  {template.label}
                </button>
              ))}
            </div>
          </div>
          <div className="editor-form">
            <label className="editor-field">
              <span>Title</span>
              <input
                type="text"
                value={state.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="GitHub Pages App Routing"
              />
            </label>
            <label className="editor-field">
              <span>Slug</span>
              <input
                type="text"
                value={state.slug}
                onChange={(event) => updateField('slug', event.target.value)}
                placeholder="github-pages-app-routing"
              />
            </label>
            <label className="editor-field">
              <span>Summary</span>
              <textarea
                rows={3}
                value={state.summary}
                onChange={(event) => updateField('summary', event.target.value)}
                placeholder="Short summary used in the wiki index."
              />
            </label>
            <label className="editor-field">
              <span>Category</span>
              <select
                value={state.category}
                onChange={(event) => updateField('category', event.target.value as WikiCategory)}
              >
                <option value="notes">notes</option>
                <option value="setup">setup</option>
                <option value="commands">commands</option>
                <option value="troubleshooting">troubleshooting</option>
                <option value="snippets">snippets</option>
              </select>
            </label>
            <label className="editor-field">
              <span>Tags</span>
              <input
                type="text"
                value={state.tags}
                onChange={(event) => updateField('tags', event.target.value)}
                placeholder="github-pages, react-router, deployment"
              />
            </label>
            <label className="editor-field">
              <span>Related slugs</span>
              <input
                type="text"
                value={state.related}
                onChange={(event) => updateField('related', event.target.value)}
                placeholder="command-snippets, github-pages-spa-routing"
              />
            </label>
            <label className="editor-field">
              <span>Updated at</span>
              <input
                type="date"
                value={state.updatedAt}
                onChange={(event) => updateField('updatedAt', event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="card editor-panel">
          <h3>Markdown body</h3>
          <div className="editor-toolbar">
            <span className="detail-label">Quick inserts</span>
            <div className="tag-row">
              <button
                className="button button--small"
                type="button"
                onClick={() =>
                  insertAtEnd(`![Alt text](/images/example.png)\n\n_Image caption or context._`)
                }
              >
                Image Block
              </button>
              <button
                className="button button--small"
                type="button"
                onClick={() =>
                  insertAtEnd(`[Useful link](https://example.com)\n\nShort note about why it matters.`)
                }
              >
                Link Block
              </button>
              <button
                className="button button--small"
                type="button"
                onClick={() =>
                  insertAtEnd(`\`\`\`bash\nnpm run build\n\`\`\`\n\nExplain the command here.`)
                }
              >
                Code Block
              </button>
            </div>
          </div>
          <label className="editor-field">
            <span>Content</span>
            <textarea
              className="editor-textarea"
              rows={20}
              value={state.content}
              onChange={(event) => updateField('content', event.target.value)}
              placeholder="Write markdown here..."
            />
          </label>
        </div>
      </section>

      <section className="editor-grid">
        <div className="card editor-panel">
          <h3>Generated markdown</h3>
          <pre className="editor-output">
            <code>{markdown}</code>
          </pre>
        </div>

        <div className="card editor-panel">
          <h3>Live preview</h3>
          <MarkdownRenderer content={preview} />
        </div>
      </section>
    </PageContainer>
  );
}
