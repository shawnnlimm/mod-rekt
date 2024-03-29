import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authentication/AuthContext";

const Navbar = ({ toggle }) => {
  const { logout, isLoggedIn, currentUserId } = useAuth();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isLoggedIn);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isFirstRender) {
      setIsUserLoggedIn(isLoggedIn);
    } else {
      setIsFirstRender(false);
      setIsUserLoggedIn(isLoggedIn);
    }
  }, [isLoggedIn]);

  if (isUserLoggedIn) {
    return (
      <nav
        className="flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-mono"
        role="navigation"
      >
        <Link to="/" className="pl-8">
          ModRekt
        </Link>
        <div className="px-4 cursor-pointer md:hidden" onClick={toggle}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
        </div>
        <div className="pr-8 md:block hidden">
          <Link className="p-4" to={`/profile/${currentUserId}`}>
            Timetable
          </Link>
          <Link className="p-4" to="/about">
            About
          </Link>
          <Link className="p-4" to={`/profile/${currentUserId}/friends`}>
            Friends
          </Link>
          <Link className="p-4" to={`/profile/${currentUserId}/courses`}>
            Courses
          </Link>
          <Link className="p-4" to="/">
            <button onClick={handleLogout}>Logout</button>
          </Link>
        </div>
      </nav>
    );
  } else {
    return (
      <nav
        className="flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-mono"
        role="navigation"
      >
        <Link to="/" className="pl-8">
          ModRekt
        </Link>
        <div className="px-4 cursor-pointer md:hidden" onClick={toggle}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
        </div>
        <div className="pr-8 md:block hidden">
          <Link className="p-4" to="/">
            Home
          </Link>
          <Link className="p-4" to="/about">
            About
          </Link>
          <Link className="p-4" to="/login">
            Login
          </Link>
        </div>
      </nav>
    );
  }
};

export default Navbar;
