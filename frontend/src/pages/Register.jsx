import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validateEmail, validatePassword } from '../utils';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';
    if (!validateEmail(form.email)) errs.email = 'Please enter a valid email';
    if (!validatePassword(form.password)) errs.password = 'Password must be at least 8 characters with uppercase, number, and special character (!@#$%^&*)';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (result.success) {
      addToast('Account created! Please check your email to verify.', 'success');
      setRegisteredEmail(form.email.trim());
    } else {
      addToast(result.error || 'Registration failed', 'error');
    }
  };

  if (registeredEmail) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <i className="fas fa-envelope" style={{ fontSize: 64, color: 'var(--primary-yellow)', marginBottom: 20 }}></i>
          <h1>Check Your Email</h1>
          <p style={{ margin: '20px 0' }}>We've sent a verification link to:</p>
          <p style={{ fontWeight: 600, color: 'var(--primary-yellow-dark)', marginBottom: 20 }}>{registeredEmail}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Click the link in the email to verify your account and start using EduLab ExamPrep.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {loading && <LoadingOverlay message="Creating account..." />}
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo mb-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/images/edulab-icon.png" alt="EduLab ExamPrep logo" className="brand-logo" /><span>EduLab ExamPrep</span>
          </div>
          <h1>Create Account</h1>
          <p>Start your journey to JAMB success</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="John Doe" />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input type="email" id="reg-email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="password-input-wrapper">
              <input type={showPw ? 'text' : 'password'} id="reg-password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 8 characters" />
              <button type="button" className="password-toggle" onClick={() => setShowPw(v => !v)}>
                <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
            <small style={{ display: 'block', marginTop: 4, color: 'var(--text-secondary)' }}>Must include uppercase, number, and special character</small>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-input-wrapper">
              <input type={showConfirm ? 'text' : 'password'} id="confirm-password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required placeholder="Re-enter password" />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm(v => !v)}>
                <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirm && <span className="error-message">{errors.confirm}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg mt-2">
            <i className="fas fa-user-plus"></i> Create Account
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
