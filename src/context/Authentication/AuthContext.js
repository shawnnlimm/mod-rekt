import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { fireStoreDB } from "../../config/firebase";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
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
      toast.error(
        "Username is already taken. Please choose a different username.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      return false;
    }

    setIsNewUser(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDocRef = doc(collection(fireStoreDB, "users"), user.uid);
    const userData = {
      friendRequests: {},
      username: username,
      friends: {},
      timetable: {
        Monday: {},
        Tuesday: {},
        Wednesday: {},
        Thursday: {},
        Friday: {},
        Saturday: {},
      },
    };
    setDoc(userDocRef, userData);
    toast.success("User created successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return true;
  }

  async function login(email, password) {
    setIsNewUser(false);
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

  async function forgetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = doc(fireStoreDB, "users", user.uid);
        const docSnapshot = await getDoc(userDoc);
        const userData = docSnapshot.data();

        if (!isNewUser) {
          setCurrentUsername(userData.username);
          setCurrentUserId(user.uid);
          setIsLoggedIn(true);
        }
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
    forgetPassword,
  };

  return (
    <div>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </div>
  );
}
