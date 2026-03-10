import type { CSSProperties } from 'react';

interface ProgressDisplayProps {
  value: number;
  size?: 'sm' | 'md';
}

export function ProgressDisplay({ value, size = 'md' }: ProgressDisplayProps) {
  return (
    <div
      className={`progress-ring progress-ring--${size}`}
      style={{ '--progress': `${value}%` } as CSSProperties}
      aria-label={`${value}% complete`}
    >
      <span>{value}%</span>
    </div>
  );
}
