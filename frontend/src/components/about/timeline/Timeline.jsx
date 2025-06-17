import styles from './Timeline.module.css';
import { FaSeedling, FaCodeBranch, FaGlobe, FaUsers, FaStar } from 'react-icons/fa';

export default function Timeline() {
  const milestones = [
    {
      icon: <FaSeedling className={styles.icon} />,
      title: "Company Founded",
      date: "May 2025",
      description: "NexMeet was officially incorporated with a mission to simplify appointment booking."
    },
    // Add other timeline items...
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Our Journey</h2>
        <h1 className={styles.title}>Milestones & Achievements</h1>
      </div>
      
      <div className={styles.timeline}>
        {milestones.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.marker}>{item.icon}</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <time className={styles.date}>{item.date}</time>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}