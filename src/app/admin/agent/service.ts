import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { AGENT_PROTOCOL } from '@/lib/agent-protocol';
import { SEO_DATA } from '@/lib/seo-data';
import { EPISODE_MAPPING } from '@/lib/episode-mapping';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

const apiKey = process.env.GOOGLE_AI_KEY || '';

if (!apiKey) {
    throw new Error('GOOGLE_AI_KEY is not configured');
}

// Use default configuration without custom fetch or proxy
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export async function processMediaToArticle(file: File): Promise<Array<{
    title: string;
    content: string;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    mainKeyword?: string;
    seoKeywords?: string[];
    excerpt?: string;
    category?: string;
    subCategory?: string;
    tags?: string[];
    imagePrompts?: Array<{
        type: 'cover' | 'section';
        position: string;
        sectionTitle?: string;
        prompt: string;
        altText: string;
        aspectRatio: '16:9' | '1:1' | '4:3';
    }>;
}>> {
    let tempFilePath = '';

    try {
        console.log("Service Processing file:", file.name, file.type, file.size);

        // 1. Save to Temp File
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        tempFilePath = join(tmpdir(), `upload-${randomUUID()}-${file.name}`);
        await writeFile(tempFilePath, buffer);

        // 2. Upload to Google AI Studio
        const mimeType = file.type;

        console.log(`Attempting to upload file to Google AI...`);
        console.log(`- File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`- Mime type: ${mimeType}`);
        console.log(`- Temp path: ${tempFilePath}`);

        let uploadResult;
        try {
            uploadResult = await fileManager.uploadFile(tempFilePath, {
                mimeType,
                displayName: file.name,
            }) as any;
            console.log(`✅ Upload successful! File URI: ${uploadResult.file.uri}`);
        } catch (uploadError: any) {
            console.error('❌ Upload failed:', uploadError);
            throw new Error(`Échec de l'upload vers Google AI. Vérifiez votre connexion réseau et votre clé API. Détails: ${uploadError.message}`);
        }

        const fileUri = uploadResult.file.uri;

        // Wait for processing if audio
        if (mimeType.startsWith('audio') || mimeType.startsWith('video')) {
            let fileState = await fileManager.getFile(uploadResult.file.name) as any;

            // Helper to get state safely
            const getState = (fs: any) => fs.file?.state || fs.state;

            let currentState = getState(fileState);
            console.log(`Initial State: ${currentState}`);

            while (currentState === 'PROCESSING') {
                console.log("File is processing, waiting 2s...");
                await new Promise(r => setTimeout(r, 2000));
                fileState = await fileManager.getFile(uploadResult.file.name) as any;
                currentState = getState(fileState);
            }

            if (currentState === 'FAILED') {
                throw new Error("L'analyse audio par Google a échoué.");
            }
        }

        // 3. Prepare Strategy Context for AI
        const strategyContext = Object.entries(EPISODE_MAPPING).map(([num, data]) => {
            return `- Épisode "${data.title}" => Mot-clé Principal: "${data.mainKeyword}" | Secondaires: ${JSON.stringify(data.secondaryKeywords)}`;
        }).join('\n');

        // 4. Generate Content using JSON Mode
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest", // Reverting to the existing model alias
            systemInstruction: `Tu es un rédacteur web expert pour "Attitude Émoi".
            TA MISSION : Écouter l'audio et générer DEUX (2) articles de blog distincts au format JSON.
            
            ÉTAPE 1 : ANALYSE STRATÉGIQUE (IMPORTANT)
            Analyse le contenu de l'audio. Vérifie s'il correspond à l'un des sujets de la "Stratégie Éditoriale".

            TU DOIS CRÉER 2 ARTICLES SUR 2 SUJETS DIFFÉRENTS ABORDÉS DANS LE PODCAST :
            
            ⚠️ IMPORTANT : Attitude Émoi n'est PAS un site d'expertise, c'est un lieu de PARTAGE AUTHENTIQUE.
            
            Les 2 articles doivent être axés sur le TÉMOIGNAGE et le PARTAGE D'EXPÉRIENCE :
            
            📝 ARTICLE 1 - Premier sujet/thème abordé dans l'épisode
               - Titre : "Mon histoire avec...", "Comment j'ai vécu...", "Témoignage : ...", "Mon expérience de..."
               - Contenu : Focalisé sur le vécu, l'émotion, le parcours personnel, les leçons apprises
               - Ton : Intime, authentique, vulnérable, storytelling émotionnel
               - Angle : Partage d'expérience personnel, ressenti, transformation
            
            📝 ARTICLE 2 - Deuxième sujet/thème abordé dans l'épisode
               - Titre : "Ce que j'ai découvert sur...", "Vivre avec...", "Mon chemin vers...", "L'histoire de..."
               - Contenu : Autre aspect du podcast, autre dimension émotionnelle/personnelle
               - Ton : Sincère, empathique, partageur, sans prétention d'expertise
               - Angle : Partage d'un autre moment fort, autre facette du sujet
            
            
            --- STRATÉGIE ÉDITORIALE (MAPPING ÉPISODES) ---
            ${strategyContext}
            --- FIN STRATÉGIE ---

            --- HIERARCHIE DU SITE (CATÉGORIES & SOUS-CATÉGORIES) ---
            Utilise UNIQUEMENT ces valeurs pour 'category' et 'subCategory' :
            ${JSON.stringify(NAVIGATION_ITEMS.map(i => ({ category: i.label, subCategories: i.subItems?.map(s => s.label) || [] })), null, 2)}
            --- FIN HIERARCHIE ---

            SI l'audio correspond clairement à un épisode listé :
            -> TU DOIS UTILISER ses mots-clés spécifiques (Principal et Secondaires) pour les deux articles, en les adaptant légèrement.
            
            SINON (si c'est un sujet hors liste) :
            -> Choisis les mots-clés les plus pertinents dans cette liste globale :
            ${Object.keys(SEO_DATA).join('\n')}

            ÉTAPE 2 : RÉDACTION JSON
            Le JSON doit être un TABLEAU (Array) contenant exactement 2 objets articles. 
            Structure attendue :
            [
                { ...Article 1 (Expertise) ... },
                { ...Article 2 (Témoignage) ... }
            ]

            Chaque objet article doit avoir cette structure :
            {
                "title": "Titre H1 accrocheur (max 60 car.)",
                "slug": "slug-optimise-seo-unique",
                "metaTitle": "Mot-clé Principal : Titre court | Attitude Émoi",
                "metaDescription": "Description incitative en tutoyant (Découvre, Apprends, Explore...) Max 160 chars",
                "mainKeyword": "Le mot-clé principal",
                "seoKeywords": ["mot-clé 1", "mot-clé 2"],
                "excerpt": "Court résumé pour l'accueil",
                "category": "La Catégorie EXACTE",
                "subCategory": "La Sous-Catégorie EXACTE",
                "tags": ["tag1", "tag2"],
                "content": "Contenu complet en MARKDOWN...",
                "imagePrompts": [
                    {
                        "type": "cover",
                        "position": "hero",
                        "prompt": "Illustration...",
                        "altText": "Description SEO 80-125 chars",
                        "aspectRatio": "16:9"
                    },
                    {
                        "type": "section",
                        "position": "section-1",
                        "sectionTitle": "Titre du H2",
                        "prompt": "Illustration avec Mooki...",
                        "altText": "Description SEO",
                        "aspectRatio": "16:9"
                    }
                ]
            }

            🚨 RÈGLES STRICTES POUR imagePrompts (OBLIGATOIRE) 🚨
            
            TU DOIS GÉNÉRER EXACTEMENT 3 À 4 PROMPTS D'IMAGES POUR CHAQUE ARTICLE :
            
            ═══════════════════════════════════════════════════════════════════
            📸 METAPROMPT 1 : IMAGE DE COUVERTURE (type: "cover")
            ═══════════════════════════════════════════════════════════════════
            
            RÔLE : Tu es Directeur Artistique et Photographe Expert en "Lifestyle Minimaliste" et "Photographie Émotionnelle".
            
            OBJECTIF : Image Hero impactante capturant l'essence du sujet sans être littérale. AUCUN TEXTE.
            
            SPÉCIFICATIONS :
            - Position: "hero"
            - STYLE : Photographie Réaliste (préférence) OU Illustration Haut de Gamme
              • Si Photo: Grain fin, bokeh, lumière naturelle douce (Golden Hour/matin)
              • Si Illustration: Vectoriel premium, flat design texturé
            
            - PALETTE (CRITIQUE) :
              • Vert Sauge #96b094 : Dominant/Secondaire (Nature, apaisement)
              • Jaune Moutarde #f5c43d : Accent/Lumière (Chaleur, optimisme)
              • Tons neutres : Blanc cassé, beige, bois clair, gris chaud
              • INTERDIT : Fluo, rouge vif, noir pur excessif
            
            - FORMAT : 16:9 (Panoramique)
            - AMBIANCE : Douceur, introspection, calme, modernité, "Safe Place"
            
            EXEMPLE DE PROMPT :
            "A cinematic photorealistic shot of a thoughtful woman sitting at a minimalist wooden desk near a large window, bathed in soft morning light. Subtle sage green (#96b094) plants in the blurry foreground. Warm golden (#f5c43d) sunlight touches her shoulder. Calm but pensive atmosphere. High resolution, 16:9 aspect ratio, raw style."
            
            ═══════════════════════════════════════════════════════════════════
            🎨 METAPROMPT 2 : IMAGES DE SECTIONS (type: "section") - 2 à 3 images
            ═══════════════════════════════════════════════════════════════════
            
            RÔLE : Tu es Illustrateur Senior spécialisé en "Brand Characters" et storytelling visuel.
            
            OBJECTIF : Illustration mettant en scène l'INTERACTION entre Florian (humain) et Mooki (chat mascotte).
            
            SPÉCIFICATIONS :
            - Position: "section-1", "section-2", "section-3"
            - sectionTitle: Le titre EXACT du H2 correspondant
            
            - STYLE : Illustration Moderne / Flat Design / Ligne Claire
              • Traits simples, couleurs unies, fond épuré (blanc crème/beige)
            
            - PALETTE : Dominante #96b094 (vert sauge) + #f5c43d (jaune moutarde)
            
            - PERSONNAGES (DUO OBLIGATOIRE) :
            
              😺 MOOKI (Le Chat) :
                • Couleur : Vert Sauge #96b094
                • Style : Chat tigré Maine Coon minimaliste
                • Grands yeux, expression curieuse
                • Petite étoile ⭐ flottante près de sa tête (SIGNATURE)
              
              🙋‍♂️ FLORIAN (L'Hôte) :
                • Personnage masculin jeune, style "Cool & Bienveillant"
                • Look : Cheveux châtains courts, barbe légère (opt.), lunettes fines
                • Tenue : Sweat/T-shirt Jaune Moutarde #f5c43d OU Blanc avec logo vert
                • Pantalon beige/gris simple
                • Attitude : Empathique, pédagogue, calme
            
            - INTERACTION (CRITIQUE) :
              ⚠️ Ils doivent faire quelque chose ENSEMBLE :
              • Exemples : Florian montre un tableau et Mooki écoute
                          Florian réconforte Mooki
                          Ils méditent côte à côte
                          Ils observent quelque chose ensemble
            
            - FORMAT : 16:9 (Large)
            
            EXEMPLE DE PROMPT :
            "A modern flat design illustration. On the left, a minimalist young man (Florian) wearing a mustard yellow hoodie (#f5c43d) and glasses is sitting cross-legged, practicing deep breathing with a peaceful smile. Beside him, a cute sage green cat (Mooki, #96b094) mimics the pose with closed eyes and a floating sparkle (⭐) above its head. Soft off-white background with abstract floating green leaves. High vector quality, 16:9 ratio."
            
            ═══════════════════════════════════════════════════════════════════
            
            ⚠️ RÈGLES CRITIQUES :
            - NE JAMAIS OUBLIER ce champ imagePrompts
            - Toujours 3-4 items minimum (1 cover + 2-3 sections)
            - altText: optimisé SEO avec mot-clé (80-125 caractères)
            - Couleurs #96b094 et #f5c43d OBLIGATOIRES dans TOUS les prompts
            - Image de couverture : SANS Mooki ni Florian
            - Images de sections : AVEC le DUO Florian + Mooki en INTERACTION
            - Aucun texte dans les images
            - aspectRatio: "16:9" pour tous

            IMPORTANT : PERSONA & TON (Commun aux deux)
            Tu es Florian, l'hôte du podcast "Attitude Émoi".
            - Ton : Empathique, authentique, vulnérable mais expert.
            - Style conversationnel avec tournures personnelles : "Certes", "J'avoue que", "vous vous doutez bien"
            - Détails personnels concrets : Lieux (Lyon, Bali), dates, anecdotes précises
            - Transitions douces : "D'ailleurs", "Pourtant", "Cela dit"
            - Guillemets français : « texte », pas "texte"
            - Paragraphes courts : 2-4 phrases maximum
            - Nuances et honnêteté : "En tout cas c'est une réflexion que j'ai eu et que je maintiens encore en partie"
            - Parenthèses pour précisions : (loin de là !), (je rentrais chaque weekend)
            - Questions au lecteur pour engagement : "Si vous aussi", "Alors si vous êtes"
            
            EXEMPLES DE TOURNURES À REPRODUIRE :
            ✅ "Ces mots... m'ont d'abord provoqué un sourire niais avant de laisser place à un électrochoc"
            ✅ "Mon cerveau, déjà expert en overthinking, s'était bien entendu mis à mouliner"
            ✅ "Ce stress de la nouveauté est typique et je le sais maintenant"
            ✅ "J'avoue que quand mon amie kinésiologue a pris la parole, j'étais intrigué"
            ✅ "Rien de plus banal à vrai dire, mais je n'avais jamais fait le lien"
            ❌ Éviter : style trop formel, phrases longues, tournures impersonnelles
            
            📊 RÈGLES SEO STRICTES - META DONNÉES :
            
            🔹 metaTitle (MAX 60 CARACTÈRES) :
            - STRUCTURE OBLIGATOIRE : "Mot-clé Principal : Titre court | Attitude Émoi"
            - Commencer par le mot-clé principal
            - Terminer par "| Attitude Émoi" pour renforcer la marque
            - EXEMPLES :
              ✅ "Hypersensibilité : Vivre ses émotions | Attitude Émoi" (54 chars)
              ✅ "Overthinking : Gérer ses pensées | Attitude Émoi" (50 chars)
              ❌ "Comment vivre avec l'hypersensibilité au quotidien" (trop long, pas de branding)
            
            🔹 metaDescription (MAX 160 CARACTÈRES) :
            - TUTOIEMENT OBLIGATOIRE dans les verbes d'action
            - Verbes d'action à utiliser : Découvre, Apprends, Explore, Plonge, Comprends, Ressens
            - Inciter à l'action tout en restant empathique
            - EXEMPLES :
              ✅ "Découvre comment vivre ton hypersensibilité au quotidien. Des témoignages authentiques et des pistes concrètes pour t'épanouir avec tes émotions." (155 chars)
              ✅ "Apprends à gérer l'overthinking avec des stratégies simples. Explore mon parcours et trouve des clés pour apaiser ton mental." (128 chars)
              ❌ "Découvrez comment..." (vouvoiement interdit)
              ❌ "Cet article parle de..." (pas d'action, trop impersonnel)
            
            IMPORTANT : ACCROCHE & INTRODUCTION
            - L'article DOIT COMMENCER par un passage/extrait marquant de l'épisode (citation, moment fort)
            - Format EXACT à suivre (citation sans nom de l'auteur) : 
              
              > "J'avais mon habitude, c'était simple, ma mère venait me chercher à l'école le midi et le soir."
              
              Puis enchaîner directement avec l'accroche personnelle (2-3 phrases qui résonnent avec la citation)
            
            - ⛔ NE JAMAIS ajouter le nom de la personne après la citation
            - ⛔ NE REPRENDS PAS l'introduction générique de l'épisode podcast
            - ✅ Choisis un MOMENT FORT SPÉCIFIQUE lié au sujet de l'article
            - ✅ Puis écris une accroche personnelle authentique qui résonne avec ce moment
            
            📖 EXEMPLE DE RÉFÉRENCE - STRUCTURE ET STYLE À REPRODUIRE :
            
            Voici un article modèle qui respecte PARFAITEMENT le style, la longueur et la structure attendus :
            
            OUVERTURE :
            > "J'avais mon habitude, c'était simple, ma mère venait me chercher à l'école le midi et le soir..."
            
            [3 paragraphes d'accroche personnelle vulnérable]
            
            [button link="..."]Écouter l'épisode[/button]
            
            ## H2 Principal 1
            [Paragraphes développés, storytelling]
            
            ### H3 Sous-section
            [Détails, anecdotes]
            
            [media index="1"]
            
            [Lien interne] vers article connexe
            
            ## H2 Principal 2
            [...]
            
            Florian.
            
            [button link="..."]Écouter l'épisode[/button]
            
            ## Questions fréquentes
            
            ### Question 1 ?
            Réponse détaillée...
            
            🔗 MAILLAGE INTERNE OBLIGATOIRE :
            - SUGGÈRE 1 à 2 LIENS INTERNES vers d'autres articles du site dans le contenu
            - Place-les naturellement dans le texte (pas en fin d'article)
            - Utilise la syntaxe markdown : [Texte du lien](/categorie/sous-categorie/slug-article)
            - Choisis des articles connexes au sujet traité pour renforcer le SEO
            - Exemple : "Si tu veux approfondir ce sujet, j'ai aussi écrit sur [la gestion des émotions](/hypersensibilite/emotions/gerer-ses-emotions)"
            
            ⚠️ CONSIGNES STRICTES BASÉES SUR CET EXEMPLE :
            - Longueur : 1500-1800 mots minimum
            - Structure : 3-4 H2 avec H3 en sous-sections
            - Bouton écoute : OBLIGATOIRE au début ET à la fin
            - Images : 2-3 balises [media index="X"]
            - Liens internes : 2-3 minimum vers articles connexes
            - Signature : "Florian." juste avant le bouton final
            - People Also Ask : 3 questions minimum en H3 simple
            
            ⚠️ IMPORTANT : PEOPLE ALSO ASK (Format Simple)
            À la fin de l'article, ajoute une section H2 "Questions fréquentes" suivie de 3-6 questions au format "People Also Ask" :
            
            Format EXACT à utiliser dans le contenu :
            
            ## Questions fréquentes
            
            ### Question 1 avec point d'interrogation ?
            Réponse concise et complète en texte normal (2-4 phrases). Optimisée pour les featured snippets Google.
            
            ### Question 2 avec point d'interrogation ?
            Autre réponse détaillée...
            
            - OBLIGATOIRE : 3 à 6 questions minimum
            - Chaque question doit être en H3 (###)
            - Les questions doivent viser la longue traîne SEO
            - Les réponses doivent être en texte normal (pas de H3 pour les réponses)
            - Optimiser pour les featured snippets Google
            
            IMPORTANT : FORMATAGE SEO (Commun)
            - Mettre en gras (**mot-clé**) les occurrences SEO.
            - Maillage interne OBLIGATOIRE (2-3 liens).
            - Bouton d'écoute [button-listen] OBLIGATOIRE (intro + conclusion).

            IMPORTANT : IMAGES & MOOKI (Commun)
            - Les prompts doivent "illustrer" les parties spécifiques du texte généré.
            - Mooki (chat vert) DOIT être présent sur les images de section.
            
            IMPORTANT : ALT-TEXT (Commun)
            - Optimisé SEO (80-125 caractères).

            Respecte le protocole suivant pour structurer le champ 'content' :
            ${AGENT_PROTOCOL}
            `
        });

        let result;
        let attempt = 0;
        const maxAttempts = 5; // Increased resilience
        const delays = [2000, 5000, 10000, 20000, 30000]; // Explicit backoff strategy

        while (attempt < maxAttempts) {
            try {
                result = await model.generateContent({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { fileData: { mimeType: uploadResult.file.mimeType, fileUri: fileUri } },
                                { text: "Génère le TABLEAU JSON des 2 articles maintenant." }
                            ]
                        }
                    ],
                    generationConfig: {
                        responseMimeType: "application/json",
                        maxOutputTokens: 8192, // Ensure enough space for 2 articles
                        temperature: 0.7
                    }
                });
                break; // Success
            } catch (error: any) {
                attempt++;
                console.warn(`⚠️ Gemini API Error [Attempt ${attempt}/${maxAttempts}]:`, error.message);

                if (attempt === maxAttempts) {
                    throw new Error(`Échec critique après ${maxAttempts} tentatives. Le service Google est trop saturé. Réessayez dans 5 minutes.`);
                }

                // Wait before retry
                const waitTime = delays[attempt - 1] || 30000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }

        if (!result) {
            throw new Error("Erreur inattendue : Aucune réponse de l'IA.");
        }

        let jsonString = result.response.text();
        console.log("=== GEMINI RAW RESPONSE ===");
        console.log(jsonString.substring(0, 500)); // First 500 chars
        console.log("=== END RAW RESPONSE ===");

        // ROBUST JSON EXTRACTION
        // 1. Locate the outer array bracket
        const firstBracket = jsonString.indexOf('[');
        const lastBracket = jsonString.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonString = jsonString.substring(firstBracket, lastBracket + 1);
        } else {
            // Fallback: locate object braces if it returned a single object
            const firstBrace = jsonString.indexOf('{');
            const lastBrace = jsonString.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                jsonString = '{' + jsonString.substring(firstBrace, lastBrace + 1) + '}';
            } else {
                console.error("❌ NO JSON STRUCTURE FOUND.");
                console.error("Full response:\n", jsonString);
                throw new Error("Aucune structure JSON trouvée dans la réponse de l'IA.");
            }
        }

        // 2. Clean common markdown or control characters remaining
        jsonString = jsonString.trim();

        // Attempt to parse
        let dataArray: any[];
        try {
            dataArray = JSON.parse(jsonString);
        } catch (e) {
            console.error("❌ JSON Parse Error, attempting to clean control characters...", e);
            console.error("📄 Problematic JSON (first 500 chars):", jsonString.substring(0, 500));

            // More aggressive sanitization for control characters
            const sanitizedString = jsonString.replace(/[\u0000-\u001F]+/g, (match) => {
                if (match === '\n') return '\\n';
                if (match === '\r') return '';
                if (match === '\t') return '\\t';
                return '';
            });

            try {
                dataArray = JSON.parse(sanitizedString);
            } catch (e2) {
                console.error("❌ Raw JSON failure (first 1000 chars):", jsonString.substring(0, 1000));
                console.error("❌ Sanitized attempt (first 1000 chars):", sanitizedString.substring(0, 1000));
                throw new Error("Impossible de parser le JSON retourné par l'IA. La réponse est probablement tronquée. Réessayez avec un fichier audio plus court.");
            }
        }

        // Ensure it is an array
        if (!Array.isArray(dataArray)) {
            // Fallback if it returned a single object instead of array
            dataArray = [dataArray];
        }

        console.log(`✅ Parsed ${dataArray.length} articles from AI response.`);

        // Process each article in the array (Self-Correction Loop)
        for (let i = 0; i < dataArray.length; i++) {
            let article = dataArray[i];
            let modified = false;

            // --- SEF-CORRECTION SEO ---
            if (
                (article.metaTitle && article.metaTitle.length > 60) ||
                (article.metaDescription && article.metaDescription.length > 160)
            ) {
                console.log(`⚠️ Article ${i + 1}: SEO Metadata too long. Triggering REWRITE...`);
                const seoRequest = `
                    CONTEXTE : Tu as généré des méta-données TROP LONGUES pour le SEO.
                    TITRE ACTUEL (${article.metaTitle?.length || 0} chars) : "${article.metaTitle}" (MAX 60 AUTORISÉ)
                    DESC ACTUELLE (${article.metaDescription?.length || 0} chars) : "${article.metaDescription}" (MAX 160 AUTORISÉ)

                    MISSION : Réécris ces deux champs pour qu'ils respectent STRICTEMENT les limites.
                    
                    RÈGLES TITLE :
                    - DOIT finir par "| Attitude Émoi"
                    - MAX 60 caractères (Espaces inclus) ! CRITIQUE !
                    - Si besoin, raccourcis le début.
                    
                    RÈGLES DESC :
                    - MAX 160 caractères.
                    - Tutoiement.

                    FORMAT JSON ATTENDU :
                    {
                        "metaTitle": "Title corrigé | Attitude Émoi",
                        "metaDescription": "Description corrigée..."
                    }
                `;

                try {
                    const seoResult = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: seoRequest }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    });
                    const seoJson = JSON.parse(seoResult.response.text());
                    if (seoJson.metaTitle) article.metaTitle = seoJson.metaTitle;
                    if (seoJson.metaDescription) article.metaDescription = seoJson.metaDescription;
                    console.log(`✅ SEO RECOVERY SUCCESS: Title=${article.metaTitle?.length}, Desc=${article.metaDescription?.length}`);
                    modified = true;
                } catch (err: any) {
                    console.error("❌ SEO RECOVERY FAILED", err.message);
                }
            }

            // --- SELF-CORRECTION MISSING IMAGES ---
            // Check if prompts exist AND seem valid (at least 2 items)
            if (!article.imagePrompts || !Array.isArray(article.imagePrompts) || article.imagePrompts.length < 2) {
                console.log(`⚠️ Article ${i + 1}: Image Prompts missing or incomplete. Triggering FORCE RECOVERY with Context...`);

                // Extract context from the generated content to ensure relevance
                const contentContext = article.content ? article.content.substring(0, 4000) : "Contenu manquant.";

                const imagePromptRequest = `
                    CONTEXTE : Tu as généré l'article suivant mais tu as OUBLIÉ les prompts d'images.
                    TITRE : "${article.title}"
                    EXTRAIT CONTENU : 
                    """
                    ${contentContext}
                    ...
                    """
                    
                    MISSION : Analyse ce contenu et génère un JSON valide contenant UNIQUEMENT la clé "imagePrompts".
                    Les images doivent illustrer les H2/Sections spécifiques du texte ci-dessus.
                    
                    FORMAT ATTENDU : 
                    {
                      "imagePrompts": [
                        { "type": "cover", "position": "hero", "prompt": "...", "altText": "...", "aspectRatio": "16:9" },
                        { "type": "section", "position": "section-1", "sectionTitle": "Titre du H2", "prompt": "...", "altText": "...", "aspectRatio": "16:9" }
                      ]
                    }
                    RÈGLES : 1 Couverture (Sans Mooki) + 2 Images Section (AVEC Mooki le chat vert d'Attitude Émoi).
                `;

                try {
                    const imageResult = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: imagePromptRequest }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    });
                    const imageJson = JSON.parse(imageResult.response.text());
                    if (imageJson.imagePrompts && Array.isArray(imageJson.imagePrompts)) {
                        article.imagePrompts = imageJson.imagePrompts;
                        console.log(`✅ RECOVERY SUCCESS: Generated ${article.imagePrompts.length} prompts for article ${i + 1}`);
                        modified = true;
                    }
                } catch (err) {
                    console.error("❌ RECOVERY FAILED for article " + (i + 1), err);
                }
            }
        }

        // Return processed array
        return dataArray.map((data, index) => {
            const content = data.content || "";
            const title = data.title || `Article ${index + 1}`;

            // Ensure slug is clean
            const safeSlug = (data.slug || title)
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const finalSlug = `${safeSlug}-${randomUUID().slice(0, 4)}`;

            // Helper: Safe Truncate
            const truncate = (str: string | undefined, length: number) => {
                if (!str) return undefined;
                return str.length > length ? str.substring(0, length - 3) + '...' : str;
            };

            // Helper: Safe Tag List
            const safeTags = (tags: any) => {
                if (Array.isArray(tags)) return tags;
                if (typeof tags === 'string') return tags.split(',').map(t => t.trim());
                return [];
            };

            // Helper: Safe Image Prompts
            const safeImagePrompts = (prompts: any[]) => {
                if (!Array.isArray(prompts)) return [];
                return prompts.map(p => {
                    if (typeof p === 'string') {
                        try { return JSON.parse(p); } catch (e) { return null; }
                    }
                    return p;
                }).filter(p => p !== null && typeof p === 'object');
            };

            return {
                title: truncate(title, 100) || "Sans titre",
                content,
                slug: finalSlug,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                mainKeyword: data.mainKeyword,
                seoKeywords: safeTags(data.seoKeywords),
                excerpt: data.excerpt,
                category: data.category || "Podcast",
                subCategory: data.subCategory,
                tags: safeTags(data.tags),
                imagePrompts: safeImagePrompts(data.imagePrompts)
            };
        });

    } finally {
        if (tempFilePath) {
            try { await unlink(tempFilePath); } catch (e) { /* ignore */ }
        }
    }
}
