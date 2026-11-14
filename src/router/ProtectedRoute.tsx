import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, checkSession } = useAuthStore();

  if (!isAuthenticated || !checkSession()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

