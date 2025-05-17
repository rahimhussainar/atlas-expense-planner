
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Only log on initial render
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("ProtectedRoute: loading", loading, "user", user ? "authenticated" : "unauthenticated");
    }
  }, []); // Only run once on mount

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
