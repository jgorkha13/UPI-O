import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ showLabel = true, className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex items-center gap-3 w-full text-left ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-brand-soft dark:bg-brand/20 flex items-center justify-center shrink-0">
        {isDark ? (
          <Sun className="w-5 h-5 text-brand" />
        ) : (
          <Moon className="w-5 h-5 text-brand" />
        )}
      </div>
      {showLabel && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">Dark mode</p>
          <p className="text-xs text-text-secondary">{isDark ? 'On' : 'Off'}</p>
        </div>
      )}
      <div
        className={`relative w-11 h-6 rounded-full transition-colors ${
          isDark ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
