'use client';

import { useState } from 'react';

// Wrapper Component
export default function Accordion({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full space-y-4 my-8">
            {children}
        </div>
    );
}

// Item Component
interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
}

export function AccordionItem({ title, children }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left group focus:outline-none"
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                    {title}
                </span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="text-gray-600 leading-relaxed font-light">
                    {children}
                </div>
            </div>
        </div>
    );
}
