import { NavLink } from "react-router-dom";
import type { NavItem } from "../navigation";
import styles from "./BottomTabBar.module.css";

interface BottomTabBarProps {
  items: NavItem[];
}

export function BottomTabBar({ items }: BottomTabBarProps) {
  return (
    <nav className={styles.bar} aria-label="Main">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ""}`}
          >
            <span className={styles.iconPill}>
              <Icon size={22} />
            </span>
            <span className={styles.label}>{item.shortLabel ?? item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
