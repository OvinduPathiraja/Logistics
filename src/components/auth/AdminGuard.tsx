import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate, Outlet } from 'react-router-dom';

const AdminGuard: React.FC = () => {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;

  const isAdmin = (auth.user?.profile?.['cognito:groups'] as string[] | undefined)?.includes('Admins');

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default AdminGuard;
