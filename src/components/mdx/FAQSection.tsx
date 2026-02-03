'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: ReactNode;
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 px-2 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-medium text-gray-900 pr-4">{question}</span>
                <ChevronDown
                    className={`flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {isOpen && (
                <div className="px-2 pb-4 text-gray-700">
                    <div className="prose prose-stone max-w-none">
                        {answer}
                    </div>
                </div>
            )}
        </div>
    );
}

interface FAQSectionProps {
    items: { question: string; answer: ReactNode }[];
}

export default function FAQSection({ items }: FAQSectionProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {items.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
        </div>
    );
}
