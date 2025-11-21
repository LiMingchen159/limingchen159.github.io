import { profile } from '../data/profile';
import { SkillsSection } from '../components/SkillsSection';
import { Github, Linkedin, Mail, ExternalLink, GraduationCap, Briefcase, MessagesSquare, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface AboutPageProps {
    isDark: boolean;
}

export const AboutPage = ({ isDark }: AboutPageProps) => {
    const themeClasses = {
        bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
        textMain: isDark ? 'text-slate-400' : 'text-slate-600',
        textHead: isDark ? 'text-slate-100' : 'text-slate-900',
        textSub: isDark ? 'text-slate-200' : 'text-slate-800',
        accent: isDark ? 'text-teal-300' : 'text-teal-600',
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
        <div className="min-h-screen pt-32 pb-20 px-6 relative">
            {/* Holographic background grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(${isDark ? '#06b6d4' : '#0f766e'} 0.5px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="max-w-4xl mx-auto relative z-10 space-y-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h1 className={`text-4xl md:text-6xl font-bold mb-4 tracking-tight ${themeClasses.textHead}`}>
                        About Me
                    </h1>
                    <div className={`h-1 w-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${isDark ? 'from-cyan-400/0 via-cyan-400 to-cyan-400/0' : 'from-teal-400/0 via-teal-400 to-teal-400/0'}`} />
                    <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${themeClasses.textMain}`}>
                        Skills, Experience, and Ways to Connect
                    </p>
                </motion.div>

                {/* Skills & Interests */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <SkillsSection isDark={isDark} />
                </motion.section>

                {/* Experience & Education */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.h2 variants={itemVariants} className={`text-2xl font-bold mb-6 ${themeClasses.textHead}`}>Experience & Education</motion.h2>
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Education */}
                        <div className="space-y-6">
                            <motion.h3 variants={itemVariants} className={`flex items-center gap-2 text-xl font-semibold ${themeClasses.textSub}`}>
                                <GraduationCap className={themeClasses.accent} /> Education
                            </motion.h3>
                            <div className="space-y-8">
                                {profile.education.map((edu, idx) => (
                                    <motion.div key={idx} variants={itemVariants} className="relative pl-6 border-l border-slate-700/50 group">
                                        <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 transition-all duration-300 group-hover:scale-125 ${isDark ? 'border-slate-950 bg-teal-400' : 'border-slate-50 bg-teal-600'}`} />
                                        <div className={`text-sm font-medium ${themeClasses.accent}`}>{edu.dateStart} - {edu.dateEnd}</div>
                                        <div className={`font-semibold ${themeClasses.textHead}`}>{edu.institution}</div>
                                        <div className={`text-sm ${themeClasses.textSub}`}>{edu.area}</div>
                                        <div className={`mt-2 text-sm ${themeClasses.textMain}`}>{edu.summary}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Work */}
                        <div className="space-y-6">
                            <motion.h3 variants={itemVariants} className={`flex items-center gap-2 text-xl font-semibold ${themeClasses.textSub}`}>
                                <Briefcase className={themeClasses.accent} /> Work Experience
                            </motion.h3>
                            <div className="space-y-8">
                                {profile.work.map((job, idx) => (
                                    <motion.div key={idx} variants={itemVariants} className="relative pl-6 border-l border-slate-700/50 group">
                                        <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 transition-all duration-300 group-hover:scale-125 ${isDark ? 'border-slate-950 bg-blue-400' : 'border-slate-50 bg-blue-600'}`} />
                                        <div className={`text-sm font-medium ${themeClasses.accent}`}>{job.dateStart} - {job.dateEnd}</div>
                                        <div className={`font-semibold ${themeClasses.textHead}`}>{job.company}</div>
                                        <div className={`text-sm ${themeClasses.textSub}`}>{job.position}</div>
                                        <div className={`mt-2 text-sm ${themeClasses.textMain}`}>{job.summary}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Contact Info */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.h2 variants={itemVariants} className={`text-2xl font-bold mb-4 ${themeClasses.textSub}`}>Contact</motion.h2>
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail size={20} className={themeClasses.accent} />
                            <a href={`mailto:${profile.email}`} className={`${themeClasses.accent} hover:opacity-80`}>
                                {profile.email}
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Github size={20} className={themeClasses.accent} />
                            <a href={profile.github} target="_blank" rel="noopener noreferrer"
                                className={`${themeClasses.accent} hover:opacity-80 flex items-center gap-1`}>
                                GitHub <ExternalLink size={14} />
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Linkedin size={20} className={themeClasses.accent} />
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                                className={`${themeClasses.accent} hover:opacity-80 flex items-center gap-1`}>
                                LinkedIn <ExternalLink size={14} />
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <GraduationCap size={20} className={themeClasses.accent} />
                            <a href={profile.scholar} target="_blank" rel="noopener noreferrer"
                                className={`${themeClasses.accent} hover:opacity-80 flex items-center gap-1`}>
                                Google Scholar <ExternalLink size={14} />
                            </a>
                        </div>
                        {profile.orcid && (
                            <div className="flex items-center gap-3">
                                <BadgeCheck size={20} className={themeClasses.accent} />
                                <a href={profile.orcid} target="_blank" rel="noopener noreferrer"
                                    className={`${themeClasses.accent} hover:opacity-80 flex items-center gap-1`}>
                                    ORCID <ExternalLink size={14} />
                                </a>
                            </div>
                        )}
                        {profile.wechat && (
                            <div className="flex items-center gap-3">
                                <MessagesSquare size={20} className={themeClasses.accent} />
                                <a href={`/${profile.wechat}`} target="_blank" rel="noopener noreferrer"
                                    className={`${themeClasses.accent} hover:opacity-80 flex items-center gap-1`}>
                                    WeChat <ExternalLink size={14} />
                                </a>
                            </div>
                        )}
                    </motion.div>
                </motion.section>
            </div>
        </div>
    );
};
