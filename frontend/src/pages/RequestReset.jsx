import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validateEmail } from '../utils';
import LoadingOverlay from '../components/LoadingOverlay';

export default function RequestReset() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) { setError('Please enter a valid email'); return; }
    setError('');
    setLoading(true);
    const result = await requestPasswordReset(email.trim());
    setLoading(false);
    if (result.success) {
      addToast('Reset link sent! Check your email.', 'success');
      setSent(true);
    } else {
      addToast(result.error || 'Failed to send reset link', 'error');
    }
  };

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <i className="fas fa-envelope" style={{ fontSize: 64, color: 'var(--primary-yellow)', marginBottom: 20 }}></i>
          <h1>Check Your Email</h1>
          <p style={{ margin: '20px 0' }}>We've sent a password reset link to:</p>
          <p style={{ fontWeight: 600, color: 'var(--primary-yellow-dark)', marginBottom: 20 }}>{email}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Click the link in the email to reset your password.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {loading && <LoadingOverlay message="Sending reset link..." />}
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>
            <input type="email" id="reset-email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            {error && <span className="error-message">{error}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg">Send Reset Link</button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
