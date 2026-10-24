import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validatePassword } from '../utils';
import LoadingOverlay from '../components/LoadingOverlay';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <i className="fas fa-times-circle" style={{ fontSize: 64, color: 'var(--error)', marginBottom: 20 }}></i>
          <h1>Invalid Link</h1>
          <p>This password reset link is invalid or has expired.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/request-reset')}>Request New Reset Link</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!validatePassword(form.password)) errs.password = 'Password must be at least 8 characters with uppercase, number, and special character';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const result = await resetPassword(token, form.password);
    setLoading(false);
    if (result.success) {
      addToast('Password reset successful!', 'success');
      navigate('/login');
    } else {
      addToast(result.error || 'Reset failed', 'error');
    }
  };

  return (
    <div className="auth-container">
      {loading && <LoadingOverlay message="Resetting password..." />}
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your new password</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <div className="password-input-wrapper">
              <input type={showPw ? 'text' : 'password'} id="new-password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 8 characters" />
              <button type="button" className="password-toggle" onClick={() => setShowPw(v => !v)}>
                <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirm-new-password">Confirm New Password</label>
            <div className="password-input-wrapper">
              <input type={showConfirm ? 'text' : 'password'} id="confirm-new-password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required placeholder="Re-enter password" />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm(v => !v)}>
                <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirm && <span className="error-message">{errors.confirm}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg mt-2">Reset Password</button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
