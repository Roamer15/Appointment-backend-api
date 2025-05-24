import styles from './RegisterForm.module.css'

export default function RegisterForm({ formik, preview, handleImageChange, error }) {
    return(
        <div className={styles.wrapper}>
            
      <div className={styles.header}>
        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h1 className={styles.title}>Join NexMeet</h1>
        <p className={styles.subtitle}>Connect with people who matter</p>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        {preview && <img src={preview} alt="Preview" className={styles.preview} />}
        <label className={styles.uploadLabel}>
          <i className="fas fa-camera fa-2x" />
          <span>Upload Profile Picture</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <input
          name="fullName"
          placeholder="Full Name"
          className={styles.input}
          onChange={formik.handleChange}
          value={formik.values.fullName}
        />
        {formik.touched.fullName && formik.errors.fullName && <div className={styles.error}>{formik.errors.fullName}</div>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className={styles.input}
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && <div className={styles.error}>{formik.errors.email}</div>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          className={styles.input}
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && <div className={styles.error}>{formik.errors.password}</div>}

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className={styles.input}
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className={styles.error}>{formik.errors.confirmPassword}</div>
        )}

        <select
          name="role"
          className={styles.input}
          value={formik.values.role}
          onChange={formik.handleChange}
        >
          <option value="client">Client</option>
          <option value="provider">Provider</option>
        </select>

        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            name="terms"
            checked={formik.values.terms}
            onChange={formik.handleChange}
          />
          I agree to the <a href="#">Terms</a> and <a href="https://www.termsfeed.com/live/64b689f4-8f12-4322-804a-57badf31caf2">Privacy Policy</a>
        </label>
        {formik.touched.terms && formik.errors.terms && <div className={styles.error}>{formik.errors.terms}</div>}

        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submit}>Create Account</button>

        <p className={styles.footerText}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </form>
    </div>
    )
}
