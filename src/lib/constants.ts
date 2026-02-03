// Base URL for the site, favoring environment variable but falling back to Vercel app URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://attitude-emoi-platform.vercel.app';

// Category Colors (Green/Yellow University)
export const CATEGORY_COLORS: Record<string, string> = {
    "Hypersensibilité": "bg-[#f5c43d] text-white border-none", // Brand Yellow
    "Masculinité & sensibilité": "bg-[#96b094] text-white border-none", // Brand Green
    "Relations": "bg-[#d4c57e] text-white border-none", // Khaki/Gold (Mix)
    "Santé mentale": "bg-[#b8c9b6] text-white border-none", // Light Olive
    "Default": "bg-gray-100 text-gray-600"
};

// Navigation Types
export interface NavSubItem {
    label: string;
    href: string;
}

export interface NavSection {
    label: string;
    href: string;
    slug: string;
    subItems: NavSubItem[];
}

export interface NavItem {
    label: string;
    href: string;
    slug?: string;
    subItems?: NavSubItem[]; // Legacy support or direct dropdowns
    sections?: NavSection[]; // For Mega Menus
}

export const NAVIGATION_ITEMS: NavItem[] = [
    {
        label: "Blog",
        href: "/blog",
        sections: [
            {
                label: "Hypersensibilité",
                href: "/blog/hypersensibilite",
                slug: "hypersensibilite",
                subItems: [
                    { label: "Vivre l'hypersensibilité", href: "/blog/hypersensibilite/vivre-hypersensibilite" },
                    { label: "Les signes principaux", href: "/blog/hypersensibilite/signes" },
                    { label: "Masculinité et sensibilité", href: "/blog/hypersensibilite/masculinite-sensibilite" },
                ]
            },
            {
                label: "Relations",
                href: "/blog/relations-et-attachement",
                slug: "relations-et-attachement",
                subItems: [
                    { label: "Attachement anxieux", href: "/blog/relations-et-attachement/attachement-anxieux" },
                    { label: "Dépendance affective", href: "/blog/relations-et-attachement/dependance-affective" },
                    { label: "Relations amoureuses", href: "/blog/relations-et-attachement/amour" },
                    { label: "Relations familiales", href: "/blog/relations-et-attachement/famille" },
                ]
            },
            {
                label: "Santé mentale",
                href: "/blog/sante-mentale",
                slug: "sante-mentale",
                subItems: [
                    { label: "Le pouvoir des animaux", href: "/blog/sante-mentale/animaux" },
                    { label: "Faire une thérapie", href: "/blog/sante-mentale/therapie" },
                    { label: "Voyager seul", href: "/blog/sante-mentale/voyage-solo" },
                    { label: "Donner du sens à sa vie", href: "/blog/sante-mentale/sens-vie" },
                ]
            }
        ]
    },
    {
        label: "Podcast",
        href: "/podcast",
    },
    {
        label: "À propos",
        href: "/a-propos",
    },
];

// Helper to generate hierarchical URLs
export function getArticleUrl(article: { slug: string, category: string, subCategory?: string }) {
    // Flatten navigation items to find category easily
    // We treat 'sections' as top-level categories for URL generation
    const allItems: (NavItem | NavSection)[] = [];

    NAVIGATION_ITEMS.forEach(item => {
        if (item.sections) {
            allItems.push(...item.sections);
        } else {
            allItems.push(item);
        }
    });

    const categoryItem = allItems.find(item => item.label === article.category);

    if (!categoryItem || !categoryItem.slug) {
        // Fallback or default
        return `/articles/${article.slug}`;
    }

    let url = `/blog/${categoryItem.slug}`;

    if (article.subCategory && categoryItem.subItems) {
        const subItem = categoryItem.subItems.find(sub => sub.label === article.subCategory);
        if (subItem) {
            // Extract subcategory part from href (e.g. /category/subcategory -> subcategory)
            const parts = subItem.href.split('/');
            const subSlug = parts[parts.length - 1];
            url += `/${subSlug}`;
        }
    }

    url += `/${article.slug}`;
    return url;
}
