import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api";
import styles from "./ViewAppointments.module.css";
import { formatTime } from "../../utils/timeFormatter";
import { toast } from "react-toastify";

export default function ViewAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
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

    fetchAppointment();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      await api.cancelAppointment(appointmentId);
      toast.success('Appointment canceled')
    } catch (err) {
      setError(`Failed to cancel appointment: ${err.message}`);
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
              {/* Card Header with Provider Info */}
              <div className={styles.cardHeader}>
                <div className={styles.providerInfo}>
                  <h2>
                    {appointment.provider_first_name} {appointment.provider_last_name}
                  </h2>
                </div>
              </div>

              {/* Appointment Timeline */}
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

              {/* Status and Location */}
              <div className={styles.metaInfo}>
                <span className={`${styles.status} ${styles[appointment.status]}`}>
                  {appointment.status}
                </span>
              </div>
              {/* Action Buttons */}
              <div className={styles.actions}>
                {appointment.status === "booked" &&(
                  <button 
                    className={styles.cancelButton}
                    onClick={() => handleCancel(appointment.appointment_id)}
                  >
                    Cancel Appointment
                  </button>
                )}
                <button 
                  className={styles.rescheduleButton}
                  onClick={() => navigate(`/providers/${appointment.provider_id}/schedule`)}
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

