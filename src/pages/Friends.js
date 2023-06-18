import React from "react";
import { useState, useEffect } from "react";
import AddFriend from "../components/AddFriend";
import { fireStoreDB } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  collection,
  where,
  deleteField
} from "firebase/firestore";

const Friends = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const { currentUsername } = useAuth();

  const handleAcceptFriendRequest = async (friendUsername) => {
    const querySnapshot = await getDocs(
      query(
        collection(fireStoreDB, "users"),
        where("username", "==", friendUsername)
      )
    );
    const friendID = querySnapshot.docs[0].id;
    const userDocRef = doc(fireStoreDB, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
  
    if (userDocSnapshot.exists()) {
      // Remove friend request and add friend to the friends list
      await updateDoc(userDocRef, {
        [`friendRequests.${friendID}`]: deleteField(),
        [`friends.${friendID}`]: friendUsername,
      });
  
      // Update the friend's friends list
      const friendDocRef = doc(fireStoreDB, "users", friendID);
      await updateDoc(friendDocRef, {
        [`friends.${auth.currentUser.uid}`]: currentUsername,
      });
  
      setFriendRequests((prevRequests) => prevRequests.filter((request) => request !== friendID));
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const userDocRef = doc(fireStoreDB, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const requests = Object.values(userData.friendRequests || {});
        setFriendRequests(requests);
      }
    };

    const fetchFriendsList = async () => {
      const userDocRef = doc(fireStoreDB, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const friends = Object.values(userData.friends || {});
        setFriendsList(friends);
      }
    };

    fetchFriendRequests();
    fetchFriendsList();
  }, [fireStoreDB, auth.currentUser.uid]);

  return (
    <div>
      <h1>
        <AddFriend />
      </h1>
      <h2>Friend Requests</h2>
        {friendRequests.map((requestId) => (
          <div key={requestId}>
            <span>{requestId}</span>
            <button onClick={() => handleAcceptFriendRequest(requestId)}>Accept</button>
          </div>
        ))}
      <h3>Friends List</h3>
        {friendsList.map((friendId) => (
          <div key={friendId}>
            <span>{friendId}</span>
          </div>
        ))}
    </div>
  );
};

export default Friends;
