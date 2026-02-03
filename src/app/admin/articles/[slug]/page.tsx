import { notFound } from "next/navigation";
import { getArticles } from "@/lib/cms";
import Link from "next/link";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const articles = await getArticles({ includeDrafts: true });
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Modifier l'article : {article.title}</h1>
                <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">← Retour au dashboard</Link>
            </div>

            <ArticleEditor initialData={article} allArticles={articles} />
        </div>
    );
}
