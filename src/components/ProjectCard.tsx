import type { ProjectCardData } from '../types/content';
import { ProgressDisplay } from './ProgressDisplay';
import { TagPill } from './TagPill';

interface ProjectCardProps {
  project: ProjectCardData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="card project-card">
      <div className="project-card__header">
        <div>
          <div className="project-card__meta">
            <span className={`badge badge--${project.visibility}`}>{project.visibility}</span>
            <span className={`badge badge--status-${project.status}`}>{project.status}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <ProgressDisplay value={project.progress} size="sm" />
      </div>

      <div className="project-card__details">
        <div>
          <span className="detail-label">Tags</span>
          <div className="tag-row">
            {project.tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        </div>
        <div>
          <span className="detail-label">Stack</span>
          <div className="tag-row">
            {project.stack.map((entry) => (
              <TagPill key={entry} label={entry} />
            ))}
          </div>
        </div>
      </div>

      <div className="project-card__footer">
        <div className="project-card__todo">
          <span>{project.todoClosed} closed</span>
          <span>{project.todoOpen} open</span>
        </div>
        <div className="project-card__links">
          {project.lastUpdatedText ? <span className="muted">{project.lastUpdatedText}</span> : null}
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              Repo
            </a>
          ) : null}
          {project.homepageUrl ? (
            <a href={project.homepageUrl} target="_blank" rel="noreferrer">
              Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
