"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAVIGATION_ITEMS } from '@/lib/constants';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header when scrolling up or at the top
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Hide header when scrolling down past 100px
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const toggleSubMenu = (label: string) => {
        setOpenSubMenu(openSubMenu === label ? null : label);
        setOpenMobileSection(null); // Reset deep nested section when toggling main
    };

    const toggleMobileSection = (label: string) => {
        setOpenMobileSection(openMobileSection === label ? null : label);
    };

    return (
        <header className={`sticky top-0 z-[999] w-full border-b border-border/40 bg-background/40 md:bg-background/80 backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="mx-auto flex h-20 w-full items-center px-4 sm:px-8 lg:px-12 relative">
                {/* Logo / Nom du site */}
                <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center gap-2">
                    <Link href="/" className="hover:opacity-90 transition-opacity">
                        <img
                            src="/logo-v2.svg"
                            alt="Attitude Émoi"
                            className="h-12 w-auto"
                        />
                    </Link>
                </div>

                {/* Navigation Desktop - Centered */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-6 text-base font-bold text-foreground/80">
                    {NAVIGATION_ITEMS.map((item) => (
                        <div key={item.label} className="relative group">
                            {item.sections || item.subItems ? (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1 hover:text-primary transition-colors py-2"
                                >
                                    <span>{item.label}</span>
                                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                                </Link>
                            ) : (
                                <Link href={item.href} className="hover:text-primary transition-colors block py-2">
                                    {item.label}
                                </Link>
                            )}

                            {/* MEGA MENU (Sections) */}
                            {item.sections && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[800px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white border border-border/40 shadow-xl rounded-xl p-6 grid grid-cols-3 gap-8">
                                        {item.sections.map((section) => (
                                            <div key={section.label} className="space-y-3">
                                                <Link
                                                    href={section.href}
                                                    className="font-bold text-primary hover:text-primary/80 block border-b border-gray-100 pb-1"
                                                >
                                                    {section.label}
                                                </Link>
                                                <div className="flex flex-col gap-2">
                                                    {section.subItems.map((sub) => (
                                                        <Link
                                                            key={sub.label}
                                                            href={sub.href}
                                                            className="text-sm text-gray-600 hover:text-primary hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STANDARD DROPDOWN (Legacy subItems) */}
                            {item.subItems && !item.sections && (
                                <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white border border-border/40 shadow-lg rounded-xl p-2 flex flex-col gap-1">
                                        {item.subItems.map((sub) => (
                                            <Link
                                                key={sub.label}
                                                href={sub.href}
                                                className="px-4 py-2 hover:bg-gray-50 text-sm rounded-lg text-foreground hover:text-primary transition-colors"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Desktop CTA - Equal width buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/test-hypersensibilite" className="inline-flex items-center justify-center rounded-full bg-[#f5c43d] min-w-[160px] px-5 py-2.5 text-sm font-bold text-white shadow transition-transform hover:scale-105 hover:bg-[#e0b135] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Test hypersensibilité
                    </Link>
                    <Link href="/sensibliotheque" className="inline-flex items-center justify-center rounded-full bg-primary min-w-[160px] px-5 py-2.5 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Sensibliothèque
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden ml-auto p-2 text-foreground hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Ouvrir le menu"
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border/40 shadow-lg h-[calc(100vh-5rem)] overflow-y-auto pb-20">
                    <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
                        <nav className="flex flex-col gap-2">
                            {NAVIGATION_ITEMS.map((item) => (
                                <div key={item.label} className="border-b border-border/20 last:border-0 pb-2">
                                    {/* Has Sections (Mega Menu Mobile) */}
                                    {item.sections ? (
                                        <>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="flex-1 text-lg font-bold text-foreground/80">
                                                    {item.label}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleSubMenu(item.label);
                                                    }}
                                                    className="p-2 -mr-2 text-foreground/60 hover:text-primary"
                                                >
                                                    <ChevronDown
                                                        size={24}
                                                        className={`transition-transform duration-200 ${openSubMenu === item.label ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Level 1 Expansion (Categories) */}
                                            {openSubMenu === item.label && (
                                                <div className="pl-4 border-l-2 border-primary/20 ml-2 space-y-4 py-2">
                                                    {item.sections.map((section) => (
                                                        <div key={section.label}>
                                                            <div className="flex items-center justify-between py-1">
                                                                <Link
                                                                    href={section.href}
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="font-bold text-base text-primary"
                                                                >
                                                                    {section.label}
                                                                </Link>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleMobileSection(section.label);
                                                                    }}
                                                                    className="p-1 text-foreground/50"
                                                                >
                                                                    <ChevronDown
                                                                        size={20}
                                                                        className={`transition-transform duration-200 ${openMobileSection === section.label ? 'rotate-180' : ''}`}
                                                                    />
                                                                </button>
                                                            </div>

                                                            {/* Level 2 Expansion (Sub-Items) */}
                                                            {openMobileSection === section.label && (
                                                                <div className="flex flex-col gap-2 pl-3 py-1 bg-gray-50 rounded mt-1">
                                                                    {section.subItems.map((sub) => (
                                                                        <Link
                                                                            key={sub.label}
                                                                            href={sub.href}
                                                                            onClick={() => setIsMenuOpen(false)}
                                                                            className="text-sm text-gray-600 py-1"
                                                                        >
                                                                            {sub.label}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : item.subItems ? (
                                        // Standard Dropdown Mobile (Legacy)
                                        <>
                                            <div className="flex items-center justify-between py-2">
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex-1 text-lg font-bold text-foreground/80 hover:text-primary"
                                                >
                                                    {item.label}
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleSubMenu(item.label);
                                                    }}
                                                    className="p-2 -mr-2 text-foreground/60 hover:text-primary"
                                                >
                                                    <ChevronDown
                                                        size={24}
                                                        className={`transition-transform duration-200 ${openSubMenu === item.label ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            </div>
                                            {openSubMenu === item.label && (
                                                <div className="flex flex-col gap-2 pl-4 py-2 bg-gray-50/50 rounded-lg">
                                                    {item.subItems.map((sub) => (
                                                        <Link
                                                            key={sub.label}
                                                            href={sub.href}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className="text-base text-foreground/70 py-1 hover:text-primary"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        // Standard Link Mobile
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block py-2 text-lg font-bold text-foreground/80 hover:text-primary"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="pt-4 flex flex-col gap-3">
                            <Link href="/test-hypersensibilite" onClick={() => setIsMenuOpen(false)} className="inline-flex w-full items-center justify-center rounded-full bg-[#f5c43d] px-6 py-4 text-lg font-bold text-white shadow transition-transform hover:scale-105">
                                Test hypersensibilité
                            </Link>
                            <Link href="/sensibliotheque" onClick={() => setIsMenuOpen(false)} className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                                Sensibliothèque
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
