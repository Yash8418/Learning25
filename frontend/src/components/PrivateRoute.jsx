import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem("role")?.toLowerCase();

  // Check if the user's role is in the allowed roles
  if (!allowedRoles.map(role => role.toLowerCase()).includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
