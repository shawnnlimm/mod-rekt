import React from "react";
import { useAuth } from "../context/Authentication/AuthContext";
import { Navigate } from "react-router-dom";

const Default = () => {
  const { isLoggedIn, currentUserId } = useAuth();

  return isLoggedIn ? (
    <Navigate to={`/profile/${currentUserId}`} />
  ) : (
    <Navigate to="/home" />
  );
};

export default Default;
