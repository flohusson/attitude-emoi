import Link from "next/link";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default function NewArticlePage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Rédiger un nouvel article</h1>
                <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">← Retour au dashboard</Link>
            </div>
            <ArticleEditor />
        </div>
    );
}
