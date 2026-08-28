import styles from "./Brand.module.css";

interface BrandProps {
  subtitle?: string;
  size?: "sm" | "lg";
}

export function Brand({ subtitle, size = "sm" }: BrandProps) {
  return (
    <div className={`${styles.brand} ${size === "lg" ? styles.lg : ""}`}>
      <span className={styles.logo} aria-hidden="true">
        N
      </span>
      <span className={styles.text}>
        <span className={styles.name}>Natourna</span>
        {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      </span>
    </div>
  );
}
