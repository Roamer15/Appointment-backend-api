import styles from './Team.module.css';
import { FaLinkedin, FaTwitter, FaGithub, FaDribbble } from 'react-icons/fa';

export default function Team() {
const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Visionary leader with 10+ years in SaaS product development.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    social: [
      { icon: <FaLinkedin />, url: "https://linkedin.com/in/sarahjohnson" },
      { icon: <FaTwitter />, url: "https://twitter.com/sarahjohnson" }
    ]
  },
  {
    name: "Michael Lee",
    role: "Chief Technology Officer",
    bio: "Full-stack engineer passionate about scalable cloud solutions.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    social: [
      { icon: <FaGithub />, url: "https://github.com/michaellee" },
      { icon: <FaLinkedin />, url: "https://linkedin.com/in/michaellee" }
    ]
  },
  {
    name: "Priya Patel",
    role: "Product Designer",
    bio: "Designs intuitive user experiences and beautiful interfaces.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    social: [
      { icon: <FaDribbble />, url: "https://dribbble.com/priyapatel" },
      { icon: <FaLinkedin />, url: "https://linkedin.com/in/priyapatel" }
    ]
  },
  {
    name: "David Kim",
    role: "Lead Backend Developer",
    bio: "API specialist and database architect with a love for clean code.",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    social: [
      { icon: <FaGithub />, url: "https://github.com/davidkim" },
      { icon: <FaLinkedin />, url: "https://linkedin.com/in/davidkim" }
    ]
  },
  {
    name: "Emily Chen",
    role: "Marketing & Community Manager",
    bio: "Connects users and builds community through creative campaigns.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    social: [
      { icon: <FaTwitter />, url: "https://twitter.com/emilychen" },
      { icon: <FaLinkedin />, url: "https://linkedin.com/in/emilychen" }
    ]
  }
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