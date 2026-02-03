
import { NAVIGATION_ITEMS } from './constants';

export function determineCategories(title: string, description: string): string[] {
    const text = (title + " " + description).toLowerCase();

    // Define keywords for each main category
    const rules = [
        {
            category: "Masculinité & sensibilité",
            keywords: ["homme", "masculin", "virilité", "père", "garçon", "papa"]
        },
        {
            category: "Relations",
            keywords: ["relation", "couple", "amour", "anniversaire", "rupture", "dépendance", "attachement", "anxieux", "évitant", "toxique", "ex", "rencontre", "appli", "dating", "mère", "maman", "parents", "copine", "conjoint", "mari"]
        },
        {
            category: "Santé mentale",
            keywords: ["thérapie", "psy", "mental", "dépression", "burnout", "angoisse", "stress", "bien-être", "bonheur", "joie", "tristesse", "colère", "hpi", "hpe", "zèbre", "voyage", "sens"]
        },
        {
            category: "Hypersensibilité",
            keywords: ["hypersensib", "sensibili", "émotion", "overthinking", "pensée", "cerveau"]
        }
    ];

    const matched: string[] = [];
    for (const rule of rules) {
        if (rule.keywords.some(k => text.includes(k))) {
            matched.push(rule.category);
        }
    }
    return matched;
}
