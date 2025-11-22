import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    isDark: boolean;
}

export const Navbar = ({ isDark }: NavbarProps) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Home', href: '/' },
        { name: 'News', href: '/news' },
        { name: 'Publications', href: '/publications' },
        { name: 'Projects', href: '/projects' },
        { name: 'About', href: '/about' },
    ];

    const navBgClass = isDark
        ? 'bg-slate-900/80 border-slate-800/50 shadow-black/20'
        : 'bg-white/80 border-slate-200/50 shadow-slate-200/50';

    const activeLinkClass = isDark
        ? 'bg-slate-800 text-teal-300'
        : 'bg-slate-100 text-teal-600';

    const inactiveLinkClass = isDark
        ? 'text-slate-400 hover:text-teal-300 hover:bg-slate-800/50'
        : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100';

    return (
        <>
            {/* Mobile Navigation (Hamburger) */}
            <div className="fixed top-6 left-6 z-50 md:hidden flex flex-col items-start gap-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${navBgClass} ${isDark ? 'text-teal-300' : 'text-teal-600'}`}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                    <span className="text-sm font-bold tracking-wide">MENU</span>
                </button>

                {/* Mobile Menu Items */}
                <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 origin-top-left ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none h-0'}`}>
                    <div className={`flex flex-col gap-1 p-2 rounded-2xl backdrop-blur-md border shadow-lg ${navBgClass}`}>
                        {links.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl ${isActive ? activeLinkClass : inactiveLinkClass}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Desktop Navigation (Centered Pill) */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
                <div className={`flex items-center gap-1 px-3 py-2 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-300 ${navBgClass}`}>
                    {links.map((link) => {
                        const isActive = location.pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full ${isActive ? activeLinkClass : inactiveLinkClass}`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};
