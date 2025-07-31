import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            🩺 SmartMed
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600">Home</Link>
            <Link to="/consultation" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600">Consultation</Link>
            <Link to="/history" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600">History</Link>
            <Link to="/nearby" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600">Nearby</Link>
            <Link to="/profile" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600">Profile</Link>

            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="ml-2 text-gray-600 dark:text-gray-300 transition">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleDarkMode} className="mr-4 text-gray-600 dark:text-gray-300">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleMenu} className="text-gray-600 dark:text-gray-300">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-6 py-4 space-y-3">
          <Link to="/" onClick={toggleMenu} className="block text-gray-800 dark:text-gray-200">Home</Link>
          <Link to="/consultation" onClick={toggleMenu} className="block text-gray-800 dark:text-gray-200">Consultation</Link>
          <Link to="/history" onClick={toggleMenu} className="block text-gray-800 dark:text-gray-200">History</Link>
          <Link to="/nearby" onClick={toggleMenu} className="block text-gray-800 dark:text-gray-200">Nearby</Link>
          <Link to="/profile" onClick={toggleMenu} className="block text-gray-800 dark:text-gray-200">Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
