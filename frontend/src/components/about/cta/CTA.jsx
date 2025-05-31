import styles from './CTA.module.css';

export default function CTA() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          <span>Ready to transform your appointment booking?</span>
          <span className={styles.highlight}>Get started with NexMeet today.</span>
        </h2>
        
        <div className={styles.buttons}>
          <a href="#" className={styles.primaryButton}>
            Start free trial
          </a>
          <a href="#" className={styles.secondaryButton}>
            Contact sales
          </a>
        </div>
      </div>
    </div>
  );
}