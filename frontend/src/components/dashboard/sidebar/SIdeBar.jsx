import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck,
  faTachometerAlt,
  faUserClock,
  faCalendarDay,
  faChartLine,
  faCog,
  faUserMd
} from '@fortawesome/free-solid-svg-icons';
import styles from './SideBar.module.css';

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.logoIcon}>
          <FontAwesomeIcon icon={faCalendarCheck} className={styles.logoIconImage} />
        </div>
        <span className={styles.logoText}>NexMeet</span>
      </div>
      
      {/* Navigation Links */}
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <a href="#" className={`${styles.navLink} ${styles.activeLink}`}>
              <FontAwesomeIcon icon={faTachometerAlt} className={styles.navIcon} />
              <span className={styles.navText}>Dashboard</span>
            </a>
            <a href="#" className={styles.navLink}>
              <FontAwesomeIcon icon={faUserClock} className={styles.navIcon} />
              <span className={styles.navText}>Time Slots</span>
            </a>
            <a href="#" className={styles.navLink}>
              <FontAwesomeIcon icon={faCalendarDay} className={styles.navIcon} />
              <span className={styles.navText}>Appointments</span>
            </a>
            <a href="#" className={styles.navLink}>
              <FontAwesomeIcon icon={faChartLine} className={styles.navIcon} />
              <span className={styles.navText}>Analytics</span>
            </a>
            <a href="#" className={styles.navLink}>
              <FontAwesomeIcon icon={faCog} className={styles.navIcon} />
              <span className={styles.navText}>Settings</span>
            </a>
          </div>
        </nav>
      </div>
      
      {/* Footer Section */}
      <div className={styles.footer}>
        <div className={styles.profile}>
          <div className={styles.profileIcon}>
            <FontAwesomeIcon icon={faUserMd} className={styles.profileIconImage} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Dr. Sarah Johnson</span>
            <span className={styles.profileRole}>Provider</span>
          </div>
        </div>
      </div>
    </div>
  );
}