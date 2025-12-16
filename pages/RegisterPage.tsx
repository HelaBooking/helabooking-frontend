
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../services/api';
import type { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const userData = await registerUser({ username, email, password, role });
      login(userData);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Username or email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-neutral-50 via-neutral-50 to-primary/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary/10 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-elevation-2 mb-3 sm:mb-4">
            <span className="text-white font-bold text-base sm:text-lg">EH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Get Started</h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Create your account to explore amazing events</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-elevation-2 p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label htmlFor="username-reg" className="block text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Username
              </label>
              <input
                id="username-reg"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-200 dark:border-neutral-600 rounded-lg sm:rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email-address" className="block text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-200 dark:border-neutral-600 rounded-lg sm:rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password-reg" className="block text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Password
              </label>
              <input
                id="password-reg"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-200 dark:border-neutral-600 rounded-lg sm:rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">Must be at least 8 characters long</p>
            </div>

            {/* Role Select */}
            <div>
              <label htmlFor="role" className="block text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Account Type
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-200 dark:border-neutral-600 rounded-lg sm:rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200 appearance-none"
              >
                <option value="USER">Regular User</option>
                <option value="AUDITOR">Auditor</option>
                <option value="ADMIN">Event Admin</option>
              </select>
              <p className="mt-1 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">Select your account type to get started</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-red-800 dark:text-red-400 font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 mt-6 bg-gradient-to-r from-primary to-primary-dark text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-elevation-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 sm:my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">OR</span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-4 sm:mt-6 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
