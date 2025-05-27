import styles from "./ProfileCard.module.css";

export default function ProfileCard({ profileData }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Profile Information</h2>
        <button className={styles.updateButton}>
          Update Profile
        </button>
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img 
              src={profileData.profileImageUrl || "/default-avatar.png"} 
              alt={`${profileData.firstName} ${profileData.lastName}`} 
              className={styles.profileImage}
            />
          </div>
          {profileData.role && (
            <div className={styles.roleBadge}>
              {profileData.role.toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.detailsGroup}>
            <h3 className={styles.detailsTitle}>Personal Information</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Full Name:</span>
              <span>{profileData.firstName} {profileData.lastName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email:</span>
              <span>{profileData.email}</span>
            </div>
          </div>

          {profileData.providerDetails && (
            <div className={styles.detailsGroup}>
              <h3 className={styles.detailsTitle}>Professional Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Specialty:</span>
                <span>{profileData.providerDetails.specialty || "Not specified"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Bio:</span>
                <p className={styles.bioText}>
                  {profileData.providerDetails.bio || "No bio available"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.lastUpdated}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}






































// import styles from "./ProfileCard.module.css";

// export default function ProfileCard({ profileData }) {
//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.header}>
//         <h2 className={styles.title}>Profile</h2>
//         <button
//           className={styles.updateButton}
//         >
//           Update Profile
//         </button>
//       </div>

//       <div className={styles.profileDetails}>
//         <div className={styles.image}>
//             <img src={profileData.profileImageUrl} alt={profileData.firstName} />
//         </div>
//         <div className={styles.info}>
//             <div className={styles.profileInfo}>
//             <p>Full name: {profileData.firstName} {" "} {profileData.lastName}</p>
//             <p>Email: {profileData.email}</p>
//         </div>
//         <div className={styles.role}>
//             <p>Role: {profileData.role}</p>
//         </div>
//         {
//             profileData.providerDetails && (
//                 <div className={styles.providerDetails}>
//                     <p>Speciality: {profileData.providerDetails.specialty}</p>
//                     <p>Bio: {profileData.providerDetails.bio}</p>
//                 </div>
//             )
//         }
//         </div>
        
//       </div>
//     </div>
//   );
// }
