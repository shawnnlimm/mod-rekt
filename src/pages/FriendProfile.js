import React from "react";
import FriendTimetable from "../components/FriendTimetable";
import { useModuleContext } from "../context/UserModuleContext";

const FriendProfile = () => {
  const { currentFriend } = useModuleContext();
  return (
    <div>
      <div className="text-center mt-20 text-4xl font-bold mb-4 font-mono">
        Viewing {currentFriend}'s Timetable
      </div>
      <FriendTimetable />
    </div>
  );
};

export default FriendProfile;
