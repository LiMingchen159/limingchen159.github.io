// Data types for the website content

export interface Publication {
    id: string;
    title: string;
    authors: string[];
    coFirstAuthors?: string[];
    date: string;
    doi?: string;
    journal: string;
    journalShort?: string;
    abstract: string;
    tags: string[];
    featured: boolean;
    citations?: number;
    links: {
        pdf?: string;
        code?: string;
        dataset?: string;
        project?: string;
        slides?: string;
    };
    image?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    github?: string;
    demo?: string;
    image?: string;
}

export interface TeachingCourse {
    id: string;
    title: string;
    category: string;
    description: string;
    materials?: string[];
}

export interface BlogPost {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    tags: string[];
    image?: string;
}

export interface WorkExperience {
    position: string;
    company: string;
    companyUrl?: string;
    dateStart: string;
    dateEnd: string;
    summary: string;
}

export interface Education {
    area: string;
    institution: string;
    dateStart: string;
    dateEnd: string;
    summary: string;
}

export interface Profile {
    name: string;
    nameZh?: string;
    role: string;
    organization: string;
    organizationUrl: string;
    email: string;
    bio: string;
    interests: string[];
    education: Education[];
    work: WorkExperience[];
    social: {
        github?: string;
        linkedin?: string;
        scholar?: string;
        orcid?: string;
        wechat?: string;
    };
}
