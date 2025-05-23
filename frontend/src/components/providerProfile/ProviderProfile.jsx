import { useParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";
import styles from './ProviderProfile.module.css';
import { toast } from "react-toastify";
// import { formatTime } from "../../utils/timeFormatter";

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
        console.log(res)
        console.log(resSlot)
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
    console.log('Booked!', res);
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


































// // ProviderProfile.jsx
// import { useParams } from "react-router";
// import { useEffect, useState } from "react";
// import api from "../../services/api"; // Adjust path if needed
// import styles from './ProviderProfile.module.css';

// export default function ProviderProfile() {
//   const { id } = useParams();
//   const [provider, setProvider] = useState(null);
//   const [slots, setSlots] = useState([]);

//   useEffect(() => {
//     const fetchProvider = async () => {
//       try {
//         const res = await api.getProviderById(id);
//         const resSlot = await api.getProviderTimeSlots(id)
//         console.log(res)
//         console.log(resSlot)
//         setProvider(res);
//         setSlots(resSlot.availableSlots);
//       } catch (err) {
//         console.error("Failed to load provider:", err);
//       }
//     };
//     fetchProvider();
//   }, [id]);

//   if (!provider) return <p>Loading...</p>;

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.header}>
//         <img src={provider.profileImageUrl} alt="" />
//         <h2>{provider.first_name} {provider.last_name}</h2>
//         <p>{provider.email}</p>
//         <p>{provider.specialty}</p>
//         <p>{provider.bio}</p>
//       </div>

//       <div className={styles.slots}>
//         <h3>Available Time Slots</h3>
//         {slots.length === 0 ? (
//           <p>No slots available.</p>
//         ) : (
//           <ul>
//             {slots.map(slot => (
//               <li key={slot.id}>
//                 {slot.day} | {slot.start_time} - {slot.end_time}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
