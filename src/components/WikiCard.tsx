import { Link } from 'react-router-dom';
import type { WikiArticle } from '../types/content';
import { TagPill } from './TagPill';

interface WikiCardProps {
  article: WikiArticle;
}

export function WikiCard({ article }: WikiCardProps) {
  return (
    <article className="card wiki-card">
      <div className="wiki-card__meta">
        <span className="badge badge--category">{article.category}</span>
        <span className="muted">{article.updatedAt}</span>
      </div>
      <h3>
        <Link to={`/wiki/${article.slug}`}>{article.title}</Link>
      </h3>
      <p>{article.summary}</p>
      <div className="tag-row">
        {article.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>
    </article>
  );
}
