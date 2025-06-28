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
  {
    icon: <FaCodeBranch className={styles.icon} />,
    title: "First Prototype Launched",
    date: "August 2025",
    description: "Released our MVP, enabling users to book and manage appointments online for the first time."
  },
  {
    icon: <FaGlobe className={styles.icon} />,
    title: "Public Launch",
    date: "November 2025",
    description: "Opened NexMeet to the public, welcoming our first service providers and clients."
  },
  {
    icon: <FaUsers className={styles.icon} />,
    title: "1,000+ Users",
    date: "February 2026",
    description: "Reached our first major milestone with over 1,000 active users on the platform."
  },
  {
    icon: <FaStar className={styles.icon} />,
    title: "Award Recognition",
    date: "June 2026",
    description: "Honored with the 'Best Startup Solution' award for innovation in appointment management."
  }
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