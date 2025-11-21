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
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-screen-xl px-6 pointer-events-none">
            <div className="flex items-center justify-between pointer-events-auto">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className={`relative w-10 h-10 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-110 ${isDark ? 'shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'shadow-lg'}`}>
                        <img src="/logo.svg" alt="BuildingAgent Logo" className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 border-2 rounded-xl opacity-50 ${isDark ? 'border-teal-400/30' : 'border-teal-600/20'}`}></div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-lg font-bold tracking-tight leading-none ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Mingchen
                        </span>
                        <span className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                            BuildingAgent
                        </span>
                    </div>
                </Link>

                {/* Navigation Links */}
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
            </div>
        </nav>
    );
};
