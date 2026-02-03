import { z } from 'zod';

// Schema SEO partagé pour tous les contenus
export const SeoSchema = z.object({
    metaTitle: z.string().max(60, "Le titre meta ne doit pas dépasser 60 caractères").optional(),
    metaDescription: z.string().max(160, "La description meta ne doit pas dépasser 160 caractères").optional(),
    mainKeyword: z.string().optional(), // Mot-clé principal pour le suivi SEO
    keywords: z.array(z.string()).optional(), // Mots-clés secondaires (ou tags SEO)
    ogImage: z.string().optional(), // Image pour le partage social
});

// Schema pour les Prompts d'Images (générés par l'IA)
export const ImagePromptSchema = z.object({
    type: z.enum(['cover', 'section']).default('section'),
    position: z.string().default('auto'),
    sectionTitle: z.string().optional(),
    prompt: z.string().default('Abstract illustration in warm tones'),
    altText: z.string().default('Illustration pour article Attitude Émoi'),
    aspectRatio: z.enum(['16:9', '1:1', '4:3']).default('16:9')
});

// Schema pour les Articles de Blog
export const ArticleSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    slug: z.string().min(1, "Le slug est requis").regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
    date: z.string().datetime(), // Date de publication ISO
    updatedAt: z.string().datetime().optional(),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(), // Optimisation SEO pour l'image
    additionalMedia: z.array(z.object({
        url: z.string(), // URLs absolues ou relatives (uploads)
        alt: z.string().optional(),
        caption: z.string().optional(),
        type: z.enum(['image', 'video']).default('image')
    })).default([]),
    category: z.string(), // Allowing string to accommodate the fuller labels from constants
    subCategory: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).optional(), // Slugs of related articles
    featured: z.boolean().default(false),
    seo: SeoSchema.optional(),
    imagePrompts: z.array(ImagePromptSchema).optional(), // Prompts d'images générés par l'IA
    status: z.enum(['draft', 'published']).default('published'),
});

// Schema pour les Épisodes de Podcast
export const EpisodeSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    slug: z.string().min(1, "Le slug est requis"),
    type: z.enum(['podcast', 'discute']).default('podcast'),
    categories: z.array(z.string()).default([]), // Multi-category support
    episodeNumber: z.number().int().default(0),
    date: z.string().datetime(),
    duration: z.string().optional(), // ex: "45:30"
    audioUrl: z.string().url("L'URL audio doit être valide"),
    coverImage: z.string().optional(),
    platformLinks: z.object({
        spotify: z.string().url().optional(),
        apple: z.string().url().optional(),
        deezer: z.string().url().optional(),
    }).optional(),
    guests: z.array(z.string()).default([]),
    seo: SeoSchema.optional(),
});

// Schema pour les Ressources (Sensibliothèque)
export const ResourceSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    author: z.string().min(1, "L'auteur est requis"),
    type: z.enum(['Livre', 'Vidéo', 'Podcast', 'Documentaire', 'Autre']),
    url: z.string().url("Le lien doit être valide"),
    coverImage: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
});

export type Article = z.infer<typeof ArticleSchema>;
export type ImagePrompt = z.infer<typeof ImagePromptSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
