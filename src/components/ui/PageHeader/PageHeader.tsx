import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, eyebrow, subtitle, actions }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
