import { Link } from "react-router-dom";
import { AlertTriangleIcon, ChevronRightIcon } from "../Icons";
import styles from "./AlertBanner.module.css";

interface AlertBannerProps {
  variant: "danger" | "warning";
  title: string;
  subtitle?: string;
  to?: string;
}

export function AlertBanner({ variant, title, subtitle, to }: AlertBannerProps) {
  const content = (
    <>
      <AlertTriangleIcon size={26} className={styles.icon} />
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </div>
      {to ? <ChevronRightIcon size={22} className={styles.icon} /> : null}
    </>
  );

  const classes = `${styles.banner} ${styles[variant]}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
