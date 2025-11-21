import type { Project } from './types';

export const projects: Project[] = [
    {
        id: 'mep2bim',
        title: 'MEP2BIM',
        description: 'An automated framework for converting MEP (Mechanical, Electrical, Plumbing) drawings into BIM models, significantly reducing manual modeling effort.',
        tags: ['BIM', 'Automation', 'Python', 'Deep Learning'],
        github: 'https://github.com/LiMingchen159/MEP2BIM',
        color: 'from-blue-400 to-indigo-500',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2072&auto=format&fit=crop' // Architecture/Blueprint vibe
    },
    {
        id: 'building-agent',
        title: 'BuildingAgent',
        description: 'A multi-agent system designed for the built environment, capable of autonomous decision-making and optimization for building operations.',
        tags: ['LLM', 'Agents', 'Building Control', 'AI'],
        demo: 'https://www.youtube.com/watch?v=3gPiw9CcoHs&t=1s',
        color: 'from-rose-500 to-orange-500',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop' // Tech/AI vibe
    },
    {
        id: 'hhw-brick',
        title: 'HHW Brick',
        description: 'A comprehensive toolkit for analyzing heating hot water systems using Brick Schema, featuring CSV-to-Brick conversion and portable analytics.',
        tags: ['Brick Schema', 'Semantic Web', 'HVAC', 'Analytics'],
        github: 'https://github.com/CenterForTheBuiltEnvironment/HHW_brick',
        color: 'from-emerald-400 to-cyan-500',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=2070&auto=format&fit=crop' // Industrial/Pipes vibe
    },
    {
        id: 'hkust-meter-brick',
        title: 'HKUST Smart Meter Dataset',
        description: 'A large-scale campus smart meter dataset integrated with Brick Schema, enabling advanced energy analytics and benchmarking.',
        tags: ['Dataset', 'Smart Meter', 'Brick Schema', 'Energy'],
        github: 'https://github.com/LiMingchen159/HKUST_Meter_Brick',
        color: 'from-violet-500 to-purple-500',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' // Data/Dashboard vibe
    },
    {
        id: 'parametric-design',
        title: 'Parametric Design',
        description: 'Passive generation and optimization of building forms using parametric design tools to enhance energy efficiency and environmental performance.',
        tags: ['Parametric Design', 'Generative Design', 'Energy Efficiency', 'Optimization'],
        color: 'from-amber-400 to-yellow-600',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' // Modern Architecture vibe
    }
];

export const getProjectById = (id: string) => projects.find(p => p.id === id);
