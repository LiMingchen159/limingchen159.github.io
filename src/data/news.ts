import newsData from './news.json';

// News Item Type Definition
export interface NewsItem {
    date: string;       // Format: "YYYY-MM" or "YYYY-MM-DD"
    title: string;
    description?: string;
    link?: string;
    related_paper_id?: string | null;
    category?: 'publication' | 'career';
}

// News Data - Single Source of Truth
// To add a new news item, simply add an entry here with date, title, and optional description/link
export const news: NewsItem[] = newsData as NewsItem[];


// Export sorted news (most recent first) - will be automatically sorted by date
export const sortedNews = [...news].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
});
