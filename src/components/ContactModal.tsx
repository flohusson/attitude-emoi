'use client';

import { useState, useActionState, useEffect } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { submitContactForm, ContactState } from '@/actions/contact';

const initialState: ContactState = {
    success: false,
    message: '',
};

export default function ContactModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

    // Close modal on success after a delay or manually
    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                setIsOpen(false);
                // Reset state logic would be needed here if we want to reopen clean,
                // but useActionState doesn't easily allow external reset without key trick.
                // For now, simpler is fine.
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state.success]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-8 py-3 rounded-full bg-secondary text-white font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
                Me contacter
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-primary/10 p-6 border-b border-primary/10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-foreground">Envie d'échanger ?</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 -mr-2 -mt-2 rounded-full hover:bg-black/5 transition-colors text-foreground/70 hover:text-foreground"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-foreground/70 leading-relaxed">
                        Vous pouvez m'écrire pour partager votre histoire, poser une question, ou simplement discuter.
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8">
                    {state.success ? (
                        <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                                <Send size={32} />
                            </div>
                            <p className="text-xl font-semibold text-foreground">{state.message}</p>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-5">

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
                                    Votre email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="exemple@email.com"
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${state.errors?.email ? 'border-red-500' : 'border-border'
                                        }`}
                                />
                                {state.errors?.email && (
                                    <p className="text-sm text-red-500">{state.errors.email[0]}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label htmlFor="category" className="block text-sm font-medium text-foreground/80">
                                    Sujet de votre message
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        defaultValue=""
                                        className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all ${state.errors?.category ? 'border-red-500' : 'border-border'
                                            }`}
                                    >
                                        <option value="" disabled>Sélectionnez une option</option>
                                        <option value="question">Poser une question</option>
                                        <option value="suggestion">Suggérer un sujet de podcast</option>
                                        <option value="participation">Participer à Attitude Discute</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-foreground/50">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                                {state.errors?.category && (
                                    <p className="text-sm text-red-500">{state.errors.category[0]}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-foreground/80">
                                    Votre message
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    placeholder="Dites-moi tout..."
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all ${state.errors?.description ? 'border-red-500' : 'border-border'
                                        }`}
                                ></textarea>
                                {state.errors?.description && (
                                    <p className="text-sm text-red-500">{state.errors.description[0]}</p>
                                )}
                            </div>

                            {state.message && !state.success && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {state.message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    "Envoyer mon message"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
