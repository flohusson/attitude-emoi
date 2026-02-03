import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-secondary/30">
            <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <span className="text-lg font-bold text-foreground">Attitude Émoi</span>
                        <p className="mt-4 text-sm text-foreground/70 max-w-xs">
                            Bibliothèque émotionnelle vivante. Un espace safe pour explorer l'hypersensibilité,
                            les relations et la santé mentale au masculin (et pas que).
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-foreground">Explorer</h3>
                        <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                            <li><Link href="/hypersensibilite" className="hover:text-primary">Hypersensibilité</Link></li>
                            <li><Link href="/relations" className="hover:text-primary">Relations & Attachement</Link></li>
                            <li><Link href="/masculinite" className="hover:text-primary">Masculinité</Link></li>
                            <li><Link href="/sante-mentale" className="hover:text-primary">Santé Mentale</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-foreground">Ressources</h3>
                        <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                            <li><Link href="/podcast" className="hover:text-primary">Le Podcast</Link></li>
                            <li><Link href="/sensibliotheque" className="hover:text-primary">Sensibliothèque</Link></li>
                            <li><Link href="/a-propos" className="hover:text-primary">À propos</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contacte-moi</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border/50 pt-8 text-center md:text-left">
                    <p className="text-xs text-foreground/50">
                        &copy; {new Date().getFullYear()} Attitude Émoi. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
