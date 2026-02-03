"use client";

import { useState } from 'react';

import Link from 'next/link';

type Question = {
    id: number;
    text: string;
};

const QUESTIONS: Question[] = [
    { id: 1, text: "Je suis conscient(e) des subtiles nuances de mon environnement." },
    { id: 2, text: "L'humeur des autres me touche." },
    { id: 3, text: "Je suis très sensible à la douleur." },
    { id: 4, text: "J'ai besoin de me retirer pendant les journées frénétiques, dans un endroit calme et sans stimulation." },
    { id: 5, text: "Je suis particulièrement sensible aux effets de la caféine." },
    { id: 6, text: "Je suis facilement terrassé(e) par les lumières violentes, les odeurs fortes, les tissus grossiers ou les sirènes proches." },
    { id: 7, text: "J'ai une vie intérieure riche et complexe." },
    { id: 8, text: "Le bruit me dérange." },
    { id: 9, text: "Les arts et la musique suscitent en moi une émotion profonde." },
    { id: 10, text: "Je suis une personne consciencieuse." },
    { id: 11, text: "Je sursaute facilement." },
    { id: 12, text: "Je m'énerve lorsque j'ai beaucoup à faire en peu de temps." },
    { id: 13, text: "Lorsque les autres se sentent mal à l'aise dans leur environnement, je sais ce qu'il faut faire pour les soulager (éclairage, sièges...)." },
    { id: 14, text: "Je perds mes moyens lorsqu'on essaie de me faire faire trop de choses à la fois." },
    { id: 15, text: "J'essaie vraiment d'éviter de commettre des erreurs ou des oublis." },
    { id: 16, text: "Je fais en sorte d'éviter les films et les émissions qui contiennent des scènes de violence." },
    { id: 17, text: "Je m'énerve lorsque beaucoup de choses se passent autour de moi." },
    { id: 18, text: "La faim provoque en moi une forte réaction, perturbe ma concentration et mon humeur." },
    { id: 19, text: "Les changements qui se produisent dans ma vie m'ébranlent." },
    { id: 20, text: "Je remarque et j'apprécie les parfums et les goûts délicats, les bruits doux, les subtiles œuvres d'art." },
    { id: 21, text: "Je fais mon possible pour éviter les situations inquiétantes ou perturbatrices." },
    { id: 22, text: "Lorsque je dois rivaliser avec d'autres ou être observé(e) au travail, je perds mon sang-froid et suis moins performant(e)." },
    { id: 23, text: "Lorsque j'étais enfant, mes parents ou mes enseignants semblaient me considérer comme sensible ou timide." }
];

export default function HypersensitivityTest() {
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (value: number) => {
        setScore(prev => prev + value);

        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const resetTest = () => {
        setStarted(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
    };

    const getResultContent = () => {
        // Elaine Aron's scoring: 12 or more indicates high sensitivity
        if (score >= 14) {
            return {
                title: "Vous êtes très probablement hypersensible",
                description: (<>Vous avez répondu OUI à <strong>{score} questions sur 23</strong>. Selon Elaine Aron, un score supérieur à 14 indique une très haute sensibilité. Vous ressentez le monde avec une intensité particulière.</>),
                color: "text-[#f5c43d]" // Brand Yellow
            };
        } else if (score >= 10) {
            return {
                title: "Vous avez une sensibilité élevée",
                description: (<>Vous avez répondu OUI à <strong>{score} questions sur 23</strong>. Vous présentez de nombreux traits de l'hypersensibilité. Sans être extrême, votre sensibilité influence votre quotidien.</>),
                color: "text-[#96b094]" // Brand Green
            };
        } else {
            return {
                title: "Votre sensibilité semble modérée",
                description: (<>Vous avez répondu OUI à <strong>{score} questions sur 23</strong>. Vous ne semblez pas présenter les traits caractéristiques de la haute sensibilité, bien que chacun ait sa propre sensibilité.</>),
                color: "text-gray-700"
            };
        }
    };

    if (!started) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-[#f5c43d] p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Test officiel d'Elaine Aron</h2>
                    <p className="text-white/90">Découvrez votre profil émotionnel en quelques minutes</p>
                </div>
                <div className="p-8 space-y-6">
                    {/* Elaine Aron Bio Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#f5c43d]/30 shadow-md">
                            <img
                                src="/images/elaine-aron.png"
                                alt="Dr. Elaine Aron"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="font-bold text-gray-800 mb-1">Dr. Elaine Aron</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Psychologue américaine et chercheuse, Dr. Aron est la pionnière de l'étude de l'hypersensibilité.
                                Elle a popularisé le concept de « Personne Hautement Sensible » (HSP) en 1996 avec son livre
                                <em className="text-[#b89126]"> The Highly Sensitive Person</em>, traduit en 21 langues.
                            </p>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Ce test comporte <strong>23 questions simples</strong> issues de ses travaux scientifiques.
                            <br /><br />
                            <em>Répondez spontanément par OUI si cela s'applique à vous, ou par NON dans le cas contraire.</em>
                        </p>
                        <button
                            onClick={() => setStarted(true)}
                            className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all bg-[#f5c43d] rounded-full hover:bg-[#e0b135] shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Commencer le test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showResult) {
        const result = getResultContent();
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-12 text-center space-y-6">
                    <div className="text-6xl mb-4">✨</div>
                    <h2 className={`text-3xl font-bold ${result.color} mb-4`}>{result.title}</h2>
                    <p className="text-gray-600 text-lg">{result.description}</p>

                    <div className="pt-8 grid gap-4 md:grid-cols-2">
                        <button
                            onClick={resetTest}
                            className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Refaire le test
                        </button>
                        <Link
                            href="/blog"
                            className="px-6 py-3 bg-[#96b094] text-white font-bold rounded-xl hover:bg-[#859f83] shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            <span>En savoir plus</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 min-h-[400px] flex flex-col">
            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 w-full">
                <div
                    className="h-full bg-[#f5c43d] transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 block">
                    Question {currentQuestionIndex + 1} / {QUESTIONS.length}
                </span>

                <h3 className="text-2xl font-medium text-gray-800 mb-12 leading-snug">
                    {QUESTIONS[currentQuestionIndex].text}
                </h3>

                <div className="grid grid-cols-2 gap-6">
                    <button
                        onClick={() => handleAnswer(0)}
                        className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                        <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">😐</span>
                        <span className="font-bold text-gray-600 group-hover:text-gray-800">Non, pas vraiment</span>
                    </button>

                    <button
                        onClick={() => handleAnswer(1)}
                        className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-[#f5c43d]/30 hover:border-[#f5c43d] hover:bg-[#f5c43d]/5 transition-all duration-200"
                    >
                        <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">✨</span>
                        <span className="font-bold text-[#b89126] group-hover:text-[#9e7d20]">Oui, tout à fait</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
