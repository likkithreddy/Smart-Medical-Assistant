import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/symptom", label: "Symptom Checker" },
    { path: "/consultation", label: "Consultation" },
    { path: "/history", label: "History" },
    { path: "/nearby", label: "Nearby Hospitals" },
    { path: "/profile", label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-white">
          Smart Medical Assistant
        </Link>

        <div className="space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium ${
                isActive(link.path)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-blue-600`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Logout
            </button>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className={`text-sm font-medium ${
                  isActive("/login")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                } hover:text-blue-600`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-sm font-medium ${
                  isActive("/register")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                } hover:text-blue-600`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
