import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  const currentPath = window.location.pathname;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user is accessing the correct route for their role
  if (!currentPath.includes(userRole)) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
};

export default PrivateRoute;
