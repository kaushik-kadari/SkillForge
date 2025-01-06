import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, condition }) => {

    // console.log("ProtectedRoute", condition);
  const isAuthenticated = !!localStorage.getItem('login'); // Example check for a token

  if(condition) return isAuthenticated ? children : <Navigate to="/login" />;
  else return isAuthenticated ? <Navigate to="/" /> : children;
};

export default ProtectedRoute;
