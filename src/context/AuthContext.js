import React, { useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    setIsLoggedIn(true);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setCurrentUser("");
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [setCurrentUser]);

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
