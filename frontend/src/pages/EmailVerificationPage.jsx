import { useState } from "react";
import EmailVerificationNotice from "../components/emailNotice/EmailVerificationNotice";
import api from '../services/api';
import { useLocation } from "react-router";

export default function EmailVerificationPage() {
    const location = useLocation()
      const [resendMessage, setResendMessage] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const email = location.state?.email || "";
    
      const handleResend = async () => {
        setLoading(true);
        setError('');
        setResendMessage('');
        try {
          await api.resendVerificationEmail({ email });
          setResendMessage('Verification email resent successfully.');
        } catch (err) {
          setError(err.message || 'Failed to resend email.');
        } finally {
          setLoading(false);
        }
      };
    return (
        <EmailVerificationNotice resendMessage={resendMessage} loading={loading} error={error} handleResend={handleResend} email={email}/>       
    )
}