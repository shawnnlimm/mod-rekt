import React from "react";
import { useAuth } from "../context/AuthContext";

const WelcomeMessage = () => {
  const { currentUsername } = useAuth();

  return (
    <div className="text-center mt-8">
      <div className="text-4xl font-bold mb-4">
        Welcome back, {currentUsername}!
      </div>
    </div>
  );
};

export default WelcomeMessage;
