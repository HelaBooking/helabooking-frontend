import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Plus, Settings, Bookmark, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-elevation-1'
        : 'text-neutral-700 dark:text-neutral-300 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800'
    }`;

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${
      scrolled ? 'shadow-elevation-2 dark:shadow-none dark:shadow-lg' : 'shadow-elevation-1 dark:shadow-none'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
            <img 
              src="/logo.svg" 
              alt="HelaBooking Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-elevation-2 group-hover:shadow-elevation-3 transition-all duration-200 object-contain"
            />
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              HelaBooking
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Home size={18} />
                <span className="hidden lg:inline">Events</span>
              </span>
            </NavLink>
            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <NavLink to="/create-event" className={navLinkClass}>
                      <span className="flex items-center gap-2">
                        <Plus size={18} />
                        <span className="hidden lg:inline">Create Event</span>
                      </span>
                    </NavLink>
                    <NavLink to="/manage-events" className={navLinkClass}>
                      <span className="flex items-center gap-2">
                        <Settings size={18} />
                        <span className="hidden lg:inline">Manage Events</span>
                      </span>
                    </NavLink>
                  </>
                )}
                <NavLink to="/my-bookings" className={navLinkClass}>
                  <span className="flex items-center gap-2">
                    <Bookmark size={18} />
                    <span className="hidden lg:inline">My Bookings</span>
                  </span>
                </NavLink>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-3 border-r border-neutral-200 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden lg:inline">
                      {user.username}
                    </span>
                  </div>
                  {user.role === 'ADMIN' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 shadow-elevation-1 hover:shadow-elevation-2"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-3 lg:px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary rounded-lg transition-colors duration-200"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 lg:px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 shadow-elevation-1 hover:shadow-elevation-2"
                >
                  Get Started
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-neutral-200 dark:border-neutral-700 animate-slide-down">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user.username}</p>
                  {user.role === 'ADMIN' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mt-1">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            )}
            <NavLink 
              to="/" 
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <Home size={18} />
                Events
              </span>
            </NavLink>
            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <NavLink 
                      to="/create-event" 
                      className={navLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <Plus size={18} />
                        Create Event
                      </span>
                    </NavLink>
                    <NavLink 
                      to="/manage-events" 
                      className={navLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <Settings size={18} />
                        Manage Events
                      </span>
                    </NavLink>
                  </>
                )}
                <NavLink 
                  to="/my-bookings" 
                  className={navLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <Bookmark size={18} />
                    My Bookings
                  </span>
                </NavLink>
              </>
            )}
            {!user && (
              <>
                <NavLink 
                  to="/login" 
                  className={navLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    Sign In
                  </span>
                </NavLink>
                <NavLink 
                  to="/register" 
                  className={navLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    Get Started
                  </span>
                </NavLink>
              </>
            )}
            {user && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 shadow-elevation-1"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
