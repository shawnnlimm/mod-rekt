import React from "react";
import { useState, useEffect } from "react";
import { fireStoreDB } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Timetable = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const getUsers = async () => {
      const usersCollectionRef = collection(fireStoreDB, "users");
      const data = await getDocs(usersCollectionRef);
      const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(userData);
    };

    getUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome back, {currentUser?.username}
      </h1>
      <div className="bg-gray-100 p-4 rounded-md">
        {users.map((user) => (
          <div key={user.id} className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Name: {user.username}
            </h2>
            <h3 className="text-md font-semibold mb-1">Friends:</h3>
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
  );
};

export default Timetable;
