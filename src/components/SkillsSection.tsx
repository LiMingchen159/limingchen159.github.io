import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { Skill3D } from './Skill3D';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SkillsSectionProps {
    isDark: boolean;
}

export const SkillsSection = ({ isDark }: SkillsSectionProps) => {
    const [activeTab, setActiveTab] = useState<'tech' | 'interest'>('tech');
    const [currentIndex, setCurrentIndex] = useState(0);

    const skills = profile.skills || [];
    const interests = profile.interests || [];

    const currentItems = activeTab === 'tech' ? skills : interests;
    const currentItem = currentItems[currentIndex];

    const nextItem = () => {
        setCurrentIndex((prev) => (prev + 1) % currentItems.length);
    };

    const prevItem = () => {
        setCurrentIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length);
    };

    const themeClasses = {
        textHead: isDark ? 'text-slate-100' : 'text-slate-900',
        textSub: isDark ? 'text-slate-200' : 'text-slate-800',
        accent: isDark ? 'text-teal-300' : 'text-teal-600',
        accentBg: isDark ? 'bg-teal-500/20' : 'bg-teal-600/20',
        buttonBg: isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100',
    };

    return (
        <section className="py-12 relative">
            <div className="flex justify-center gap-8 mb-12">
                <button
                    onClick={() => { setActiveTab('tech'); setCurrentIndex(0); }}
                    className={`text-xl font-bold px-6 py-2 rounded-full transition-all ${activeTab === 'tech'
                        ? `${themeClasses.accentBg} ${themeClasses.accent}`
                        : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    Skills
                </button>
                <button
                    onClick={() => { setActiveTab('interest'); setCurrentIndex(0); }}
                    className={`text-xl font-bold px-6 py-2 rounded-full transition-all ${activeTab === 'interest'
                        ? `${themeClasses.accentBg} ${themeClasses.accent}`
                        : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    Interests
                </button>
            </div>

            <div className="relative h-[400px] w-full max-w-4xl mx-auto">
                {/* Navigation Buttons */}
                <button
                    onClick={prevItem}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all ${themeClasses.buttonBg}`}
                >
                    <ChevronLeft size={24} className={themeClasses.textHead} />
                </button>

                <button
                    onClick={nextItem}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all ${themeClasses.buttonBg}`}
                >
                    <ChevronRight size={24} className={themeClasses.textHead} />
                </button>

                {/* 3D Canvas */}
                <div className="h-full w-full rounded-2xl overflow-hidden bg-gradient-to-b from-transparent to-slate-900/10">
                    <Canvas shadows dpr={[1, 2]}>
                        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
                        <ambientLight intensity={0.5} />
                        <Environment preset="city" />

                        <Suspense fallback={null}>
                            <Skill3D
                                key={`${activeTab}-${currentIndex}`} // Force re-render on change for simple transition
                                modelPath={currentItem?.modelPath || '/models/gamepad.glb'}
                                isActive={true}
                                color={isDark ? "#2dd4bf" : "#0d9488"}
                            />
                        </Suspense>

                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            minPolarAngle={Math.PI / 4}
                            maxPolarAngle={Math.PI / 2}
                        />
                    </Canvas>
                </div>

                {/* Item Info Overlay */}
                <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                    <motion.div
                        key={`${activeTab}-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="inline-block px-6 py-3 rounded-xl backdrop-blur-md bg-slate-900/60 border border-slate-700/50"
                    >
                        <h3 className={`text-2xl font-bold ${themeClasses.textHead}`}>{currentItem?.name}</h3>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
