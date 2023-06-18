import React from "react";
import { useState } from "react";
import { fireStoreDB } from "../config/firebase";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  updateDoc,
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
        setSearchError(
          "User cannot be yourself. Please enter another username."
        );
      } else {
        const friendId = querySnapshot.docs[0].id;
        const userDocRef = doc(fireStoreDB, "users", friendId);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        const friendRequests = Object.keys(userData.friendRequests || {});
        const friendsList = Object.keys(userData.friends || {});
        const currentuserDocRef = doc(fireStoreDB, "users", auth.currentUser.uid);
        const currentuserDocSnapshot = await getDoc(currentuserDocRef);
        const currentuserData = currentuserDocSnapshot.data();
        const currentfriendRequests = Object.keys(currentuserData.friendRequests || {});
        const currentfriendsList = Object.keys(currentuserData.friends || {});
        if (friendRequests.includes(auth.currentUser.uid)) {
          setSearchError("Friend request has already been sent. Please wait for request to be accepted.");
        } else if (friendsList.includes(auth.currentUser.uid) || currentfriendsList.includes(friendId)) {
          setSearchError("User is already your friend!");
        } else if (currentfriendRequests.includes(friendId)) {
          setSearchError("User is already in your requests!");
        } else {
          await updateDoc(userDocRef, {
            [`friendRequests.${auth.currentUser.uid}`]: currentUsername,
          });
          alert("Friend request sent.");
          setFriendUsername("");
          setSearchError("");
        }
      }
    }
  };

  return (
    <div className="flex justify-center space-x-4 my-10">
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
