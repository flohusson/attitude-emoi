'use client';

import { useState } from 'react';
import { Upload, FileAudio, FileText, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { generateArticleFromMedia } from './actions';
import { useRouter } from 'next/navigation';

export default function ContentAgentPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setIsThinking(true);
        setStatus('Lecture du fichier en cours...');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('media', file);

            setStatus('Analyse par Gemini Pro (c\'est rapide)...');

            // Call server action
            const result = await generateArticleFromMedia(formData);

            if (result.success) {
                setStatus('Génération terminée ! Redirection...');
                // Redirect to the edit page of the draft
                router.push(`/admin/articles/${result.slug}`);
            } else {
                throw new Error(result.error);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Une erreur est survenue");
            setIsThinking(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="text-primary" /> Agent de Contenu
            </h1>
            <p className="text-gray-500 mb-8">
                Transformez vos podcasts ou notes vocales en articles de blog complets, optimisés SEO et illustrés.
            </p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                {/* Upload Zone */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        accept="audio/*,text/plain,.md"
                        className="hidden"
                    />

                    {!file ? (
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="bg-white p-4 rounded-full shadow-sm">
                                <Upload size={32} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Déposez votre fichier ici</h3>
                                <p className="text-sm text-gray-500">MP3, WAV, M4A ou TXT</p>
                            </div>
                        </label>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-white p-4 rounded-full shadow-sm">
                                {file.type.startsWith('audio') ? (
                                    <FileAudio size={32} className="text-primary" />
                                ) : (
                                    <FileText size={32} className="text-primary" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{file.name}</h3>
                                <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={(e) => { e.preventDefault(); setFile(null); }}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Changer de fichier
                            </button>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={!file || isThinking}
                        className={`
                            px-8 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 transition-all
                            ${!file || isThinking
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl'
                            }
                        `}
                    >
                        {isThinking ? (
                            <>
                                <Loader2 className="animate-spin" /> {status}
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} /> Convertir en Article
                            </>
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}
            </div>

            {/* Protocol Reminder */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🎯 Structure Hn</h3>
                    <p className="text-sm text-gray-600">L'agent respecte strictement la structure H1, H2, H3 et Intro/Conclusion.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🎙️ Ton & Style</h3>
                    <p className="text-sm text-gray-600">Analyse de votre style "Attitude Émoi" pour une rédaction authentique.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🖼️ Visuels</h3>
                    <p className="text-sm text-gray-600">Génération automatique des prompts et images via Imagen 3.</p>
                </div>
            </div>
        </div>
    );
}
