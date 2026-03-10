interface SortControlProps {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

export function SortControl({ value, options, onChange }: SortControlProps) {
  return (
    <label className="filter-select">
      <span>Sort</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
