import { useState, useEffect } from "react";
import PieChart from "../PieChart";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUserClock,
  faChartPie,
  faComments,
  faCalendarPlus,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ProviderHome.module.css";
import api from "../../services/api";
import { formatTime } from "../../utils/timeFormatter";

export default function ProviderHome() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [apptsRes, statsRes] = await Promise.all([
          api.getProviderAppointments(),
          api.getProviderStats(),
        ]);
        console.log(today)
        console.log(apptsRes)
        if (new Date(apptsRes.appointments.day).toISOString().split("T")[0] === today) {
          setAppointments(apptsRes.appointments);
        }
        setStats(statsRes.stats);

      } catch (error) {
        console.error("Failed to fetch data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return <div className={styles.loading}>Loading dashboard...</div>;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Provider Dashboard</h1>
        <button
          className={styles.primaryButton}
          onClick={() => navigate("/dashboard/timeslots")}
        >
          <FontAwesomeIcon icon={faCalendarPlus} /> Create Availability
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={faCalendarAlt}
          title="Today's Appointments"
          value={stats?.todayCount || 0}
          change={stats?.todayChange || 0}
          color="amber"
        />
        <StatCard
          icon={faUserClock}
          title="Average Duration"
          value={`${stats?.avgDuration || 0} mins`}
          change={stats?.durationChange || 0}
          color="blue"
        />
        <StatCard
          icon={faChartPie}
          title="Succesful Booking Rate"
          value={`${stats?.completionRate || 0}%`}
          change={stats?.completionChange || 0}
          color="green"
        />
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>
        {/* Upcoming Appointments */}
        <div className={`${styles.card} ${styles.appointmentsCard}`}>
          <div className={styles.cardHeader}>
            <h2>
              <FontAwesomeIcon icon={faCalendarAlt} /> Today's Appointments
            </h2>
            <span className={styles.badge}>{appointments.length}</span>
          </div>

          <div className={styles.appointmentsList}>
            {console.log(appointments)}
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  time={`${formatTime(appt.start_time)} - ${formatTime(
                    appt.end_time
                  )}`}
                  patient={`${appt.client_first_name} ${appt.client_last_name}`}
                  service={appt.service_type}
                  status={appt.status}
                  onClick={() => navigate(`dashboard/appointments`)}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No appointments scheduled for today</p>
                <button
                  className={styles.secondaryButton}
                  onClick={() => navigate("/dashboard/timeslots")}
                >
                  Set Availability
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analytics */}
        <div className={`${styles.card} ${styles.analyticsCard}`}>
          <div className={styles.cardHeader}>
            <h2>
              <FontAwesomeIcon icon={faChartPie} /> Weekly Summary
            </h2>
          </div>
          <div className={styles.chartContainer}>
            {/* Placeholder for chart - implement with your preferred library */}
            <div className={styles.pieChart}>
              <PieChart
                data={[
                  {
                    name: "Completed",
                    value: stats?.bookedThisWeek || 0,
                    color: "#10B981",
                  },
                  {
                    name: "Cancelled",
                    value: stats?.
canceledThisWeek || 0,
                    color: "#EF4444",
                  },
                  {
                    name: "Rescheduled",
                    value: stats?.rescheduledThisWeek || 0,
                    color: "#F59E0B",
                  },
                ]}
              />
            </div>
            <div className={styles.chartLegend}>
              {["Booked", "Canceled", "Rescheduled"].map((item) => (
                <div key={item} className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{
                      backgroundColor:
                        item === "Booked"
                          ? "#10B981"
                          : item === "Canceled"
                          ? "#EF4444"
                          : "#F59E0B",
                    }}
                  />
                  <span>
                    {item}: {stats?.[`${item.toLowerCase()}ThisWeek`] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${styles.card} ${styles.quickActionsCard}`}>
          <div className={styles.cardHeader}>
            <h2>
              <FontAwesomeIcon icon={faComments} /> Quick Actions
            </h2>
          </div>
          <div className={styles.actionsGrid}>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/messages")}
            >
              <div className={styles.actionIcon}>
                <FontAwesomeIcon icon={faComments} />
              </div>
              Respond to Messages
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/schedule")}
            >
              <div className={styles.actionIcon}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              Manage Availability
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/profile")}
            >
              <div className={styles.actionIcon}>
                <FontAwesomeIcon icon={faUserClock} />
              </div>
              Update Profile
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/stats")}
            >
              <div className={styles.actionIcon}>
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              View Full Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function StatCard({ icon, title, value, change, color }) {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className={styles.statContent}>
        <h3>{title}</h3>
        <p className={styles.statValue}>{value}</p>
        {change !== 0 && (
          <p
            className={`${styles.statChange} ${
              change > 0 ? styles.positive : styles.negative
            }`}
          >
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}% from yesterday
          </p>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({ time, patient, service, status, onClick }) {
  return (
    <div
      className={`${styles.appointmentCard} ${styles[status]}`}
      onClick={onClick}
    >
      <div className={styles.appointmentTime}>{time}</div>
      <div className={styles.appointmentDetails}>
        <h4>{patient}</h4>
        <p>{service}</p>
      </div>
      <div className={styles.appointmentStatus}>
        <span className={`${styles.statusBadge} ${styles[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
