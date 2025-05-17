import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.logo}>NexMeeet</h3>
            <p className={styles.description}>
              Connecting communities through trusted service providers.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Quick Links</h4>
            <ul className={styles.list}>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Contact Us</h4>
            <ul className={styles.list}>
              <li><i className="fas fa-map-marker-alt"></i> Montee Jouvence, Yaounde</li>
              <li><i className="fas fa-phone"></i> +237 680 449 450</li>
              <li><i className="fas fa-envelope"></i> ianseeksbeta@gmail.com</li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Follow Us</h4>
            <div className={styles.socialIcons}>
              <a href="https://github.com/Roamer15"><i className="fab fa-github"></i></a>
              <a href="https://x.com/@Bel78709"><i className="fab fa-x"></i></a>
              <a href="https://instagram.com/r.i.s.e.n_r.o.a.m.e.r"><i className="fab fa-instagram"></i></a>
              <a href="https://www.linkedin.com/in/beleke-ian-langeh-52576b332?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2025 NexMeeet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
