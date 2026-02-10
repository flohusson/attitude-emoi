import Link from 'next/link';
import Image from 'next/image';
import { getEpisodes } from '@/lib/cms';

export const metadata = {
    title: 'Le Podcast Attitude Émoi - Hypersensibilité et Masculinité',
    description: 'Découvrez le podcast qui explore les émotions, la sensibilité et la masculinité sans tabou.',
};

export default async function PodcastPage() {
    const episodes = await getEpisodes();
    const latestEpisode = episodes[0];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section - Style harmonisé */}
            <section className="relative w-full h-[400px] lg:h-[500px] flex items-end overflow-hidden border-b-2 border-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/podcast-bg.webp"
                        alt="Podcast Attitude Émoi"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-8 max-w-5xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-md">
                        Podcast
                    </h1>
                    <div className="flex flex-wrap gap-3 pt-4">
                        <a href="https://open.spotify.com/show/4ip420ENioHGydcMreet9r" target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] text-white font-bold rounded-full hover:opacity-90 transition-all shadow-md">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                            Spotify
                        </a>
                        <a href="https://podcasts.apple.com/us/podcast/attitude-podcast/id1739617739" target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-[#872EC4] text-white font-bold rounded-full hover:bg-[#7627ab] transition-all shadow-md">
                            <img src="/images/apple-podcasts-logo.png" alt="Apple Podcasts" className="h-5 w-auto" />
                            Apple
                        </a>
                        <a href="https://www.deezer.com/show/1000825721" target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-all shadow-md">
                            <img src="/images/deezer-logo.svg" alt="Deezer" className="h-5 w-auto" />
                            Deezer
                        </a>
                        <a href="https://podcast.ausha.co/attitudepodcast" target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#486878] border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-all shadow-md">
                            <img src="/images/ausha-logo.jpeg" alt="Ausha" className="h-5 w-5 rounded-full" />
                            Ausha
                        </a>
                    </div>
                </div>
            </section>

            {/* Choix du Format */}
            <section
                className="relative py-16 md:py-24 overflow-hidden"
                style={{ backgroundColor: '#faf9f7' }}
            >
                {/* Texture Background */}
                <div
                    className="absolute inset-0 opacity-15"
                    style={{
                        backgroundImage: 'url(/images/nature-texture.png)',
                        backgroundSize: '400px',
                        backgroundRepeat: 'repeat'
                    }}
                />

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
                        Choisissez votre Attitude
                    </h2>
                    <p className="text-lg text-foreground/70 text-center max-w-2xl mx-auto mb-12">
                        Des conversations authentiques sur l'hypersensibilité, la gestion des émotions et la quête de soi.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Carte Attitude Podcast */}
                        <Link href="/podcast/attitude-podcast" className="group relative overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="absolute top-0 w-full h-2 bg-primary"></div>
                            <div className="p-8 md:p-12 flex flex-col items-center text-center space-y-6">
                                <div className="w-48 h-48 rounded-lg shadow-md overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-500">
                                    <img src="/images/covers/attitude-podcast.jpg" alt="Cover Attitude Podcast" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-3xl font-bold text-foreground">Attitude Podcast</h3>
                                <p className="text-foreground/70 border-t border-gray-100 pt-6">
                                    Le format solo.
                                    <br />
                                    Des réflexions intimes et directes sur l'hypersensibilité, la masculinité et la quête de sens.
                                </p>
                                <span className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full mt-4 group-hover:bg-primary/90 transition-colors">
                                    Explorer les épisodes →
                                </span>
                            </div>
                        </Link>

                        {/* Carte Attitude Discute */}
                        <Link href="/podcast/attitude-discute" className="group relative overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="absolute top-0 w-full h-2 bg-secondary"></div>
                            <div className="p-8 md:p-12 flex flex-col items-center text-center space-y-6">
                                <div className="w-48 h-48 rounded-lg shadow-md overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-500">
                                    <img src="/images/covers/attitude-discute.jpg" alt="Cover Attitude Discute" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-3xl font-bold text-foreground">Attitude Discute</h3>
                                <p className="text-foreground/70 border-t border-gray-100 pt-6">
                                    Le format interview.
                                    <br />
                                    Des échanges profonds avec des invités inspirants qui partagent leur parcours et leur vulnérabilité.
                                </p>
                                <span className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-full mt-4 group-hover:bg-secondary/90 transition-colors">
                                    Explorer les discussions →
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-primary/5">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Envie de découvrir le blog ?</h2>
                    <p className="text-lg text-foreground/70 mb-8">
                        Retrouve mes articles et réflexions écrites sur l'hypersensibilité, les relations et la santé mentale.
                    </p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                        Découvrir le blog
                    </Link>
                </div>
            </section>
        </div>
    );
}
