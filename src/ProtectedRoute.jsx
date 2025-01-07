import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './services/AuthService';


const ProtectedRoute = ({ children, condition }) => {
  const { isAuthenticated } = useAuth();
  // console.log(isAuthenticated);
  if (condition) return isAuthenticated ? children : <Navigate to="/login" />;
  else return isAuthenticated ? <Navigate to="/" /> : children;
};

export default ProtectedRoute;
