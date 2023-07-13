import React from "react";
import FriendTimetable from "../components/Friends/FriendTimetable";

const FriendProfile = () => {
  const friendDisplayName = localStorage.getItem("currentFriend");

  return (
    <div>
      <div className="text-center mt-20 text-4xl font-bold mb-4 font-mono">
        Viewing {friendDisplayName}'s Timetable
      </div>
      <FriendTimetable />
    </div>
  );
};

export default FriendProfile;
