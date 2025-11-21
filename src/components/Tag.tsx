import React from 'react';

export const Tag = ({ children, isDark }: { children: React.ReactNode, isDark: boolean }) => (
    <li className={`flex items-center rounded-full px-3 py-1 text-xs font-medium leading-5 ${isDark
        ? 'bg-teal-400/10 text-teal-300'
        : 'bg-teal-600/10 text-teal-700'
        }`}>
        {children}
    </li>
);
