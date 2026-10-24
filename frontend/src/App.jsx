import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import LoadingOverlay from './components/LoadingOverlay';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import RequestReset from './pages/RequestReset';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import GuidedLearn from './pages/GuidedLearn';
import YearPractice from './pages/YearPractice';
import CBT from './pages/CBT';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';

function AppRoutes() {
  const { user, loading } = useAuth();
  const { addToast } = useToast();

  if (loading) return <LoadingOverlay message="Restoring session..." />;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      {/* Email / password token routes — accessible even when logged in */}
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/request-reset" element={<RequestReset />} />

      {/* Protected routes */}
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/guided-learn" element={<ProtectedRoute><GuidedLearn /></ProtectedRoute>} />
      <Route path="/year-practice" element={<ProtectedRoute><YearPractice /></ProtectedRoute>} />
      <Route path="/cbt" element={<ProtectedRoute><CBT /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
