'use client';

import { ImagePrompt } from '@/lib/schemas';
import { Copy, ImageIcon, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type ImagePromptsDisplayProps = {
    prompts: ImagePrompt[];
};

export default function ImagePromptsDisplay({ prompts }: ImagePromptsDisplayProps) {
    if (!prompts || prompts.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-yellow-800">Aucun prompt d'image généré</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                        L'intelligence artificielle n'a pas retourné de suggestions d'images pour cet article.
                    </p>
                </div>
            </div>
        );
    }

    const coverPrompt = prompts.find(p => p.type === 'cover');
    const sectionPrompts = prompts.filter(p => p.type === 'section');

    return (
        <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                    <ImageIcon className="w-6 h-6 text-brand-primary" />
                    Prompts d'Images Suggérés
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {prompts.length} visuels suggérés
                </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Image de Couverture */}
                {coverPrompt && (
                    <PromptCard
                        prompt={coverPrompt}
                        title="Image de Couverture"
                        badge="Prioritaire"
                        badgeColor="bg-purple-100 text-purple-700"
                    />
                )}

                {/* Images de Sections */}
                {sectionPrompts.map((prompt, index) => (
                    <PromptCard
                        key={index}
                        prompt={prompt}
                        title={`Image Section ${index + 1}`}
                        subTitle={prompt.sectionTitle}
                    />
                ))}
            </div>
        </div>
    );
}

function PromptCard({ prompt, title, subTitle, badge, badgeColor }: {
    prompt: ImagePrompt,
    title: string,
    subTitle?: string,
    badge?: string,
    badgeColor?: string
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white border text-left border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    {subTitle && (
                        <p className="text-xs text-gray-500 mt-0.5 font-medium truncate max-w-[300px]">
                            Section: {subTitle}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
                            {badge}
                        </span>
                    )}
                    <span className="text-xs bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded-full font-medium border border-brand-secondary/20">
                        {prompt.aspectRatio}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="group relative">
                    <div className="absolute right-0 top-0">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors"
                            title="Copier le prompt"
                        >
                            {copied ? (
                                <span className="text-xs font-bold text-green-600 px-1">Copié !</span>
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-sm text-gray-700 pr-8 leading-relaxed italic">
                        "{prompt.prompt}"
                    </p>
                </div>

                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-blue-800">
                        <span className="font-semibold">Alt-text SEO :</span> {prompt.altText}
                    </p>
                </div>
            </div>
        </div>
    );
}
