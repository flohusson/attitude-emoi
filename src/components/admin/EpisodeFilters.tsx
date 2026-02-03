'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { useRef, useCallback } from 'react';

function useDebouncedCallback<T extends (...args: any[]) => void>(callback: T, delay: number) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}

export default function EpisodeFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        params.set('page', '1'); // Reset to page 1 on search
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleTypeChange = (type: string) => {
        const params = new URLSearchParams(searchParams);
        if (type && type !== 'all') {
            params.set('type', type);
        } else {
            params.delete('type');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams);
        if (sort) {
            params.set('sort', sort);
        } else {
            params.delete('sort');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-1/3">
                <input
                    type="text"
                    placeholder="Rechercher par titre..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('q')?.toString()}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                {/* Type Filter */}
                <select
                    onChange={(e) => handleTypeChange(e.target.value)}
                    defaultValue={searchParams.get('type')?.toString()}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
                >
                    <option value="all">Tous les types</option>
                    <option value="podcast">🎙️ Attitude Podcast</option>
                    <option value="discute">💬 Attitude Discute</option>
                </select>

                {/* Sort Order */}
                <select
                    onChange={(e) => handleSortChange(e.target.value)}
                    defaultValue={searchParams.get('sort')?.toString() || 'desc'}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
                >
                    <option value="desc">📅 Plus récent</option>
                    <option value="asc">📅 Plus ancien</option>
                </select>
            </div>
        </div>
    );
}
