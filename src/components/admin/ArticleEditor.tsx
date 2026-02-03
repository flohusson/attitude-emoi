'use client';

import { useState, useEffect, useRef } from 'react';
import { createArticleAction } from '@/app/actions';
import { NAVIGATION_ITEMS, getArticleUrl } from '@/lib/constants';
import { Article } from '@/lib/schemas';
import { SEO_DATA } from '@/lib/seo-data';
import RichEditor from './RichEditor';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ImagePromptsDisplay from './ImagePromptsDisplay';

type ArticleEditorProps = {
    initialData?: (Article & { content: string }) | null;
    allArticles?: Article[];
}

export default function ArticleEditor({ initialData, allArticles = [] }: ArticleEditorProps) {
    const [content, setContent] = useState(initialData?.content || '');
    const [links, setLinks] = useState<{ label: string, url: string }[]>([]);

    // Related Articles State
    const [relatedArticles, setRelatedArticles] = useState<string[]>(initialData?.relatedArticles || []);

    // Controlled States for URL generation
    const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '');
    const [selectedSubCategory, setSelectedSubCategory] = useState(initialData?.subCategory || '');
    const [slug, setSlug] = useState(initialData?.slug || '');

    const [subCategories, setSubCategories] = useState<{ label: string, href: string }[]>([]);
    const [title, setTitle] = useState(initialData?.title || '');
    const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || '');
    const [metaDescription, setMetaDescription] = useState(initialData?.seo?.metaDescription || '');
    const [mainKeyword, setMainKeyword] = useState(initialData?.seo?.mainKeyword || '');

    // SEO Keywords (Separate from Tags)
    const [seoKeywords, setSeoKeywords] = useState<string[]>(initialData?.seo?.keywords || []);
    const [keywordInput, setKeywordInput] = useState('');

    // Autocomplete States
    const [mainKwSuggestions, setMainKwSuggestions] = useState<string[]>([]);
    const [secKwSuggestions, setSecKwSuggestions] = useState<string[]>([]);
    const [showMainKwSuggestions, setShowMainKwSuggestions] = useState(false);
    const [showSecKwSuggestions, setShowSecKwSuggestions] = useState(false);

    const [slugTouched, setSlugTouched] = useState(false);

    // Filter categories that have sub-items (exclude 'Podcast', 'About')
    const categoryOptions = NAVIGATION_ITEMS.filter(item => item.subItems);

    useEffect(() => {
        if (selectedCategory) {
            const cat = NAVIGATION_ITEMS.find(item => item.label === selectedCategory);
            if (cat && cat.subItems) {
                setSubCategories(cat.subItems);
            } else {
                setSubCategories([]);
            }
        }
    }, [selectedCategory]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const catLabel = e.target.value;
        setSelectedCategory(catLabel);
        setSelectedSubCategory(''); // Reset subcategory on category change
    };

    // Helper: Autocomplete
    const getSuggestions = (input: string) => {
        if (!input || input.length < 2) return [];
        const lowerInput = input.trim().toLowerCase();

        return Object.keys(SEO_DATA)
            .filter(key => key.toLowerCase().includes(lowerInput))
            .sort((a, b) => {
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();

                // Priority 1: Exact match
                if (aLower === lowerInput) return -1;
                if (bLower === lowerInput) return 1;

                // Priority 2: Starts with
                const aStarts = aLower.startsWith(lowerInput);
                const bStarts = bLower.startsWith(lowerInput);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;

                // Priority 3: Volume (High to Low)
                const volA = SEO_DATA[a]?.volume || 0;
                const volB = SEO_DATA[b]?.volume || 0;
                return volB - volA;
            })
            .slice(0, 8); // Increased limit to 8
    };

    // Helper: Slugify
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD') // Split accented characters
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w-]+/g, '') // Remove all non-word chars
            .replace(/--+/g, '-') // Replace multiple - with single -
            .trim();
    };

    // Auto-generate slug from title until manually touched
    useEffect(() => {
        if (!slugTouched && title) {
            setSlug(slugify(title));
        }
    }, [title, slugTouched]);

    const publicUrl = getArticleUrl({
        slug: slug,
        category: selectedCategory,
        subCategory: selectedSubCategory
    });

    // Detect links in markdown content
    useEffect(() => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const foundLinks = [];
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
            foundLinks.push({ label: match[1], url: match[2] });
        }
        setLinks(foundLinks);
    }, [content]);

    return (
        <form action={createArticleAction} className="space-y-8">
            {/* Hidden field for Date on update */}
            {initialData?.date && <input type="hidden" name="date" value={initialData.date} />}

            {/* Sticky Header */}
            {/* Sticky Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-50 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {initialData ? '✏️ Modifier l\'article' : '✨ Nouvel Article'}
                        {initialData?.status === 'draft' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200">Brouillon</span>}
                        {initialData?.status === 'published' && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">Publié</span>}
                    </h1>
                    {title && <p className="text-sm text-gray-500 truncate max-w-md">{title}</p>}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Link href="/admin" className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                        Annuler
                    </Link>

                    <button
                        type="submit"
                        name="status"
                        value="draft"
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-2"
                    >
                        <span>📝</span>
                        Sauvegarder le brouillon
                    </button>

                    <button
                        type="submit"
                        name="status"
                        value="published"
                        className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:shadow transition-transform hover:scale-105 text-sm flex items-center justify-center gap-2"
                    >
                        <span>🚀</span>
                        {initialData?.status === 'published' ? "Mettre à jour" : "Publier"}
                    </button>
                </div>
            </div>

            {/* Top Area: 2x2 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* Informations Principales */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h2 className="text-lg font-semibold text-gray-700">Informations Principales</h2>
                            {slug && selectedCategory && (
                                <Link
                                    href={publicUrl}
                                    target="_blank"
                                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium bg-primary/10 px-2 py-1 rounded"
                                    title="Voir l'article en ligne (nouvel onglet)"
                                >
                                    <ExternalLink size={12} /> Voir l'article
                                </Link>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-gray-700">Titre</label>
                                <span className="text-xs text-gray-500">{title.length} car.</span>
                            </div>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value);
                                        setSlugTouched(true);
                                    }}
                                    required
                                    pattern="[a-z0-9-]+"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Catégorie</label>
                                <select
                                    name="category"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                                    onChange={handleCategoryChange}
                                    value={selectedCategory}
                                >
                                    <option value="">Choisir...</option>
                                    {categoryOptions.map(cat => (
                                        <option key={cat.label} value={cat.label}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Sub-Category Selection */}
                        {subCategories.length > 0 && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium text-gray-700">Sous-catégorie</label>
                                <select
                                    name="subCategory"
                                    value={selectedSubCategory}
                                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">Aucune (Général)</option>
                                    {subCategories.map(sub => (
                                        <option key={sub.label} value={sub.label}>{sub.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Maillage Interne */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                            <span>🔗 Maillage Interne</span>
                            <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded text-gray-500">{links.length} liens détectés</span>
                        </h3>

                        {/* Detected Links List - Reduced Height */}
                        {links.length > 0 && (
                            <ul className="mb-6 space-y-2 max-h-32 overflow-y-auto pr-2 border-b border-gray-100 pb-4">
                                {links.map((link, idx) => (
                                    <li key={idx} className="text-xs p-2 bg-gray-50 rounded border border-gray-100 flex justify-between items-center">
                                        <span className="font-medium text-gray-700 truncate max-w-[60%]" title={link.label || 'Sans titre'}>{link.label || 'Sans titre'}</span>
                                        <span className="text-gray-400 truncate max-w-[35%]" title={link.url}>{link.url}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Related Articles Selection */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Articles à découvrir (Maillage)</p>
                            <p className="text-xs text-gray-400">Sélectionnez jusqu'à 3 articles à afficher en bas de page.</p>
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex gap-2">
                                    <select
                                        value={relatedArticles[i] || ''}
                                        onChange={(e) => {
                                            const newRelated = [...relatedArticles];
                                            newRelated[i] = e.target.value;
                                            setRelatedArticles(newRelated);
                                        }}
                                        className="flex-1 px-3 py-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    >
                                        <option value="">-- Choisir un article --</option>
                                        {allArticles
                                            .filter(a => a.slug !== slug) // Exclude current article
                                            .map(a => (
                                                <option key={a.slug} value={a.slug}>
                                                    {a.title}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            ))}
                            {/* Hidden Inputs for Form Submission */}
                            {relatedArticles.map((slug, i) => (
                                slug && <input key={i} type="hidden" name="relatedArticles" value={slug} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* SEO & Performance Metrics */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2">🔍 Performance SEO</h2>

                        {/* Main Keyword Analysis */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-gray-700">Mot-clé Principal</label>
                            <input
                                type="text"
                                name="mainKeyword"
                                value={mainKeyword}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setMainKeyword(val);
                                    setMainKwSuggestions(getSuggestions(val));
                                    setShowMainKwSuggestions(true);
                                }}
                                onBlur={() => setTimeout(() => setShowMainKwSuggestions(false), 200)}
                                onFocus={() => {
                                    if (mainKeyword) {
                                        setMainKwSuggestions(getSuggestions(mainKeyword));
                                        setShowMainKwSuggestions(true);
                                    }
                                }}
                                placeholder="ex: hypersensibilité"
                                className="w-full px-4 py-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                                autoComplete="off"
                            />
                            {/* Autocomplete Dropdown */}
                            {showMainKwSuggestions && mainKwSuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto top-full mt-1">
                                    {mainKwSuggestions.map((suggestion) => (
                                        <li
                                            key={suggestion}
                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex justify-between items-center"
                                            onClick={() => {
                                                setMainKeyword(suggestion);
                                                setShowMainKwSuggestions(false);
                                            }}
                                        >
                                            <span>{suggestion}</span>
                                            <span className="text-xs text-gray-400">{SEO_DATA[suggestion].volume.toLocaleString()} vol.</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {mainKeyword && SEO_DATA[mainKeyword.toLowerCase()] ? (
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between text-sm">
                                    <div>
                                        <span className="block font-bold text-blue-900">{mainKeyword}</span>
                                        <span className="text-blue-700 text-xs uppercase">{SEO_DATA[mainKeyword.toLowerCase()].intent}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-blue-900">{SEO_DATA[mainKeyword.toLowerCase()].volume.toLocaleString()} <span className="text-xs font-normal">vol.</span></span>
                                        <span className="text-blue-700 text-xs">KD: {SEO_DATA[mainKeyword.toLowerCase()].kd}%</span>
                                    </div>
                                </div>
                            ) : mainKeyword ? (
                                <div className="mt-2 text-xs text-orange-500 italic">Donnée de volume non disponible pour "{mainKeyword}"</div>
                            ) : null}
                        </div>

                        {/* Secondary Keywords (SEO Only) */}
                        <div className="space-y-2 pt-2 border-t border-gray-100 relative">
                            <label className="text-sm font-medium text-gray-700">Mots-clés Secondaires (Volume)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {seoKeywords.map((kw, i) => {
                                    const data = SEO_DATA[kw.toLowerCase()];
                                    return (
                                        <div key={i} className="flex flex-col bg-purple-50 text-purple-900 rounded-md px-3 py-1 border border-purple-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{kw}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSeoKeywords(seoKeywords.filter((_, idx) => idx !== i))}
                                                    className="text-purple-400 hover:text-purple-600"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                            {data ? (
                                                <div className="flex justify-between gap-4 mt-0.5 border-t border-purple-200/50 pt-0.5">
                                                    <span className="text-[10px] font-semibold">{data.volume} vol.</span>
                                                    <span className="text-[10px] opacity-70">{data.intent.substring(0, 4)}.</span>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-purple-400 italic mt-0.5">Volume inconnu</div>
                                            )}
                                            {/* Hidden input for submission */}
                                            <input type="hidden" name="seoKeywords" value={kw} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={keywordInput}
                                    onChange={(e) => {
                                        setKeywordInput(e.target.value);
                                        setSecKwSuggestions(getSuggestions(e.target.value));
                                        setShowSecKwSuggestions(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowSecKwSuggestions(false), 200)}
                                    onFocus={() => {
                                        if (keywordInput) {
                                            setSecKwSuggestions(getSuggestions(keywordInput));
                                            setShowSecKwSuggestions(true);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (keywordInput.trim() && !seoKeywords.includes(keywordInput.trim())) {
                                                setSeoKeywords([...seoKeywords, keywordInput.trim()]);
                                                setKeywordInput('');
                                                setShowSecKwSuggestions(false);
                                            }
                                        }
                                    }}
                                    placeholder="Ajouter un mot-clé secondaire..."
                                    className="flex-1 px-3 py-1 rounded border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (keywordInput.trim() && !seoKeywords.includes(keywordInput.trim())) {
                                            setSeoKeywords([...seoKeywords, keywordInput.trim()]);
                                            setKeywordInput('');
                                        }
                                    }}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                                >
                                    +
                                </button>

                                {/* Autocomplete Dropdown for Secondary Keywords */}
                                {showSecKwSuggestions && secKwSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto top-full mt-1 left-0">
                                        {secKwSuggestions.map((suggestion) => (
                                            <li
                                                key={suggestion}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex justify-between items-center"
                                                onClick={() => {
                                                    if (!seoKeywords.includes(suggestion)) {
                                                        setSeoKeywords([...seoKeywords, suggestion]);
                                                    }
                                                    setKeywordInput('');
                                                    setShowSecKwSuggestions(false);
                                                }}
                                            >
                                                <span>{suggestion}</span>
                                                <span className="text-xs text-gray-400">{SEO_DATA[suggestion].volume.toLocaleString()} vol.</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-gray-100">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-gray-700">Meta Title <span className="text-xs text-gray-400">(60 chars max)</span></label>
                                <span className={`text-xs ${metaTitle.length > 60 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{metaTitle.length}/60</span>
                            </div>
                            <input
                                type="text"
                                name="metaTitle"
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-gray-700">Meta Description <span className="text-xs text-gray-400">(160 chars max)</span></label>
                                <span className={`text-xs ${metaDescription.length > 160 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{metaDescription.length}/160</span>
                            </div>
                            <textarea
                                name="metaDescription"
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                            ></textarea>
                        </div>
                    </div>

                    {/* Données Structurées (Schema Markup) */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <details className="group">
                            <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                                <span className="flex items-center gap-2">
                                    <span>📊</span>
                                    <span>Données Structurées (Schema Markup)</span>
                                </span>
                                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div className="mt-3 space-y-3 text-xs">
                                <p className="text-gray-500 italic">Les balises Schema.org suivantes sont automatiquement générées pour cet article :</p>

                                {/* Article Schema */}
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span className="font-bold text-blue-900">Article</span>
                                        <code className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700">@type: Article</code>
                                    </div>
                                    <ul className="space-y-1 ml-6 text-gray-700">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span><strong>headline:</strong> Meta Title ou Titre</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span><strong>description:</strong> Meta Description</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span><strong>image:</strong> Image de couverture</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span><strong>datePublished:</strong> Date de publication</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span><strong>author:</strong> Person Schema (Florian Husson)</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span><strong>publisher:</strong> Organization Schema (Attitude Émoi)</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span><strong>mainEntityOfPage:</strong> URL canonique de l'article</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* BreadcrumbList Schema */}
                                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span className="font-bold text-purple-900">BreadcrumbList</span>
                                        <code className="text-[10px] bg-purple-100 px-1.5 py-0.5 rounded text-purple-700">@type: BreadcrumbList</code>
                                    </div>
                                    <ul className="space-y-1 ml-6 text-gray-700">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-purple-400 mt-0.5">•</span>
                                            <span><strong>itemListElement:</strong> Navigation hiérarchique (Accueil → Catégorie → Sous-catégorie → Article)</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-purple-400 mt-0.5">•</span>
                                            <span><strong>position:</strong> Position dans la hiérarchie</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                                    <span className="text-gray-500">Ces données améliorent le référencement et l'affichage dans les résultats de recherche Google.</span>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </div>

            {/* Middle: Content Editor */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2">Contenu</h2>
                <RichEditor value={content} onChange={setContent} />
                {/* Hidden input to ensure form submission works exactly as before with server actions */}
                <input type="hidden" name="content" value={content} />
                {/* Preserve imagePrompts from AI generation */}
                <input type="hidden" name="imagePrompts" value={JSON.stringify(initialData?.imagePrompts || [])} />
            </div>

            {/* Bottom Row: Image Prompts & Media */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Image Prompts Display (New Section) */}
                <ImagePromptsDisplay prompts={initialData?.imagePrompts || []} />

                {/* Media Section: Moved to bottom */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2">Médias</h2>

                    {/* Cover Image */}
                    <MediaInput
                        label="Image de Couverture (Principale)"
                        namePrefix="coverImage"
                        initialUrl={initialData?.coverImage}
                        initialAlt={initialData?.coverImageAlt}
                    />

                    {/* Additional Media Slots */}
                    {[1, 2, 3].map((i) => {
                        const media = initialData?.additionalMedia?.[i - 1];
                        return (
                            <div key={i} className="space-y-2 border-t border-gray-200 pt-4">
                                <MediaInput
                                    label={`Média #${i}`}
                                    namePrefix="media"
                                    index={i}
                                    initialUrl={media?.url}
                                    initialAlt={media?.alt}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hidden field for Original Slug (to handle renames) */}
            {initialData?.slug && <input type="hidden" name="originalSlug" value={initialData.slug} />}

            <div className="flex justify-center gap-4 pt-4 mb-12">
                <Link href="/admin" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                    Annuler
                </Link>

                <button
                    type="submit"
                    name="status"
                    value="draft"
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-2"
                >
                    <span>📝</span>
                    Sauvegarder le brouillon
                </button>

                <button
                    type="submit"
                    name="status"
                    value="published"
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:shadow transition-transform hover:scale-105 text-sm flex items-center justify-center gap-2"
                >
                    <span>🚀</span>
                    {initialData?.status === 'published' ? "Mettre à jour" : "Publier"}
                </button>
            </div>
        </form >
    );
}

function MediaInput({ label, namePrefix, index, initialUrl, initialAlt, initialCaption }: { label: string, namePrefix: string, index?: number, initialUrl?: string, initialAlt?: string, initialCaption?: string }) {
    const [mode, setMode] = useState<'url' | 'file'>(initialUrl?.startsWith('/uploads') ? 'file' : 'url');
    // Default mode to file if it looks like an upload, but user can switch. Content is same.

    // Controlled file state for preview
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialUrl || null);

    // Ref for URL input to manually clear it when removing image
    const urlInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const urlName = index ? `${namePrefix}Url${index}` : namePrefix;
    const fileName = index ? `${namePrefix}File${index}` : `${namePrefix}File`;
    const altName = index ? `${namePrefix}Alt${index}` : `${namePrefix}Alt`;
    const captionName = index ? `${namePrefix}Caption${index}` : `${namePrefix}Caption`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const objectUrl = URL.createObjectURL(file as any);
            setPreview(objectUrl);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setSelectedFile(null);
        // Explicitly clear inputs
        if (urlInputRef.current) urlInputRef.current.value = '';
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-primary text-sm flex items-center gap-2">
                    {label}
                    {preview && <span className="text-xs text-green-600 font-normal bg-green-50 px-2 py-0.5 rounded border border-green-100">Image active</span>}
                </h3>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`text-xs px-3 py-1 rounded-md transition-colors ${mode === 'url' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Lien URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('file')}
                        className={`text-xs px-3 py-1 rounded-md transition-colors ${mode === 'file' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Fichier
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            {preview && (
                <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:text-red-700 hover:bg-white transition-colors shadow-sm"
                        title="Retirer l'image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-3">
                {/* URL Input */}
                <div className={mode === 'url' ? 'block' : 'hidden'}>
                    <input
                        ref={urlInputRef}
                        type="text"
                        name={urlName}
                        defaultValue={initialUrl}
                        placeholder="https://..."
                        onChange={(e) => setPreview(e.target.value || null)}
                        className="w-full px-4 py-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                </div>

                {/* File Input */}
                <div className={mode === 'file' ? 'block' : 'hidden'}>
                    <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${selectedFile ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name={fileName}
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center text-xs text-gray-500 pointer-events-none">
                            {selectedFile ? (
                                <div className="text-primary font-medium flex flex-col items-center gap-1">
                                    <span className="text-2xl">✅</span>
                                    <span>{selectedFile.name}</span>
                                    <span className="text-gray-400 text-[10px]">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-2xl">📁</span>
                                    <span>Cliquez ou glissez un fichier ici</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <input
                    type="text"
                    name={altName}
                    defaultValue={initialAlt}
                    placeholder="Texte Alternative (SEO invisible - requis)"
                    className="w-full px-4 py-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />

                <input
                    type="text"
                    name={captionName}
                    defaultValue={initialCaption}
                    placeholder="Légende (Visible sous l'image)"
                    className="w-full px-4 py-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50 text-sm italic"
                />
            </div>
        </div>
    );
}
