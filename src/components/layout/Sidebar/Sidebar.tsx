import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Avatar } from "../../ui/Avatar";
import { Brand } from "../../ui/Brand";
import { LogoutIcon } from "../../ui/Icons";
import { adminSidebarItems } from "../navigation";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  compoundName?: string;
}

export function Sidebar({ compoundName }: SidebarProps) {
  const { session, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <Brand subtitle={compoundName} />
      <nav className={styles.nav} aria-label="Main">
        {adminSidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
              }
            >
              <Icon size={22} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className={styles.footer}>
        <Avatar name={session?.username ?? ""} tone="primary" size={44} />
        <div className={styles.userText}>
          <div className={styles.userName}>{session?.username}</div>
          <div className={styles.userRole}>Committee admin</div>
        </div>
        <button type="button" className={styles.logout} aria-label="Sign out" onClick={logout}>
          <LogoutIcon size={20} />
        </button>
      </div>
    </aside>
  );
}
