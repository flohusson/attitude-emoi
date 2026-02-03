import { Article } from '@/lib/schemas';
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
                url: `${BASE_URL}/images/logo.png` // Ensure this path is correct or generic
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
