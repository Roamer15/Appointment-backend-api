import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router';
import { 
  faCalendarCheck,
  faUserClock,
  faCalendarDay,
  faChartLine,
  faCog,
  faDashboard
} from '@fortawesome/free-solid-svg-icons';
import styles from './SideBar.module.css';

export default function SideBar({userData, collapsed}) {
    const navigate = useNavigate()
  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.logoIcon}>
          <FontAwesomeIcon icon={faCalendarCheck} className={styles.logoIconImage} />
        </div>
        <span className={styles.logoText} onClick={() => navigate('/')}>NexMeet</span>
      </div>
      
      {/* Navigation Links */}
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <NavLink to="/dashboard" className={`${styles.navLink} ${styles.activeLink}`}>
              <FontAwesomeIcon icon={faDashboard} className={styles.navIcon} />
              <span className={styles.navText}>Dashboard</span>
            </NavLink>
            <NavLink to="/dashboard/timeslots" className={styles.navLink}>
              <FontAwesomeIcon icon={faUserClock} className={styles.navIcon} />
              <span className={styles.navText}>Time Slots</span>
            </NavLink>
            <NavLink to="/dashboard/appointments" className={styles.navLink}>
              <FontAwesomeIcon icon={faCalendarDay} className={styles.navIcon} />
              <span className={styles.navText}>Appointments</span>
            </NavLink>
            <NavLink to="/dashboard/analytics" className={styles.navLink}>
              <FontAwesomeIcon icon={faChartLine} className={styles.navIcon} />
              <span className={styles.navText}>Analytics</span>
            </NavLink>
            <NavLink to="/dashboard/settings" className={styles.navLink}>
              <FontAwesomeIcon icon={faCog} className={styles.navIcon} />
              <span className={styles.navText}>Settings</span>
            </NavLink>
          </div>
        </nav>
      </div>
      
      {/* Footer Section */}
      <div className={styles.footer}>
        <div className={styles.profile}>
          <div className={styles.profileIcon}>
            <img src={userData.profileImageUrl} className={styles.profileIconImage} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{userData.firstName}{" "}{userData.lastName}</span>
            <span className={styles.profileRole}>{userData.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}