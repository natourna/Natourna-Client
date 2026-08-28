import { initials } from "../../../utils/names";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  tone?: "primary" | "neutral";
  size?: number;
}

export function Avatar({ name, tone = "neutral", size = 48 }: AvatarProps) {
  return (
    <span
      className={`${styles.avatar} ${styles[tone]}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
