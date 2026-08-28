import type { ReactNode } from "react";
import { ProgressBar } from "../ProgressBar";
import styles from "./WizardShell.module.css";

interface WizardShellProps {
  title: string;
  step: number;
  totalSteps: number;
  children: ReactNode;
  footer: ReactNode;
}

export function WizardShell({ title, step, totalSteps, children, footer }: WizardShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.stepLabel}>
            Step {step} of {totalSteps}
          </span>
        </div>
        <ProgressBar value={step} max={totalSteps} label={`${title} progress`} />
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>{footer}</div>
    </div>
  );
}
