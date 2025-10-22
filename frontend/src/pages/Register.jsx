// frontend/src/pages/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register, loading } = useAuth(); // Get register function from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic password validation (example: minimum length)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await register(email, password);
      // navigate('/'); // AuthContext handles navigation on success
    } catch (err) {
      setError(
        typeof err === "string" ? err : "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-wide">
          Create Account
        </h2>

        {error && (
          <p className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent transition duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (min. 6 characters)"
              className="w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent transition duration-200"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent transition duration-200"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 bg-accent text-gray-900 font-bold rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg shadow-accent/40 hover:shadow-accent/60 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}

// 💡 ENSURE THIS LINE IS AT THE VERY END 💡
export default Register;
