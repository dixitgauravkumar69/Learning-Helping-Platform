import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import HR from "../Login/Images/HR.svg"; // Replace with an optimized login image
import Header from "../Home/Header/Header";

export default function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // Teacher or Student
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const loginEndpoint = userType === "teacher" ? "/api/teacher/login" : "/api/student/login";

    try {
      const response = await fetch(loginEndpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: Email, password: Password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("token", responseData.token);
        navigate(userType === "teacher" ? "/Teacher/Dashboard/:ID" : "/Student/Dashboard/:ID");
      } else {
        const responseData = await response.json();
        setErr(responseData.message || "Login failed");
      }
    } catch (error) {
      setErr("Something went wrong. Please check your network.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back!</h2>
          <p className="text-center text-gray-600">Please log in to your account.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Email Address"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* User Type Selection (Always Visible) */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-semibold">User Type:</label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="radio"
                    value="teacher"
                    checked={userType === "teacher"}
                    onChange={() => setUserType("teacher")}
                    className="w-4 h-4"
                  />
                  <span className="text-lg">Teacher</span>
                </label>

                <label className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="radio"
                    value="student"
                    checked={userType === "student"}
                    onChange={() => setUserType("student")}
                    className="w-4 h-4"
                  />
                  <span className="text-lg">Student</span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {err && <p className="text-red-500 text-center">{err}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </button>

            {/* Other Links */}
            <div className="flex justify-between text-sm text-gray-500 mt-4">
              <NavLink to="/signup" className="hover:text-blue-600">Sign up</NavLink>
              <button onClick={() => navigate("/forgetpassword")} className="hover:text-blue-600">
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block">
          <img src={HR} width={500} alt="Login Illustration" className="ml-10" />
        </div>
      </div>
    </>
  );
}
