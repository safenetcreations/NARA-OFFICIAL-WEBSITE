import React from 'react';
import { Navigate } from 'react-router-dom';

const LibraryRegister = () => {
  // Redirect to unified registration page
  return <Navigate to="/register" replace />;
};

export default LibraryRegister;
