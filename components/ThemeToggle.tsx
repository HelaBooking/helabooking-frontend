import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Sun size={20} className="transition-transform duration-300" />
      ) : (
        <Moon size={20} className="transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
