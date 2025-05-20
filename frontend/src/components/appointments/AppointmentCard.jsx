import styles from '../timeslots/TimeSlotCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEdit} from '@fortawesome/free-solid-svg-icons';
import {formatTime} from '../../utils/timeFormatter'
//import { useState } from 'react';
// import UpdateSlotModal from './UpdateSlotModal';

export default function AppointmentCard({ appointment }) {
 // const [showModal, setShowModal] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>Client: {appointment.client_first_name}{" "}{appointment.client_last_name}</h4>
          <p className={styles.date}>{new Date(appointment.day).toDateString()}</p>
        </div>
        <span className={styles.status}>{appointment.status}</span>
      </div>

      <div className={styles.time}>
        <FontAwesomeIcon icon={faClock} className={styles.icon} />
        <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.edit} ><FontAwesomeIcon icon={faEdit} /></button>
      </div>
{/* 
      {showModal && (
        <UpdateSlotModal onClose={() => setShowModal(false)} onSlotUpdated={onRefresh} slotId={appointment.id}/>
      )} */}
    </div>
  );
}
