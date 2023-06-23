import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dropdown = ({ isOpen, toggle }) => {
  const { isLoggedIn, currentUserId, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoggedIn) {
    return (
      <div
        className={
          isOpen
            ? "grid grid-rows-6 text-center items-center bg-yellow-500 font-mono"
            : "hidden"
        }
        onClick={toggle}
      >
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
    );
  } else {
    return (
      <div
        className={
          isOpen
            ? "grid grid-rows-4 text-center items-center bg-yellow-500 font-mono"
            : "hidden"
        }
        onClick={toggle}
      >
        <Link className="p-4" to="/">
          Home
        </Link>
        <Link className="p-4" to="/menu">
          Menu
        </Link>
        <Link className="p-4" to="/about">
          About
        </Link>
        <Link className="p-4" to="/login">
          Login
        </Link>
      </div>
    );
  }
};

export default Dropdown;
