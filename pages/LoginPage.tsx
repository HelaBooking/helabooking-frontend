
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/api';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await loginUser({ username, password });
      login(userData);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-neutral-50 via-neutral-50 to-primary/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary/10 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <img
              src="/logo.png"
              alt="HelaBooking Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-elevation-2 object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.indexOf('/logo.svg') === -1) {
                  target.src = '/logo.svg';
                }
              }}
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Sign in to your account to continue booking events</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-elevation-2 p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 sm:top-3.5 text-neutral-500 dark:text-neutral-400" size={16} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-200 dark:border-neutral-600 rounded-lg sm:rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password-input" className="block text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 sm:top-3.5 text-neutral-500 dark:text-neutral-400" size={16} />
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-200 dark:border-neutral-600 rounded-lg sm:rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex gap-2">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-elevation-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 sm:my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">OR</span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Create one now
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-4 sm:mt-6 px-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
