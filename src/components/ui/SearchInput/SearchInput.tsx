import { useId } from "react";
import { SearchIcon } from "../Icons";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  label: string;
  value: string;
  onChange(value: string): void;
}

export function SearchInput({ label, value, onChange }: SearchInputProps) {
  const id = useId();
  return (
    <div className={styles.wrapper}>
      <SearchIcon size={22} className={styles.icon} />
      <label htmlFor={id} className={styles.hiddenLabel}>
        {label}
      </label>
      <input
        id={id}
        type="search"
        className={styles.input}
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
