import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <header>
      <h1>Welcome to Mod-Rekt!</h1>
      <p>Start connecting with your friends now! :)</p>
      <button>
        <Link to="/login">Log in</Link>
      </button>
      <button>
        <Link to="/signup">Sign Up</Link>
      </button>
      <button>
        <Link to="/about">About</Link>
      </button>
    </header>
  );
}

