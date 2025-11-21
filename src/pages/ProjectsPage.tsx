import { projects } from '../data/projects';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectsPageProps {
    isDark: boolean;
}

export const ProjectsPage = ({ isDark }: ProjectsPageProps) => {
    const themeClasses = {
        bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
        textMain: isDark ? 'text-slate-400' : 'text-slate-600',
        textHead: isDark ? 'text-slate-100' : 'text-slate-900',
        textSub: isDark ? 'text-slate-200' : 'text-slate-800',
        accent: isDark ? 'text-teal-300' : 'text-teal-600',
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className={`text-4xl font-bold mb-8 ${themeClasses.textHead}`}>Projects</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className={`p-6 rounded-xl border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                            }`}>
                            <h3 className={`text-xl font-semibold mb-3 ${themeClasses.textSub}`}>{project.title}</h3>
                            <p className={`mb-4 ${themeClasses.textMain}`}>{project.description}</p>

                            <div className="flex gap-2 mb-4 flex-wrap">
                                {project.tags.map(tag => (
                                    <span key={tag} className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                                        className={`flex items-center gap-1 text-sm ${themeClasses.accent} hover:opacity-80`}>
                                        <Github size={16} /> GitHub
                                    </a>
                                )}
                                {project.demo && (
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                                        className={`flex items-center gap-1 text-sm ${themeClasses.accent} hover:opacity-80`}>
                                        <ExternalLink size={16} /> Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
