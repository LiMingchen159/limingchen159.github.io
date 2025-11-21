import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => (
    <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-2.5 rounded-full transition-all duration-300 border ${isDark
            ? 'bg-slate-900/80 border-slate-800 text-teal-300 hover:bg-slate-800'
            : 'bg-white/80 border-slate-200 text-teal-600 hover:bg-slate-100 shadow-sm'
            }`}
        aria-label="Toggle Theme"
    >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
);
