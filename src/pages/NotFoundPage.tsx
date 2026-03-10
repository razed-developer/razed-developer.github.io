import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';

export function NotFoundPage() {
  return (
    <PageContainer>
      <EmptyState title="Page not found" description="The requested route does not exist in this static dashboard." />
      <div className="not-found-actions">
        <Link className="button button--primary" to="/">
          Return Home
        </Link>
      </div>
    </PageContainer>
  );
}
