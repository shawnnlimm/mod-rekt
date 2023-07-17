import React, { useRef } from "react";
import { useAuth } from "../../context/Authentication/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const emailRef = useRef();
  const { forgetPassword } = useAuth();

  async function handleForgotPassword(e) {
    e.preventDefault();

    try {
      const email = emailRef.current.value;
      if (email) {
        forgetPassword(email).then(() => {
          emailRef.current.value = "";
        });
      }
      toast.success("Password reset link has been sent to your email", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-white rounded-md drop-shadow-xl p-8 max-w-md w-full">
        <h2 className="text-center mb-4 text-2xl">Forget Password</h2>
        <form onSubmit={handleForgotPassword}>
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
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
            type="submit"
          >
            Send Password Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
