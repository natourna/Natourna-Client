import type { UserRole } from "../../../types/user";
import styles from "./RolePill.module.css";

const roleLabels: Record<UserRole, string> = {
  Admin: "Admin",
  User: "Resident",
};

interface RolePillProps {
  role: UserRole;
}

export function RolePill({ role }: RolePillProps) {
  return (
    <span className={`${styles.pill} ${role === "Admin" ? styles.admin : styles.resident}`}>
      {roleLabels[role]}
    </span>
  );
}
