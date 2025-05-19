// ProviderLayout.jsx
import SideBar from '../sidebar/SIdeBar';
import TopBar from '../topbar/TopBar';
import styles from './ProviderLayout.module.css';

export default function ProviderLayout({  userData }) {
  return (
    <div className={styles.layout}>
      <SideBar userData={userData}/>
      <div className={styles.main}>
        <TopBar userData={userData} />
        <div className={styles.content}>Hello</div>
      </div>
    </div>
  );
}
