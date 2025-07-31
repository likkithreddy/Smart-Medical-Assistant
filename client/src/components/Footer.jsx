import React from "react";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 px-6 py-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600">Smart Health</h2>
          <p className="mt-2 text-sm">Your AI-powered medical assistant for better, smarter healthcare.</p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
            <li><Link to="/consultation" className="hover:text-blue-600 transition">Consultation</Link></li>
            <li><Link to="/history" className="hover:text-blue-600 transition">History</Link></li>
            <li><Link to="/profile" className="hover:text-blue-600 transition">Profile</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-sm">support@smarthealth.com</p>
          <p className="text-sm">+91 98765 43210</p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-600"><Facebook size={20} /></a>
            <a href="#" className="hover:text-blue-600"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-600"><Instagram size={20} /></a>
            <a href="mailto:support@smarthealth.com" className="hover:text-blue-600"><Mail size={20} /></a>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      <p className="text-center text-sm">
        © {new Date().getFullYear()} Smart Health. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
