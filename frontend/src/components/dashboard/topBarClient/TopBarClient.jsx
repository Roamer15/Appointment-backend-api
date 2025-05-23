import { useState } from "react";
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

const notificationIcons = {
  new: faCalendarPlus,
  canceled: faCalendarTimes,
  rescheduled: faExchangeAlt,
  default: faInfoCircle
};

export default function TopBarClient({ userData, handleChange, query, providers }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(prev => {
      if (!prev) markAllAsRead();
      return !prev;
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Branding Section */}
        <div className={styles.branding}>
          <button className={styles.menuButton} aria-label="Toggle menu">
            <FontAwesomeIcon icon={faHandshake} />
          </button>
          <h1 className={styles.logo}>NexMeet</h1>
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
          <button className={styles.profileButton} aria-label="User profile">
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
        </div>
      </div>
    </header>
  );
}










// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBell,
//   faCalendarPlus,
//   faCalendarTimes,
//   faExchangeAlt,
//   faInfoCircle,
//   faChevronDown,
//   faHandshake
// } from "@fortawesome/free-solid-svg-icons";
// import styles from "./TopBarClient.module.css";
// import { useNotifications } from '../../../context/NotificationContext';
// import SearchResults from "../../searchResults/SearchResults";

// export default function TopBarClient({ userData, handleChange, query, providers }) {

//   const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
//   const [showNotifications, setShowNotifications] = useState(false);

//   const getNotificationIcon = (type) => {
//     switch(type) {
//       case 'new': return faCalendarPlus;
//       case 'canceled': return faCalendarTimes;
//       case 'rescheduled': return faExchangeAlt;
//       default: return faInfoCircle;
//     }
//   };
//   return (
//     <header className={styles.headerClient}>
//       <div className={styles.container}>
//         <div className={styles.leftSection}>
//           <button id="sidebar-toggle" className={styles.menuButton}>
//             <FontAwesomeIcon icon={faHandshake} className={styles.menuIcon} />
//           </button>
//           <h1 className={styles.title}>NexMeet</h1>
//         </div>
//         <div className={styles.middleSection}>
//             <input type="search" placeholder="Search Providers by name, specialty, ..." onChange={handleChange} value={query}/>
//             <SearchResults providers={providers}/>
//         </div>
//         <div className={styles.rightSection}>
//           <div className={styles.notificationWrapper}>
//           <button
//             id="notification-btn"
//             className={styles.notificationButton}
//             onClick={() => {
//               setShowNotifications(!showNotifications);
//               if (showNotifications) markAllAsRead();
//             }}
//           >
//             <FontAwesomeIcon icon={faBell} className={styles.notificationIcon} />
//             {unreadCount > 0 && (
//               <span className={styles.notificationBadge}>
//                 {unreadCount > 9 ? '9+' : unreadCount}
//               </span>
//             )}
//           </button>

//           {showNotifications && (
//             <div className={styles.notificationDropdown}>
//               <div className={styles.dropdownHeader}>
//                 <h3>Notifications ({notifications.length})</h3>
//                 <button 
//                   onClick={markAllAsRead}
//                   className={styles.markAllRead}
//                 >
//                   Mark all as read
//                 </button>
//               </div>
//               <div className={styles.notificationList}>
//                 {notifications.length === 0 ? (
//                   <p className={styles.empty}>No notifications</p>
//                 ) : (
//                   notifications.map(notification => (
//                     <div 
//                       key={notification.id} 
//                       className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
//                       onClick={() => markAsRead(notification.id)}
//                     >
//                       <div className={styles.notificationContent}>
//                         <div className={styles.notificationIconWrapper}>
//                           <FontAwesomeIcon 
//                             icon={getNotificationIcon(notification.type)} 
//                             className={styles.notificationTypeIcon} 
//                           />
//                         </div>
//                         <div className={styles.notificationText}>
//                           <p className={styles.notificationTitle}>
//                             {notification.title}
//                           </p>
//                           <p className={styles.notificationMessage}>
//                             {notification.message}
//                           </p>
//                           <p className={styles.notificationTime}>
//                             {notification.time}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//               <div className={styles.dropdownFooter}>
//                 <a href="#" className={styles.viewAllLink}>
//                   View all notifications
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>
//           <div className={styles.profileWrapper}>
//             <button className={styles.profileButton}>
//               <div className={styles.profileAvatar}>
//                 {userData.profileImageUrl || userData.avatar ? (
//                   <img
//                     src={userData.profileImageUrl ? userData.profileImageUrl : userData.avatar}
//                     alt={`${userData.firstName}'s profile`}
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                     }}
//                     className={styles.profileIcon}
//                   />
//                 ) : (
//                   <div className="initials">
//                     {userData.firstName?.[0]}
//                     {userData.lastName?.[0]}
//                   </div>
//                 )}
//               </div>
//               <span className={styles.profileName}>
//                 {userData.firstName} {userData.lastName}
//               </span>
//               <FontAwesomeIcon
//                 icon={faChevronDown}
//                 className={styles.dropdownIcon}
//               />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
