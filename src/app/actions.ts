'use server';

import { redirect } from 'next/navigation';
import { determineCategories } from '@/lib/categorization';
import { revalidatePath } from 'next/cache';
import { saveArticle, getArticles, softDeleteArticle, restoreArticle, permanentDeleteArticle, saveEpisode, deleteEpisode, getEpisodes, getEpisodeBySlug } from '@/lib/cms';
import { ArticleSchema, EpisodeSchema } from '@/lib/schemas';
import { z } from 'zod';

import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';

// Helper: Upload File
async function uploadFile(file: File | null): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return `/uploads/${filename}`;
}

export async function createArticleAction(formData: FormData) {
    // 1. Gestion des uploads
    const coverImageFile = formData.get('coverImageFile') as File;
    const coverImageUrl = formData.get('coverImage') as string;

    // Priorité à l'upload, sinon l'URL
    const finalCoverImage = (await uploadFile(coverImageFile)) || coverImageUrl;

    // Gestion des médias additionnels
    const additionalMedia = [];
    for (let i = 1; i <= 3; i++) {
        const file = formData.get(`mediaFile${i}`) as File;
        const url = formData.get(`mediaUrl${i}`) as string;
        const alt = formData.get(`mediaAlt${i}`) as string;
        const caption = formData.get(`mediaCaption${i}`) as string;

        const finalUrl = (await uploadFile(file)) || url;

        if (finalUrl) {
            additionalMedia.push({
                url: finalUrl,
                alt: alt || '',
                caption: caption || '',
                type: 'image' as const
            });
        }
    }

    // 2. Extraire les données du formData
    // Parse imagePrompts from JSON string
    let imagePrompts = [];
    try {
        const imagePromptsStr = formData.get('imagePrompts') as string;
        if (imagePromptsStr) {
            imagePrompts = JSON.parse(imagePromptsStr);
        }
    } catch (e) {
        console.error('Failed to parse imagePrompts:', e);
    }

    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        category: formData.get('category'),
        subCategory: formData.get('subCategory'),
        coverImage: finalCoverImage,
        coverImageAlt: formData.get('coverImageAlt'),
        additionalMedia: additionalMedia,
        content: formData.get('content'),
        imagePrompts: imagePrompts,
        seo: {
            metaTitle: formData.get('metaTitle') || undefined,
            metaDescription: formData.get('metaDescription') || undefined,
            mainKeyword: formData.get('mainKeyword') || undefined,
            keywords: formData.getAll('seoKeywords') as string[] || [],
        },
        // Date : On garde l'existante si fournie (cas update), sinon nouvelle (cas create)
        date: (formData.get('date') as string) || new Date().toISOString(),
        relatedArticles: formData.getAll('relatedArticles') as string[],
        status: (formData.get('status') as 'draft' | 'published') || 'published',
    };

    // 3. Validation Zod (partielle pour l'instant, on affine)
    // On doit séparer le contenu (body) des métadonnées (frontmatter)
    const validationResult = ArticleSchema.safeParse({
        ...rawData,
        tags: formData.getAll('tags') as string[] || [],
        featured: false,
    });

    if (!validationResult.success) {
        console.error("Validation Error:", validationResult.error);
        // Dans une vraie app, on renverrait les erreurs au client
        throw new Error("Données invalides. Vérifiez que tous les champs sont remplis.");
    }

    const articleData = validationResult.data;
    const content = rawData.content as string || '';

    // 4. Sauvegarde via le CMS
    try {
        await saveArticle(articleData, content);

        // Gestion du renommage : Si le slug a changé, on supprime l'ancien fichier
        const originalSlug = formData.get('originalSlug') as string;
        if (originalSlug && originalSlug !== articleData.slug) {
            console.log(`Renaming detected: ${originalSlug} -> ${articleData.slug}`);
            await softDeleteArticle(originalSlug);
        }

    } catch (error) {
        console.error("Save Error:", error);
        throw new Error("Erreur lors de la sauvegarde du fichier.");
    }

    // 5. Redirection vers le dashboard
    redirect('/admin');
}

export async function deleteArticleAction(formData: FormData) {
    const slug = formData.get('slug') as string;
    if (slug) {
        await softDeleteArticle(slug);
        redirect('/admin');
    }
}

export async function restoreArticleAction(formData: FormData) {
    const slug = formData.get('slug') as string;
    if (slug) {
        await restoreArticle(slug);
        redirect('/admin/trash');
    }
}


export async function permanentDeleteArticleAction(formData: FormData) {
    const slug = formData.get('slug') as string;
    if (slug) {
        await permanentDeleteArticle(slug);
        redirect('/admin/trash');
    }
}

// --- PODCAST ACTIONS ---

export async function saveEpisodeAction(formData: FormData) {
    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        type: formData.get('type'),
        categories: JSON.parse((formData.get('categories') as string) || '[]'),
        coverImage: formData.get('coverImage'),
        // episodeNumber removed from form, will default to 0 via Schema
        duration: formData.get('duration'),
        audioUrl: formData.get('audioUrl'),
        platformLinks: {
            spotify: formData.get('spotify') || undefined,
            apple: formData.get('apple') || undefined,
            deezer: formData.get('deezer') || undefined,
        },
        guests: formData.getAll('guests'),
        seo: {
            metaTitle: formData.get('metaTitle') || undefined,
            metaDescription: formData.get('metaDescription') || undefined,
        },
        date: (formData.get('date') as string) || new Date().toISOString(),
    };

    const validationResult = EpisodeSchema.safeParse(rawData);

    if (!validationResult.success) {
        console.error("Episode Validation Error:", validationResult.error);
        throw new Error("Données invalides.");
    }

    const episodeData = validationResult.data;
    const content = formData.get('content') as string || '';
    const returnUrl = (formData.get('returnUrl') as string) || '/admin/episodes';

    try {
        await saveEpisode(episodeData, content);
    } catch (e) {
        console.error("Save Episode Error", e);
        throw new Error("Erreur sauvegarde épisode");
    }

    redirect(returnUrl);
}

