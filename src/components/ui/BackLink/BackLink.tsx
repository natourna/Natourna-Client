import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "../Icons";
import styles from "./BackLink.module.css";

interface BackLinkProps {
  to: string;
  label: string;
}

export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className={styles.link}>
      <ChevronLeftIcon size={20} />
      {label}
    </Link>
  );
}
