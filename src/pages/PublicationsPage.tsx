import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FileText, Award, Layers, Hash } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { publications } from '../data/publications';

interface PublicationsPageProps {
    isDark: boolean;
}

const PublicationsPage = ({ isDark }: PublicationsPageProps) => {
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const location = useLocation();

    // Handle hash scrolling
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            // Small delay to allow for animations/rendering
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    }, [location]);

    // Calculate statistics
    const totalPapers = publications.length;
    const totalCitations = publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);

    // Get years and sort descending
    const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);

    // Filter logic
    const filteredPubs = publications.filter(pub => selectedYear === null || pub.year === selectedYear);

    const theme = {
        textMain: isDark ? 'text-slate-400' : 'text-slate-600',
        textHead: isDark ? 'text-slate-100' : 'text-slate-900',
        border: isDark ? 'border-slate-800' : 'border-slate-200',
        cardBg: isDark ? 'bg-slate-900' : 'bg-white',
        // Unified cyan/teal accent
        accent: isDark ? 'text-cyan-400' : 'text-teal-600',
        tagBg: isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600',
        btnActive: isDark ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-teal-600 text-white shadow-md shadow-teal-500/30',
        btnInactive: isDark ? 'bg-slate-900 text-slate-400 hover:bg-slate-800' : 'bg-white text-slate-600 hover:bg-slate-100',
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 relative">

            {/* Holographic background grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(${isDark ? '#06b6d4' : '#0f766e'} 0.5px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header and Statistics (matching NewsPage style) */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    {/* Title - matching NewsPage h1 style */}
                    <h1 className={`text-4xl md:text-6xl font-bold mb-4 tracking-tight ${theme.textHead}`}>
                        Publications Archive
                    </h1>

                    {/* Gradient divider - matching NewsPage */}
                    <div className={`h-1 w-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${isDark ? 'from-cyan-400/0 via-cyan-400 to-cyan-400/0' : 'from-teal-400/0 via-teal-400 to-teal-400/0'}`} />

                    {/* Description */}
                    <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${theme.textMain}`}>
                        A filtered archive of core research papers, conference proceedings, and technical reports on AI, BIM, and the Built Environment.
                    </p>

                    {/* Statistics blocks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-center gap-8 mt-8"
                    >
                        {/* Total publications */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center gap-2 p-3 rounded-lg border ${theme.border} ${theme.cardBg} shadow-lg transition-all`}
                        >
                            <Layers size={20} className={theme.accent} />
                            <div>
                                <div className={`text-2xl font-bold ${theme.textHead}`}>{totalPapers}</div>
                                <div className={`text-xs uppercase font-medium ${theme.textMain}`}>Total Publications</div>
                            </div>
                        </motion.div>

                        {/* Total citations */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center gap-2 p-3 rounded-lg border ${theme.border} ${theme.cardBg} shadow-lg transition-all`}
                        >
                            <Hash size={20} className={theme.accent} />
                            <div>
                                <div className={`text-2xl font-bold ${theme.textHead}`}>{totalCitations}</div>
                                <div className={`text-xs uppercase font-medium ${theme.textMain}`}>Total Citations</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Filter Pills */}
                <motion.div
                    className="mb-12 flex justify-center gap-3 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                >
                    <FilterButton
                        label="All Years"
                        isActive={selectedYear === null}
                        onClick={() => setSelectedYear(null)}
                        theme={theme}
                    />
                    {years.map(year => (
                        <FilterButton
                            key={year}
                            label={year.toString()}
                            isActive={selectedYear === year}
                            onClick={() => setSelectedYear(year)}
                            theme={theme}
                        />
                    ))}
                </motion.div>

                {/* Single column layout with Framer Motion */}
                <motion.div
                    layout
                    className="grid grid-cols-1 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredPubs.map((pub, index) => (
                            <PublicationCard key={pub.id} pub={pub} theme={theme} isDark={isDark} index={index} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredPubs.length === 0 && (
                    <div className={`text-center py-20 ${theme.textMain}`}>
                        No publications found for the selected year.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicationsPage;

// --- Sub-Components ---

const FilterButton = ({ label, isActive, onClick, theme }: any) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${isActive ? 'border-transparent scale-105' : `${theme.border} scale-100`} ${isActive ? theme.btnActive : theme.btnInactive}`}
    >
        {label}
    </motion.button>
);

