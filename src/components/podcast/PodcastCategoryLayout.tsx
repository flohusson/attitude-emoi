import Link from 'next/link';
import { getEpisodes } from '@/lib/cms';
import { Play, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PodcastCategoryProps {
    type: 'podcast' | 'discute';
    title: string;
    description: string;
    themeColor: string;
}

export default async function PodcastCategoryLayout({ type, title, description, themeColor }: PodcastCategoryProps) {
    const allEpisodes = await getEpisodes();

    // Filter episodes
    const episodes = allEpisodes.filter(e => {
        if (type === 'podcast') return e.type === 'podcast' || !e.type; // Default
        return e.type === 'discute';
    });

    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            {/* Header Category */}
            <div className="bg-white border-b border-gray-100 py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <Link href="/podcast" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Retour au choix du format
                    </Link>
                    <h1 className={`text-3xl md:text-5xl font-bold mb-4 ${themeColor}`}>
                        {title}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* Liste des Épisodes */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="space-y-6">
                    {episodes.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-10">Aucun épisode trouvé dans cette catégorie.</p>
                    ) : (
                        episodes.map((episode) => (
                            <Link href={`/podcast/${episode.slug}`} key={episode.slug} className="group block">
                                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md hover:border-primary/30">
                                    {/* Cover Mini */}
                                    <div className="w-full md:w-48 aspect-square bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                                                <Play size={20} className="text-gray-900 ml-1 fill-current" />
                                            </div>
                                        </div>
                                        <img
                                            src={episode.coverImage || episode.seo?.ogImage || "https://image.ausha.co/d81qy6emCUJQ0ckJPDppvyzGYdcGvJMqI3bCHoQG_400x400.jpeg"}
                                            alt={episode.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Info Content */}
                                    <div className="flex-1 space-y-3 py-2">
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                                            <span className={`font-bold ${themeColor}`}>
                                                {episode.type === 'discute' ? '💬 Discute' : '🎙️ Podcast'}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(episode.date).toLocaleDateString('fr-FR')}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Play size={12} /> {episode.duration || "20 min"}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                                            {episode.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-2">
                                            {(episode.seo?.metaDescription || "Découvrez cet épisode...").replace(/<[^>]*>?/gm, '')}
                                        </p>
                                        <div className={`pt-2 ${themeColor} font-bold text-sm underline decoration-transparent group-hover:decoration-current transition-all`}>
                                            Écouter l'épisode →
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
