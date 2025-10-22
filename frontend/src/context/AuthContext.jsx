// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
// REMOVE useNavigate import - it's no longer needed here
// import { useNavigate } from "react-router-dom";

// Create the context
export const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

// API URL base path
const API_URL = "/api/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading true
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initialize as false until checked

  // Effect to check token on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
        // Optional: You could add an API call here to verify the token
        // and fetch user data if the token is valid.
        // For now, we assume the token's presence means authenticated.
      } else {
        setIsAuthenticated(false);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
      }
      setLoading(false); // Finished initial check
    };
    checkAuthStatus();
  }, []); // Empty dependency array means run only once on mount

  // Effect to update isAuthenticated whenever the token state changes
  useEffect(() => {
    setIsAuthenticated(!!token);
    // Also update Axios header whenever token changes
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Login Function - NO NAVIGATION
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const { token: authToken, user: userData } = response.data;
      localStorage.setItem("token", authToken);
      setToken(authToken); // Update state, which triggers useEffects
      setUser(userData);
      // Let components handle navigation based on isAuthenticated change
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

  // Register Function - NO NAVIGATION
  const register = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
      });
      const { token: authToken, user: userData } = response.data;
      localStorage.setItem("token", authToken);
      setToken(authToken); // Update state
      setUser(userData);
      // Let components handle navigation
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

  // Logout Function - NO NAVIGATION
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null); // Update state
    setUser(null);
    // Let components handle navigation
  };

  // Value provided to consuming components
  const contextValue = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Only render children after initial loading/token check is complete */}
      {
        !loading ? (
          children
        ) : (
          <div>Loading Application...</div>
        ) /* Basic loading indicator */
      }
    </AuthContext.Provider>
  );
};
