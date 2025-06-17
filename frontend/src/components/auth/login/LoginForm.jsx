import { useState } from 'react';
import styles from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

export default function LoginForm ({ formik, setShowModal, showModal, error}){
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.logo} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className={styles.title}>Welcome to NexMeet</h1>
          <p className={styles.subtitle}>Schedule your appointments with ease</p>
        </div>
        
        {/* Form */}
        <form 
          onSubmit={(e) => {
            console.log('Form submit triggered')
            e.preventDefault();
            formik.handleSubmit(e);
          }} 
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formik.values.email}
                className={styles.input}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="john@example.com"
              />
              <div className={styles.inputIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className={styles.error}>{formik.errors.email}</div>
              )}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={styles.input}
                placeholder="••••••••"
              />
              <div 
                className={styles.passwordToggle} 
                onClick={togglePasswordVisibility}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </div>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className={styles.error}>{formik.errors.password}</div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className={styles.signupLink}>
            Don't have an account? <a href="/register" className={styles.signupText}>Sign up</a>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="#f59e0b" strokeWidth="4"/>
                <path className={styles.successCheck} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M25 40L35 50L55 30"/>
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Welcome back!</h3>
            <p className={styles.modalText}>You've successfully logged in to NexMeet.</p>
            <button 
              onClick={() => {
                setShowModal(false);
                navigate('/dashboard');
              }} 
              className={styles.modalButton}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
 
  );
};
