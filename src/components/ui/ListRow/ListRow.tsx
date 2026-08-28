import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../Icons";
import styles from "./ListRow.module.css";

interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  to?: string;
}

export function ListRow({ title, subtitle, leading, trailing, to }: ListRowProps) {
  const content = (
    <>
      {leading}
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </div>
      {trailing}
      {to ? <ChevronRightIcon size={20} className={styles.chevron} /> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${styles.row} ${styles.linkRow}`}>
        {content}
      </Link>
    );
  }

  return <div className={styles.row}>{content}</div>;
}
