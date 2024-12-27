import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { logout, user, authenticated } = usePrivy();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.name || 'User');

  // Fetch updated display name from localStorage on component mount
  useEffect(() => {
    if (user?.id) {
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setDisplayName(profileData.displayName || user.name || 'User');
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!authenticated) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 h-16 flex items-center justify-between px-4">
      {/* Left side - Logo and Profile */}
      <div className="flex items-center space-x-8">
        <Link to="/profile" className="flex items-center space-x-2">
          <img
            src={user?.picture || 'https://via.placeholder.com/32'}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white font-medium">{displayName}</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-500 transition-colors">
            Files
          </Link>
        </div>
      </div>

      {/* Right side - Logout */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};


export default Navbar;
