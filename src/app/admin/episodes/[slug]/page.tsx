import { getEpisodeBySlug } from "@/lib/cms";
import EpisodeEditor from "@/components/admin/EpisodeEditor";
import { notFound } from "next/navigation";

export default async function EditEpisodePage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ returnUrl?: string }>;
}) {
    // Next.js 15: params is a Promise
    const { slug } = await params;
    const { returnUrl } = await searchParams;
    const episode = await getEpisodeBySlug(slug);

    if (!episode) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Modifier l'Épisode</h1>
            <EpisodeEditor initialData={episode} returnUrl={returnUrl || '/admin/episodes'} />
        </div>
    );
}
