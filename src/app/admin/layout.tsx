
import Link from "next/link";
import { LayoutDashboard, PenSquare, Globe, LogOut, Sparkles } from 'lucide-react';


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-bold text-xl text-primary">Attitude Émoi</Link>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">ADMIN</span>
                        <Link href="/admin/trash" className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm ml-2" title="Corbeille (Undo)">
                            <span>↩️</span> <span className="hidden sm:inline">Corbeille</span>
                        </Link>
                    </div>
                    <nav className="flex gap-4 text-sm font-medium">
                        <Link href="/admin" className="hover:text-primary">Articles</Link>
                        <Link href="/admin/episodes" className="hover:text-primary">Épisodes</Link>
                        <Link href="/admin/agent" className="hover:text-primary">Agent rédaction</Link>
                        <Link href="/" target="_blank" className="text-gray-400 hover:text-gray-600">Voir le site ↗</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
