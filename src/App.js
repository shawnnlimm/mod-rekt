import "./App.css";
import React, { useState, useEffect } from "react";
import Signup from "./components/Signup";
import { AuthProvider } from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import About from "./pages/About";
import Home from "./pages/Home";
import Dropdown from "./components/Dropdown";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Friends from "./pages/Friends";
import Courses from "./pages/Courses";
import { UserModulesProvider } from "./context/UserModuleContext";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const hideMenu = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", hideMenu);

    return () => {
      window.removeEventListener("resize", hideMenu);
    };
  });

  return (
    <>
      <Dropdown isOpen={isOpen} toggle={toggle} />
      <AuthProvider>
        <UserModulesProvider>
          <Navbar toggle={toggle} />
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route element={<PrivateRoute />}>
              <Route
                path="/profile/:currentUserId"
                element={<Profile />}
              ></Route>
              <Route
                path="/profile/:currentUserId/friends"
                element={<Friends />}
              ></Route>
              <Route
                path="/profile/:currentUserId/courses"
                element={<Courses />}
              ></Route>
            </Route>
          </Routes>
        </UserModulesProvider>
      </AuthProvider>
    </>
  );
}

export default App;
