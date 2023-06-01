import React, { useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { fireStoreDB, realTimeDB } from "../config/firebase";
import { set, ref, update } from "firebase/database";
import { collection, getDoc, addDoc, doc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const usersCollectionRef = collection(fireStoreDB, "users");

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
    })
      .then(() => {
        addDoc(usersCollectionRef, { username: username, friends: {} });
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        const userDoc = doc(fireStoreDB, "users", user.uid);
        const docSnapshot = getDoc(userDoc);
        setCurrentUser(docSnapshot.username);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe();
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
