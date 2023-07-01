import React from "react";
import { fireStoreDB, auth } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useModuleContext } from "../../context/UserModuleContext";
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

const FriendList = ({ setRefresh, friendsList }) => {
  const { fetchFriendModules } = useModuleContext();
  const { currentUserId } = useAuth();
  const navigate = useNavigate();

  const handleDeleteFriend = async (friendUsername) => {
    const querySnapshot = await getDocs(
      query(
        collection(fireStoreDB, "users"),
        where("username", "==", friendUsername)
      )
    );
    const friendID = querySnapshot.docs[0].id;
    const userDocRef = doc(fireStoreDB, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const friendDocRef = doc(fireStoreDB, "users", friendID);

    if (userDocSnapshot.exists()) {
      // Remove friend frok friends list
      await updateDoc(userDocRef, {
        [`friends.${friendID}`]: deleteField(),
      });
      await updateDoc(friendDocRef, {
        [`friends.${auth.currentUser.uid}`]: deleteField(),
      });

      toast.error("Friend removed.", {
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
    await fetchFriendModules(friendUsername);
    navigate(`/profile/${currentUserId}/friends/${friendID}`);
  };
  return (
    <div>
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
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={() => handleDeleteFriend(friendUsername)}
            >
              Remove Friend
            </button>
          </div>
        ))
      ) : (
        <p>No friends added.</p>
      )}
    </div>
  );
};

export default FriendList;
