import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import { ProjectCard } from '../components/ProjectCard';
import { ProgressDisplay } from '../components/ProgressDisplay';
import { SectionHeader } from '../components/SectionHeader';
import { StatCard } from '../components/StatCard';
import { WikiCard } from '../components/WikiCard';
import { siteConfig } from '../config/site';
import { getRecentArticles, getTodoSummary, getCompletionRate } from '../lib/dashboard';
import { getWikiArticles } from '../lib/content';
import { useProjects } from '../lib/hooks';

export function HomePage() {
  const { projects, loading } = useProjects();
  const articles = getWikiArticles();
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const recentArticles = getRecentArticles(articles, 3);
  const todoSummary = getTodoSummary(projects);
  const completionRate = getCompletionRate(projects);
  const publicProjects = projects.filter((project) => project.visibility === 'public').length;

  return (
    <PageContainer>
      <section className="hero card">
        <div className="hero__content">
          <p className="section-header__eyebrow">Developer Dashboard</p>
          <h1>Public landing page, project directory, and markdown notes for razed-developer.</h1>
          <p>
            This build runs in <strong>{siteConfig.mode}</strong> mode. Public repositories are
            fetched from GitHub, project progress is curated in local JSON, and private work is
            represented only by intentionally vague placeholder cards.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/projects">
              Browse Projects
            </Link>
            <Link className="button" to="/wiki">
              Read Wiki Notes
            </Link>
          </div>
        </div>
        <div className="hero__side">
          <ProgressDisplay value={completionRate} />
          <div className="hero__placeholder">
            <span>Future local-only dashboard</span>
            <p>Reserved entry point for a private build. Not available in the public site.</p>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Tracked Projects" value={String(projects.length)} detail="Public + placeholder cards" />
        <StatCard label="Public Repos" value={String(publicProjects)} detail="Fetched or fallback sample repos" />
        <StatCard label="Todo Completion" value={`${todoSummary.closed}`} detail={`${todoSummary.open} items still open`} />
        <StatCard label="Wiki Articles" value={String(articles.length)} detail="Markdown-backed notes and snippets" />
      </section>

      <section className="split-section">
        <div>
          <SectionHeader
            eyebrow="Current Focus"
            title="Featured projects"
            description="Highlighted work with status, stack, progress, and links."
          />
          <div className="card-grid">
            {loading ? (
              <EmptyState title="Loading projects" description="Fetching public repository data and local placeholders." />
            ) : featuredProjects.length > 0 ? (
              featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <EmptyState title="No featured projects" description="Mark projects as featured in local override data." />
            )}
          </div>
        </div>

        <aside className="home-sidebar">
          <SectionHeader
            eyebrow="Quick Access"
            title="Fast paths"
            description="Primary entry points for the dashboard."
          />
          <div className="quick-links">
            <Link className="card quick-link" to="/projects">
              <strong>Projects</strong>
              <span>Public repos, private placeholders, filters, and progress stats.</span>
            </Link>
            <Link className="card quick-link" to="/wiki">
              <strong>Wiki</strong>
              <span>Markdown-based notes with copyable code blocks.</span>
            </Link>
            <Link className="card quick-link" to="/links">
              <strong>Links</strong>
              <span>Curated references with pinned items and category filters.</span>
            </Link>
          </div>
        </aside>
      </section>

      <section>
        <SectionHeader
          eyebrow="Recent Notes"
          title="Latest wiki entries"
          description="A few recent references surfaced on the home page."
        />
        <div className="card-grid card-grid--compact">
          {recentArticles.map((article) => (
            <WikiCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
