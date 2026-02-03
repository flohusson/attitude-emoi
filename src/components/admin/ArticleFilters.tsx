'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useRef, useCallback } from 'react';
import { NAVIGATION_ITEMS } from '@/lib/constants';

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

export default function ArticleFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const categoryOptions = NAVIGATION_ITEMS.filter(item => item.subItems);

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

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search */}
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Rechercher par titre..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('q')?.toString()}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* Status Filter */}
            <select
                onChange={(e) => handleFilterChange('status', e.target.value)}
                defaultValue={searchParams.get('status')?.toString() || 'all'}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
            >
                <option value="all">Tous les statuts</option>
                <option value="published">🚀 Publiés</option>
                <option value="draft">📝 Brouillons</option>
            </select>

            {/* Category Filter */}
            <select
                onChange={(e) => handleFilterChange('category', e.target.value)}
                defaultValue={searchParams.get('category')?.toString() || 'all'}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
            >
                <option value="all">Toutes les catégories</option>
                {categoryOptions.map((cat) => (
                    <option key={cat.label} value={cat.label}>{cat.label}</option>
                ))}
            </select>

            {/* Sort Order */}
            <select
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                defaultValue={searchParams.get('sort')?.toString() || 'desc'}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
            >
                <option value="desc">📅 Plus récent</option>
                <option value="asc">📅 Plus ancien</option>
            </select>
        </div>
    );
}
