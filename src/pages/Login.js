import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history("/");
    } catch {
      setError("Failed to sign in");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-white rounded-md drop-shadow-xl p-8 max-w-md w-full">
        <h2 className="text-center mb-4 text-2xl">Log In</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
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
              id="password"
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              ref={passwordRef}
              required
            />
          </div>
          <button
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
            type="submit"
          >
            Log In
          </button>
        </form>
      </div>
      <div className="text-center mt-2">
        Need an account?{" "}
        <Link to="/signup" className="text-blue-500">
          Signup
        </Link>
      </div>
    </div>
  );
}
