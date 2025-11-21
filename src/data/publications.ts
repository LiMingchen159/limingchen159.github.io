import publicationsData from './publications.json';

export interface Publication {
    id: string;
    title: string;
    authors: string[];
    venue: string;
    year: number;
    month?: string;
    abstract?: string;
    tags?: string[];
    citations?: number;
    featured?: boolean;
    doi?: string;
    links: {
        pdf?: string;
        code?: string;
        project?: string;
        video?: string;
    };
    image?: string;
    author_status?: 'first' | 'corresponding' | 'co-first' | 'other';
}

export const publications: Publication[] = publicationsData as Publication[];

export const getFeaturedPublications = () => publications.filter(p => p.featured);
export const getRecentPublications = () => publications.sort((a, b) => b.year - a.year);
export const getPublicationsByYear = (year: number) => publications.filter(p => p.year === year);
export const getPublicationById = (id: string) => publications.find(p => p.id === id);
