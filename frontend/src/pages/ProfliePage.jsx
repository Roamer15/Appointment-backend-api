import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileUpdateModal from "../components/profile/ProfileUpdateModal";
import styles from '../components/profile/ProfilePage.module.css'

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  async function fetchProfileData() {
    try {
      const profileRes = await api.getProfileData();
      console.log(profileRes);
      setProfile(profileRes);
      toast.success("Profile data succesfully fetched");
    } catch (error) {
      console.error(`Failed to fetch profile details`, error.message);
      toast.error("Failed to fetch profile details");
    }
  }

  const handleProfileUpdate = async () => {
    fetchProfileData()
    toast.success("Profile updated successfully");
    setShowUpdateModal(false);
  };

  const handleUpdateClick = () => {
    console.log('Button clicked')
    setShowUpdateModal(true)
  }

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (!profile) {
    return <div className={styles.error}>Failed to load profile data</div>;
  }

  return (
    <div className={styles.container}>
      <ProfileCard
        profileData={profile}
        onUpdateClick={handleUpdateClick}
      />
{console.log(showUpdateModal)}
      {showUpdateModal && (
        <ProfileUpdateModal
          userData={profile}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
