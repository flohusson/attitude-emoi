import Link from "next/link";
import { getTrashedArticles } from "@/lib/cms";
import { restoreArticleAction, permanentDeleteArticleAction } from "@/app/actions";

export default async function TrashPage() {
    const trashedArticles = await getTrashedArticles();

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span>🗑️</span> Corbeille
                </h1>
                <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">← Retour aux articles</Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {trashedArticles.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        La corbeille est vide. Tout est propre ! ✨
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Titre</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date suppression</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {trashedArticles.map((article) => (
                                <tr key={article.slug} className="hover:bg-red-50/10 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex flex-col">
                                            <span>{article.title}</span>
                                            <span className="text-xs text-gray-400">/{article.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {/* Note: We don't track deletion date yet, using file date or just "Aujourd'hui" implied */}
                                        {new Date(article.date).toLocaleDateString('fr-FR')} (Date article)
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <form action={restoreArticleAction}>
                                                <input type="hidden" name="slug" value={article.slug} />
                                                <button type="submit" className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1" title="Restaurer">
                                                    <span>♻️</span> Restaurer
                                                </button>
                                            </form>
                                            <span className="text-gray-300">|</span>
                                            <form action={permanentDeleteArticleAction}>
                                                <input type="hidden" name="slug" value={article.slug} />
                                                <button type="submit" className="text-red-500 hover:text-red-700 font-medium" title="Supprimer définitivement">
                                                    ❌
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
