import { getArticles } from '@/lib/cms';
import { notFound } from 'next/navigation';
import Markdown from 'markdown-to-jsx';
import { NAVIGATION_ITEMS, getArticleUrl } from '@/lib/constants';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/schema';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/mdx/Button';
import InlineMedia from '@/components/mdx/InlineMedia';
import Accordion, { AccordionItem } from '@/components/mdx/Accordion';
import AuthorBio from '@/components/AuthorBio';
import Breadcrumb from '@/components/Breadcrumb';

// We need to generate static params for all possible valid category/subcategory/slug combinations
export async function generateStaticParams() {
    const articles = await getArticles();
    const params = [];

    for (const article of articles) {
        // Find category
        const categoryItem = NAVIGATION_ITEMS.find(item => item.label === article.category);
        if (!categoryItem || !categoryItem.slug) continue;

        const categorySlug = categoryItem.slug;
        let subCategorySlug = 'general'; // Default or handle "no subcategory" scenarios differently

        // Find subcategory if exists
        if (article.subCategory && categoryItem.subItems) {
            const subItem = categoryItem.subItems.find(sub => sub.label === article.subCategory);
            if (subItem) {
                const parts = subItem.href.split('/');
                subCategorySlug = parts[parts.length - 1];

                params.push({
                    category: categorySlug,
                    subcategory: subCategorySlug,
                    slug: article.slug,
                });
            }
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string, subcategory: string, slug: string }> }) {
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
        },
        alternates: {
            canonical: getArticleUrl(article),
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string, subcategory: string, slug: string }> }) {
    const { category, subcategory, slug } = await params;

    // 1. Fetch Article
    const articles = await getArticles();
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    // Process Content
    let processedContent = article.content;

    // 1. Buttons: [button link="..."]...[/button] -> <Button href="...">...</Button>
    // 1. Buttons: [button link="..."]...[/button] -> <Button href="...">...</Button>
    processedContent = processedContent.replace(/\\?\[button link="([^"]+)"\\?\](.*?)\\?\[\/button\\?\]/g, '<Button href="$1">$2</Button>');

    // 2. Inline Media: [media index="1"] -> <InlineMedia src="..." alt="..." />
    processedContent = processedContent.replace(/\\?\[media index="(\d+)"\\?\]/g, (match, index) => {
        const i = parseInt(index, 10);
        const media = article.additionalMedia?.[i - 1]; // index 1-based
        if (media) {
            return `<InlineMedia src="${media.url}" alt="${media.alt || ''}" caption="${media.caption || ''}" />`;
        }
        return ''; // Remove shortcode if media not found
    });
    // 3. Accordion: Handle HTML-wrapped accordion shortcodes
    // Remove problematic HTML wrapping around accordion tags
    processedContent = processedContent.replace(/\<h3[^>]*\>\s*\<br\>\s*\[accordion/gi, '[accordion');
    processedContent = processedContent.replace(/\<h3[^>]*\>\s*\[accordion/gi, '[accordion');
    processedContent = processedContent.replace(/\[\/accordion\]\s*\<br\>\s*\<\/h3\>/gi, '[/accordion]');
    processedContent = processedContent.replace(/\[\/accordion\]\s*\<\/h3\>/gi, '[/accordion]');

    // Remove <br> tags inside accordion content
    processedContent = processedContent.replace(/\[accordion([^>]+)\]\s*\<br\>/gi, '[accordion$1]');
    processedContent = processedContent.replace(/\<br\>\s*\[\/accordion\]/gi, '[/accordion]');

    // Remove ### markdown prefix if any
    processedContent = processedContent.replace(/###\s*\[accordion/g, '[accordion');

    // Convert [accordion title="Question"]Answer[/accordion] -> <AccordionItem title="Question">Answer</AccordionItem>
    processedContent = processedContent.replace(/\[accordion\s+title="([^"]+)"\]\s*([\s\S]*?)\s*\[\/accordion\]/gi, (match, title, content) => {
        // Clean up content: remove extra HTML formatting
        let cleanContent = content.trim();
        // Remove wrapping span with font-size if present
        cleanContent = cleanContent.replace(/^\s*<span[^>]*>(.*?)<\/span>\s*$/gi, '$1');
        return `<AccordionItem title="${title}">${cleanContent}</AccordionItem>`;
    });


    // JSON-LD Generation
    const articleSchema = generateArticleSchema(article);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Accueil', item: '/' },
        { name: article.category, item: `/${category}` }, // Assuming category is the label, but we use the slug for URL
        { name: article.subCategory || subcategory, item: `/${category}/${subcategory}` },
        { name: article.title, item: getArticleUrl(article) }
    ]);

    return (
        <article className="min-h-screen bg-[#FAF9F6]">
            {/* JSON-LD Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <Breadcrumb items={[
                    { name: article.category, href: `/${category}` },
                    { name: article.subCategory || subcategory, href: `/${category}/${subcategory}` },
                    { name: article.title, href: getArticleUrl(article) }
                ]} />
            </div>

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
                {article.coverImage ? (
                    <>
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={article.coverImage}
                                alt={article.coverImageAlt || article.title}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/40 z-10" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-secondary/30 z-0" />
                )}

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <div className="flex justify-center gap-2 mb-4">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/90 text-primary-foreground text-sm font-bold">
                            {article.category}
                        </span>
                        {article.subCategory && (
                            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white backdrop-blur-sm text-sm font-medium">
                                {article.subCategory}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md leading-tight">
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

                {/* Author Bio */}
                <AuthorBio />


                {/* Content Body */}
                <div className="prose prose-lg prose-stone max-w-none">
                    <Markdown
                        options={{
                            forceBlock: true,
                            overrides: {
                                Button: {
                                    component: Button,
                                },
                                InlineMedia: {
                                    component: InlineMedia,
                                },
                                Accordion: {
                                    component: Accordion,
                                },
                                AccordionItem: {
                                    component: AccordionItem,
                                },
                                img: {
                                    component: (props: any) => (
                                        <span className="w-full inline-flex justify-center mt-2 mb-8 leading-none">
                                            <img {...props} className="w-auto h-auto max-h-[500px] object-cover !border-none !bg-transparent !p-0 !m-0 !rounded-xl drop-shadow-md" />
                                        </span>
                                    )
                                },
                            },
                        }}
                    >
                        {processedContent}
                    </Markdown>
                </div>

                {/* Related Articles */}
                <div className="mt-20 pt-16 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Dans la même thématique</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(article.relatedArticles && article.relatedArticles.length > 0
                            ? articles.filter(a => article.relatedArticles?.includes(a.slug))
                            : articles.filter(a => a.slug !== article.slug).slice(0, 3)
                        ).map((related) => (
                            <Link
                                key={related.slug}
                                href={getArticleUrl(related)}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    {related.coverImage ? (
                                        <Image
                                            src={related.coverImage}
                                            alt={related.coverImageAlt || related.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary">
                                            <span className="text-4xl">✨</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                        {related.category}
                                    </span>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                        {related.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                        {related.excerpt}
                                    </p>
                                    <span className="text-xs font-medium text-gray-400">
                                        Lire l'article →
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {(article.relatedArticles && article.relatedArticles.length > 0
                            ? articles.filter(a => article.relatedArticles?.includes(a.slug)).length === 0
                            : articles.filter(a => a.slug !== article.slug).length === 0
                        ) && (
                                <div className="col-span-full py-8 text-center text-gray-500 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    D'autres articles arrivent bientôt... 🌱
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </article>
    );
}
