import { news, type NewsItem } from './news';

export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

export interface Education {
    area: string;
    institution: string;
    dateStart: string;
    dateEnd: string;
    summary: string;
}

export interface WorkExperience {
    position: string;
    company: string;
    companyUrl?: string;
    dateStart: string;
    dateEnd: string;
    summary: string;
}

export interface Skill {
    name: string;
    percent: number;
    icon?: string;
    category?: 'tech' | 'interest';
    modelPath?: string;
}

export interface Award {
    title: string;
    awarder: string;
    date: string;
    url?: string;
    certificateUrl?: string;
}

// Re-export NewsItem type for backward compatibility
export type { NewsItem };

export const profile = {
    name: "Mingchen Li",
    nameCN: "李铭晨",
    role: "Postdoctoral Fellow",
    bio: "Mingchen Li is a Postdoctoral Fellow in Civil Engineering at Hong Kong University of Science and Technology (HKUST). His research interests include Large Language Models, Semantic Models, Building Performance Optimization, and Machine Learning. He works with Prof. Wang on semantic modeling of HVAC systems.",
    avatar: "/avatar.png",
    email: "mingchen.li@connect.ust.hk",
    github: "https://github.com/LiMingchen159",
    linkedin: "https://www.linkedin.com/in/mingchen-li-81b79028a/",
    scholar: "https://scholar.google.com/citations?hl=zh-TW&user=xpVXHpcAAAAJ",
    orcid: "https://orcid.org/0000-0002-8873-0766",
    wechat: "uploads/Wechat Code.jpg",
    location: "Hong Kong",
    university: "Hong Kong University of Science and Technology",
    researchBio: `My research focuses on developing BuildingAgent, an intelligent system that leverages Large Language Models and Semantic Model to optimize HVAC systems. By using Brick Schema and SPARQL to create Knowledge Graphs from building data, BuildingAgent enables natural language interaction with complex building systems for automated fault detection and energy optimization.

I'm particularly interested in collaborating on projects involving Smart Buildings, Digital Twins, and Machine Learning applications in the built environment. Please reach out via email or WeChat 😃`,
    buildingAgentUrl: "https://github.com/LiMingchen159/BuildingGPT",

    news: news,

    education: [
        {
            area: "PhD | Civil Engineering",
            institution: "Hong Kong University of Science and Technology",
            dateStart: "2023-09-01",
            dateEnd: "",
            summary: "BuildingGPT, a Large Language Model for Building metadata."
        },
        {
            area: "Master | Smart Building",
            institution: "Tianjin University",
            dateStart: "2020-09-01",
            dateEnd: "2023-06-30",
            summary: "GPA: 86/100 (Comprehensive ranking 1st in 2022)\n\nCourses included:\n- Machine Learning Algorithms and Applications (96/100)\n- Introduction to Intelligent Buildings (92/100)\n- Parametric modeling in design (advanced) (92/100)"
        },
        {
            area: "Bachelor | Urban underground space engineering",
            institution: "China University of Mining & Technology,Beijing",
            dateStart: "2016-09-01",
            dateEnd: "2020-06-30",
            summary: "GPA: 84/100 (Comprehensive ranking within the top 5)"
        }
    ] as Education[],

    work: [
        {
            position: "Postdoctoral Fellow",
            company: "Hong Kong University of Science and Technology",
            companyUrl: "https://hkust.edu.hk/",
            dateStart: "2026-02-01",
            dateEnd: "",
            summary: "Research on semantic modeling, large language models, and intelligent HVAC systems."
        },
        {
            position: "Visiting Scholar",
            company: "University of California, Berkeley",
            companyUrl: "https://www.berkeley.edu/",
            dateStart: "2025-08-04",
            dateEnd: "2026-01-31",
            summary: "Visiting scholar appointment focused on intelligent building technologies."
        },
        {
            position: "Python development engineer",
            company: "Beijing Glory PKPM Technology Co.,Ltd.",
            dateStart: "2020-10-01",
            dateEnd: "2022-09-30",
            summary: "Responsibilities include:\n- Independent development of \"pyp3d_tunnel\" Python library for the project;\n- The secondary development of interactable tools based on Bimbase and PYP3D libraries;\n- Followed multiple tasks to complete complex parametric modeling work;\n- Held the position of answering teacher (technical support) in several competitions;"
        },
        {
            position: "BIM Designer",
            company: "Tianjin University Research Institute of Architectural Design and Urban Planning Co.,Ltd.",
            dateStart: "2021-06-01",
            dateEnd: "2021-09-30",
            summary: "Responsibilities include:\n- Led the team to follow the project to complete the creation of architecture, structure, and comprehensive pipeline model in the BIM model;\n- Won the first prize in the domestic software group of the 2021 BIM Technology Application Innovation Labor Competition based on the project."
        }
    ] as WorkExperience[],

    skills: [
        // Technical Skills
        { name: "Python", percent: 80, category: "tech", modelPath: "/models/python_programming_language.glb" },
        { name: "R", percent: 70, category: "tech", modelPath: "rlanguage" },
        { name: "Knowledge Graph", percent: 90, category: "tech", modelPath: "knowledgegraph" },
        { name: "Building daylight simulation", percent: 80, category: "tech", modelPath: "suntoy" },
        { name: "Building energy simulation", percent: 80, category: "tech", modelPath: "lightningtoy" },
        { name: "Parametric Modeling", percent: 80, category: "tech", modelPath: "toycity" },
    ] as Skill[],

    interests: [
        // Hobbies
        { name: "Roller skating", percent: 60, category: "interest", modelPath: "Roller" },
        { name: "Games", percent: 100, category: "interest", modelPath: "/models/gamepad.glb" },
        { name: "Film", percent: 80, category: "interest", modelPath: "clapperboard" }
    ] as Skill[],

    awards: [
        {
            title: "(Optics Valley Of China. Huawei Cup) The 19th China Post-Graduate Mathematical Contest in Modeling",
            awarder: "Huawei",
            date: "2023-01-01",
            url: "https://www.huawei.com/en/"
        },
        {
            title: "The best work of the first domestic BIM application 100 universities invitations (Leader)",
            awarder: "WUHAN DESIGN",
            date: "2023-01-01",
            url: "http://www.wuhancityofdesign.com/en/",
            certificateUrl: "uploads/Catifications-Mingchen Li_页面_14.jpg"
        },
        {
            title: "2021 BIM Technology Application Innovation Labor Competition Domestic Software Group (Leader)",
            awarder: "PKPM",
            date: "2022-01-21",
            url: "https://www.pkpm.cn/"
        }
    ] as Award[]
};

export const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
    { name: 'Publications', href: '/publications' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
];
