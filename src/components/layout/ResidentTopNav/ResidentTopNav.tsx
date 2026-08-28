import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Avatar } from "../../ui/Avatar";
import { Brand } from "../../ui/Brand";
import { LogoutIcon } from "../../ui/Icons";
import { residentNavItems } from "../navigation";
import styles from "./ResidentTopNav.module.css";

interface ResidentTopNavProps {
  apartmentLabel?: string;
}

export function ResidentTopNav({ apartmentLabel }: ResidentTopNavProps) {
  const { session, logout } = useAuth();
  const username = session?.username ?? "";
  const firstName = username.split(" ")[0];

  return (
    <header className={styles.header}>
      <Brand />
      <nav className={styles.nav} aria-label="Main">
        {residentNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.user}>
        <Avatar name={username} size={42} />
        <span className={styles.userName}>
          {apartmentLabel ? `${firstName} · ${apartmentLabel}` : firstName}
        </span>
        <button type="button" className={styles.logout} aria-label="Sign out" onClick={logout}>
          <LogoutIcon size={20} />
        </button>
      </div>
    </header>
  );
}
