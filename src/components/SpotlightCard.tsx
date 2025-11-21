import React, { useRef, useState } from 'react';

export const SpotlightCard = ({ children, className = "", isDark }: { children: React.ReactNode, className?: string, isDark: boolean }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative rounded-xl border overflow-hidden group transition-colors duration-300 ${isDark
                ? 'border-slate-800 bg-slate-900/50'
                : 'border-slate-200 bg-white/50 shadow-sm'
                } ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: isDark
                        ? `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.1), transparent 40%)`
                        : `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(13, 148, 136, 0.08), transparent 40%)`,
                    opacity: opacity,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px rounded-xl transition duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: isDark
                        ? `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.4), transparent 40%)`
                        : `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(13, 148, 136, 0.3), transparent 40%)`,
                    maskImage: 'linear-gradient(black, black)',
                    WebkitMaskImage: 'linear-gradient(black, black)',
                    WebkitMaskComposite: 'xor',
                    zIndex: 10
                } as React.CSSProperties}
            />
            <div className="relative h-full z-20 p-6">
                {children}
            </div>
        </div>
    );
};
