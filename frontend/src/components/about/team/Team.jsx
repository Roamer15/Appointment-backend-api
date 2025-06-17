import styles from './Team.module.css';
import { FaLinkedin, FaTwitter, FaGithub, FaDribbble } from 'react-icons/fa';

export default function Team() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Visionary leader with 10+ years in SaaS product development.",
      social: [
        { icon: <FaLinkedin />, url: "#" },
        { icon: <FaTwitter />, url: "#" }
      ]
    },
    // Add other team members...
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.subtitle}>Meet the Team</h2>
        <h1 className={styles.title}>The People Behind NexMeet</h1>
        <p className={styles.description}>
          A passionate group of individuals dedicated to making appointment booking better.
        </p>
      </div>
      
      <div className={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <div key={index} className={styles.card}>
            <img 
              src={member.image} 
              alt={member.name}
              className={styles.avatar}
            />
            <h3 className={styles.name}>{member.name}</h3>
            <p className={styles.role}>{member.role}</p>
            <p className={styles.bio}>{member.bio}</p>
            <div className={styles.socialLinks}>
              {member.social.map((social, i) => (
                <a key={i} href={social.url} className={styles.socialLink}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}