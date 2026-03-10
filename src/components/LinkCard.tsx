import type { LinkItem } from '../types/content';
import { TagPill } from './TagPill';

interface LinkCardProps {
  item: LinkItem;
}

export function LinkCard({ item }: LinkCardProps) {
  return (
    <article className="card link-card">
      <div className="link-card__meta">
        <span className="badge badge--category">{item.category}</span>
        {item.pinned ? <span className="badge badge--featured">Pinned</span> : null}
      </div>
      <h3>
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      </h3>
      <p>{item.description}</p>
      <div className="tag-row">
        {item.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>
    </article>
  );
}
