import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
    isDark: boolean;
}

export const Navbar = ({ isDark }: NavbarProps) => {
    const location = useLocation();

    const links = [
        { name: 'Home', href: '/' },
        { name: 'News', href: '/news' },
        { name: 'Publications', href: '/publications' },
        { name: 'Projects', href: '/projects' },
        { name: 'About', href: '/about' },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className={`flex items-center gap-1 px-3 py-2 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-300 ${isDark
                ? 'bg-slate-900/80 border-slate-800/50 shadow-black/20'
                : 'bg-white/80 border-slate-200/50 shadow-slate-200/50'
                }`}>
                {links.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full ${isActive
                                ? isDark ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-teal-600'
                                : isDark ? 'text-slate-400 hover:text-teal-300 hover:bg-slate-800/50' : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100'
                                }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
