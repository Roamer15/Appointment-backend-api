import { useParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";
import styles from './ProviderProfile.module.css';
import { toast } from "react-toastify";

export default function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  
  const [isBooking, setIsBooking] = useState(false);


  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setIsLoading(true);
        const [res, resSlot] = await Promise.all([
          api.getProviderById(id),
          api.getProviderTimeSlots(id)
        ]);
        setProvider(res);
        setSlots(resSlot.availableSlots || []);
      } catch (err) {
        console.error("Failed to load provider:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

const handleBooking = async (id) => {
  setIsBooking(true);
  try {
    const res = await api.bookAppointment({ timeslotId: id });
    toast.success(res.message)
    // Update state or redirect
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsBooking(false);
  }
};

  if (isLoading) return <p className={styles.loading}>Loading provider details...</p>;
  if (!provider) return <p className={styles.loading}>Provider not found</p>;

  return (
    <div className={styles.wrapper}>
  <div className={styles.profileSection}>
    <img 
      src={provider.profileImageUrl || '/default-avatar.png'} 
      alt={`${provider.first_name} ${provider.last_name}`} 
      className={styles.avatar}
      onError={(e) => { e.target.src = '/default-avatar.png' }}
    />
    <div className={styles.details}>
      <h2 className={styles.name}>{provider.firstName} {provider.lastName}</h2>
      <p className={styles.email}>{provider.email}</p>
      <p className={styles.specialty}>{provider.specialty}</p>
      <p className={styles.bio}>{provider.bio}</p>
    </div>
  </div>

  <div className={styles.slotsSection}>
    <h3 className={styles.slotsTitle}>Available Time Slots</h3>
    {slots.length === 0 ? (
      <p className={styles.noSlots}>No available time slots at the moment.</p>
    ) : (
      <ul className={styles.slotsList}>
        {slots.map((slot, index) => (
          <li key={index + 1} className={styles.slotItem}>
            <div className={styles.slotDetail}>
              <span className={styles.slotDate}>{new Date(slot.day).toDateString()}</span>
            <span className={styles.slotTime}> {new Date(`1970-01-01T${slot.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {" "}
      {new Date(`1970-01-01T${slot.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <button className={styles.book} onClick={() => handleBooking(slot.id)}> {isBooking ? 'Booking...' : 'Book Now'}</button>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
  );
}
