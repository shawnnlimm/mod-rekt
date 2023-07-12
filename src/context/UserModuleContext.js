import React, { useState, useContext, useEffect } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { fireStoreDB } from "../config/firebase";
import { useAuth } from "./AuthContext";

const UserModulesContext = React.createContext();

export function useModuleContext() {
  return useContext(UserModulesContext);
}

export function UserModulesProvider({ children }) {
  const [userModules, setUserModules] = useState([]);
  const [friendModules, setFriendModules] = useState([]);
  const { currentUsername } = useAuth();
  const [currentFriend, setCurrentFriend] = useState("");

  /* 
    userModules contains an array of array, where the array at 
    each index consist of [day, moduleCode, timeslot]. eg. [Monday, GEA1000 Lecture, 1200 - 1500]
  */

  async function fetchUserModules() {
    const modulesQuery = query(
      collection(fireStoreDB, "users"),
      where("username", "==", currentUsername)
    );

    try {
      const querySnapshot = await getDocs(modulesQuery);
      const userModulesData = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const dayMap = userData.timetable;
        Object.keys(dayMap).forEach((day) => {
          const moduleCodeMap = dayMap[day];
          Object.entries(moduleCodeMap).forEach(([moduleCode, array]) => {
            userModulesData.push([day, moduleCode, array[0], array[1]]);
          });
        });
      });

      setUserModules(userModulesData);
    } catch (err) {
      console.log("Error fetching user modules", err);
    }
  }

  async function fetchFriendModules(friendUsername) {
    const modulesQuery = query(
      collection(fireStoreDB, "users"),
      where("username", "==", friendUsername)
    );

    try {
      setCurrentFriend(friendUsername);
      const querySnapshot = await getDocs(modulesQuery);
      const userModulesData = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const dayMap = userData.timetable;
        Object.keys(dayMap).forEach((day) => {
          const moduleCodeMap = dayMap[day];
          Object.entries(moduleCodeMap).forEach(([moduleCode, timeslot]) => {
            userModulesData.push([day, moduleCode, timeslot]);
          });
        });
      });

      setCurrentFriend(friendUsername);
      setFriendModules(userModulesData);
    } catch (err) {
      console.log("Error fetching friend modules", err);
    }
  }

  useEffect(() => {
    fetchUserModules();
  }, [currentUsername]);

  return (
    <UserModulesContext.Provider
      value={{
        userModules,
        setUserModules,
        fetchUserModules,
        friendModules,
        setFriendModules,
        fetchFriendModules,
        currentFriend,
      }}
    >
      {children}
    </UserModulesContext.Provider>
  );
}
