import { MetadataRoute } from 'next';
import { getArticles, getEpisodes } from '@/lib/cms';
import { NAVIGATION_ITEMS, getArticleUrl, SITE_URL } from '@/lib/constants';

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = await getArticles();
    const episodes = await getEpisodes();

    // 1. Static Pages
    const staticRoutes = [
        '',
        '/a-propos',
        '/podcast',
        '/contact',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Categories & Sub-Categories
    const categoryRoutes: MetadataRoute.Sitemap = [];

    NAVIGATION_ITEMS.forEach(cat => {
        if (cat.href) {
            categoryRoutes.push({
                url: `${BASE_URL}${cat.href}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            });
        }

        if (cat.subItems) {
            cat.subItems.forEach(sub => {
                categoryRoutes.push({
                    url: `${BASE_URL}${sub.href}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                });
            });
        }
    });

    // 3. Articles
    const articleRoutes = articles.map((article) => ({
        url: `${BASE_URL}${getArticleUrl(article)}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // 4. Podcast Episodes
    const episodeRoutes = episodes.map((episode) => ({
        url: `${BASE_URL}/podcast/${episode.slug}`,
        lastModified: new Date(episode.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...episodeRoutes];
}
