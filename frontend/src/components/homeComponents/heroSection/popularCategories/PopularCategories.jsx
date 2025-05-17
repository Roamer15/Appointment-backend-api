import styles from './PopularCategories.module.css';

const categories = [
  { icon: 'fas fa-cut', title: 'Barber', desc: 'Professional haircuts and grooming services' },
  { icon: 'fas fa-car', title: 'Driver', desc: 'Reliable transportation when you need it' },
  { icon: 'fas fa-book-open', title: 'Tutor', desc: 'Personalized learning for all subjects' },
  { icon: 'fas fa-camera', title: 'Photographer', desc: 'Capture your special moments professionally' },
  { icon: 'fas fa-tools', title: 'Mechanic', desc: 'Expert vehicle maintenance and repairs' },
  { icon: 'fas fa-wrench', title: 'Plumber', desc: 'Fix your plumbing issues quickly' },
  { icon: 'fas fa-bolt', title: 'Electrician', desc: 'Professional electrical services' },
  { icon: 'fas fa-broom', title: 'Cleaner', desc: 'Spotless cleaning for your space' },
];

export default function PopularCategories() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Popular Categories</h2>
        <div className={styles.grid}>
          {categories.map((cat, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.iconBox}>
                <i className={`${cat.icon} ${styles.icon}`}></i>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.title}>{cat.title}</h3>
                <p className={styles.desc}>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
