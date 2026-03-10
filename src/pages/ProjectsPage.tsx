import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { PageContainer } from '../components/PageContainer';
import { ProjectCard } from '../components/ProjectCard';
import { SearchInput } from '../components/SearchInput';
import { SectionHeader } from '../components/SectionHeader';
import { SortControl } from '../components/SortControl';
import { filterProjects, sortProjects } from '../lib/filters';
import { useProjects } from '../lib/hooks';

function uniqueValues(values: string[]): Array<{ label: string; value: string }> {
  return ['all', ...new Set(values)].map((value) => ({
    label: value === 'all' ? 'All' : value,
    value,
  }));
}

export function ProjectsPage() {
  const { projects, loading, error } = useProjects();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [tag, setTag] = useState('all');
  const [stack, setStack] = useState('all');
  const [visibility, setVisibility] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const filteredProjects = useMemo(
    () =>
      sortProjects(
        filterProjects(projects, {
          query,
          status,
          tag,
          stack,
          visibility,
        }),
        sortBy,
      ),
    [projects, query, sortBy, stack, status, tag, visibility],
  );

  const availableTags = uniqueValues(projects.flatMap((project) => project.tags));
  const availableStacks = uniqueValues(projects.flatMap((project) => project.stack));

  return (
    <PageContainer>
      <section>
        <SectionHeader
          eyebrow="Projects"
          title="Public repos with safe private placeholders"
          description="Fetched GitHub repositories are merged with local override metadata. Private work stays vague by design."
        />

        <div className="toolbar">
          <SearchInput value={query} onChange={setQuery} placeholder="Search projects, tags, or stack" />
          <FilterBar
            filters={[
              {
                label: 'Visibility',
                value: visibility,
                options: uniqueValues(projects.map((project) => project.visibility)),
                onChange: setVisibility,
              },
              {
                label: 'Status',
                value: status,
                options: uniqueValues(projects.map((project) => project.status)),
                onChange: setStatus,
              },
              {
                label: 'Tag',
                value: tag,
                options: availableTags,
                onChange: setTag,
              },
              {
                label: 'Stack',
                value: stack,
                options: availableStacks,
                onChange: setStack,
              },
            ]}
          />
          <SortControl
            value={sortBy}
            onChange={setSortBy}
            options={[
              { label: 'Updated', value: 'updated' },
              { label: 'Title', value: 'title' },
              { label: 'Status', value: 'status' },
              { label: 'Progress', value: 'progress' },
            ]}
          />
        </div>

        {error ? <p className="inline-notice">GitHub fetch fallback in use: {error}</p> : null}

        <div className="card-grid">
          {loading ? (
            <EmptyState title="Loading project data" description="Pulling public repo details and merging local metadata." />
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <EmptyState title="No matching projects" description="Adjust the search, filters, or sorting controls." />
          )}
        </div>
      </section>
    </PageContainer>
  );
}
