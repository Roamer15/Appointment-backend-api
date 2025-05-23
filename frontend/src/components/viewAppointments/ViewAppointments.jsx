import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api";
import styles from "./ViewAppointments.module.css";
import { formatTime } from "../../utils/timeFormatter";
import { toast } from "react-toastify";
import RescheduleModal from "../reschedule/RescheduleAppointment"; // We'll create this component

export default function ViewAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.getClientAppointments();
        setAppointments(res.appointments);
      } catch (err) {
        setError("Failed to fetch appointment details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      await api.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      toast.error(`Failed to cancel appointment: ${err.message}`);
    }
  };

  const handleRescheduleClick = async (appointment) => {
    try {
      setIsRescheduling(true);
      setSelectedAppointment(appointment);
      // Fetch available slots for this provider
      const res = await api.getProviderTimeSlots(appointment.provider_id);
      setAvailableSlots(res.availableSlots);
      
      setShowRescheduleModal(true);
    } catch (err) {
      toast.error(`Failed to load available slots: ${err.message}`);
      console.error('Failed to load available slots', err.message)
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleReschedule = async (newTimeslotId) => {
    try {
      setIsRescheduling(true);
      console.log(selectedAppointment)
      await api.rescheduleAppointment(selectedAppointment.appointment_id, { newTimeslotId });
      
      // Update the appointment in state
      setAppointments(prev => 
        prev.map(appt => 
          appt.appointment_id === selectedAppointment.appointment_id
            ? { 
                ...appt, 
                timeslot_id: newTimeslotId,
                day: availableSlots.find(slot => slot.id === newTimeslotId).day,
                start_time: availableSlots.find(slot => slot.id === newTimeslotId).start_time,
                end_time: availableSlots.find(slot => slot.id === newTimeslotId).end_time
              }
            : appt
        )
      );
      
      toast.success('Appointment rescheduled successfully');
      setShowRescheduleModal(false);
    } catch (err) {
      toast.error(`Failed to reschedule appointment: ${err.message}`);
    } finally {
      setIsRescheduling(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading appointment details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!appointments || appointments.length === 0) return <div className={styles.notFound}>No appointments found</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Your Appointments</h1>
          <button 
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <div className={styles.cardsContainer}>
          {appointments.map((appointment) => (
            <div key={appointment.appointment_id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.providerInfo}>
                  <h2>
                    {appointment.provider_first_name} {appointment.provider_last_name}
                  </h2>
                  <span className={styles.specialty}>{appointment.provider_specialty}</span>
                </div>
              </div>

              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <span className={styles.date}>{new Date(appointment.day).toDateString()}</span>
                    <span className={styles.timeRange}>
                      {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.metaInfo}>
                <span className={`${styles.status} ${styles[appointment.status]}`}>
                  {appointment.status}
                </span>
                <span className={styles.location}>
                  {appointment.location || "Virtual"}
                </span>
              </div>

              <div className={styles.actions}>
                {appointment.status === "booked" && (
                  <button 
                    className={styles.cancelButton}
                    onClick={() => handleCancel(appointment.appointment_id)}
                    disabled={isRescheduling}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  className={styles.rescheduleButton}
                  onClick={() => handleRescheduleClick(appointment)}
                  disabled={isRescheduling || appointment.status !== "booked"}
                >
                  {isRescheduling ? "Loading..." : "Reschedule"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <RescheduleModal
            currentAppointment={selectedAppointment}
            availableSlots={availableSlots}
            onClose={() => setShowRescheduleModal(false)}
            onReschedule={handleReschedule}
            isProcessing={isRescheduling}
          />
        )}
      </div>
    </div>
  );
}












































// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import api from "../../services/api";
// import styles from "./ViewAppointments.module.css";
// import { formatTime } from "../../utils/timeFormatter";
// import { toast } from "react-toastify";

// export default function ViewAppointments() {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAppointment = async () => {
//       try {
//         const res = await api.getClientAppointments();

//         setAppointments(res.appointments);

//       } catch (err) {
//         setError("Failed to fetch appointment details");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAppointment();
//   }, []);

//   const handleCancel = async (appointmentId) => {
//     try {
//       await api.cancelAppointment(appointmentId);
//       toast.success('Appointment canceled')
//     } catch (err) {
//       setError(`Failed to cancel appointment: ${err.message}`);
//     }
//   };

//   if (isLoading) return <div className={styles.loading}>Loading appointment details...</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!appointments || appointments.length === 0) return <div className={styles.notFound}>No appointments found</div>;

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.container}>
//         <div className={styles.header}>
//           <h1>Your Appointments</h1>
//           <button 
//             className={styles.backButton}
//             onClick={() => navigate(-1)}
//           >
//             ← Back
//           </button>
//         </div>

//         <div className={styles.cardsContainer}>
//           {appointments.map((appointment) => (
//             <div key={appointment.appointment_id} className={styles.card}>
//               {/* Card Header with Provider Info */}
//               <div className={styles.cardHeader}>
//                 <div className={styles.providerInfo}>
//                   <h2>
//                     {appointment.provider_first_name} {appointment.provider_last_name}
//                   </h2>
//                 </div>
//               </div>

//               {/* Appointment Timeline */}
//               <div className={styles.timeline}>
//                 <div className={styles.timelineItem}>
//                   <div className={styles.timelineDot}></div>
//                   <div className={styles.timelineContent}>
//                     <span className={styles.date}>{new Date(appointment.day).toDateString()}</span>
//                     <span className={styles.timeRange}>
//                       {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Status and Location */}
//               <div className={styles.metaInfo}>
//                 <span className={`${styles.status} ${styles[appointment.status]}`}>
//                   {appointment.status}
//                 </span>
//               </div>
//               {/* Action Buttons */}
//               <div className={styles.actions}>
//                 {appointment.status === "booked" &&(
//                   <button 
//                     className={styles.cancelButton}
//                     onClick={() => handleCancel(appointment.appointment_id)}
//                   >
//                     Cancel Appointment
//                   </button>
//                 )}
//                 <button 
//                   className={styles.rescheduleButton}
//                   onClick={() => navigate(`/client/${appointment.appointment_id}/reschedule`)}
//                 >
//                   Reschedule
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

