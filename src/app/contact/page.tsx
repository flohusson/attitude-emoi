export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-center">Contacte-moi</h1>
            <p className="text-center text-foreground/70 mb-12">
                Une question ? Un sujet à suggérer pour le podcast ? Ou simplement envie de partager votre histoire ?
                Ce formulaire est là pour ça.
            </p>

            <form className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">Nom / Prénom</label>
                        <input type="text" id="name" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Votre nom" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                        <input type="email" id="email" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none" placeholder="votre@email.com" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">Sujet</label>
                    <select id="subject" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none">
                        <option>Je veux partager un témoignage</option>
                        <option>Suggestion de sujet pour le podcast/site</option>
                        <option>Candidature pour participer au podcast</option>
                        <option>Autre demande</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                    <textarea id="message" rows={6} className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Écrivez votre message ici bienveillance..."></textarea>
                </div>

                <button type="button" className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors">
                    Envoyer le message
                </button>
            </form>
        </div>
    );
}