// Publication Card with Holographic/3D Tilt Effect
const PublicationCard = React.forwardRef(({ pub, theme, isDark, index }: any, ref: React.ForwardedRef<HTMLDivElement>) => {
    // Initial load animation for staggered entrance
    const initialLoadVariants: any = {
        hidden: { opacity: 0, y: 50, rotateX: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                delay: 0.8 + i * 0.05,
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }),
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
    };

    const [isHovered, setIsHovered] = useState(false);

    // Hover animation for the whole card
    const hoverMotion = isDark ? {
        scale: 1.01,
        boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)",
        transition: { duration: 0.3 }
    } : {
        scale: 1.005,
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3 }
    };

    return (
        <motion.div
            id={pub.id}
            ref={ref}
            layout
            custom={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={initialLoadVariants}
            whileHover={hoverMotion}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative p-6 md:p-8 rounded-2xl border ${theme.border} ${theme.cardBg} flex flex-col justify-between overflow-hidden transition-shadow duration-300 cursor-pointer scroll-mt-32`}
            style={{
                transformStyle: 'preserve-3d',
            }}
        >
            {/* Inner 3D Holographic Layer */}
            <motion.div
                className="absolute inset-0 bg-transparent rounded-2xl pointer-events-none"
                animate={{
                    rotateX: isHovered ? [0, 2, -2, 0] : 0,
                    rotateY: isHovered ? [0, -2, 2, 0] : 0,
                    z: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                    boxShadow: isHovered && isDark ? 'inset 0 0 15px rgba(6, 182, 212, 0.4)' : 'none',
                }}
            />

            {/* Featured/Best Paper Badge */}
            {pub.featured && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-yellow-400 bg-yellow-900/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-400/20">
                    <Award size={14} />
                    <span>Featured</span>
                </div>
            )}

            {/* Content Area */}
            <div className="relative z-20">
                {/* Meta Row: Year & Venue */}
                <div className="flex items-center gap-3 mb-4 text-sm font-mono">
                    <span className={`${theme.accent} font-extrabold text-lg`}>{pub.year}</span>
                    <span className={theme.textMain}>•</span>
                    <span className={`${theme.textHead} font-semibold`}>{pub.venue}</span>
                </div>

                {/* Title */}
                <motion.h3
                    className={`text-2xl md:text-3xl font-bold mb-3 leading-tight transition-colors ${theme.textHead}`}
                    animate={{ color: isHovered ? (isDark ? '#06b6d4' : '#0f766e') : (isDark ? '#f8fafc' : '#1e293b') }}
                >
                    {pub.title}
                </motion.h3>

                {/* Authors */}
                <p className={`text-base mb-4 leading-relaxed ${theme.textMain}`}>
                    {pub.authors.map((author: string, i: number) => {
                        const isMe = author.includes("Mingchen Li") || author.includes("M Li") || author.includes("Ming-Chen Li");
                        return (
                            <span key={i} className={isMe ? `font-bold ${theme.accent} relative inline-block` : ""}>
                                {author}
                                {isMe && pub.author_status === 'first' && (
                                    <span className="ml-1 text-[10px] align-top bg-teal-500/10 text-teal-500 px-1 rounded border border-teal-500/20">1st</span>
                                )}
                                {isMe && pub.author_status === 'co-first' && (
                                    <span className="ml-1 text-[10px] align-top bg-teal-500/10 text-teal-500 px-1 rounded border border-teal-500/20">Co-1st</span>
                                )}
                                {isMe && pub.author_status === 'corresponding' && (
                                    <span className="ml-1 text-[10px] align-top bg-blue-500/10 text-blue-500 px-1 rounded border border-blue-500/20">Corr</span>
                                )}
                                {i < pub.authors.length - 1 ? ", " : ""}
                            </span>
                        );
                    })}
                </p>

                {/* Abstract */}
                {pub.abstract && (
                    <p className={`text-sm mb-6 leading-relaxed opacity-80 line-clamp-4 ${theme.textMain}`}>
                        {pub.abstract}
                    </p>
                )}
            </div>

            {/* Footer: Tags & Actions */}
            <div className="relative z-20 flex items-end justify-between mt-auto pt-6 border-t border-dashed border-slate-700/30">

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                    {pub.tags?.map((tag: string) => (
                        <span key={tag} className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${theme.tagBg}`}>
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Links and Citations */}
                <div className="flex gap-3 items-center">
                    {/* Citations Count */}
                    <div className={`flex items-center gap-1 text-sm font-bold ${theme.accent} opacity-80`}>
                        <Hash size={14} className="opacity-60" />
                        {pub.citations || 0}
                    </div>

                    {pub.links.pdf && (
                        <motion.a
                            href={pub.links.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, boxShadow: isDark ? '0 0 10px rgba(6, 182, 212, 0.8)' : '0 5px 15px rgba(0, 0, 0, 0.2)' }}
                            className={`p-2 rounded-full transition-all ${isDark ? 'bg-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white' : 'bg-slate-100 text-teal-600 hover:bg-teal-600 hover:text-white'}`}
                        >
                            <FileText size={18} />
                        </motion.a>
                    )}
                    {pub.doi && (
                        <motion.a
                            href={pub.doi}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, boxShadow: isDark ? '0 0 10px rgba(6, 182, 212, 0.8)' : '0 5px 15px rgba(0, 0, 0, 0.2)' }}
                            className={`p-2 rounded-full transition-all ${isDark ? 'bg-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white' : 'bg-slate-100 text-teal-600 hover:bg-teal-600 hover:text-white'}`}
                        >
                            <ExternalLink size={18} />
                        </motion.a>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

PublicationCard.displayName = 'PublicationCard';
