import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Outlet } from 'react-router-dom';

const AuthGuard: React.FC = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>; 
  }

  if (!auth.isAuthenticated) {
    auth.signinRedirect(); 
    return null;
  }

  return <Outlet />;
};

export default AuthGuard;
