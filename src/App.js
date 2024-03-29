import "./App.css";
import React, { useState, useEffect } from "react";
import Signup from "./pages/Signup/Signup";
import { AuthProvider } from "./context/Authentication/AuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import About from "./pages/About";
import Home from "./pages/Home";
import Dropdown from "./components/Display/Dropdown";
import PrivateRoute from "./components/Routing/PrivateRoute";
import Profile from "./pages/Profile";
import Navbar from "./components/Display/Navbar";
import Friends from "./pages/Friends";
import Courses from "./pages/Courses";
import FriendProfile from "./pages/FriendProfile";
import Default from "./pages/Default";
import { UserModulesProvider } from "./context/UserModules/UserModuleContext";
import ScrapeModules from "./ScrapeModules";
import { ToastContainer } from "react-toastify";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    console.log("bp");
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
      <ToastContainer />
      <AuthProvider>
        <ScrapeModules />
        <Dropdown isOpen={isOpen} toggle={toggle} />
        <UserModulesProvider>
          <Navbar toggle={toggle} />
          <Routes>
            <Route path="/" element={<Default />} />
            <Route exact path="/home" element={<Home />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/forgetpassword" element={<ForgetPassword />}></Route>
            <Route element={<PrivateRoute />}>
              <Route
                path="/profile/:currentUserId"
                element={<Profile />}
              ></Route>
              <Route
                path="/profile/:currentUserId/friends/:friendUserId"
                element={<FriendProfile />}
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
