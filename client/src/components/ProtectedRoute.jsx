import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from './Feedback.jsx';

/** Пропускає лише авторизованих користувачів (і, за потреби, з певною роллю) */
export default function ProtectedRoute({ role }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <div className="page"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
