// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
// REMOVE useNavigate from the main import here
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
  // REMOVE useNavigate call from here
  // const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  const setAuthHeader = (authToken) => {
    if (authToken) {
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
    // GET useNavigate hook INSIDE the function
    const navigate = useNavigate();
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
      navigate("/"); // Navigate after successful login
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  // Register Function
  const register = async (email, password) => {
    // GET useNavigate hook INSIDE the function
    const navigate = useNavigate();
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
      navigate("/"); // Navigate after successful registration
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
    // GET useNavigate hook INSIDE the function
    const navigate = useNavigate();
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthHeader(null); // Clear auth header on logout
    navigate("/login"); // Navigate after logout
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
