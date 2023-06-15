import React from "react";
import { useState, useEffect } from "react";
import { fireStoreDB } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../config/firebase";
import WelcomeMessage from "../components/WelcomeMessage";
import Timetable from "../components/Timetable";
import CourseSearch from "../components/CourseSearch";
import AddFriend from "../components/AddFriend";

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [userModules, setUserModules] = useState([]);

  /* 
    userModules contains an array of array, where the array at 
    each index consist of [day, moduleCode, timeslot]
  */

  useEffect(() => {
    const getUsers = async () => {
      const usersCollectionRef = collection(fireStoreDB, "users");
      const data = await getDocs(usersCollectionRef);
      const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(userData);
    };

    getUsers();
  }, [userModules]);

  const currentUser = users.filter((user) => user.id === auth.currentUser.uid);

  return (
    <div>
      <div>
        <WelcomeMessage />
        <AddFriend />
        <div className="bg-gray-100 p-4 rounded-md">
          {currentUser.map((user) => (
            <div key={user.id} className="mb-4">
              <h2 className="text-md font-semibold mb-1">Friends:</h2>
              <ul>
                {user.friends &&
                  Object.entries(user.friends).map((friendKey) => (
                    <li key={friendKey} className="ml-4">
                      {friendKey}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <CourseSearch userModules={userModules} setUserModules={setUserModules} />
      <Timetable userModules={userModules} />
    </div>
  );
};

export default Profile;
