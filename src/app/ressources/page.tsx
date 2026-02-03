import Link from 'next/link';
import { getResources } from '@/lib/cms';
import { BookOpen, Video, Headphones, Film } from 'lucide-react';

export const metadata = {
    title: 'La Sensibliothèque - Ressources pour Hypersensibles',
    description: 'Livres, vidéos, podcasts et documentaires sélectionnés pour mieux vivre son hypersensibilité.',
};

const typeIcons = {
    'Livre': <BookOpen size={18} />,
    'Vidéo': <Video size={18} />,
    'Podcast': <Headphones size={18} />,
    'Documentaire': <Film size={18} />,
    'Autre': <BookOpen size={18} />,
};

export default async function ResourcesPage() {
    const resources = await getResources();

    // Grouping or simple grid? Let's do a simple grid for now.

    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            {/* Hero Section */}
            <div className="bg-primary/5 py-20 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <span className="text-secondary font-bold tracking-widest text-sm uppercase">La Sensibliothèque</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                        Nourrissez votre <span className="text-primary">esprit</span>.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Une sélection curée de livres, vidéos et outils qui m'ont aidé sur mon chemin.
                    </p>
                </div>
            </div>

            {/* Resources Grid */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                {resources.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 italic text-lg">La bibliothèque est en cours de remplissage...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((resource, idx) => (
                            <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/30 transition-all flex flex-col h-full"
                            >
                                {/* Cover */}
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {resource.coverImage ? (
                                        <img
                                            src={resource.coverImage}
                                            alt={resource.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-2 shadow-sm">
                                        {typeIcons[resource.type as keyof typeof typeIcons]}
                                        {resource.type}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium mb-4">
                                        de {resource.author}
                                    </p>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                        {resource.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {resource.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
