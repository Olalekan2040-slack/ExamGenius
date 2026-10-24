import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from './LoadingOverlay';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingOverlay message="Restoring session..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
