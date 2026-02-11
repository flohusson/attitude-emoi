import { getEpisodes, getEpisodeBySlug } from '@/lib/cms';
import { notFound } from 'next/navigation';
import PodcastPlayer from '@/components/podcast/PodcastPlayer';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

import { generatePodcastEpisodeSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { getArticleUrl } from '@/lib/constants'; // Potentially needed if used for breadcrumbs, but here we hardcode paths

export async function generateStaticParams() {
    const episodes = await getEpisodes();
    return episodes.map((ep) => ({
        slug: ep.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const episode = await getEpisodeBySlug(slug);
    if (!episode) return {};

    return {
        title: episode.seo?.metaTitle || episode.title,
        description: episode.seo?.metaDescription,
        openGraph: {
            images: episode.seo?.ogImage ? [episode.seo?.ogImage] : [],
        }
    };
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const episode = await getEpisodeBySlug(slug);

    if (!episode) {
        notFound();
    }

    // JSON-LD Generation
    const episodeSchema = generatePodcastEpisodeSchema(episode);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Attitude Émoi', item: '/' },
        { name: 'Podcast', item: '/podcast' },
        { name: episode.title, item: `/podcast/${episode.slug}` }
    ]);

    return (
        <div className="min-h-screen bg-[#FAF9F6] py-12 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <Breadcrumb items={[
                    { name: 'Podcast', href: '/podcast' },
                    { name: episode.title, href: `/podcast/${episode.slug}` }
                ]} />

                {/* Nav Back */}
                <Link href="/podcast" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Retour aux épisodes
                </Link>

                {/* Header */}
                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        {episode.title}
                    </h1>
                    <div className="text-gray-500 font-mono text-sm">
                        Publié le {new Date(episode.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </header>

                {/* Streaming Platform Buttons */}
                <div className="mb-8 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Écouter sur ma plateforme préférée :</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a
                            href={episode.platformLinks?.spotify || "https://open.spotify.com/show/4ip420ENioHGydcMreet9r"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white font-bold rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                            Spotify
                        </a>
                        <a
                            href={episode.platformLinks?.apple || "https://podcasts.apple.com/us/podcast/attitude-podcast/id1739617739"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-[#872EC4] text-white font-bold rounded-full hover:bg-[#7627ab] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <img src="/images/apple-podcasts-logo.png" alt="Apple Podcasts" className="h-6 w-auto" />
                            Apple Podcasts
                        </a>
                        <a
                            href={episode.platformLinks?.deezer || "https://www.deezer.com/show/1000825721"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white border border-gray-800 font-bold rounded-full hover:bg-gray-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <img src="/images/deezer-logo.svg" alt="Deezer" className="h-6 w-auto" />
                            Deezer
                        </a>
                        <a
                            href="https://podcast.ausha.co/attitudepodcast"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-[#ffffff] text-[#486878] border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <img src="/images/ausha-logo.jpeg" alt="Ausha" className="h-6 w-6 rounded-full" />
                            Ausha
                        </a>
                    </div>
                </div>

                {/* Player Sticky or Featured */}
                <div className="my-10">
                    <PodcastPlayer
                        title={episode.title}
                        audioUrl={episode.audioUrl}
                        duration={episode.duration}
                        imageUrl={episode.seo?.ogImage} // Use OG image as cover for player
                    />
                </div>

                {/* Content / Show Notes */}
                <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-lg prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Notes de l'épisode</h2>
                    <Markdown>{episode.content}</Markdown>

                    {/* Platform Links */}
                    {(episode.platformLinks?.spotify || episode.platformLinks?.apple) && (
                        <div className="not-prose mt-12 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Écouter sur ma plateforme préférée :</h3>
                            <div className="flex flex-wrap gap-4">
                                {episode.platformLinks.spotify && (
                                    <a href={episode.platformLinks.spotify} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                                        Spotify
                                    </a>
                                )}
                                {episode.platformLinks.apple && (
                                    <a href={episode.platformLinks.apple} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                                        Apple Podcasts
                                    </a>
                                )}
                                <a href="https://podcast.ausha.co/attitudepodcast" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-[#fcc4dd] text-[#2b2b2b] rounded-full font-bold hover:opacity-90 transition-opacity">
                                    Ausha
                                </a>
                            </div>
                        </div>
                    )}
                </article>

            </div>
        </div>
    );
}
