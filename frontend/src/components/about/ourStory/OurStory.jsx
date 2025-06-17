import styles from './OurStory.module.css';
import { FaLightbulb, FaCode, FaRocket } from 'react-icons/fa';

export default function OurStory() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Our Story</h2>
        <h1 className={styles.title}>How NexMeet was born</h1>
        <p className={styles.description}>
          Founded in 2025, NexMeet started as a simple idea to make appointment booking easier for everyone.
        </p>
      </div>

      <div className={styles.grid}>
        {[
          {
            icon: <FaLightbulb className={styles.icon} />,
            title: "The Idea",
            description: "Frustrated with complex booking systems, our founder envisioned a simpler solution."
          },
          {
            icon: <FaCode className={styles.icon} />,
            title: "Development",
            description: "A small team of passionate developers brought the vision to life."
          },
          {
            icon: <FaRocket className={styles.icon} />,
            title: "Growth",
            description: "Today, NexMeet serves thousands of businesses and customers worldwide."
          }
        ].map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.iconContainer}>{item.icon}</div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardText}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}