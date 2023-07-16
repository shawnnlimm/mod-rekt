import React, { useRef, useState } from "react";
import { useAuth } from "../../context/Authentication/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const result = await signup(
        usernameRef.current.value,
        emailRef.current.value,
        passwordRef.current.value
      );

      if (result) {
        navigate("/login");
      }
    } catch (err) {
      toast.error("Error: " + err.code, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setError("Failed to create an account");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-white rounded-md drop-shadow-xl p-4 max-w-md w-full">
        <h2 className="text-center mb-4 text-2xl">Sign Up</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Username
            </label>
            <input
              data-testid="username-input"
              id="username"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              ref={usernameRef}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              data-testid="email-input"
              id="email"
              type="email"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              ref={emailRef}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              data-testid="password-input"
              id="password"
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              ref={passwordRef}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password-confirm" className="block mb-2">
              Confirm Password
            </label>
            <input
              data-testid="password-confirm-input"
              id="password-confirm"
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              ref={passwordConfirmRef}
              required
            />
          </div>
          <button
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
      <div className="text-center mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
