import { useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <span className={styles.brandText}>NexMeet</span>
          </div>
          <div className={styles.links}>
            <a href="/">Home</a>
            <a href="#section">How It Works</a>
            <a href="#">Categories</a>
            <a href="/about">About</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.signUp}>
            <a href="/register" className={styles.register}>
              Sign Up
            </a>
            <button className={styles.login} onClick={() => navigate('/login')}>Login</button>
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
              <a href="/login">Log In</a>
              <a href="/register">Sign Up</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
