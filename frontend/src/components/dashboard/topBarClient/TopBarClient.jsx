import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarPlus,
  faCalendarTimes,
  faExchangeAlt,
  faInfoCircle,
  faChevronDown,
  faHandshake,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import styles from "./TopBarClient.module.css";
import { useNotifications } from '../../../context/NotificationContext';
import SearchResults from "../../searchResults/SearchResults";
import NotificationItem from "../notificationItem/NotificationItem";
import { useNavigate } from "react-router";
import DropDownCard from "./DropDownCard";

const notificationIcons = {
  new: faCalendarPlus,
  canceled: faCalendarTimes,
  rescheduled: faExchangeAlt,
  default: faInfoCircle
};

export default function TopBarClient({ userData, handleChange, query, providers }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [dropDown, setDropDown] = useState(false)
  const navigate = useNavigate()

   useEffect(() => {
    if (showNotifications) {
      markAllAsRead();
    }
  }, [showNotifications, markAllAsRead]);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const handleLogOut = async() => {
    try {
    setDropDown(false)
    navigate('/')
  } catch(error) {
    console.error("Error: ", error.message)
  }
    
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Branding Section */}
        <div className={styles.branding}>
          <button className={styles.menuButton} aria-label="Toggle menu">
            <FontAwesomeIcon icon={faHandshake} />
          </button>
          <h1 className={styles.logo} onClick={() => navigate('/')}>NexMeet</h1>
        </div>

        {/* Search Section */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input 
              type="search" 
              placeholder="Search Providers by name, specialty..." 
              onChange={handleChange} 
              value={query}
              className={styles.searchInput}
            />
          </div>
          <SearchResults providers={providers} />
        </div>

        {/* User Controls Section */}
        <div className={styles.userControls}>
          {/* Notifications */}
          <div className={styles.notificationContainer}>
            <button 
              className={styles.notificationButton}
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>
                  <h3>Notifications ({notifications.length})</h3>
                  <button onClick={markAllAsRead} className={styles.markAllRead}>
                    Mark all as read
                  </button>
                </div>
                
                <div className={styles.notificationList}>
                  {notifications.length === 0 ? (
                    <p className={styles.emptyMessage}>No notifications</p>
                  ) : (
                    notifications.map(notification => (
                      <NotificationItem 
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        notificationIcons={notificationIcons}
                      />
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

          {/* User Profile */}
          <button className={styles.profileButton} aria-label="User profile" onClick={() => {
            console.log("Button clicked")
            setDropDown(() => {
              if(dropDown) return false
              return true
            })}}>
            <div className={styles.avatar}>
              {userData.profileImageUrl || userData.avatar ? (
                <img
                  src={userData.profileImageUrl || userData.avatar}
                  alt={`${userData.firstName}'s profile`}
                  onError={(e) => e.target.style.display = "none"}
                />
              ) : (
                <span className={styles.initials}>
                  {userData.firstName?.[0]}{userData.lastName?.[0]}
                </span>
              )}
            </div>
            <span className={styles.userName}>
              {userData.firstName} {userData.lastName}
            </span>
            <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
          </button>
          {dropDown && (
            <DropDownCard user={userData} onLogout={handleLogOut}/>
          )}
        </div>
      </div>
    </header>
  );
}
