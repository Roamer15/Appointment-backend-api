import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCalendarPlus,
  faCalendarTimes,
  faExclamationCircle,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./TopBar.module.css";

export default function TopBar({ userData }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <button id="sidebar-toggle" className={styles.menuButton}>
            <FontAwesomeIcon icon={faBars} className={styles.menuIcon} />
          </button>
          <h1 className={styles.title}>Dashboard</h1>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.notificationWrapper}>
            <button
              id="notification-btn"
              className={styles.notificationButton}
              onClick={toggleNotifications}
            >
              <FontAwesomeIcon
                icon={faBell}
                className={styles.notificationIcon}
              />
              <span className={styles.notificationBadge}>3</span>
            </button>

            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>
                  <h3>Notifications (3)</h3>
                </div>
                <div className={styles.notificationList}>
                  <a href="#" className={styles.notificationItem}>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationIconWrapper}>
                        <FontAwesomeIcon
                          icon={faCalendarPlus}
                          className={styles.notificationTypeIcon}
                        />
                      </div>
                      <div className={styles.notificationText}>
                        <p className={styles.notificationTitle}>
                          New appointment booked
                        </p>
                        <p className={styles.notificationTime}>
                          John Doe - Today at 2:30 PM
                        </p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className={styles.notificationItem}>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationIconWrapper}>
                        <FontAwesomeIcon
                          icon={faCalendarTimes}
                          className={styles.notificationTypeIcon}
                        />
                      </div>
                      <div className={styles.notificationText}>
                        <p className={styles.notificationTitle}>
                          Appointment canceled
                        </p>
                        <p className={styles.notificationTime}>
                          Jane Smith - Tomorrow at 11:00 AM
                        </p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className={styles.notificationItem}>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationIconWrapper}>
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className={styles.notificationTypeIcon}
                        />
                      </div>
                      <div className={styles.notificationText}>
                        <p className={styles.notificationTitle}>
                          Time slot reminder
                        </p>
                        <p className={styles.notificationTime}>
                          You have 5 open slots tomorrow
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={styles.dropdownFooter}>
                  <a href="#" className={styles.viewAllLink}>
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={styles.profileWrapper}>
            <button className={styles.profileButton}>
              <div className={styles.profileAvatar}>
                {console.log(userData)}
                {userData.profileImageUrl || userData.avatar ? (
                  <img
                    src={userData.profileImageUrl ? userData.profileImageUrl : userData.avatar}
                    alt={`${userData.firstName}'s profile`}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    className={styles.profileIcon}
                  />
                ) : (
                  <div className="initials">
                    {userData.firstName?.[0]}
                    {userData.lastName?.[0]}
                  </div>
                )}
              </div>
              <span className={styles.profileName}>
                {userData.firstName} {userData.lastName}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.dropdownIcon}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
