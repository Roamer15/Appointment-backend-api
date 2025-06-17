import { useEffect, useState } from "react";
import styles from "../components/timeslots/TimeSlotPage.module.css";
import AppointmentCard from "../components/appointments/AppointmentCard";
import api from "../services/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await api.getProviderAppointments();
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Appointments</h2>
      </div>

      <div className={styles.slotList}>
        {appointments.length === 0 ? (
          <p className={styles.empty}>No Appointments booked.</p>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.appointment_id}
              appointment={appointment}
              onRefresh={fetchAppointments}
            />
          ))
        )}
      </div>
    </div>
  );
}
