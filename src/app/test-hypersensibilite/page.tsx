import HypersensitivityTest from "@/components/HypersensitivityTest";

export const metadata = {
    title: "Test Hypersensibilité | Attitude Émoi",
    description: "Faites le test pour savoir si vous êtes hypersensible. Un questionnaire simple et rapide pour mieux comprendre votre fonctionnement émotionnel.",
};

export default function TestPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#fdfbf6] to-[#f4f1ea] py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                        Êtes-vous <span className="text-[#f5c43d]">hypersensible</span> ?
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        L'hypersensibilité est un trait de caractère qui touche environ 20% de la population.
                        Ce test rapide vous aidera à identifier si vous possédez les caractéristiques de la haute sensibilité.
                        <br /><span className="text-sm italic text-gray-500">Ce test n'est pas un diagnostic, mais un outil pour déceler une potentielle sensibilité plus élevée.</span>
                    </p>
                </div>

                <HypersensitivityTest />

                <div className="text-center text-sm text-gray-400 mt-12">
                    <p>© Attitude Émoi - Ce test n'est pas un diagnostic médical.</p>
                </div>
            </div>
        </main>
    );
}
