// frontend/src/App.jsx (Layout Wrapper)

import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom"; // Import Link and Outlet
import "./App.css"; // Assuming this is still used for general utility/Tailwind imports

function App() {
  // We'll manage auth state here later
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle logout (Placeholder for now)
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // Note: React Router will handle the navigation automatically on state change
  };

  return (
    <>
      {/* 1. NAVIGATION BAR (Updated for Authentication links) */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-xl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-white tracking-widest">
                <span className="text-accent">T</span>ODO
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {/* Conditional rendering for Auth status */}
              {isAuthenticated ? (
                // Links for LOGGED IN users
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Logout
                </button>
              ) : (
                // Links for GUEST users
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-accent transition duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 bg-accent text-gray-900 font-bold rounded-lg hover:bg-opacity-90 transition duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      {/* The Outlet renders the component matched by the current route (Dashboard, Login, or Register) */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
}

export default App;
