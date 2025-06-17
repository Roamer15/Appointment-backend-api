import styles from "./TopBarClient.module.css";

export default function DropDownCard(user, onLogout) {
    const userData = user.user;
    console.log(onLogout)
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.dropImage}>
          <img src={userData.profileImageUrl} alt={userData.firstName} />
        </div>
        <div className={styles.dropUserInfo}>
          <p>
            {userData.firstName} {userData.lastName}
          </p>
        </div>
      </div>
      <div className={styles.cardMiddle}>
        <a href="/client/appointments">Appointments</a>
        <a href="#">Account</a>
      </div>
      <div className={styles.cardBottom}>
        <button className={styles.logout} onClick={user.onLogout}>
            Logout
        </button>
      </div>
    </div>
  );
}
