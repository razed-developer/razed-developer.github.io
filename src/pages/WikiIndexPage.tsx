import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { PageContainer } from '../components/PageContainer';
import { SearchInput } from '../components/SearchInput';
import { SectionHeader } from '../components/SectionHeader';
import { WikiCard } from '../components/WikiCard';
import { siteConfig } from '../config/site';
import { getWikiArticles } from '../lib/content';
import { filterWiki } from '../lib/filters';
import { Link } from 'react-router-dom';

function optionsFrom(values: string[]): Array<{ label: string; value: string }> {
  return ['all', ...new Set(values)].map((value) => ({
    label: value === 'all' ? 'All' : value,
    value,
  }));
}

export function WikiIndexPage() {
  const articles = getWikiArticles();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState('all');

  const filteredArticles = useMemo(
    () => filterWiki(articles, { query, category, tag }),
    [articles, category, query, tag],
  );

  return (
    <PageContainer>
      <section>
        <SectionHeader
          eyebrow="Wiki"
          title="Searchable markdown knowledge base"
          description="Notes, commands, setup references, and troubleshooting articles sourced from local markdown files."
        />
        {siteConfig.localEditorEnabled ? (
          <div className="page-actions">
            <Link className="button" to="/wiki/editor">
              Open Local Editor
            </Link>
          </div>
        ) : null}
        <div className="toolbar">
          <SearchInput value={query} onChange={setQuery} placeholder="Search wiki titles, categories, or tags" />
          <FilterBar
            filters={[
              {
                label: 'Category',
                value: category,
                options: optionsFrom(articles.map((article) => article.category)),
                onChange: setCategory,
              },
              {
                label: 'Tag',
                value: tag,
                options: optionsFrom(articles.flatMap((article) => article.tags)),
                onChange: setTag,
              },
            ]}
          />
        </div>

        <div className="card-grid card-grid--compact">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => <WikiCard key={article.slug} article={article} />)
          ) : (
            <EmptyState title="No wiki entries found" description="Try a broader search term or clear one of the filters." />
          )}
        </div>
      </section>
    </PageContainer>
  );
}
