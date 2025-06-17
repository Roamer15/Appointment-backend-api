import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const steps = [
    {
      icon: 'fas fa-search',
      title: 'Search',
      description: 'Find providers by category or location with our easy-to-use search',
    },
    {
      icon: 'far fa-calendar-check',
      title: 'Book',
      description: 'Select your preferred time and confirm your appointment instantly',
    },
    {
      icon: 'fas fa-handshake',
      title: 'Connect',
      description: 'Meet your provider and get your service done with satisfaction',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How NexMeet Works</h2>
        <div className={styles.steps}>
          {steps.map((step, idx) => (
            <div className={styles.step} key={idx}>
              <div className={styles.iconCircle}>
                <i className={`${step.icon} ${styles.icon}`}></i>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.description}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
