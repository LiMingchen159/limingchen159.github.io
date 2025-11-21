import React, { useRef } from 'react';
import { projects } from '../data/projects';
import { Github, ArrowUpRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

interface ProjectsPageProps {
    isDark: boolean;
}

export const ProjectsPage = ({ isDark }: ProjectsPageProps) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Smooth out the scroll progress
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Transform vertical scroll to horizontal movement
    const x = useTransform(smoothProgress, [0, 1], ["1%", "-75%"]);
    const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    // Navigation Helpers
    const handleScroll = (direction: 'prev' | 'next') => {
        const scrollAmount = window.innerHeight * 0.8;
        window.scrollBy({
            top: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    };

    const themeClasses = {
        bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
        textMain: isDark ? 'text-slate-400' : 'text-slate-600',
        textHead: isDark ? 'text-slate-100' : 'text-slate-900',
        textSub: isDark ? 'text-slate-200' : 'text-slate-800',
        accent: isDark ? 'text-teal-300' : 'text-teal-600',
        cardBg: isDark ? 'bg-slate-900' : 'bg-white',
        cardBorder: isDark ? 'border-slate-800' : 'border-slate-200',
    };

    return (
        <div className="relative">
            {/* Header Section */}
            <div className="relative z-10 pt-32 pb-12 px-6 md:px-16 text-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    <h1 className={`text-5xl md:text-7xl font-bold mb-6 tracking-tight ${themeClasses.textHead}`}>
                        Project Horizon
                    </h1>
                    <div className={`h-1.5 w-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0`} />
                    <p className={`text-lg md:text-xl max-w-xl mx-auto leading-relaxed ${themeClasses.textMain}`}>
                        A panoramic view of my work in building digitization, AI agents, and sustainable design.
                    </p>
                </motion.div>
            </div>

            {/* Scroll Container */}
            <section ref={targetRef} className="relative h-[300vh]">
                <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                    {/* The Moving Content */}
                    <motion.div style={{ x }} className="flex gap-12 px-12 md:px-32 items-center">
                        {/* Project Cards */}
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} isDark={isDark} />
                        ))}
                    </motion.div>

                    {/* --- UI Controls Layer --- */}
                    <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between z-30 pointer-events-none">
                        {/* Progress Bar */}
                        <div className={`w-48 h-[2px] rounded-full overflow-hidden relative ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <motion.div
                                style={{ width: progressBarWidth }}
                                className="absolute top-0 left-0 h-full bg-teal-500"
                            />
                        </div>

                        {/* Navigation Buttons (Pointer events re-enabled) */}
                        <div className="flex gap-4 pointer-events-auto">
                            <button
                                onClick={() => handleScroll('prev')}
                                className={`p-4 rounded-full border transition-all group ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => handleScroll('next')}
                                className={`p-4 rounded-full border transition-all group ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                            >
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

const ProjectCard = ({ project, isDark }: { project: any, isDark: boolean }) => {
    // 3D Tilt Effect using Mouse
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = (mouseX / width - 0.5) * 2;
        const yPct = (mouseY / height - 0.5) * 2;
        x.set(xPct * 100);
        y.set(yPct * 100);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`
                group relative h-[50vh] md:h-[500px] w-[85vw] md:w-[400px] flex-shrink-0 
                rounded-2xl border cursor-pointer
                ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
            `}
        >
            {/* Image Container with Internal Parallax */}
            <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute inset-4 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
            >
                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                {project.image && (
                    <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                )}
            </div>

            {/* Text Content Overlay */}
            <div
                style={{ transform: "translateZ(75px)" }}
                className="absolute bottom-8 left-8 right-8 z-20 flex flex-col items-start pointer-events-none"
            >
                <div className={`px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider rounded-full bg-gradient-to-r ${project.color || 'from-teal-400 to-teal-600'} text-white shadow-lg`}>
                    {project.tags[0]}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{project.title}</h3>
                <p className="text-sm text-white/90 backdrop-blur-md bg-black/40 p-3 rounded-lg mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 leading-relaxed">
                    {project.description}
                </p>
            </div>

            {/* Interactive Buttons (Separate layer to handle clicks) */}
            <div
                style={{ transform: "translateZ(80px)" }}
                className="absolute bottom-8 right-8 z-30 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
            >
                {project.demo && (
                    <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform shadow-lg"
                        title="View Demo"
                    >
                        <ArrowUpRight size={20} />
                    </a>
                )}
                {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 hover:scale-110 transition-all shadow-lg backdrop-blur-sm"
                        title="View Code"
                    >
                        <Github size={20} />
                    </a>
                )}
            </div>

            {/* Border Gradient Glow */}
            <div className={`absolute -inset-[1px] rounded-2xl z-[-1] bg-gradient-to-r ${project.color || 'from-teal-400 to-teal-600'} opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500`} />
        </motion.div>
    );
};
