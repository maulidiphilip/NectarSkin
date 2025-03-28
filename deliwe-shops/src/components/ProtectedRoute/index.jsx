import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const { token, role } = useSelector((state) => state.auth);
  // console.log("ProtectedRoute check - token:", token, "role:", role, "allowedRole:", allowedRole);

  if (!token) {
    console.log("No token, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    console.log("Role mismatch, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;