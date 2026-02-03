import Image from 'next/image';
import { Instagram } from 'lucide-react';

export default function AuthorBio() {
    return (
        <div className="flex gap-4 items-center p-6 border-2 border-primary/20 rounded-xl bg-gradient-to-r from-primary/5 to-transparent mb-16">
            {/* Photo circulaire */}
            <div className="flex-shrink-0 w-20 h-20">
                <Image
                    src="/author-photo.jpg"
                    alt="Florian Husson"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-primary w-full h-full aspect-square"
                />
            </div>

            {/* Contenu texte */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-foreground">Florian Husson</h3>
                    <a
                        href="https://www.instagram.com/attitudepodcast_/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label="Instagram de Florian Husson"
                    >
                        <Instagram size={18} />
                    </a>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed text-justify">
                    Florian est le créateur d'Attitude, un podcast et une plateforme dédiés à l'hypersensibilité.
                    À travers des témoignages authentiques et des réflexions personnelles, il explore les émotions,
                    les relations et le bien-être mental pour aider les personnes hypersensibles à mieux se comprendre
                    et s'épanouir au quotidien.
                </p>
            </div>
        </div>
    );
}
