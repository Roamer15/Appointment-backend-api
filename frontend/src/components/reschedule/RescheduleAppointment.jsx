import styles from './RescheduleAppointment.module.css';
import { formatTime } from '../../utils/timeFormatter';
import { useState } from 'react';
import { toast } from 'react-toastify';


export default function RescheduleModal({
  currentAppointment,
  availableSlots,
  onClose,
  onReschedule,
  isProcessing
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleReschedule = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    onReschedule(selectedSlot.id);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <h2 className={styles.title}>Reschedule Appointment</h2>
        
        <div className={styles.currentAppointment}>
          <h3>Current Appointment</h3>
          <p>
            {new Date(currentAppointment.day).toDateString()}, {formatTime(currentAppointment.start_time)} - {formatTime(currentAppointment.end_time)}
          </p>
        </div>

        <div className={styles.availableSlots}>
          <h3>Available Time Slots</h3>
          
          {availableSlots.length === 0 ? (
            <div className={styles.noSlots}>No available slots found</div>
          ) : (
            <div className={styles.slotGrid}>
              {availableSlots.map(slot => (
                <div 
                  key={slot.id}
                  className={`${styles.slotCard} ${selectedSlot?.id === slot.id ? styles.selected : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className={styles.slotDate}>{new Date(slot.day).toDateString()}</div>
                  <div className={styles.slotTime}>
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton}
            onClick={handleReschedule}
            disabled={!selectedSlot || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}