// frontend/src/App.jsx (Layout Wrapper)

import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx"; // IMPORT useAuth

function App() {
  // 💡 CORRECT: Get state and functions directly from the AuthContext
  const { isAuthenticated, logout, loading } = useAuth();

  // NOTE: The old local state (isAuthenticated, handleLogout) has been removed.

  return (
    <>
      {/* 1. NAVIGATION BAR */}
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
              {/* Show Loading state for a better UX */}
              {loading && <div className="text-accent">Loading...</div>}

              {/* Conditional rendering for Auth status */}
              {!loading &&
                (isAuthenticated ? (
                  // Links for LOGGED IN users
                  <button
                    onClick={logout} // Calls the global logout function
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
                ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="pt-16">
        {/* Outlet renders the current page: Dashboard, Login, or Register */}
        <Outlet />
      </main>
    </>
  );
}

export default App;
