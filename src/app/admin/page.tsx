import Link from "next/link";
import { getArticles } from "@/lib/cms";
import { deleteArticleAction } from "@/app/actions";
import { getArticleUrl, CATEGORY_COLORS } from "@/lib/constants";
import Pagination from "@/components/admin/Pagination";
import ArticleFilters from "@/components/admin/ArticleFilters";
import { Suspense } from "react";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; status?: string; category?: string; sort?: string }> }) {
    const { page, q, status, category, sort = 'desc' } = await searchParams;

    // Always fetch ALL articles (including drafts) to allow filtering from full set
    let articles = await getArticles({ includeDrafts: true });

    // 1. Filtering Logic
    if (q) {
        articles = articles.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
    }

    if (status && status !== 'all') {
        articles = articles.filter(a => a.status === status);
    }

    if (category && category !== 'all') {
        articles = articles.filter(a => a.category === category);
    }

    // 2. Sorting Logic (use updatedAt if available, otherwise date)
    articles.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.date).getTime();
        const dateB = new Date(b.updatedAt || b.date).getTime();
        return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // 3. Pagination Logic
    const currentPage = Number(page) || 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(articles.length / itemsPerPage);

    const paginatedArticles = articles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Vos Articles</h1>
                <Link href="/admin/articles/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                    + Nouvel Article
                </Link>
            </div>

            <Suspense fallback={<div>Chargement des filtres...</div>}>
                <ArticleFilters />
            </Suspense>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
                {articles.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        Aucun article trouvé avec ces critères.
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Titre</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Statut</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Catégorie</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedArticles.map((article) => (
                                        <tr key={article.slug} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                                            <td className="px-6 py-4">
                                                {article.status === 'draft' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                        📝 Brouillon
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                        🚀 Publié
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS['Default']}`}>
                                                    {article.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(article.updatedAt || article.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link href={`/admin/articles/${article.slug}`} className="text-primary hover:text-primary/80 font-medium">
                                                        Modifier
                                                    </Link>
                                                    <a href={getArticleUrl(article)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 font-medium" title="Voir l'article">
                                                        👁️
                                                    </a>
                                                    <form action={deleteArticleAction}>
                                                        <input type="hidden" name="slug" value={article.slug} />
                                                        <button type="submit" className="text-red-500 hover:text-red-700 font-medium" title="Supprimer">
                                                            🗑️
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl="/admin"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
