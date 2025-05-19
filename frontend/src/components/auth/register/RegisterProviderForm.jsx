import styles from './RegisterForm.module.css'

export default function RegisterProviderForm ({ formik }){
    return (
         <div className={styles.wrapper}>
      <div className={styles.header}>
        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H17" />
        </svg>
        <h2 className={styles.title}>Complete Your Provider Profile</h2>
        <p className={styles.subtitle}>Tell us what you do and why you’re awesome</p>
      </div>

      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <input
          name="specialty"
          placeholder="Specialty"
          className={styles.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.specialty}
        />
        {formik.touched.specialty && formik.errors.specialty && (
          <div className={styles.error}>{formik.errors.specialty}</div>
        )}

        <textarea
          name="bio"
          placeholder="Short Bio"
          className={styles.input}
          rows="4"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bio}
        />
        {formik.touched.bio && formik.errors.bio && (
          <div className={styles.error}>{formik.errors.bio}</div>
        )}

        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>
    </div>
    )
}