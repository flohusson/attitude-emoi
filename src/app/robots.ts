import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = SITE_URL;

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
