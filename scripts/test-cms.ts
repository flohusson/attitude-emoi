import { saveArticle, getArticles } from '../src/lib/cms';

async function testCms() {
    console.log("Testing CMS...");

    const testArticle = {
        title: "Article Test Automatique",
        slug: "test-auto",
        date: new Date().toISOString(),
        category: "Hypersensibilité" as const,
        tags: ["test"],
        featured: false,
        status: "draft" as const,
        seo: {
            metaTitle: "Titre Meta Test",
            metaDescription: "Desc Meta Test"
        },
        additionalMedia: []
    };

    const content = "# Ceci est un test\n\nContenu de l'article de test.";

    try {
        console.log("Saving article...");
        await saveArticle(testArticle, content);
        console.log("Article saved.");

        console.log("Reading articles...");
        const articles = await getArticles();
        console.log(`Found ${articles.length} articles.`);

        const found = articles.find(a => a.slug === 'test-auto');
        if (found) {
            console.log("SUCCESS: Test article found!");
        } else {
            console.error("FAILURE: Test article not found.");
            process.exit(1);
        }

    } catch (error) {
        console.error("Error during test:", error);
        process.exit(1);
    }
}

testCms();
