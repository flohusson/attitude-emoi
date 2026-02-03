import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ArticleSchema, EpisodeSchema, ResourceSchema, Article, Episode, Resource } from '@/lib/schemas';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');
const EPISODES_DIR = path.join(CONTENT_DIR, 'episodes');
const RESOURCES_DIR = path.join(CONTENT_DIR, 'resources');

// Helper to ensure directories exist
const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDir(ARTICLES_DIR);
ensureDir(EPISODES_DIR);
ensureDir(RESOURCES_DIR);

export async function getResources(): Promise<Resource[]> {
    const files = fs.readdirSync(RESOURCES_DIR).filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

    const resources = files.map(file => {
        const filePath = path.join(RESOURCES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        try {
            return ResourceSchema.parse(data);
        } catch (e) {
            console.error(`Error parsing resource ${file}:`, e);
            return null;
        }
    }).filter((r): r is Resource => r !== null);

    // Sort? Maybe alphabetical or by date if added
    return resources;
}


export async function getArticles(options: { includeDrafts?: boolean } = {}): Promise<(Article & { content: string })[]> {
    const { includeDrafts = false } = options;
    const files = fs.readdirSync(ARTICLES_DIR).filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

    const articles = files.map(file => {
        const filePath = path.join(ARTICLES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        // On valide avec Zod pour s'assurer que les données sont clean, sinon on renvoie partiel ou on log l'erreur
        try {
            const parsedData = ArticleSchema.parse(data);
            return { ...parsedData, content };
        } catch (e) {
            console.error(`Error parsing article ${file}:`, e);
            return null;
        }
    })
        .filter((article): article is Article & { content: string } => article !== null)
        .filter(article => includeDrafts || article.status === 'published'); // Filter drafts if not requested

    // Sort by date desc
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function saveArticle(article: Article, content: string) {
    const filePath = path.join(ARTICLES_DIR, `${article.slug}.mdx`);
    const cleanArticle = JSON.parse(JSON.stringify(article));
    const fileContent = matter.stringify(content, cleanArticle); // Zod object to Frontmatter
    fs.writeFileSync(filePath, fileContent);
}

const TRASH_DIR = path.join(CONTENT_DIR, 'trash');
ensureDir(TRASH_DIR);

export async function softDeleteArticle(slug: string) {
    const srcPath = path.join(ARTICLES_DIR, `${slug}.mdx`);
    const destPath = path.join(TRASH_DIR, `${slug}.mdx`);
    if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
    }
}

export async function restoreArticle(slug: string) {
    const srcPath = path.join(TRASH_DIR, `${slug}.mdx`);
    const destPath = path.join(ARTICLES_DIR, `${slug}.mdx`);
    if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
    }
}

export async function permanentDeleteArticle(slug: string) {
    const filePath = path.join(TRASH_DIR, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

export async function getTrashedArticles(): Promise<Article[]> {
    if (!fs.existsSync(TRASH_DIR)) return [];

    const files = fs.readdirSync(TRASH_DIR).filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

    const articles = files.map(file => {
        const filePath = path.join(TRASH_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        try {
            return ArticleSchema.parse(data);
        } catch (e) {
            console.error(`Error parsing trashed article ${file}:`, e);
            return null;
        }
    }).filter((article): article is Article => article !== null);

    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export async function getEpisodes(): Promise<Episode[]> {
    const files = fs.readdirSync(EPISODES_DIR).filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

    const episodes = files.map(file => {
        const filePath = path.join(EPISODES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        try {
            return EpisodeSchema.parse(data);
        } catch (e) {
            console.error(`Error parsing episode ${file}:`, e);
            return null;
        }
    }).filter((ep): ep is Episode => ep !== null);

    return episodes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return episodes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getEpisodeBySlug(slug: string): Promise<(Episode & { content: string }) | null> {
    const files = fs.readdirSync(EPISODES_DIR).filter(file => file.endsWith('.mdx') || file.endsWith('.md'));
    const file = files.find(f => f.replace(/\.mdx?$/, '') === slug);

    if (!file) return null;

    const filePath = path.join(EPISODES_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    try {
        const parsedData = EpisodeSchema.parse(data);
        return { ...parsedData, content };
    } catch (e) {
        console.error(`Error parsing episode ${slug}:`, e);
        return null;
    }
}

export async function saveEpisode(episode: Episode, content: string) {
    const filePath = path.join(EPISODES_DIR, `${episode.slug}.mdx`);
    const cleanEpisode = JSON.parse(JSON.stringify(episode));
    const fileContent = matter.stringify(content, cleanEpisode);
    fs.writeFileSync(filePath, fileContent);
}

export async function deleteEpisode(slug: string) {
    const filePath = path.join(EPISODES_DIR, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
