import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: "Le Blog | Attitude Émoi",
    description: "Explorez nos articles sur l'hypersensibilité, les relations et la santé mentale pour mieux vous comprendre et vous épanouir.",
};

const CATEGORIES = [
    {
        title: "Hypersensibilité",
        description: "Comprendre et vivre pleinement sa haute sensibilité au quotidien.",
        href: "/blog/hypersensibilite",
        color: "bg-[#f5c43d]",
        textColor: "text-white",
        coverImage: "/uploads/1768672868133-GeminiGeneratedImagekoklvmkoklvmkokl.webp"
    },
    {
        title: "Relations",
        description: "Développer des liens sains et apaiser ses relations affectives.",
        href: "/blog/relations-et-attachement",
        color: "bg-[#d4c57e]",
        textColor: "text-white",
        coverImage: "/uploads/1768585406569-GeminiGeneratedImagene7i6tne7i6tne7i.webp"
    },
    {
        title: "Santé Mentale",
        description: "Prendre soin de son bien-être psychologique et trouver du sens.",
        href: "/blog/sante-mentale",
        color: "bg-[#b8c9b6]",
        textColor: "text-white",
        coverImage: "/uploads/1769705524255-Sesentirbien-HeroBanner.png"
    }
];

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section - Style harmonisé */}
            <section className="relative w-full h-[400px] lg:h-[500px] flex items-end overflow-hidden border-b-2 border-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/blog-bg.webp"
                        alt="Blog Attitude Émoi"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-8 max-w-5xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-md">
                        Blog
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-sm">
                        Mon carnet de bord pour les sensibles.
                    </p>
                </div>
            </section>

            {/* Categories Grid */}
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

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Mes trois piliers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.title}
                                href={cat.href}
                                className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between h-96"
                            >
                                {/* Background Image */}
                                <Image
                                    src={cat.coverImage}
                                    alt={cat.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Color Overlay */}
                                <div className={`absolute inset-0 ${cat.color} opacity-70 group-hover:opacity-60 transition-opacity duration-300`} />

                                {/* Gradient for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                                    <div className="space-y-4">
                                        <h3 className={`text-3xl font-bold ${cat.textColor} tracking-wide drop-shadow-md`}>
                                            {cat.title}
                                        </h3>
                                        <p className={`${cat.textColor}/90 text-lg leading-relaxed font-medium drop-shadow-sm`}>
                                            {cat.description}
                                        </p>
                                    </div>

                                    <div className={`mt-auto inline-flex items-center gap-3 font-bold ${cat.textColor} group-hover:gap-4 transition-all`}>
                                        <span className="uppercase tracking-wider text-sm">Découvrir</span>
                                        <span className="text-2xl">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-primary/5">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Besoin d'aller plus loin ?</h2>
                    <p className="text-lg text-foreground/70 mb-8">
                        Découvre si tu es hypersensible grâce à notre test basé sur les travaux d'Elaine Aron.
                    </p>
                    <Link
                        href="/test-hypersensibilite"
                        className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                    >
                        Faire le test de sensibilité
                    </Link>
                </div>
            </section>
        </div>
    );
}
