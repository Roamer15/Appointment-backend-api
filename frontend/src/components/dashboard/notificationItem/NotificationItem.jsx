import styles from '../topBarClient/TopBarClient.module.css'

export default function NotificationItem({ notification, onMarkAsRead, notificationIcons }) {
  return (
    <div 
      className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className={styles.notificationContent}>
        <div className={styles.notificationIcon}>
          <FontAwesomeIcon icon={notificationIcons[notification.type] || notificationIcons.default} />
        </div>
        <div className={styles.notificationDetails}>
          <p className={styles.notificationTitle}>{notification.title}</p>
          <p className={styles.notificationMessage}>{notification.message}</p>
          <p className={styles.notificationTime}>{notification.time}</p>
        </div>
      </div>
    </div>
  );
}
