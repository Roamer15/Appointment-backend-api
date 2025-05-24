import { useEffect, useState } from 'react';
import styles from '../components/timeslots/TimeSlotPage.module.css';
import TimeSlotCard from '../components/timeslots/TimeSlotCard';
import CreateSlotModal from '../components/timeslots/CreateSlotModal';
import api from '../services/api'; // your service layer

export default function TimeSlot() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch time slots from the backend
  const fetchTimeSlots = async () => {
    try {
      const response = await api.getProviderSlots(); // adjust to your actual API method
      console.log(response)
      setTimeSlots(response.slots || []);
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Time Slots Management</h2>
        <button className={styles.createButton} onClick={() => setShowModal(true)}>
          + Create Slot
        </button>
      </div>

      <div className={styles.slotList}>
        {timeSlots.length === 0 ? (
          <p className={styles.empty}>No time slots available.</p>
        ) : (
          timeSlots.map(slot => (
            <TimeSlotCard key={slot.id} slot={slot} onRefresh={fetchTimeSlots} />
          ))
        )}
      </div>

      {showModal && (
        <CreateSlotModal
          onClose={() => setShowModal(false)}
          onSlotCreated={fetchTimeSlots}
        />
      )}
    </div>
  );
}
