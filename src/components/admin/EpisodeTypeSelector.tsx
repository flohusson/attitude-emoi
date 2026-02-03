'use client';

import { useTransition } from 'react';
import { updateEpisodeTypeAction } from '@/app/actions';

interface EpisodeTypeSelectorProps {
    slug: string;
    currentType: 'podcast' | 'discute';
}

export default function EpisodeTypeSelector({ slug, currentType }: EpisodeTypeSelectorProps) {
    const [isPending, startTransition] = useTransition();

    const toggleType = () => {
        const newType = currentType === 'podcast' ? 'discute' : 'podcast';
        startTransition(async () => {
            await updateEpisodeTypeAction(slug, newType);
        });
    };

    return (
        <button
            onClick={toggleType}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border transition-all cursor-pointer ${currentType === 'discute'
                    ? 'bg-[#96b094]/20 text-[#5f7a5d] border-[#96b094]/30 hover:bg-[#96b094]/30' // Brand Green
                    : 'bg-[#f5c43d]/20 text-[#9e7b23] border-[#f5c43d]/30 hover:bg-[#f5c43d]/30' // Brand Yellow
                } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
            title="Cliquez pour changer le type"
        >
            {currentType === 'discute' ? '💬 Discute' : '🎙️ Podcast'}
            {isPending && <span className="animate-spin ml-1">↻</span>}
        </button>
    );
}
