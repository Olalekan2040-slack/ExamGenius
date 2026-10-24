import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getUserInitials } from '../utils';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname;

  const navItem = (path, icon, label) => (
    <div
      className={`nav-item${current === path ? ' active' : ''}`}
      onClick={() => navigate(path)}
    >
      <i className={`fas ${icon}`}></i>
      <span>{label}</span>
    </div>
  );

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    await logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <img src="/images/edulab-icon.png" alt="EduLab ExamPrep logo" className="brand-logo" />
            <span>EduLab ExamPrep</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {navItem('/dashboard', 'fa-home', 'Dashboard')}
          {navItem('/guided-learn', 'fa-road', 'Learn Topics')}
          {navItem('/year-practice', 'fa-calendar-alt', 'Year Practice')}
          {navItem('/cbt', 'fa-laptop', 'Full CBT')}
          {navItem('/profile', 'fa-user', 'Profile')}
        </div>

        {user?.role === 'admin' && (
          <div
            className={`nav-item${current === '/admin' ? ' active' : ''}`}
            onClick={() => navigate('/admin')}
          >
            <i className="fas fa-shield-alt"></i>
            <span>Admin Panel</span>
          </div>
        )}

        <div className="sidebar-footer">
          <div className="nav-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="top-bar">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="user-menu">
            <div className="user-avatar">{getUserInitials(user?.name)}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user?.email}</div>
            </div>
          </div>
        </div>
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}
