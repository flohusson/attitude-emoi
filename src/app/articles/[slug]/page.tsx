import { getArticles } from '@/lib/cms';
import { notFound } from 'next/navigation';
import Markdown from 'markdown-to-jsx'; // We might need to install this or use a simple renderer
import Image from 'next/image';
import Link from 'next/link';

// Force static generation for performance
export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

// 1. AUTOMATIC SEO: generateMetadata grabs the data before the page loads
// 1. AUTOMATIC SEO: generateMetadata grabs the data before the page loads
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const articles = await getArticles();
    const article = articles.find((a) => a.slug === slug);

    if (!article) return {};

    return {
        title: article.seo?.metaTitle || article.title,
        description: article.seo?.metaDescription || article.excerpt,
        openGraph: {
            title: article.seo?.metaTitle || article.title,
            description: article.seo?.metaDescription || article.excerpt,
            images: article.coverImage ? [article.coverImage] : [],
            type: 'article',
            authors: ['Florian'], // Hardcoded for now
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const articles = await getArticles();
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    // 2. AUTOMATIC LAYOUT: Cover Image at Top with Overlay
    return (
        <article className="min-h-screen bg-[#FAF9F6]">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
                {article.coverImage ? (
                    <>
                        <div className="absolute inset-0 z-0">
                            {/* Note: In real app, use next/image with fill. For ext URLs, standard img is easier if domains not config via next.config */}
                            <img
                                src={article.coverImage}
                                alt={article.coverImageAlt || article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Overlay for readability */}
                        <div className="absolute inset-0 bg-black/40 z-10" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-secondary/30 z-0" />
                )}

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/90 text-primary-foreground text-sm font-bold mb-4">
                        {article.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white shadow-sm leading-tight">
                        {article.title}
                    </h1>
                    <div className="mt-6 text-white/90 font-medium">
                        Publié le {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-6 py-16">

                {/* Intro / Excerpt */}
                {article.excerpt && (
                    <div className="text-xl md:text-2xl font-serif text-gray-600 italic mb-12 border-l-4 border-primary pl-6">
                        {article.excerpt}
                    </div>
                )}

                {/* Content Body */}
                <div className="prose prose-lg prose-stone max-w-none">
                    {/* Note: We need a markdown renderer here. For now, simple whitespace preservation or basic HTML */}
                    <Markdown>{article.content}</Markdown>
                </div>

                {/* Media Gallery (Images additionnelles) */}
                {article.additionalMedia && article.additionalMedia.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Galerie & Ressources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {article.additionalMedia.map((media, idx) => (
                                <div key={idx} className="space-y-2">
                                    {media.type === 'image' && (
                                        <img
                                            src={media.url}
                                            alt={media.alt || 'Illustration'}
                                            className="rounded-xl shadow-md w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                    {/* Video placeholder logic could go here */}
                                    {media.alt && <p className="text-sm text-gray-500 text-center italic">{media.alt}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}
