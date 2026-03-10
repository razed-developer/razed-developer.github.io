import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { LinkCard } from '../components/LinkCard';
import { PageContainer } from '../components/PageContainer';
import { SearchInput } from '../components/SearchInput';
import { SectionHeader } from '../components/SectionHeader';
import { SortControl } from '../components/SortControl';
import { getLinks } from '../lib/content';
import { filterLinks, sortLinks } from '../lib/filters';

function optionsFrom(values: string[]): Array<{ label: string; value: string }> {
  return ['all', ...new Set(values)].map((value) => ({
    label: value === 'all' ? 'All' : value,
    value,
  }));
}

export function LinksPage() {
  const links = getLinks();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState('all');
  const [sortBy, setSortBy] = useState('pinned');

  const filteredLinks = useMemo(
    () => sortLinks(filterLinks(links, { query, category, tag }), sortBy),
    [category, links, query, sortBy, tag],
  );
  const pinnedLinks = filteredLinks.filter((item) => item.pinned);

  return (
    <PageContainer>
      <section>
        <SectionHeader
          eyebrow="Links"
          title="Curated developer references"
          description="Local JSON powers this hub, with pinned resources, filters, and simple sorting."
        />
        <div className="toolbar">
          <SearchInput value={query} onChange={setQuery} placeholder="Search links, descriptions, or tags" />
          <FilterBar
            filters={[
              {
                label: 'Category',
                value: category,
                options: optionsFrom(links.map((link) => link.category)),
                onChange: setCategory,
              },
              {
                label: 'Tag',
                value: tag,
                options: optionsFrom(links.flatMap((link) => link.tags)),
                onChange: setTag,
              },
            ]}
          />
          <SortControl
            value={sortBy}
            onChange={setSortBy}
            options={[
              { label: 'Pinned', value: 'pinned' },
              { label: 'Title', value: 'title' },
              { label: 'Category', value: 'category' },
            ]}
          />
        </div>

        {pinnedLinks.length > 0 ? (
          <>
            <SectionHeader eyebrow="Pinned" title="Favorites" description="Priority references surfaced first." />
            <div className="card-grid card-grid--compact">
              {pinnedLinks.map((item) => (
                <LinkCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : null}

        <SectionHeader eyebrow="All Links" title="Reference library" description="The full filtered list." />
        <div className="card-grid card-grid--compact">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((item) => <LinkCard key={item.id} item={item} />)
          ) : (
            <EmptyState title="No links match" description="Clear a filter or broaden the search query." />
          )}
        </div>
      </section>
    </PageContainer>
  );
}
