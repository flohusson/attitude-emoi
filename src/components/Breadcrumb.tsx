import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="py-4">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
                {/* Home link */}
                <li className="flex items-center">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                    >
                        <Home size={16} />
                        <span>Accueil</span>
                    </Link>
                </li>

                {/* Breadcrumb items */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.href} className="flex items-center gap-2">
                            <ChevronRight size={16} className="text-gray-400" />
                            {isLast ? (
                                <span className="text-gray-900 font-medium" aria-current="page">
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
