import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
