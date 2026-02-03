'use server';

import { z } from 'zod';

const contactSchema = z.object({
    email: z.string().email("L'adresse email n'est pas valide"),
    category: z.enum([
        "question",
        "suggestion",
        "participation"
    ]),
    description: z.string().min(10, "Votre message doit contenir au moins 10 caractères"),
});

export type ContactState = {
    success?: boolean;
    message?: string;
    errors?: {
        email?: string[];
        category?: string[];
        description?: string[];
    };
};

export async function submitContactForm(prevState: ContactState, formData: FormData): Promise<ContactState> {
    const validatedFields = contactSchema.safeParse({
        email: formData.get('email'),
        category: formData.get('category'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Veuillez corriger les erreurs dans le formulaire.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Simulation d'envoi (LOG)
    console.log('--- NOUVEAU MESSAGE DE CONTACT ---');
    console.log('Email:', validatedFields.data.email);
    console.log('Catégorie:', validatedFields.data.category);
    console.log('Message:', validatedFields.data.description);
    console.log('----------------------------------');

    // Délai artificiel pour l'UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: "Merci ! Votre message a bien été envoyé. Je vous répondrai dès que possible.",
    };
}
