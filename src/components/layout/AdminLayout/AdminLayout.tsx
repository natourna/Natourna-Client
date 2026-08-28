import { Outlet } from "react-router-dom";
import { useCompound } from "../../../hooks/useCompound";
import { BottomTabBar } from "../BottomTabBar";
import { Sidebar } from "../Sidebar";
import { adminTabItems } from "../navigation";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  const { compound } = useCompound();

  return (
    <div className={styles.layout}>
      <Sidebar compoundName={compound?.name} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomTabBar items={adminTabItems} />
    </div>
  );
}
