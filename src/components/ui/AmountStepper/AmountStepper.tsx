import { formatCurrency } from "../../../utils/currency";
import styles from "./AmountStepper.module.css";

interface AmountStepperProps {
  label: string;
  value: number;
  onChange(value: number): void;
  step?: number;
  min?: number;
  size?: "md" | "lg";
}

export function AmountStepper({
  label,
  value,
  onChange,
  step = 5,
  min = 0,
  size = "md",
}: AmountStepperProps) {
  return (
    <div className={`${styles.stepper} ${size === "lg" ? styles.lg : ""}`}>
      <button
        type="button"
        className={styles.control}
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        −
      </button>
      <output className={styles.value} aria-label={label}>
        {formatCurrency(value)}
      </output>
      <button
        type="button"
        className={styles.control}
        aria-label={`Increase ${label}`}
        onClick={() => onChange(value + step)}
      >
        +
      </button>
    </div>
  );
}
