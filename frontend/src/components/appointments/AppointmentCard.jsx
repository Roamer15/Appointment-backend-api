import styles from '../timeslots/TimeSlotCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '../../utils/timeFormatter';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useEffect } from 'react';
import { onSocketEvent, offSocketEvent } from '../../services/socket';

export default function AppointmentCard({ appointment, onRefresh }) {
  useEffect(() => {
    // Set up socket listener when component mounts
    const handleAppointmentCanceled = (data) => {
      if (data.appointmentId === appointment.appointment_id) {
        toast.info(data.message, {
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true
        });
        onRefresh(); // Refresh the appointment list
      }
    };

    onSocketEvent('appointment_canceled', handleAppointmentCanceled);

    // Clean up listener when component unmounts
    return () => {
      offSocketEvent('appointment_canceled', handleAppointmentCanceled);
    };
  }, [appointment.appointment_id, onRefresh]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const res = await api.cancelAppointmentProvider(appointment.appointment_id);
        console.log(res)
        toast.success('Appointment Canceled');
        onRefresh();
      } catch (err) {
        console.log(err)
        toast.error(err.message || 'Failed to cancel appointment');
      }
    }
  };

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
        <button className={styles.edit}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className={styles.delete} onClick={handleCancel}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </div>
  );
}




























// import styles from '../timeslots/TimeSlotCard.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faClock, faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
// import {formatTime} from '../../utils/timeFormatter'
// import {toast} from 'react-toastify'
// import api from '../../services/api';
// //import { useState } from 'react';
// // import UpdateSlotModal from './UpdateSlotModal';

// export default function AppointmentCard({ appointment, onRefresh }) {
//  // const [showModal, setShowModal] = useState(false)

//   const handleCancel = async() => {
//     if (confirm('Are you sure you want to cancel this appointment?')) {
//       try {
//         await api.cancelAppointmentProvider(appointment.appointment_id);
//         toast.success('Appointment Canceled');
//         onRefresh();
//       } catch {
//         toast.error('Failed to cancel appointment');
//       }
//     }
//   }

//   return (
//     <div className={styles.card}>
//       <div className={styles.header}>
//         <div>
//           <h4 className={styles.title}>Client: {appointment.client_first_name}{" "}{appointment.client_last_name}</h4>
//           <p className={styles.date}>{new Date(appointment.day).toDateString()}</p>
//         </div>
//         <span className={styles.status}>{appointment.status}</span>
//       </div>

//       <div className={styles.time}>
//         <FontAwesomeIcon icon={faClock} className={styles.icon} />
//         <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
//       </div>

//       <div className={styles.actions}>
//         <button className={styles.edit} ><FontAwesomeIcon icon={faEdit} /></button>
//         <button className={styles.delete} onClick={handleCancel}><FontAwesomeIcon icon={faTrashAlt} /></button>
//       </div>
// {/* 
//       {showModal && (
//         <UpdateSlotModal onClose={() => setShowModal(false)} onSlotUpdated={onRefresh} slotId={appointment.id}/>
//       )} */}
//     </div>
//   );
// }
