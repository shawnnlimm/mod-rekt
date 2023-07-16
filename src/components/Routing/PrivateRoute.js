import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/Authentication/AuthContext";

const PrivateRoute = () => {
  const auth = useAuth();
  return auth.isLoggedIn ? <Outlet /> : <Navigate to="/login"></Navigate>;
};

export default PrivateRoute;
