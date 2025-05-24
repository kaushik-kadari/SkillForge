import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './services/AuthService';
import { FallingLines } from 'react-loader-spinner';


const ProtectedRoute = ({ children, condition }) => {
  const { isAuthenticated, loading } = useAuth();

  if(loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
      <FallingLines
        color="black"
        width="150"
        visible={true}
        ariaLabel="falling-circles-loading"
      />
    </div>
  );

  if (condition) return isAuthenticated ? children : <Navigate to="/login" />;
  else return isAuthenticated ? <Navigate to="/" /> : children;
};

export default ProtectedRoute;
