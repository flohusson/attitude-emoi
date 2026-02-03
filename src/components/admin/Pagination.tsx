'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                >
                    Précédent
                </Link>
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                >
                    Suivant
                </Link>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <Link
                            href={createPageUrl(currentPage - 1)}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <span className="sr-only">Précédent</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </Link>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={createPageUrl(page)}
                                aria-current={page === currentPage ? 'page' : undefined}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                                    ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                            >
                                {page}
                            </Link>
                        ))}

                        <Link
                            href={createPageUrl(currentPage + 1)}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <span className="sr-only">Suivant</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
