import styles from "./FilterChips.module.css";

export interface FilterChipOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterChipsProps<T extends string> {
  options: FilterChipOption<T>[];
  value: T;
  onChange(value: T): void;
}

export function FilterChips<T extends string>({ options, value, onChange }: FilterChipsProps<T>) {
  return (
    <div className={styles.chips} role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.chip} ${option.value === value ? styles.active : ""}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined ? ` · ${option.count}` : ""}
        </button>
      ))}
    </div>
  );
}
