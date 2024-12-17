import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken'); // Check if the admin token exists

  if (!token) {
    return <Navigate to="/admin-login" />; // Redirect to login if not authenticated
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
