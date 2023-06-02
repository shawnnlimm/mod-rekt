import React, { useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { fireStoreDB, realTimeDB } from "../config/firebase";
import { set, ref, update } from "firebase/database";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  async function signup(username, email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    set(ref(realTimeDB, "users/" + user.uid), {
      email: email,
      password: password,
      timtable: { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
    })
      .then(() => {
        const userDocRef = doc(collection(fireStoreDB, "users"), user.uid);
        const userData = { username: username, friends: {}, timtable: { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} };
        setDoc(userDocRef, userData);
      })
      .then(() => {
        alert("user created succcessfully");
      });
  }

  async function login(email, password) {
    var lgDate = new Date();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    update(ref(realTimeDB, "users/" + user.uid), {
      last_login: lgDate,
    });
  }

  function logout() {
    setCurrentUser("");
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        const userDoc = doc(fireStoreDB, "users", user.uid);
        const docSnapshot = await getDoc(userDoc);
        const userData = docSnapshot.data();
        setCurrentUser(userData.username);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
