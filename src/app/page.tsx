import Image from "next/image";
import Link from "next/link";
import ContactModal from "@/components/ContactModal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[480px] lg:h-[650px] flex items-end justify-start overflow-hidden pb-8 border-b-2 border-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/homepage-hero.webp"
            alt="Ambiance végétale et apaisante - Attitude Émoi"
            fill
            className="object-cover object-[20%_20%] md:object-[60%_center]"
            priority
            quality={100}
            unoptimized
          />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 text-left max-w-5xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-3 md:mb-6 mt-8 md:mt-0 drop-shadow-md">
            Attitude Émoi
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-4 md:mb-8 max-w-2xl leading-relaxed drop-shadow-sm">
            Le refuge des hypersensibles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
            <Link
              href="/a-propos"
              className="inline-flex items-center justify-center rounded-full bg-secondary px-5 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-secondary/90"
            >
              Découvrir le projet
            </Link>
            <Link
              href="/podcast"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90"
            >
              Écouter le Podcast
            </Link>
          </div>
        </div>
      </section>
      {/* Blog & Podcast Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b-2 border-white">
        {/* Left: Blog */}
        <div className="relative h-[550px] lg:h-[650px] flex items-end border-r-0 lg:border-r-2 border-white" style={{ backgroundImage: 'url(/images/blog-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="relative z-10 p-8 w-full">
            <h2 className="text-4xl font-bold text-white mb-3">Blog</h2>
            <p className="text-white text-base md:text-lg mb-6">Mon carnet de bord pour les sensibles.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/blog/hypersensibilite" className="w-40 text-center px-5 py-2.5 rounded-full bg-primary text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all">
                Hypersensibilité
              </Link>
              <Link href="/blog/relations-et-attachement" className="w-40 text-center px-5 py-2.5 rounded-full bg-secondary text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all">
                Relations
              </Link>
              <Link href="/blog/sante-mentale" className="w-40 text-center px-5 py-2.5 rounded-full bg-secondary md:bg-primary text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all">
                Santé Mentale
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Podcast */}
        <div className="relative h-[550px] lg:h-[650px] flex items-end border-t-2 lg:border-t-0 border-white" style={{ backgroundImage: 'url(/images/podcast-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="relative z-10 p-8 w-full">
            <h2 className="text-4xl font-bold text-white mb-3">Podcast</h2>
            <p className="text-white text-base md:text-lg mb-6">L'univers Attitude dans tes oreilles.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/podcast" className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all">
                <Image src="/images/covers/attitude-podcast.jpg" alt="Attitude Podcast" width={32} height={32} className="rounded-full" />
                Attitude Podcast
              </Link>
              <Link href="/podcast/attitude-discute" className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-secondary text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all">
                <Image src="/images/covers/attitude-discute.jpg" alt="Attitude Discute" width={32} height={32} className="rounded-full" />
                Attitude Discute
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* À propos - Layout asymétrique */}
      {/* Version Mobile : Image + overlay + texte superposé */}
      <section className="lg:hidden relative h-[550px] border-b-2 border-white">
        <Image
          src="/images/florian-portrait.webp"
          alt="Florian, créateur d'Attitude Émoi - Podcast hypersensibilité"
          fill
          className="object-cover object-[center_20%]"
        />
        {/* Overlay gradient en bas uniquement pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        {/* Contenu en bas */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-8">
          <h2 className="text-4xl font-bold mb-3 text-white">Un espace authentique</h2>
          <p className="text-white text-xs mb-3 whitespace-nowrap">
            Le média dédié à l'hypersensibilité et la santé mentale.
          </p>
          <Link
            href="/a-propos"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-5 py-2.5 text-base font-bold text-white shadow-md hover:scale-105 transition-all"
          >
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Version Desktop : Layout 40% - 60% */}
      <section className="hidden lg:block border-b-2 border-white">
        <div className="grid grid-cols-2">
          {/* Image à gauche (50%) - pleine hauteur */}
          <div className="relative min-h-[650px]">
            <Image
              src="/images/florian-portrait.webp"
              alt="Florian, créateur d'Attitude Émoi - Podcast hypersensibilité"
              fill
              className="object-cover"
            />
          </div>
          {/* Texte à droite (50%) avec texture nature */}
          <div
            className="py-24 px-12 lg:px-16 flex flex-col justify-center relative overflow-hidden"
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
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 text-primary text-center">Un espace authentique</h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed max-w-2xl">
                <p>
                  Bienvenue sur <strong>Attitude Émoi</strong>, le média dédié à l'<strong>hypersensibilité</strong> et au <strong>bien-être mental</strong>.
                  Ici, je mets des mots sur ce qui est souvent tu : les émotions intenses, la <strong>dépendance affective</strong>,
                  la <strong>peur de l'abandon</strong>, et tout ce qui traverse les <strong>personnes hypersensibles</strong>.
                </p>
                <p>
                  À travers le podcast <strong>Attitude</strong> et ce blog, j'explore les <strong>relations amoureuses</strong>,
                  les <strong>styles d'attachement</strong>, l'<strong>estime de soi</strong> et la <strong>confiance en soi</strong>.
                  C'est une voix masculine qui assume la vulnérabilité, les doutes et les contradictions.
                </p>
                <p className="text-foreground/60 text-sm italic">
                  Pour que chacun puisse se reconnaître, se comprendre et se sentir moins seul.
                </p>
              </div>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 mt-6 text-primary font-semibold hover:underline"
              >
                En savoir plus sur le projet →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Envie d'échanger - Contact Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl text-center bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary/10">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Envie d'échanger ?</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">La porte est ouverte</h2>
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
            <p className="mt-4">
              Quelle que soit ta raison, n'hésite pas à m'écrire. Je lis chaque message avec attention.
            </p>
          </div>

          <ContactModal />

        </div>
      </section>
    </div>
  );
}
