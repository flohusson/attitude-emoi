import Link from "next/link";
import { Suspense } from "react";
import { getEpisodes } from "@/lib/cms";
import Pagination from "@/components/admin/Pagination";
import EpisodeFilters from "@/components/admin/EpisodeFilters";
import EpisodeTypeSelector from "@/components/admin/EpisodeTypeSelector";
import { deleteEpisodeAction, importEpisodesFromXMLStringAction } from "@/app/actions";
import { CATEGORY_COLORS } from "@/lib/constants";

export default async function EpisodesAdmin({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string; sort?: string }> }) {
    const { page, q, type, sort = 'desc' } = await searchParams;
    let episodes = await getEpisodes();

    // 1. Filtering
    if (q) {
        episodes = episodes.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));
    }
    if (type && type !== 'all') {
        episodes = episodes.filter(e => e.type === type);
    }

    // 2. Sorting
    episodes.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // 3. Pagination Logic
    const currentPage = Number(page) || 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(episodes.length / itemsPerPage);

    const paginatedEpisodes = episodes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Épisodes Podcast</h1>
                <div className="flex gap-2 relative">
                    <details className="group">
                        <summary className="list-none px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2">
                            📥 Importer des épisodes
                        </summary>
                        <div className="absolute right-0 top-full mt-2 w-96 bg-white p-6 rounded-xl shadow-xl border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    💾 Import Manuel (RSS)
                                </h3>
                                <p className="text-sm text-gray-500">
                                    1. Ouvrez <a href="https://feed.ausha.co/jnejQi4v9MlV" target="_blank" className="underline text-blue-500 hover:text-blue-600">votre flux Ausha</a>.<br />
                                    2. Vous verrez du code technique. Faites <strong>CTRL + A</strong> pour tout sélectionner.<br />
                                    3. Copiez (CTRL+C) et collez tout le texte ci-dessous.
                                </p>
                                <form action={importEpisodesFromXMLStringAction} className="space-y-3">
                                    <textarea
                                        name="xmlContent"
                                        rows={6}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-xs font-mono text-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none bg-gray-50"
                                        placeholder="<rss>...</rss>"
                                        required
                                    ></textarea>
                                    <button type="submit" className="w-full px-4 py-2.5 bg-secondary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-sm hover:shadow active:scale-95">
                                        🚀 Lancer l'Import
                                    </button>
                                </form>
                            </div>
                        </div>
                    </details>

                    <Link href="/admin/episodes/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                        + Nouvel Épisode
                    </Link>
                </div>
            </div>

            <Suspense fallback={<div>Chargement des filtres...</div>}>
                <EpisodeFilters />
            </Suspense>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
                {episodes.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        Aucun épisode trouvé.
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Attitude</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Titre</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Catégorie</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedEpisodes.map((episode) => (
                                        <tr key={episode.slug} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <EpisodeTypeSelector
                                                    slug={episode.slug}
                                                    currentType={episode.type}
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {episode.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {episode.categories && episode.categories.length > 0 ? (
                                                        episode.categories.map(cat => (
                                                            <span key={cat} className={`inline-block px-2 py-1 rounded text-xs font-bold ${CATEGORY_COLORS[cat] || CATEGORY_COLORS['Default']}`}>
                                                                {cat}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(episode.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={`/admin/episodes/${episode.slug}?returnUrl=${encodeURIComponent(`/admin/episodes?page=${currentPage}${q ? `&q=${q}` : ''}${type && type !== 'all' ? `&type=${type}` : ''}${sort ? `&sort=${sort}` : ''}`)}`}
                                                        className="text-primary hover:text-primary/80 font-medium"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <a href={`/podcast/${episode.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 font-medium" title="Voir l'épisode">
                                                        👁️
                                                    </a>
                                                    <form action={deleteEpisodeAction}>
                                                        <input type="hidden" name="slug" value={episode.slug} />
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
                            baseUrl="/admin/episodes"
                        />
                    </>
                )}
            </div>
        </div >
    );
}
