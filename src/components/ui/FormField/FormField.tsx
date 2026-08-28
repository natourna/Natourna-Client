import { useId, type ReactNode } from "react";
import { CalendarIcon } from "../Icons";
import styles from "./FormField.module.css";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

function FieldShell({ label, htmlFor, error, children }: FieldShellProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClassName(error?: string): string {
  return error ? `${styles.input} ${styles.inputError}` : styles.input;
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange(value: string): void;
  type?: "text" | "email" | "password" | "tel";
  inputMode?: "numeric";
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  error,
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        className={inputClassName(error)}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
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
  error?: string;
}

export function SelectField({ label, value, options, onChange, placeholder, error }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <select
        id={id}
        className={inputClassName(error)}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
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
  error?: string;
}

export function DateField({ label, value, onChange, error }: DateFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <div className={styles.dateWrapper}>
        <CalendarIcon size={20} className={styles.dateIcon} />
        <input
          id={id}
          type="date"
          className={`${inputClassName(error)} ${styles.dateInput}`}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </FieldShell>
  );
}
