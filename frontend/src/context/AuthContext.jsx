// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create the context
export const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

// API URL base path
const API_URL = "/api/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for token on mount
    if (token) {
      setIsAuthenticated(true);
      // Optional: Decode token to get user info, but for now, rely on its presence
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  // Set the default authorization header for all subsequent requests
  const setAuthHeader = (authToken) => {
    if (authToken) {
      // Sends the JWT token with every request in the Authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  // Login Function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token: authToken, user: userData } = response.data;

      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/"); // Navigate to the dashboard
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      // Throw simplified error message for the component to display
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  // Register Function
  const register = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
      });

      const { token: authToken, user: userData } = response.data;

      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/"); // Navigate to the dashboard
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      throw error.response?.data?.message || "Registration failed";
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
