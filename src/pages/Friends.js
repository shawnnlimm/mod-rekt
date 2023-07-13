import React, { useState, useEffect } from "react";
import { fireStoreDB, auth } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import FriendRequests from "../components/Friends/FriendRequests";
import FriendList from "../components/Friends/FriendList";
import AddFriend from "../components/Friends/AddFriend";
import "react-toastify/dist/ReactToastify.css";

const Friends = () => {
  const [friendsList, setFriendsList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

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
      <AddFriend />
      <FriendRequests
        friendRequests={friendRequests}
        setFriendRequests={setFriendRequests}
        setRefresh={setRefresh}
      />
      <FriendList setRefresh={setRefresh} friendsList={friendsList} />
    </div>
  );
};

export default Friends;
