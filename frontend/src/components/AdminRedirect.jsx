import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AdminRedirect = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    // If admin is logged in and tries to access user/provider routes, redirect to admin dashboard
    if (user.isLoggedIn && user.userType === 'admin') {
      const currentPath = location.pathname;
      // Only redirect if not already on admin routes, login, signup, or landing page
      const allowedPaths = ['/admin', '/login', '/signup', '/'];
      const shouldRedirect = !allowedPaths.some(path => currentPath.startsWith(path));
      
      if (shouldRedirect) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, location, navigate]);

  return children;
};

export default AdminRedirect;
