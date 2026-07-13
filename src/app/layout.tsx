import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { SEO } from "@/constants/content";
import { generateSchemaOrg } from "@/lib/schema";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SEO.title,
  metadataBase: new URL(SEO.url),
  description: SEO.description,
  keywords: SEO.keywords,
  robots: { index: true, follow: true },
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: SEO.url,
    siteName: "Lions Team BJJ",
    images: [
      {
        url: SEO.ogImage,
        width: 1200,
        height: 630,
        alt: "Lions Team — Школа бразильского джиу-джитсу",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [SEO.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = generateSchemaOrg();

  return (
    <html
      lang="ru"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
