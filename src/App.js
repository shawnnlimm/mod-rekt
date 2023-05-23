import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import { AuthProvider } from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import About from "./pages/About";
import Home from "./pages/Home";
import Dropdown from "./components/Dropdown";

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
      <Navbar toggle={toggle} />
      <Dropdown isOpen={isOpen} toggle={toggle} />
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
