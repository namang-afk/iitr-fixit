import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { UnauthorizedPage } from '../../pages/UnauthorizedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentRole } = useAuth();
  const location = useLocation();

  // If user is not authenticated at all, redirect to /login
  if (!isAuthenticated || !currentRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is restricted and current user role is not permitted
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <UnauthorizedPage allowedRoles={allowedRoles} currentRole={currentRole} />;
  }

  return <>{children}</>;
};
