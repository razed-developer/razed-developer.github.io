interface StatCardProps {
  label: string;
  value: string;
  detail: string;
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="card stat-card">
      <p className="stat-card__label">{label}</p>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__detail">{detail}</p>
    </article>
  );
}
