interface TagPillProps {
  label: string;
}

export function TagPill({ label }: TagPillProps) {
  return <span className="tag-pill">{label}</span>;
}
