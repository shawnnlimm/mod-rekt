import React from "react";
import { useAuth } from "../../context/Authentication/AuthContext";

const WelcomeMessage = () => {
  const { currentUsername } = useAuth();

  return (
    <div className="text-center mt-20 text-4xl font-bold mb-4 font-mono">
      Welcome back, {currentUsername}!
    </div>
  );
};

export default WelcomeMessage;
