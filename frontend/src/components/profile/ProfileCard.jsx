import styles from "./ProfileCard.module.css";

export default function ProfileCard({ profileData }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Profile</h2>
        <button
          className={styles.createButton}
        >
          Update Profile
        </button>
      </div>

      <div className={styles.profileDetails}>
        <div className={styles.image}>
            <img src={profileData.profileImageUrl} alt={profileData.firstName} />
        </div>
        <div className={styles.profileInfo}>
            <p>{profileData.firstName}</p>
        </div>
      </div>
    </div>
  );
}
