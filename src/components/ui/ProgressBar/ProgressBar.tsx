import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className={styles.fill} style={{ width: `${percentage}%` }} />
    </div>
  );
}
