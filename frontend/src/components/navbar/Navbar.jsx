import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <span className={styles.brandText}>NexMeet</span>
          </div>
          <div className={styles.links}>
            <a href="#">Home</a>
            <a href="#">How It Works</a>
            <a href="#">Categories</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.signUp}>
            <a href="#" className={styles.register}>
              Sign Up
            </a>
            <button className={styles.login}>Login</button>
          </div>
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#">Home</a>
            <a href="#">How It Works</a>
            <a href="#">Categories</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <div className={styles.mobileMenuAction}>
              <a href="#">Log In</a>
              <a href="#">Sign Up</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
