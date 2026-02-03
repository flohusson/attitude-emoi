export interface KeywordData {
    volume: number;
    kd: number;
    intent: string;
}

import dictionary from '@/data/seo-dictionary.json';

export interface KeywordData {
    volume: number;
    kd: number;
    intent: string;
}

// Export the JSON as the typed Record to keep compatibility
export const SEO_DATA: Record<string, KeywordData> = dictionary as Record<string, KeywordData>;
