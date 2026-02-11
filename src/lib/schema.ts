import { Article, Episode } from '@/lib/schemas';
import { getArticleUrl } from './constants';

const BASE_URL = 'https://www.attitude-emoi.fr';

export function generateArticleSchema(article: Article) {
    const articleUrl = `${BASE_URL}${getArticleUrl(article)}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.seo?.metaTitle || article.title,
        description: article.seo?.metaDescription || article.excerpt,
        image: article.coverImage ? [article.coverImage] : [],
        datePublished: article.date,
        dateModified: article.date, // Ideally this should be the actual modified date if available
        author: {
            '@type': 'Person',
            name: 'Florian Husson', // Or dynamic if multiple authors
            url: `${BASE_URL}/a-propos`
        },
        publisher: {
            '@type': 'Organization',
            name: 'Attitude Émoi',
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo-v2.svg` // Updated to correct logo file
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl
        }
    };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${BASE_URL}${item.item}`
        }))
    };
}

export function generatePodcastEpisodeSchema(episode: Episode) {
    const episodeUrl = `${BASE_URL}/podcast/${episode.slug}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'PodcastEpisode',
        name: episode.title,
        headline: episode.seo?.metaTitle || episode.title,
        description: episode.seo?.metaDescription || '', // Fallback to empty string if no meta description
        image: episode.coverImage || episode.seo?.ogImage,
        datePublished: episode.date,
        dateModified: episode.date, // Ideally actual modified date if available
        timeRequired: episode.duration ? `PT${episode.duration.replace(/:/g, 'M')}S` : undefined, // Simple duration parsing if possible, or leave undefined
        associatedMedia: {
            '@type': 'MediaObject',
            contentUrl: episode.audioUrl,
        },
        author: {
            '@type': 'Person',
            name: 'Florian Husson',
            url: `${BASE_URL}/a-propos`
        },
        partOfSeries: {
            '@type': 'PodcastSeries',
            name: 'Attitude Émoi', // Or 'Attitude Podcast' depending on branding
            url: `${BASE_URL}/podcast`
        },
        publisher: { // Added publisher for consistency
            '@type': 'Organization',
            name: 'Attitude Émoi',
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo-v2.svg`
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': episodeUrl
        }
    };
}
