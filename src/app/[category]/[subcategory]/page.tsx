import { getArticles } from "@/lib/cms";
import { NAVIGATION_ITEMS, getArticleUrl } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

import { generateBreadcrumbSchema } from "@/lib/schema";

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
    const { category, subcategory } = await params;
    const categorySlug = category;
    const subCategorySlug = subcategory;

    // Helper to find labels (reusing logic or simplified for metadata)
    const categoryData = NAVIGATION_ITEMS.find(item => item.slug === categorySlug);
    if (!categoryData) return { title: 'Page introuvable' };

    const expectedHref = `/${categorySlug}/${subCategorySlug}`;
    const subCategoryData = categoryData.subItems?.find(sub => sub.href === expectedHref);

    return {
        title: subCategoryData ? `${subCategoryData.label} - Attitude Émoi` : `${categoryData.label} - Attitude Émoi`,
        description: `Articles sur ${subCategoryData ? subCategoryData.label : categoryData.label} dans la thématique ${categoryData.label}.`,
        alternates: {
            canonical: expectedHref,
        },
    };
}


// Generate params for all sub-categories
export function generateStaticParams() {
    const params: { category: string; subcategory: string }[] = [];

    NAVIGATION_ITEMS.forEach(cat => {
        if (cat.slug && cat.subItems) {
            cat.subItems.forEach(sub => {
                // Extract the last part of the URL provided in constants as the subcategory slug
                // e.g. /hypersensibilite/definition -> definition
                const parts = sub.href.split('/');
                const subSlug = parts[parts.length - 1]; // "definition"

                params.push({
                    category: cat.slug!,
                    subcategory: subSlug
                });
            });
        }
    });

    return params;
}

export default async function SubCategoryPage({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
    const { category, subcategory } = await params;
    const categorySlug = category;
    const subCategorySlug = subcategory;

    const categoryData = NAVIGATION_ITEMS.find(item => item.slug === categorySlug);
    if (!categoryData) notFound();

    // Reconstruct the full href to find the label logic
    // We assume the href pattern matches /category/subcategory
    const expectedHref = `/${categorySlug}/${subCategorySlug}`;
    const subCategoryData = categoryData.subItems?.find(sub => sub.href === expectedHref);

    if (!subCategoryData) notFound();

    const allArticles = await getArticles();

    // Filter by Sub-Category Label (exact match with CMS)
    const filteredArticles = allArticles.filter(article =>
        article.category === categoryData.label &&
        article.subCategory === subCategoryData.label
    );

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Accueil', item: '/' },
        { name: categoryData.label, item: `/${categorySlug}` },
        { name: subCategoryData.label, item: `/${categorySlug}/${subCategorySlug}` }
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
                    { name: categoryData.label, href: `/${categorySlug}` },
                    { name: subCategoryData.label, href: `/${categorySlug}/${subCategorySlug}` }
                ]} />

                {/* Back Link */}
                <div className="mb-8">
                    <Link href={`/${categorySlug}`} className="inline-flex items-center text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">
                        <ChevronLeft size={16} className="mr-1" />
                        Retour à {categoryData.label}
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">{categoryData.label}</span>
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">{subCategoryData.label}</h1>
                </div>

                {/* Articles Grid */}
                {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article) => (
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
                                    <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-foreground/70 line-clamp-2 text-sm">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-xl text-gray-400">Aucun article dans cette sous-catégorie pour le moment.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
