import React from "react";
import { fireStoreDB, auth } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
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

const FriendRequests = ({ friendRequests, setFriendRequests, setRefresh }) => {
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

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
      {friendRequests.length > 0 ? (
        friendRequests.map((requestId) => (
          <div
            key={requestId}
            className="flex items-center justfy-between bg-gray-200 rounded-md p-4 mb-4"
          >
            <span className="text-lg flex-grow">{requestId}</span>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
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
  );
};

export default FriendRequests;
