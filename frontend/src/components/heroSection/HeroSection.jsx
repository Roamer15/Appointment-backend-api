import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <h1 className={styles.heading}>
          Book Trusted Services Near You
        </h1>
        <p className={styles.subheading}>
          Connecting you with top-rated providers in your community
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton}>Find a Provider</button>
          <button className={styles.secondaryButton}>Join as Provider</button>
        </div>
      </div>
    </section>
  );
}
