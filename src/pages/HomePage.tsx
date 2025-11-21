import { profile } from '../data/profile';
import { getFeaturedPublications } from '../data/publications';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SpotlightCard } from '../components/SpotlightCard';
import { motion } from 'framer-motion';

interface HomePageProps {
    isDark: boolean;
}

// Helper to render bio with highlights
const BioText = ({ text, isDark }: { text: string, isDark: boolean }) => {
    const highlightClass = isDark ? 'text-teal-300 font-medium' : 'text-teal-600 font-medium';

    const parts = text.split(/(Hong Kong University of Science and Technology|BuildingAgent|Brick Schema|SPARQL|HVAC|Large Language Model|Large Language Models|Semantic Model|semantic modeling|Building Performance Optimization|Machine Learning|Prof. Wang|Knowledge Graphs|Digital Twins|Smart Buildings)/g);

    return (
        <span>
            {parts.map((part, i) => {
                if (part === 'Hong Kong University of Science and Technology') {
                    return <a key={i} href="https://hkust.edu.hk/" target="_blank" rel="noopener noreferrer" className={`${highlightClass} hover:underline`}>{part}</a>;
                }
                if (part === 'Prof. Wang') {
                    return <a key={i} href="https://walterzwang.github.io/" target="_blank" rel="noopener noreferrer" className={`${highlightClass} hover:underline`}>{part}</a>;
                }
                if (part === 'BuildingAgent') {
                    return <a key={i} href="https://github.com/LiMingchen159/BuildingGPT" target="_blank" rel="noopener noreferrer" className={`${highlightClass} hover:underline`}>{part}</a>;
                }
                if (part === 'Brick Schema') {
                    return <a key={i} href="https://brickschema.org/" target="_blank" rel="noopener noreferrer" className={`${highlightClass} hover:underline`}>{part}</a>;
                }
                if (part === 'SPARQL') {
                    return <a key={i} href="https://www.w3.org/TR/sparql11-query/" target="_blank" rel="noopener noreferrer" className={`${highlightClass} hover:underline`}>{part}</a>;
                }
                if (['Large Language Model', 'Large Language Models', 'Semantic Model', 'semantic modeling', 'Building Performance Optimization', 'Machine Learning', 'HVAC', 'Knowledge Graphs', 'Digital Twins', 'Smart Buildings'].includes(part)) {
                    return <span key={i} className={highlightClass}>{part}</span>;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

export const HomePage = ({ isDark }: HomePageProps) => {
    const featuredPubs = getFeaturedPublications().slice(0, 3);

    const themeClasses = {
        bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
        textMain: isDark ? 'text-slate-400' : 'text-slate-600',
        textHead: isDark ? 'text-slate-100' : 'text-slate-900',
        textSub: isDark ? 'text-slate-200' : 'text-slate-800',
        accent: isDark ? 'text-teal-300' : 'text-teal-600',
        accentHover: isDark ? 'hover:text-teal-300' : 'hover:text-teal-600',
        cardBg: isDark ? 'bg-slate-900/50' : 'bg-white',
        cardBorder: isDark ? 'border-slate-800' : 'border-slate-200',
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <div className="space-y-24">
            {/* About Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className={`sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0 ${isDark ? 'bg-slate-950/75' : 'bg-slate-50/75'}`}>
                    <h2 className={`text-sm font-bold uppercase tracking-widest lg:sr-only ${themeClasses.textSub}`}>About</h2>
                </div>
                <motion.h2 variants={itemVariants} className={`text-3xl font-bold mb-8 hidden lg:block ${themeClasses.textHead}`}>About Me</motion.h2>
                <motion.div variants={itemVariants} className={`text-lg leading-relaxed ${themeClasses.textMain}`}>
                    <p className="mb-6">
                        <BioText text={profile.bio} isDark={isDark} />
                    </p>
                    {profile.buildingAgentUrl && (
                        <a
                            href={profile.buildingAgentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${isDark ? 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20' : 'bg-teal-600/10 text-teal-700 hover:bg-teal-600/20'}`}
                        >
                            See BuildingAgent <ExternalLink size={16} />
                        </a>
                    )}
                </motion.div>
            </motion.section>

            {/* My Research Section */}
            {profile.researchBio && (
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.h2 variants={itemVariants} className={`text-3xl font-bold mb-8 ${themeClasses.textHead}`}>My Research</motion.h2>
                    <motion.div variants={itemVariants} className={`text-lg leading-relaxed whitespace-pre-line ${themeClasses.textMain}`}>
                        <BioText text={profile.researchBio} isDark={isDark} />
                    </motion.div>
                </motion.section>
            )}

            {/* News Section */}
            {profile.news && (
                <motion.section
                    className="mb-16 scroll-mt-16 md:mb-24"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className={`sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0 ${isDark ? 'bg-slate-950/75' : 'bg-slate-50/75'}`}>
                        <h2 className={`text-sm font-bold uppercase tracking-widest lg:sr-only ${themeClasses.textSub}`}>News</h2>
                    </div>
                    <motion.h2 variants={itemVariants} className={`text-3xl font-bold mb-8 hidden lg:block ${themeClasses.textHead}`}>News</motion.h2>
                    <div className="space-y-8">
                        {profile.news.slice(0, 3).map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
                                variants={itemVariants}
                            >
                                <span className={`text-sm font-mono whitespace-nowrap ${themeClasses.accent}`}>{item.date}</span>
                                <div>
                                    <h3 className={`text-base font-semibold ${themeClasses.textHead}`}>{item.title}</h3>
                                    {item.description && <p className={`text-sm mt-1 ${themeClasses.textMain}`}>{item.description}</p>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        className="mt-8"
                        variants={itemVariants}
                    >
                        <Link
                            to="/news"
                            className={`inline-flex items-center font-medium leading-tight group ${themeClasses.textSub}`}
                        >
                            <span className={`border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none ${themeClasses.accentHover}`}>
                                View Full News Archive
                            </span>
                            <ExternalLink size={16} className="ml-1 inline-block h-4 w-4 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
                        </Link>
                    </motion.div>
                </motion.section>
            )}

            {/* Featured Publications */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className={`sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0 ${isDark ? 'bg-slate-950/75' : 'bg-slate-50/75'}`}>
                    <h2 className={`text-sm font-bold uppercase tracking-widest lg:sr-only ${themeClasses.textSub}`}>Featured Publications</h2>
                </div>
                <motion.h2 variants={itemVariants} className={`text-3xl font-bold mb-8 hidden lg:block ${themeClasses.textHead}`}>Featured Publications</motion.h2>
                <div className="space-y-6 group/list">
                    {featuredPubs.map((pub) => (
                        <motion.div key={pub.id} variants={itemVariants}>
                            <Link
                                to={`/publications#${pub.id}`}
                                className={`block group/item relative pl-4 border-l-2 border-slate-700/30 hover:border-teal-500/50 transition-colors duration-300`}
                            >
                                <h3 className={`text-lg font-bold leading-tight mb-2 group-hover/item:text-teal-400 transition-colors ${themeClasses.textHead}`}>
                                    {pub.title}
                                </h3>

                                <div className={`text-base mb-2 leading-relaxed ${themeClasses.textMain}`}>
                                    {pub.authors.map((author: string, i: number) => {
                                        const isMe = author.includes("Mingchen Li") || author.includes("M Li") || author.includes("Ming-Chen Li");
                                        return (
                                            <span key={i} className={isMe ? `font-bold ${themeClasses.accent} relative inline-block` : ""}>
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
                                </div>

                                <div className="flex items-center gap-3 text-sm font-medium opacity-80">
                                    <span className="italic text-slate-500">{pub.venue}, {pub.year}</span>
                                    {pub.citations ? (
                                        <span className={`flex items-center gap-1 text-xs font-bold ${themeClasses.accent}`}>
                                            <span className="opacity-60">Cited by</span> {pub.citations}
                                        </span>
                                    ) : null}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                <motion.div variants={itemVariants}>
                    <Link to="/publications"
                        className={`inline-block mt-8 font-semibold ${themeClasses.accent} hover:opacity-80 flex items-center gap-2 group`}>
                        View All Publications <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </motion.section>

            {/* Awards */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.h2 variants={itemVariants} className={`text-3xl font-bold mb-8 ${themeClasses.textHead}`}>Honors & Awards</motion.h2>
                <div className="space-y-4">
                    {profile.awards.map((award, idx) => (
                        <motion.div key={idx} variants={itemVariants}>
                            <SpotlightCard isDark={isDark}>
                                <a
                                    href={award.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group/award"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className={`font-semibold text-lg group-hover/award:text-teal-300 transition-colors ${themeClasses.textSub}`}>
                                                {award.title}
                                                <ExternalLink size={14} className="ml-2 inline-block opacity-0 group-hover/award:opacity-50 transition-opacity" />
                                            </h3>
                                            <p className={`text-sm ${themeClasses.textMain} mt-1`}>{award.awarder}</p>
                                        </div>
                                        <span className={`text-xs font-mono whitespace-nowrap ${themeClasses.accent}`}>{award.date}</span>
                                    </div>
                                </a>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
};

export default HomePage;
