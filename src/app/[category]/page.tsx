import { getArticles } from "@/lib/cms";
import { NAVIGATION_ITEMS, getArticleUrl } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";

import { generateBreadcrumbSchema } from "@/lib/schema";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const categorySlug = category;
    const categoryData = NAVIGATION_ITEMS.find(item => item.slug === categorySlug);

    if (!categoryData) {
        return {
            title: "Catégorie Introuvable - Attitude Émoi",
        };
    }

    return {
        title: `${categoryData.label} - Attitude Émoi`,
        description: `Explorez nos articles et ressources sur le thème : ${categoryData.label}.`,
        alternates: {
            canonical: `/${categorySlug}`,
        },
    };
}

// Generate static params for all categories defined in constants
export function generateStaticParams() {
    return NAVIGATION_ITEMS.filter(item => item.slug).map((item) => ({
        category: item.slug,
    }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const categorySlug = category;
    const categoryData = NAVIGATION_ITEMS.find(item => item.slug === categorySlug);

    if (!categoryData) {
        notFound();
    }

    const allArticles = await getArticles();

    // Filter articles by the main category label (matching the saved string in CMS)
    const categoryArticles = allArticles.filter(article => article.category === categoryData.label);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Accueil', item: '/' },
        { name: categoryData.label, item: `/${categorySlug}` }
    ]);

    return (
        <main className="min-h-screen pt-12 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <div className="container mx-auto px-4">

                {/* Breadcrumb */}
                <Breadcrumb items={[
                    { name: categoryData.label, href: `/${categorySlug}` }
                ]} />

                {/* Header */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">{categoryData.label}</h1>
                    <p className="text-xl text-foreground/70">
                        {categoryData.label === 'Hypersensibilité' && "Comprendre, accepter et faire de sa sensibilité une force."}
                        {categoryData.label === 'Relations' && "Naviguer dans les liens affectifs avec justesse."}
                        {categoryData.label === 'Masculinité & sensibilité' && "Redéfinir le masculin à travers le prisme de l'émotion."}
                        {categoryData.label === 'Santé mentale' && "Prendre soin de soi, corps et esprit."}
                    </p>
                </div>

                {/* Sub-categories Pills */}
                {categoryData.subItems && (
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {categoryData.subItems.map(sub => (
                            <Link
                                key={sub.href}
                                href={sub.href}
                                className="px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors text-sm font-semibold"
                            >
                                {sub.label}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Articles Grid */}
                {categoryArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryArticles.map((article) => (
                            <Link key={article.slug} href={getArticleUrl(article)} className="group flex flex-col gap-4">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                                    {article.coverImage ? (
                                        <Image
                                            src={article.coverImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-secondary/20 text-secondary">
                                            <span className="text-4xl">✨</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                        <span>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-foreground/70 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-xl text-gray-400">Aucun article pour le moment dans cette catégorie.</p>
                        <p className="text-gray-400 mt-2">Revenez bientôt ! ✨</p>
                    </div>
                )}
            </div>
        </main>
    );
}
