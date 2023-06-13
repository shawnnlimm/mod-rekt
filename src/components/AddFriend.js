import React from "react";
import { useState } from "react";
import { fireStoreDB } from "../config/firebase";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

const AddFriend = () => {
  const [friendUsername, setFriendUsername] = useState("");
  const [searchError, setSearchError] = useState("");
  const { currentUsername } = useAuth();

  const handleInputChange = async (event) => {
    setFriendUsername(event.target.value);
    setSearchError("");
  };

  const handleAddFriend = async () => {
    const querySnapshot = await getDocs(
      query(
        collection(fireStoreDB, "users"),
        where("username", "==", friendUsername)
      )
    );

    if (querySnapshot.empty) {
      setSearchError("User not found. Please enter a valid username.");
    } else {
      if (friendUsername === currentUsername) {
        setSearchError("User cannot be yourself. Please enter another username.");
      } else {
        const userDocRef = doc(fireStoreDB, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userFriends = userDocSnapshot.data().friends;
        userFriends[friendUsername] = true;
        await setDoc(userDocRef, { friends : userFriends}, { merge: true });
        setFriendUsername("");
        setSearchError("");
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        value={friendUsername}
        onChange={handleInputChange}
        placeholder="Enter friend's username..."
        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
      />
      <button
        onClick={handleAddFriend}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
      >
        Add Friend
      </button>
      {searchError && <p className="text-red-500">{searchError}</p>}
    </div>
  );
};

export default AddFriend;