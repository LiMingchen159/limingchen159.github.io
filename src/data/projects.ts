import type { Project } from './types';

export const projects: Project[] = [
    {
        id: 'hkust-meter-brick',
        title: 'HKUST_Meter_Brick',
        description: 'Campus-level smart meter database with Brick schema integration for building energy research.',
        tags: ['Brick Schema', 'Smart Meter', 'Energy Data', 'Python'],
        github: 'https://github.com/LiMingchen159/HKUST_Meter_Brick'
    },
    {
        id: 'py-brickschema',
        title: 'py-brickschema',
        description: 'Python library for working with Brick schema building metadata and semantic models.',
        tags: ['Python', 'Brick Schema', 'Semantic Model', 'Library'],
        github: 'https://github.com/LiMingchen159/py-brickschema'
    },
    {
        id: 'mep2bim',
        title: 'MEP2BIM',
        description: 'Tools and workflows for converting MEP (Mechanical, Electrical, Plumbing) data to Building Information Modeling format.',
        tags: ['BIM', 'MEP', 'Python', 'Automation'],
        github: 'https://github.com/LiMingchen159/MEP2BIM'
    }
];

export const getProjectById = (id: string) => projects.find(p => p.id === id);
