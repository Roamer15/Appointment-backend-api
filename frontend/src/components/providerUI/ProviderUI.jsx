import styles from "./ProviderUI.module.css";
import { Outlet } from "react-router";
import SideBar from "../dashboard/sidebar/SIdeBar";
import TopBar from "../dashboard/topbar/TopBar";

export default function ProviderUI({ collapsed, toggleSidebar, userData }) {
  return (
    <div className={styles.layout}>
      <SideBar userData={userData} collapsed={collapsed} />
      <div className={styles.main}>
        <TopBar userData={userData} toggleSidebar={toggleSidebar} />
        <div className={styles.content}>
          <Outlet key="provider" />
        </div>
      </div>
    </div>
  );
}
