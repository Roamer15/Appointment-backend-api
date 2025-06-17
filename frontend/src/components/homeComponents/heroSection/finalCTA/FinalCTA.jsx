import styles from './FinalCTA.module.css';
import { useNavigate } from 'react-router';

export default function FinalCTA() {
    const navigate = useNavigate()
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ready to book your next appointment?</h2>
        <p className={styles.subtitle}>
          Join thousands of happy customers enjoying convenient services
        </p>
        <button className={styles.ctaButton} onClick={() => navigate("/register")}>Sign Up Now</button>
      </div>
    </section>
  );
}
