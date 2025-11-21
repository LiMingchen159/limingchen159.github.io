import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { profile } from '../data/profile';

interface NewsPageProps {
    isDark?: boolean;
}

// --- 3D Card Component Wrapper ---
const NewsCard3D: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

    // Animations
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.6, 1, 0.6, 0]);
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
    const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [20, 0, -20]);
    const y = useTransform(smoothProgress, [0, 0.5, 1], [50, 0, -50]);

    // Reduced blur effect - only apply when far from center and NOT hovering
    const filter = useTransform(smoothProgress, (v) => {
        if (isHovered) return 'none'; // Force no filter when hovering
        const distanceFromCenter = Math.abs(v - 0.5);
        // Only blur when very far from center (> 0.4), and max 2px blur
        const blurAmount = distanceFromCenter > 0.4 ? (distanceFromCenter - 0.4) * 3.3 : 0;
        return blurAmount > 0.1 ? `blur(${blurAmount}px)` : 'none';
    });

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale, rotateX, y, filter: isHovered ? 'none' : filter, transformStyle: "preserve-3d" }}
            className="origin-center will-change-transform perspective-1000 group transition-all duration-300 ease-out hover:z-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </motion.div>
    );
};

const NewsPage: React.FC<NewsPageProps> = ({ isDark = false }) => {


    const [filter, setFilter] = useState<'all' | 'publication' | 'career'>('all');

    // Filter news based on selected category
    const filteredNews = profile.news.filter(item => {
        if (filter === 'all') return true;
        // Default to 'career' if category is missing (for backward compatibility)
        const category = item.category || 'career';
        return category === filter;
    });

    // Group news by year
    const newsByYear = filteredNews.reduce((acc, item) => {
        const year = item.date.split('-')[0];
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(item);
        return acc;
    }, {} as Record<string, typeof profile.news>);

    const years = Object.keys(newsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    const themeClasses = {
        textMain: isDark ? 'text-slate-400' : 'text-slate-600',
        textHead: isDark ? 'text-slate-100' : 'text-slate-900',
        textSub: isDark ? 'text-slate-200' : 'text-slate-800',
        accent: isDark ? 'text-teal-300' : 'text-teal-600',
        timelineBorder: isDark ? 'border-teal-500/40' : 'border-teal-500/50',
        timelineDot: isDark ? 'bg-teal-400' : 'bg-teal-600',
        timelineDotBorder: isDark ? 'border-slate-950' : 'border-slate-50',
        yearBg: isDark ? 'bg-slate-900/60' : 'bg-white/90',
        cardBg: isDark ? 'bg-slate-900/40' : 'bg-white/60',
        cardBorder: isDark ? 'border-teal-500/20' : 'border-teal-500/30',
        cardHover: isDark ? 'hover:bg-slate-800/60 hover:border-teal-400/40' : 'hover:bg-white/80 hover:border-teal-500/50',
        glow: isDark ? 'shadow-[0_0_20px_-8px_rgba(45,212,191,0.15)]' : 'shadow-[0_0_20px_-8px_rgba(13,148,136,0.15)]',
        glowActive: isDark ? 'hover:shadow-[0_0_40px_-10px_rgba(45,212,191,0.3)]' : 'hover:shadow-[0_0_40px_-10px_rgba(13,148,136,0.25)]'
    };

    return (
        <div className="min-h-screen py-24 overflow-hidden relative">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-5xl mx-auto px-6 text-center mb-12 relative z-10"
            >
                <h1 className={`text-4xl md:text-6xl font-bold mb-4 tracking-tight ${themeClasses.textHead}`}>
                    News Archive
                </h1>
                <div className={`h-1 w-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0`} />
                <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${themeClasses.textMain} mb-8`}>
                    A timeline of my academic journey and achievements
                </p>

                {/* Filter Controls */}
                <div className="flex justify-center gap-2">
                    {(['all', 'publication', 'career'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${filter === f
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                                    : `${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50'} border ${themeClasses.cardBorder}`
                                }
                            `}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="perspective-[1200px] relative">

                    {/* Global Content Vertical Line */}
                    <div className={`absolute left-[35px] md:left-[43px] top-0 bottom-0 w-0.5 ${themeClasses.timelineBorder}`} />

                    {years.map((year, yearIdx) => (
                        <motion.div
                            key={year}
                            id={`year-${year}`}
                            className="mb-16 last:mb-0 relative group scroll-mt-24"
                            viewport={{ margin: "-45% 0px -45% 0px" }}
                        >

                            {/* Year Marker */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex items-center gap-4 mb-8 relative z-20"
                            >
                                <div className={`relative flex items-center justify-center w-20 h-20 rounded-xl ${themeClasses.yearBg} border-2 ${themeClasses.timelineBorder} backdrop-blur-md shadow-xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500`}>
                                    <span className={`text-2xl font-bold font-mono tracking-tight ${themeClasses.accent}`}>
                                        {year}
                                    </span>
                                    <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${themeClasses.timelineDot}`} />
                                    <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full ${themeClasses.timelineDot} opacity-50`} />
                                </div>
                                <div className={`h-px flex-1 bg-gradient-to-r from-teal-500/40 to-transparent`} />
                            </motion.div>

                            {/* News Items */}
                            <div className="space-y-8">
                                {newsByYear[year].map((item, idx) => (
                                    <div key={idx} className="relative pl-8 md:pl-12">

                                        {/* Timeline Connector Dot */}
                                        <div className="absolute left-[27px] md:left-[35px] top-6 z-20">
                                            <div className={`w-3 h-3 rounded-full border-2 ${themeClasses.timelineDot} ${themeClasses.timelineDotBorder} shadow-[0_0_8px_currentColor]`} />
                                        </div>

                                        {/* Connecting line to next item within same year */}
                                        {idx < newsByYear[year].length - 1 && (
                                            <div className={`absolute left-[35px] md:left-[43px] top-9 w-0.5 h-[calc(100%+2rem)] ${themeClasses.timelineBorder} opacity-60`} />
                                        )}

                                        {/* Connecting line to next year */}
                                        {idx === newsByYear[year].length - 1 && yearIdx < years.length - 1 && (
                                            <div className={`absolute left-[35px] md:left-[43px] top-9 w-0.5 h-20 ${themeClasses.timelineBorder} opacity-40`} />
                                        )}

                                        {/* The 3D Card Wrapper */}
                                        <NewsCard3D>
                                            <div className={`
                                                relative p-6 rounded-xl border backdrop-blur-md transition-all duration-500 ease-out
                                                ${themeClasses.cardBg} 
                                                ${themeClasses.cardBorder}
                                                ${themeClasses.cardHover}
                                                ${themeClasses.glow}
                                                ${themeClasses.glowActive}
                                            `}>
                                                {/* Shine effect on hover */}
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />

                                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${themeClasses.timelineBorder} ${themeClasses.accent} bg-teal-500/5`}>
                                                        {item.date}
                                                    </span>
                                                    {item.category && (
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${themeClasses.timelineBorder} ${isDark ? 'text-slate-400' : 'text-slate-500'} bg-slate-500/5`}>
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`text-xl font-bold mb-3 leading-tight ${themeClasses.textHead}`}>
                                                    {item.title}
                                                </h3>

                                                {item.description && (
                                                    <p className={`text-sm leading-relaxed ${themeClasses.textMain}`}>
                                                        {item.description}
                                                    </p>
                                                )}

                                                {item.link && (
                                                    <div className="mt-4">
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${themeClasses.accent} hover:underline decoration-2 underline-offset-4 transition-all`}
                                                        >
                                                            Read Source
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                )}

                                                {item.related_paper_id && (
                                                    <div className="mt-2">
                                                        <a
                                                            href={`/publications`}
                                                            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${themeClasses.accent} hover:underline decoration-2 underline-offset-4 transition-all`}
                                                        >
                                                            View Paper
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </NewsCard3D>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
