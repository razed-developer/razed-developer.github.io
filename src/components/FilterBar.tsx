interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: Array<{
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }>;
}

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <label key={filter.label} className="filter-select">
          <span>{filter.label}</span>
          <select value={filter.value} onChange={(event) => filter.onChange(event.target.value)}>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
