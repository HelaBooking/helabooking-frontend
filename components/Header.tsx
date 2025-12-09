
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = "text-white hover:text-neutral-200 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkStyle = "bg-primary-dark";

  return (
    <header className="bg-neutral-800 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-white text-xl font-bold">
              Event Horizon
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
              Events
            </NavLink>
            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <NavLink to="/create-event" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                      Create Event
                    </NavLink>
                    <NavLink to="/manage-events" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                      Manage Events
                    </NavLink>
                  </>
                )}
                <NavLink to="/my-bookings" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
                  My Bookings
                </NavLink>
              </>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-neutral-200 text-sm">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                 <NavLink
                  to="/login"
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-transparent hover:bg-primary text-white font-semibold hover:text-white py-2 px-4 border border-white hover:border-transparent rounded-lg transition-colors duration-300"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