export async function deleteEpisodeAction(formData: FormData) {
    const slug = formData.get('slug') as string;
    if (slug) {
        await deleteEpisode(slug);
        redirect('/admin/episodes');
    }
}

export async function updateEpisodeTypeAction(slug: string, newType: 'podcast' | 'discute') {
    if (!slug || !newType) return;

    // 1. Fetch existing episode
    const episodes = await getEpisodes();
    const episode = episodes.find(e => e.slug === slug);

    if (!episode) throw new Error("Episode non trouvé");

    // 2. Update type and cover image
    episode.type = newType;
    if (newType === 'discute') {
        episode.coverImage = '/images/covers/attitude-discute.jpg';
    } else {
        episode.coverImage = '/images/covers/attitude-podcast.jpg';
    }

    // 3. Save
    // We need to fetch content to save fully, getting content by slug
    const episodeWithContent = await getEpisodeBySlug(slug);
    if (episodeWithContent) {
        await saveEpisode(episode, episodeWithContent.content);
    }

    // 4. Revalidate
    revalidatePath('/admin/episodes');
}

// Helper: Parse XML String to Episodes
function parseRSSEpisodes(xmlText: string) {
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    const episodes = [];

    while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemContent = match[1];

        const getTagValue = (tag: string) => {
            const regex = new RegExp(`<${tag}.*?>([\\s\\S]*?)<\/${tag}>`, 'i');
            const m = itemContent.match(regex);
            return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
        };

        const getEnclosureUrl = () => {
            const regex = /<enclosure.*?url="([^"]+)".*?>/i;
            const m = itemContent.match(regex);
            return m ? m[1] : '';
        };

        const title = getTagValue('title');
        const audioUrl = getEnclosureUrl();
        const pubDate = getTagValue('pubDate');
        const description = getTagValue('description'); // Often short
        const contentEncoded = getTagValue('content:encoded'); // Often full HTML
        const duration = getTagValue('itunes:duration');

        // Generate Slug
        const slug = title
            .toLowerCase()
            .normalize('NFD') // Split accented characters
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w-]+/g, '') // Remove all non-word chars
            .replace(/--+/g, '-') // Replace multiple - with single -
            .trim();

        // Detect Type: Look in Description or Content
        const textToSearch = (description + " " + contentEncoded).toLowerCase();
        const isDiscute = textToSearch.includes("discute") || textToSearch.includes("attitude discute");
        const type = isDiscute ? 'discute' : 'podcast';

        if (title && audioUrl) {
            episodes.push({
                title,
                slug,
                type,
                audioUrl,
                date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                duration: duration || '',
                episodeNumber: 0,
                guests: [],
                categories: determineCategories(title, description || contentEncoded), // Auto-detect multiple
                content: contentEncoded || description || '',
                seo: {
                    metaTitle: title.substring(0, 60),
                    metaDescription: (description || '').replace(/<[^>]*>?/gm, '').substring(0, 160)
                }
            });
        }
    }
    return episodes;
}

// Common Save Logic
async function saveImportedEpisodes(episodes: any[]) {
    let importCount = 0;
    for (const ep of episodes) {
        const parseResult = EpisodeSchema.safeParse(ep);
        if (parseResult.success) {
            await saveEpisode(parseResult.data, ep.content);
            importCount++;
        } else {
            console.warn(`Skipping episode ${ep.title}:`, parseResult.error);
        }
    }
    return importCount;
}

export async function importEpisodesFromRSSAction(formData: FormData) {
    const rssUrl = formData.get('rssUrl') as string;
    if (!rssUrl) throw new Error("URL RSS manquante");

    try {
        const response = await fetch(rssUrl);
        const xmlText = await response.text();
        const episodes = parseRSSEpisodes(xmlText);

        console.log(`Found ${episodes.length} episodes in RSS.`);
        const count = await saveImportedEpisodes(episodes);
        console.log(`Imported ${count} episodes.`);

    } catch (e) {
        console.error("RSS Import Error:", e);
        throw new Error("Erreur lors de l'import RSS");
    }

    redirect('/admin/episodes');
}

export async function importEpisodesFromXMLStringAction(formData: FormData) {
    const xmlContent = formData.get('xmlContent') as string;
    if (!xmlContent) throw new Error("Contenu XML manquant");

    // Check for common error: pasting HTML instead of XML
    if (xmlContent.trim().toLowerCase().startsWith("<!doctype html") || xmlContent.includes("<html")) {
        throw new Error("Erreur: Vous avez collé le code HTML de la page, pas le code XML. Faites Clic Droit > 'Afficher le code source' sur la page RSS avant de copier.");
    }

    console.log("XML Content Preview:", xmlContent.substring(0, 100)); // DEBUG

    console.log("XML Content Preview:", xmlContent.substring(0, 500)); // DEBUG: Check what user is pasting


    try {
        const episodes = parseRSSEpisodes(xmlContent);
        console.log(`Found ${episodes.length} episodes in XML Paste.`);
        const count = await saveImportedEpisodes(episodes);
        console.log(`Imported ${count} episodes.`);
    } catch (e) {
        console.error("XML Import Error:", e);
        throw new Error("Erreur lors de l'import XML");
    }

    redirect('/admin/episodes');
}
