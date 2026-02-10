'use client';

import { useState, useEffect } from 'react';
import { saveEpisodeAction } from '@/app/actions';
import { Episode } from '@/lib/schemas';
import RichEditor from './RichEditor';
import { ExternalLink, Check } from 'lucide-react';
import { NAVIGATION_ITEMS, CATEGORY_COLORS } from '@/lib/constants';
import Link from 'next/link';

type EpisodeEditorProps = {
    initialData?: (Episode & { content: string }) | null;
    returnUrl?: string;
}

export default function EpisodeEditor({ initialData, returnUrl = '/admin/episodes' }: EpisodeEditorProps) {
    const [content, setContent] = useState(initialData?.content || '');
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [slugTouched, setSlugTouched] = useState(false);

    // Podcast Specifics
    const [type, setType] = useState<'podcast' | 'discute'>(initialData?.type || 'podcast'); // NEW
    const [categories, setCategories] = useState<string[]>(initialData?.categories || ((initialData as any)?.category ? [(initialData as any).category] : [])); // Migration support
    const [duration, setDuration] = useState(initialData?.duration || '');
    const [audioUrl, setAudioUrl] = useState(initialData?.audioUrl || '');
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '/images/covers/attitude-podcast.jpg');

    // Platform Links
    const [spotify, setSpotify] = useState(initialData?.platformLinks?.spotify || '');
    const [apple, setApple] = useState(initialData?.platformLinks?.apple || '');
    const [deezer, setDeezer] = useState(initialData?.platformLinks?.deezer || '');

    // SEO
    const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || '');
    const [metaDescription, setMetaDescription] = useState((initialData?.seo?.metaDescription || '').replace(/<[^>]*>?/gm, ''));

    // Guests
    const [guests, setGuests] = useState<string[]>(initialData?.guests || []);
    const [guestInput, setGuestInput] = useState('');

    // Helper: Slugify
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .trim();
    };

    // Auto-generate slug
    useEffect(() => {
        if (!slugTouched && title) {
            setSlug(slugify(title));
        }
    }, [title, slugTouched]);

    // NEW: Auto-switch cover when Type changes
    const handleTypeChange = (newType: 'podcast' | 'discute') => {
        setType(newType);
        if (newType === 'discute') {
            setCoverImage('/images/covers/attitude-discute.jpg');
        } else {
            setCoverImage('/images/covers/attitude-podcast.jpg');
        }
    };

    return (
        <form action={saveEpisodeAction} className="space-y-8">
            {initialData?.date && <input type="hidden" name="date" value={initialData.date} />}
            {initialData?.slug && <input type="hidden" name="originalSlug" value={initialData.slug} />}
            <input type="hidden" name="type" value={type} /> {/* NEW: Persist type */}
            <input type="hidden" name="returnUrl" value={returnUrl} />

            {/* Sticky Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 sticky top-4 z-40 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {initialData ? '✏️ Modifier l\'épisode' : '✨ Nouvel Épisode'}
                    </h1>
                    {initialData?.title && <p className="text-sm text-gray-500 truncate max-w-md">{initialData.title}</p>}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <Link href={returnUrl} className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors text-center">
                        Annuler
                    </Link>
                    <button type="submit" className="flex-1 sm:flex-none px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:shadow transition-transform hover:scale-105 text-sm flex items-center justify-center gap-2">
                        <span>💾</span>
                        {initialData ? "Mettre à jour" : "Publier"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Main Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 h-full">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-semibold text-gray-700">Informations de l'Épisode</h2>
                        {slug && (
                            <Link href={`/podcast/${slug}`} target="_blank" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium bg-primary/10 px-2 py-1 rounded">
                                <ExternalLink size={12} /> Voir
                            </Link>
                        )}
                    </div>

                    {/* NEW: Type Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Type d'épisode</label>
                        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('podcast')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium ${type === 'podcast' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                🎙️ Attitude Podcast
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('discute')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium ${type === 'discute' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                💬 Attitude Discute
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Thématiques (Catégories)</label>
                        <div className="flex flex-wrap gap-2">
                            {NAVIGATION_ITEMS.flatMap(item => {
                                if (item.sections) return item.sections;
                                if (item.subItems) return [item];
                                return [];
                            }).map(item => {
                                const isSelected = categories.includes(item.label);
                                const colorClass = CATEGORY_COLORS[item.label] || CATEGORY_COLORS['Default'];

                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setCategories(categories.filter(c => c !== item.label));
                                            } else {
                                                setCategories([...categories, item.label]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${isSelected ? colorClass : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        {item.label}
                                        {isSelected && <Check size={12} />}
                                    </button>
                                );
                            })}
                        </div>
                        <input type="hidden" name="categories" value={JSON.stringify(categories)} />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Titre</label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={slug}
                            onChange={e => { setSlug(e.target.value); setSlugTouched(true); }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Durée (ex: 45:30)</label>
                            <input
                                type="text"
                                name="duration"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Lien fichier Audio (MP3)</label>
                            <input
                                type="url"
                                name="audioUrl"
                                value={audioUrl}
                                onChange={e => setAudioUrl(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                placeholder="https://..."
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                        <label className="text-sm font-medium text-gray-700">Cover de l'épisode</label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Podcast Cover Option */}
                            <div
                                onClick={() => setCoverImage('/images/covers/attitude-podcast.jpg')}
                                className={`cursor-pointer border-2 rounded-lg p-2 flex flex-col items-center gap-2 transition-all ${coverImage === '/images/covers/attitude-podcast.jpg' ? 'border-[#f5c43d] bg-[#f5c43d]/10' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <img src="/images/covers/attitude-podcast.jpg" alt="Attitude Podcast" className="w-full h-auto rounded shadow-sm aspect-square object-cover" />
                                <span className="text-xs font-semibold text-gray-700">Attitude Podcast</span>
                            </div>

                            {/* Discute Cover Option */}
                            <div
                                onClick={() => setCoverImage('/images/covers/attitude-discute.jpg')}
                                className={`cursor-pointer border-2 rounded-lg p-2 flex flex-col items-center gap-2 transition-all ${coverImage === '/images/covers/attitude-discute.jpg' ? 'border-[#96b094] bg-[#96b094]/10' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <img src="/images/covers/attitude-discute.jpg" alt="Attitude Discute" className="w-full h-auto rounded shadow-sm aspect-square object-cover" />
                                <span className="text-xs font-semibold text-gray-700">Attitude Discute</span>
                            </div>
                        </div>
                        {/* Hidden input to submit the value */}
                        <input type="hidden" name="coverImage" value={coverImage} />
                    </div>
                </div>

                {/* Platforms & Guests */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 h-full">
                    <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2">Plateformes & Invités</h2>

                    <div className="space-y-3">
                        <input
                            type="url"
                            name="spotify"
                            value={spotify}
                            onChange={e => setSpotify(e.target.value)}
                            placeholder="Lien Spotify"
                            className="w-full px-4 py-2 rounded border border-gray-300 text-sm"
                        />
                        <input
                            type="url"
                            name="apple"
                            value={apple}
                            onChange={e => setApple(e.target.value)}
                            placeholder="Lien Apple Podcasts"
                            className="w-full px-4 py-2 rounded border border-gray-300 text-sm"
                        />
                        <input
                            type="url"
                            name="deezer"
                            value={deezer}
                            onChange={e => setDeezer(e.target.value)}
                            placeholder="Lien Deezer"
                            className="w-full px-4 py-2 rounded border border-gray-300 text-sm"
                        />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <label className="text-sm font-medium text-gray-700">Invités</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {guests.map((g, i) => (
                                <span key={i} className="bg-blue-50 text-blue-900 px-2 py-1 rounded text-sm border border-blue-100 flex items-center gap-1">
                                    {g}
                                    <button type="button" onClick={() => setGuests(guests.filter((_, idx) => idx !== i))} className="text-blue-400 hover:text-blue-600">&times;</button>
                                    <input type="hidden" name="guests" value={g} />
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={guestInput}
                                onChange={e => setGuestInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (guestInput.trim()) {
                                            setGuests([...guests, guestInput.trim()]);
                                            setGuestInput('');
                                        }
                                    }
                                }}
                                placeholder="Ajouter un invité..."
                                className="flex-1 px-3 py-1 rounded border border-gray-300 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (guestInput.trim()) {
                                        setGuests([...guests, guestInput.trim()]);
                                        setGuestInput('');
                                    }
                                }}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2">SEO Podcast</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-700">Meta Title <span className="text-xs text-gray-400">(60 chars max)</span></label>
                            <span className={`text-xs ${metaTitle.length > 60 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{metaTitle.length}/60</span>
                        </div>
                        <input type="text" name="metaTitle" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-700">Meta Description <span className="text-xs text-gray-400">(160 chars max)</span></label>
                            <span className={`text-xs ${metaDescription.length > 160 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{metaDescription.length}/160</span>
                        </div>
                        <textarea name="metaDescription" rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300"></textarea>
                    </div>
                </div>
            </div>

            {/* Description / Show Notes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2">Show Notes (Description)</h2>
                <RichEditor value={content} onChange={setContent} />
                <input type="hidden" name="content" value={content} />
            </div>

            <div className="flex justify-center pt-4 mb-12">
                <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow hover:shadow-lg transition-transform hover:scale-105 text-lg">
                    {initialData ? "Mettre à jour l'épisode" : "Publier l'épisode"}
                </button>
            </div>
        </form >
    );
}
