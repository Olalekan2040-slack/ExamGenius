import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validateEmail } from '../utils';
import LoadingOverlay from '../components/LoadingOverlay';
import * as api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!validateEmail(form.email)) errs.email = 'Please enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      addToast('Login successful! Welcome back.', 'success');
      try {
        const profileCheck = await api.checkProfileCompletion();
        if (profileCheck.requires_completion) { navigate('/profile-setup'); return; }
      } catch { /* proceed */ }
      navigate('/dashboard');
    } else {
      addToast(result.error || 'Login failed', 'error');
    }
  };


  return (
    <div className="auth-container">
      {loading && <LoadingOverlay message="Signing in..." />}
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo mb-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/images/edulab-icon.png" alt="EduLab ExamPrep logo" className="brand-logo" /><span>EduLab ExamPrep</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your JAMB preparation</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input type={showPw ? 'text' : 'password'} id="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Enter your password" />
              <button type="button" className="password-toggle" onClick={() => setShowPw(v => !v)}>
                <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/request-reset" style={{ color: 'var(--primary-yellow-dark)', fontSize: 14 }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            <i className="fas fa-sign-in-alt"></i> Sign In
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
