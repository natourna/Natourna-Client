import { useId, type ReactNode } from "react";
import { CalendarIcon } from "../Icons";
import styles from "./FormField.module.css";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

function FieldShell({ label, htmlFor, children }: FieldShellProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange(value: string): void;
  type?: "text" | "email" | "password" | "tel";
  inputMode?: "numeric";
  placeholder?: string;
  autoComplete?: string;
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id}>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        className={styles.input}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange(value: string): void;
  placeholder?: string;
}

export function SelectField({ label, value, options, onChange, placeholder }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id}>
      <select
        id={id}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange(value: string): void;
}

export function DateField({ label, value, onChange }: DateFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id}>
      <div className={styles.dateWrapper}>
        <CalendarIcon size={20} className={styles.dateIcon} />
        <input
          id={id}
          type="date"
          className={`${styles.input} ${styles.dateInput}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </FieldShell>
  );
}
