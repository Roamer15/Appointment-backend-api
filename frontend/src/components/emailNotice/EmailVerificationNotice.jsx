import styles from './EmailVerificationNotice.module.css';

export default function EmailVerificationNotice({ email, error, resendMessage, handleResend, loading }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Verify Your Email</h2>
        <p className={styles.subtext}>
          A verification link has been sent to <strong>{email}</strong>.
        </p>
        <p className={styles.subtext}>
          Please check your inbox and click the link to activate your account.
        </p>
        <button onClick={handleResend} disabled={loading} className={styles.resendButton}>
          {loading ? "Resending..." : "Didn’t receive it? Resend Email"}
        </button>

        {resendMessage && <p className={styles.success}>{resendMessage}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <br /><a href="/login">Login</a>
      </div>
    </div>
  );
}
