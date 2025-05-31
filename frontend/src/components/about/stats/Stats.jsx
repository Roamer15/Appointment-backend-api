import styles from './Stats.module.css';

export default function Stats() {
  const stats = [
    { value: "5,000+", label: "Businesses Using NexMeet" },
    { value: "2M+", label: "Appointments Booked" },
    { value: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Trusted by businesses worldwide</h2>
        <p className={styles.subtitle}>
          NexMeet is transforming appointment booking for businesses of all sizes.
        </p>
      </div>
      
      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <dt className={styles.statValue}>{stat.value}</dt>
              <dd className={styles.statLabel}>{stat.label}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}