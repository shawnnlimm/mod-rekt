import React from "react";
import { useState, useEffect } from "react";
import AddFriend from "../components/AddFriend";
import { fireStoreDB } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  collection,
  where,
  deleteField,
} from "firebase/firestore";
import { useModuleContext } from "../context/UserModuleContext";

const Friends = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { currentUsername, currentUserId } = useAuth();
  const { fetchFriendModules } = useModuleContext();
  const navigate = useNavigate();

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

      toast.success("Friend request accepted!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setRefresh((prevRefresh) => !prevRefresh);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request !== friendID)
      );
    }
  };

  const handleDeclineFriendRequest = async (friendUsername) => {
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
      });

      toast.error("Friend request declined.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setRefresh((prevRefresh) => !prevRefresh);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request !== friendID)
      );
    }
  };

  const handleViewTimetable = async (friendUsername) => {
    const querySnapshot = await getDocs(
      query(
        collection(fireStoreDB, "users"),
        where("username", "==", friendUsername)
      )
    );
    const friendID = querySnapshot.docs[0].id;
    fetchFriendModules(friendUsername);
    navigate(`/profile/${currentUserId}/friends/${friendID}`);
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
  }, [refresh]);

  return (
    <div className="container mx-auto p-8 font-mono">
      <ToastContainer />
      <h1>
        <AddFriend />
      </h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
        {friendRequests.length > 0 ? (
          friendRequests.map((requestId) => (
            <div
              key={requestId}
              className="flex items-center justify-between bg-gray-200 rounded-md p-4 mb-4"
            >
              <span className="text-lg">{requestId}</span>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                onClick={() => handleAcceptFriendRequest(requestId)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={() => handleDeclineFriendRequest(requestId)}
              >
                Decline
              </button>
            </div>
          ))
        ) : (
          <p>No friend requests.</p>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4">Friends List</h2>
      {friendsList.length > 0 ? (
        friendsList.map((friendUsername) => (
          <div
            key={friendUsername}
            className="flex items-center justify-between bg-gray-200 rounded-md p-4 mb-4"
          >
            <span className="text-lg">{friendUsername}</span>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => handleViewTimetable(friendUsername)}
            >
              View Timetable
            </button>
          </div>
        ))
      ) : (
        <p>No friends added.</p>
      )}
    </div>
  );
};

export default Friends;
