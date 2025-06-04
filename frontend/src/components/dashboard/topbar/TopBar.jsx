import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCalendarPlus,
  faCalendarTimes,
  faExchangeAlt,
  faInfoCircle,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./TopBar.module.css";
import { useNotifications } from "../../../context/NotificationContext";

export default function TopBar({ userData, toggleSidebar }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  console.log(notifications);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_appointment":
        return faCalendarPlus;
      case "canceled":
        return faCalendarTimes;
      case "rescheduled":
        return faExchangeAlt;
      default:
        return faInfoCircle;
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <button
            id="sidebar-toggle"
            className={styles.menuButton}
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faBars} className={styles.menuIcon} />
          </button>
          <h1 className={styles.title}>Dashboard</h1>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.notificationWrapper}>
            <button
              id="notification-btn"
              className={styles.notificationButton}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showNotifications) markAllAsRead();
              }}
            >
              <FontAwesomeIcon
                icon={faBell}
                className={styles.notificationIcon}
              />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>
                  <h3>Notifications ({notifications.length})</h3>
                  <button
                    onClick={markAllAsRead}
                    className={styles.markAllRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className={styles.notificationList}>
                  {notifications.length === 0 ? (
                    <p className={styles.empty}>No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`${styles.notificationItem} ${
                          notification.read ? "" : styles.unread
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={styles.notificationContent}>
                          <div className={styles.notificationIconWrapper}>
                            <FontAwesomeIcon
                              icon={getNotificationIcon(notification.type)}
                              className={styles.notificationTypeIcon}
                            />
                          </div>
                          <div className={styles.notificationText}>
                            <p className={styles.notificationTitle}>
                              {notification.title}
                            </p>
                            <p className={styles.notificationMessage}>
                              {notification.message}
                            </p>
                            <p className={styles.notificationTime}>
                              {new Date(
                                notification.created_at
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                {userData.profileImageUrl || userData.avatar ? (
                  <img
                    src={
                      userData.profileImageUrl
                        ? userData.profileImageUrl
                        : userData.avatar
                    }
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
