import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Github, Linkedin, Mail, GraduationCap, MessagesSquare } from 'lucide-react';
import { profile } from './data/profile';

// Components
import { ArchitectureScene } from './components/ArchitectureScene';
import { NeuralBackground } from './components/NeuralBackground';
import { ThemeToggle } from './components/ThemeToggle';
import { Avatar } from './components/Avatar';
import { SocialLink } from './components/SocialLink';
import { Navbar } from './components/Navbar';

// Pages
import { HomePage } from './pages/HomePage';
import PublicationsPage from './pages/PublicationsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import NewsPage from './pages/NewsPage';

// ScrollToTop component to handle scroll reset on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const themeClasses = {
    bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
    textMain: isDark ? 'text-slate-400' : 'text-slate-600',
    textHead: isDark ? 'text-slate-100' : 'text-slate-900',
    textSub: isDark ? 'text-slate-200' : 'text-slate-800',
    selection: isDark ? 'selection:bg-teal-300/30 selection:text-teal-300' : 'selection:bg-teal-600/20 selection:text-teal-700',
  };

  return (
    <Router>
      <ScrollToTop />
      <div className={`min-h-screen transition-colors duration-500 font-sans ${themeClasses.bg} ${themeClasses.textMain} ${themeClasses.selection}`}>

        {/* Mouse Follower Gradient */}
        <div
          className="pointer-events-none fixed inset-0 z-30 transition duration-300"
          style={{
            background: isDark
              ? `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.25), transparent 80%)`
              : `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
          }}
        />

        <NeuralBackground isDark={isDark} />
        <Navbar isDark={isDark} />
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />

        <main className="mx-auto min-h-screen max-w-screen-xl px-6 py-6 md:px-12 md:py-20 lg:px-24 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-4">

            {/* Sidebar (Sticky) */}
            <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/3 lg:flex-col lg:justify-between lg:py-24 z-40">
              <div>
                {/* Mobile Header Layout: Flex Row for Avatar/Info + 3D Model */}
                <div className="flex flex-row items-center justify-between md:block">

                  {/* Left Side on Mobile: Avatar + Info */}
                  <div className="flex-1 md:w-full">
                    {/* Identity */}
                    <Avatar src={profile.avatar} isDark={isDark} />

                    <h1 className={`text-3xl font-bold tracking-tight sm:text-5xl transition-colors duration-300 ${themeClasses.textHead}`}>
                      {profile.name}
                    </h1>
                    {/* Chinese Name */}
                    {profile.nameCN && (
                      <h1 className={`text-xl font-bold tracking-tight sm:text-2xl mt-1 transition-colors duration-300 ${themeClasses.textHead}`}>
                        {profile.nameCN}
                      </h1>
                    )}
                    <h2 className={`mt-1 md:mt-3 text-lg font-medium tracking-tight sm:text-xl transition-colors duration-300 ${themeClasses.textSub}`}>
                      {profile.role}
                    </h2>
                  </div>

                  {/* Right Side on Mobile: 3D Model */}
                  {/* 3D Canvas Container - Pointer events disabled on mobile to prevent scroll blocking */}
                  <div className="relative h-32 w-32 md:h-64 md:w-full md:-ml-4 mb-0 md:mb-6 select-none md:cursor-grab md:active:cursor-grabbing z-50 pointer-events-none md:pointer-events-auto">
                    <ArchitectureScene isDark={isDark} />
                  </div>
                </div>

                <div className="mt-4 md:mt-8 flex items-center gap-5">
                  <SocialLink icon={<Github size={20} />} href={profile.github} label="GitHub" isDark={isDark} />
                  <SocialLink icon={<Linkedin size={20} />} href={profile.linkedin} label="LinkedIn" isDark={isDark} />
                  <SocialLink icon={<GraduationCap size={20} />} href={profile.scholar} label="Google Scholar" isDark={isDark} />
                  <SocialLink icon={<Mail size={20} />} href={`mailto:${profile.email}`} label="Email" isDark={isDark} />
                  <SocialLink icon={<MessagesSquare size={20} />} href={profile.wechat} label="WeChat" isDark={isDark} />
                </div>
              </div>

              <div className="hidden lg:block mt-10 text-xs opacity-70">
                <p>Built with React & Three.js.</p>
              </div>
            </header>

            {/* Main Content Area */}
            <div className="pt-8 lg:w-3/5 lg:py-24 z-40">
              <Routes>
                <Route path="/" element={<HomePage isDark={isDark} />} />
                <Route path="/news" element={<NewsPage isDark={isDark} />} />
                <Route path="/publications" element={<PublicationsPage isDark={isDark} />} />
                <Route path="/projects" element={<ProjectsPage isDark={isDark} />} />
                <Route path="/about" element={<AboutPage isDark={isDark} />} />
              </Routes>

              <footer className="py-6 text-sm opacity-60 lg:hidden">
                <p>Built with React & Tailwind.</p>
              </footer>
            </div>

          </div>
        </main>
      </div>
    </Router>
  );
}
