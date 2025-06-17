import { useState, useEffect } from "react";
import styles from "./ProfileUpdateModal.module.css";
import api from "../../services/api";

const ProfileUpdateModal = ({ userData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialty: "",
    bio: "",
    profilePic: null
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || userData.first_name || "",
        lastName: userData.lastName || userData.last_name || "",
        email: userData.email || "",
        password: "",
        specialty: userData.providerDetails?.specialty || "",
        bio: userData.providerDetails?.bio || "",
        profilePic: null
      });
      setPreviewImage(userData.profileImageUrl || userData.profile_image_url || "");
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (userData.role === "provider" && !formData.specialty.trim()) {
      newErrors.specialty = "Specialty is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("firstName", formData.firstName);
      formPayload.append("lastName", formData.lastName);
      formPayload.append("email", formData.email);
      if (formData.password) formPayload.append("password", formData.password);
      if (formData.specialty) formPayload.append("specialty", formData.specialty);
      if (formData.bio) formPayload.append("bio", formData.bio);
      if (formData.profilePic) formPayload.append("profilePic", formData.profilePic);

      await api.updateProfile(formPayload);

      onUpdate();
    } catch (error) {
      console.error("Update error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to update profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Update Profile</h2>
        
        {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.imageSection}>
              <div className={styles.imagePreview}>
                <img 
                  src={previewImage || "/default-avatar.png"} 
                  alt="Profile preview" 
                />
              </div>
              <label className={styles.fileInputLabel}>
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </label>
            </div>

            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? styles.errorInput : ""}
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>

               <div className={styles.formGroup}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? styles.errorInput : ""}
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>

               <div className={styles.formGroup}>
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? styles.errorInput : ""}
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              {userData.role === "provider" && (
                <>
                  <div className={styles.formGroup}>
                    <label>Specialty</label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className={errors.specialty ? styles.errorInput : ""}
                    />
                    {errors.specialty && <span className={styles.errorText}>{errors.specialty}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;