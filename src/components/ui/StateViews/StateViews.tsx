import { AlertTriangleIcon } from "../Icons";
import { Button } from "../Button";
import styles from "./StateViews.module.css";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div className={styles.state} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.subtitle}>{label}</span>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry(): void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.state} role="alert">
      <AlertTriangleIcon size={32} className={styles.errorIcon} />
      <span className={styles.title}>{message}</span>
      <Button variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <span className={styles.title}>{title}</span>
      {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
    </div>
  );
}
