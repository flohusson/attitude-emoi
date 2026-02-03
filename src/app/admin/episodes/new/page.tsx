import EpisodeEditor from "@/components/admin/EpisodeEditor";

export default async function NewEpisodePage({ searchParams }: { searchParams: Promise<{ returnUrl?: string }> }) {
    const { returnUrl } = await searchParams;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Nouvel Épisode</h1>
            <EpisodeEditor returnUrl={returnUrl || '/admin/episodes'} />
        </div>
    );
}
