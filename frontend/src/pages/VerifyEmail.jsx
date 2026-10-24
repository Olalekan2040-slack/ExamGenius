import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const { addToast } = useToast();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Invalid verification link');
      return;
    }
    verifyEmail(token).then((result) => {
      if (result.success) {
        setStatus('success');
        addToast('Email verified successfully!', 'success');
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Verification failed');
        addToast(result.error || 'Verification failed', 'error');
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        {status === 'verifying' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <h1>Verifying Email...</h1>
            <p>Please wait while we verify your email address.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <i className="fas fa-check-circle" style={{ fontSize: 64, color: 'var(--success)', marginBottom: 20 }}></i>
            <h1>Email Verified!</h1>
            <p style={{ margin: '20px 0' }}>Your email has been successfully verified.</p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>You can now login and start preparing for your JAMB exam.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              <i className="fas fa-sign-in-alt"></i> Continue to Login
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <i className="fas fa-times-circle" style={{ fontSize: 64, color: 'var(--error)', marginBottom: 20 }}></i>
            <h1>Verification Failed</h1>
            <p style={{ margin: '20px 0', color: 'var(--error)' }}>{errorMsg}</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
          </>
        )}
      </div>
    </div>
  );
}
