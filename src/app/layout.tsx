import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import { GoogleAnalytics } from "@next/third-parties/google";

import { generateOrganizationSchema } from "@/lib/schema";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Attitude Émoi - Bibliothèque émotionnelle",
  description: "Un espace pour explorer l'hypersensibilité, la santé mentale et les relations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${jost.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId="G-L6NBDNZ7D3" />
      </body>
    </html>
  );
}
