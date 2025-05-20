import SideBar from '../sidebar/SIdeBar';
import TopBar from '../topbar/TopBar';
import styles from './ProviderLayout.module.css';
import { useState } from 'react';
import { Outlet } from 'react-router';

export default function ProviderLayout({  userData }) {
    const [collapsed, setCollapsed] = useState(false)

    const toggleSidebar = () => setCollapsed((prev) => !prev);
  return (
    <div className={styles.layout}>
      <SideBar userData={userData} collapsed={collapsed}/>
      <div className={styles.main}>
        <TopBar userData={userData} toggleSidebar={toggleSidebar}/>
        <div className={styles.content}><Outlet /> </div>
      </div>
    </div>
  );
}
