import Link from "next/link";
import Image from "next/image";
import ContactModal from "@/components/ContactModal";

export const metadata = {
    title: "À propos | Attitude Émoi",
    description: "Découvrez Attitude Émoi, le média dédié à l'hypersensibilité et au bien-être mental. Un espace authentique créé par Florian.",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[450px] lg:h-[550px] flex items-end overflow-hidden border-b-2 border-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/florian-portrait.webp"
                        alt="Florian, créateur d'Attitude Émoi"
                        fill
                        className="object-cover object-[center_15%]"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-8 max-w-5xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-md">
                        À propos
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-medium max-w-2xl leading-relaxed drop-shadow-sm">
                        L'histoire derrière Attitude.
                    </p>
                </div>
            </section>

            {/* Main Content Section - Split Layout (Desktop: Text Left / Image Right) */}
            <section className="border-b-2 border-white">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* Colonne Texte (Gauche sur Desktop) */}
                    <div
                        className="py-12 px-6 sm:px-12 lg:px-16 flex flex-col justify-center relative overflow-hidden"
                        style={{ backgroundColor: '#faf9f7' }}
                    >
                        {/* Texture de fond */}
                        <div
                            className="absolute inset-0 opacity-15"
                            style={{
                                backgroundImage: 'url(/images/nature-texture.png)',
                                backgroundSize: '400px',
                                backgroundRepeat: 'repeat'
                            }}
                        ></div>

                        <div className="relative z-10 space-y-8 max-w-2xl mx-auto lg:mx-0">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                                    Bonjour, moi c'est <span className="text-primary">Florian !</span>
                                </h2>
                                <p className="text-lg text-foreground/80 leading-relaxed text-justify">
                                    <strong>Attitude Émoi</strong> est né d'un besoin : celui de créer un espace de <strong className="text-[#f5c43d] font-bold">santé mentale incarnée</strong>.
                                    C'est une bibliothèque émotionnelle vivante, un prolongement de mon podcast Attitude.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-3">Pourquoi ce site ?</h3>
                                <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
                                    <p className="text-justify">
                                        Je voulais offrir un repère. Une "safe place" où l'on parle de vécu, d'intimité, de vulnérabilité, sans filtre.
                                    </p>
                                    <p className="text-justify">
                                        En tant qu'<strong className="text-[#f5c43d]">homme hypersensible</strong>, j'ai longtemps cherché des voix qui me ressemblaient.
                                        Des modèles qui acceptaient leurs doutes et leur sensibilité.
                                        Ne les trouvant pas toujours, j'ai décidé de porter cette voix.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-3">Ma mission</h3>
                                <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
                                    <p className="text-justify">
                                        Ici, pas de recettes magiques ni d'injonctions au bonheur. Juste du partage d'expérience,
                                        des réflexions sur nos schémas relationnels (attachement, dépendance), et une exploration de la <strong className="text-[#f5c43d]">masculinité sensible</strong>.
                                    </p>
                                    <p className="text-justify pt-2">
                                        Mon but est simple : que vous puissiez vous reconnaître, vous comprendre, et surtout, vous sentir moins seuls dans ce que vous traversez.
                                    </p>
                                    <div className="text-right mt-2 text-[#f5c43d] font-bold font-handwriting text-xl">
                                        Florian
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne Image (Droite sur Desktop) */}
                    <div className="relative min-h-[400px] lg:min-h-[700px]">
                        <Image
                            src="/images/homepage-hero.webp"
                            alt="Ambiance apaisante Attitude Émoi"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-primary/5">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Envie d'échanger ?</h2>

                    <div className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto space-y-4">
                        <p>
                            Attitude Émoi, c'est avant tout un espace de dialogue.
                        </p>
                        <ul className="text-left space-y-2 max-w-lg mx-auto bg-background p-6 rounded-xl border border-border/50">
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">●</span>
                                <span><strong>Poser une question</strong> : Un doute, une interrogation sur un épisode ou un article ?</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">●</span>
                                <span><strong>Suggérer un sujet</strong> : Tu aimerais que j'aborde une thématique précise ?</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">●</span>
                                <span><strong>Participer à Attitude Discute</strong> : Tu souhaites témoigner et échanger avec moi dans un prochain épisode ?</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <ContactModal />
                        <Link
                            href="/podcast"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
                        >
                            Écouter le podcast
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
