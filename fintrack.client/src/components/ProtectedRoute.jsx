import { useEffect } from 'react';
import authService from '../services/auth.service';

const ProtectedRoute = ({ children }) => {
  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
  }, []);

  // If authenticated, render the children
  if (authService.isAuthenticated()) {
    return children;
  }

  // Show loading or nothing while redirecting
  return null;
};

export default ProtectedRoute; 