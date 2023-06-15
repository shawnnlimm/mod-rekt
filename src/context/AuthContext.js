import React, { useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { fireStoreDB } from "../config/firebase";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function checkUsernameExists(username) {
    const querySnapshot = await getDocs(
      query(collection(fireStoreDB, "users"), where("username", "==", username))
    );
    return !querySnapshot.empty;
  }

  async function signup(username, email, password) {
    const usernameExists = await checkUsernameExists(username);

    if (usernameExists) {
      alert("Username is already taken. Please choose a different username.");
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDocRef = doc(collection(fireStoreDB, "users"), user.uid);
    const userData = {
      username: username,
      friends: {},
      timetable: {
        Monday: {},
        Tuesday: {},
        Wednesday: {},
        Thursday: {},
        Friday: {},
      },
    };
    setDoc(userDocRef, userData);
    alert("user created succcessfully");
  }

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    setCurrentUserId(user.uid);
    const userDoc = doc(fireStoreDB, "users", user.uid);
    const docSnapshot = await getDoc(userDoc);
    const userData = docSnapshot.data();
    setCurrentUsername(userData.username);
    setIsLoggedIn(true);
    navigate(`/profile/${user.uid}`);
  }

  function logout() {
    setIsLoggedIn(false);
    setCurrentUsername("");
    setCurrentUserId("");
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = doc(fireStoreDB, "users", user.uid);
        const docSnapshot = await getDoc(userDoc);
        const userData = docSnapshot.data();
        setCurrentUsername(userData.username);
        setCurrentUserId(user.uid);
        console.log(currentUserId);
        setIsLoggedIn(true);
      } else {
        setCurrentUsername("");
        setCurrentUserId("");
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe();
  });

  const value = {
    isLoggedIn,
    currentUsername,
    currentUserId,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
