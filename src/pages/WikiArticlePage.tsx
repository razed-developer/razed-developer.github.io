import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { PageContainer } from '../components/PageContainer';
import { SectionHeader } from '../components/SectionHeader';
import { TagPill } from '../components/TagPill';
import { getWikiArticleBySlug, getWikiArticles } from '../lib/content';

export function WikiArticlePage() {
  const { slug = '' } = useParams();
  const article = getWikiArticleBySlug(slug);
  const relatedArticles = getWikiArticles().filter((entry) => article?.related?.includes(entry.slug));

  if (!article) {
    return (
      <PageContainer>
        <EmptyState title="Article not found" description="The requested markdown entry does not exist." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <article className="article-shell">
        <SectionHeader
          eyebrow={article.category}
          title={article.title}
          description={`${article.summary} Updated ${article.updatedAt}.`}
        />
        <div className="tag-row">
          {article.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
        <MarkdownRenderer content={article.content} />
      </article>

      {relatedArticles.length > 0 ? (
        <section>
          <SectionHeader
            eyebrow="Related"
            title="Continue reading"
            description="Related markdown notes linked from article frontmatter."
          />
          <div className="card-grid card-grid--compact">
            {relatedArticles.map((entry) => (
              <Link key={entry.slug} className="card quick-link" to={`/wiki/${entry.slug}`}>
                <strong>{entry.title}</strong>
                <span>{entry.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </PageContainer>
  );
}
