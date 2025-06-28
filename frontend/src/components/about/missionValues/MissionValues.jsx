import styles from './MissionValues.module.css';
import { FaHeart, FaLightbulb, FaHandshake } from 'react-icons/fa';

export default function MissionValues() {
const values = [
  {
    icon: <FaHeart className={styles.icon} />,
    title: "Customer-Centric",
    description: "We put our users first in every decision we make, striving to exceed expectations and deliver real value."
  },
  {
    icon: <FaLightbulb className={styles.icon} />,
    title: "Innovation",
    description: "We embrace creativity and technology to continuously improve our platform and empower our community."
  },
  {
    icon: <FaHandshake className={styles.icon} />,
    title: "Trust & Integrity",
    description: "We build lasting relationships through honesty, transparency, and respect for all users and partners."
  },
  {
    icon: <FaHeart className={styles.icon} />,
    title: "Empathy",
    description: "We listen, understand, and respond to the needs of our users, ensuring a supportive experience for everyone."
  },
  {
    icon: <FaLightbulb className={styles.icon} />,
    title: "Excellence",
    description: "We are committed to delivering high-quality solutions and continuously raising our standards."
  }
];
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Our Core</h2>
        <h1 className={styles.title}>Mission & Values</h1>
      </div>
      
      <div className={styles.grid}>
        <div className={styles.missionCard}>
          <h3 className={styles.missionTitle}>Our Mission</h3>
          <p className={styles.missionText}>
            To empower service businesses and their customers with seamless, intuitive appointment booking solutions...
          </p>
        </div>
        
        <div className={styles.values}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueItem}>
              <div className={styles.valueIcon}>{value.icon}</div>
              <div>
                <h4 className={styles.valueTitle}>{value.title}</h4>
                <p className={styles.valueText}>{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}