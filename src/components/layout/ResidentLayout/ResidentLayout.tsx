import { Outlet } from "react-router-dom";
import { useResidentApartment } from "../../../hooks/useResidentApartment";
import { BottomTabBar } from "../BottomTabBar";
import { ResidentTopNav } from "../ResidentTopNav";
import { residentNavItems } from "../navigation";
import styles from "./ResidentLayout.module.css";

export function ResidentLayout() {
  const { apartment } = useResidentApartment();

  return (
    <div className={styles.layout}>
      <ResidentTopNav apartmentLabel={apartment?.apartmentInfo} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomTabBar items={residentNavItems} />
    </div>
  );
}
