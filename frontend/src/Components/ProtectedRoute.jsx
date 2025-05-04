import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../utils/api';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuth = auth.isAuthenticated();
  const userInfo = auth.getUserInfo();

  if (!isAuth) {
    return <Navigate to="/signin" />;
  }

  if (requiredRole && userInfo.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 