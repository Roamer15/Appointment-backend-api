import styles from './TimeSlotCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {formatTime} from '../../utils/timeFormatter'
import { useState } from 'react';
import UpdateSlotModal from './UpdateSlotModal';

export default function TimeSlotCard({ slot, onRefresh }) {
  const [showModal, setShowModal] = useState(false)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this slot?')) {
      try {
        await api.deleteTimeSlot(slot.id);
        toast.success('Time slot deleted');
        onRefresh();
      } catch {
        toast.error('Failed to delete slot');
      }
    }
  };


  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>{slot.type}</h4>
          <p className={styles.date}>{new Date(slot.day).toDateString()}</p>
        </div>
        <span className={styles.status}>{!slot.is_booked ? "Available":"Booked"}</span>
      </div>

      <div className={styles.time}>
        <FontAwesomeIcon icon={faClock} className={styles.icon} />
        <span>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className={styles.delete} onClick={handleDelete}><FontAwesomeIcon icon={faTrashAlt} /></button>
      </div>

      {showModal && (
        <UpdateSlotModal onClose={() => setShowModal(false)} onSlotUpdated={onRefresh} slotId={slot.id}/>
      )}
    </div>
  );
}
