import React from 'react';

export const SocialLink = ({ icon, href, label, isDark }: { icon: React.ReactNode, href: string, label: string, isDark: boolean }) => (
    <a
        href={href}
        className={`transition ${isDark ? 'text-slate-400 hover:text-teal-300' : 'text-slate-500 hover:text-teal-600'}`}
        aria-label={label}
        target="_blank"
        rel="noreferrer"
    >
        {icon}
    </a>
);
