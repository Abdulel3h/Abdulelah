import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { AgentPanel } from "@/components/agent/AgentPanel";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { AnimatedBackground } from "@/components/visuals/AnimatedBackground";
import { PageTransitionWrapper } from "@/components/layout/PageTransitionWrapper";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import { ogImage } from "@/lib/metadata";
import { personJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

// Arabic typeface for the bilingual blog. preload is off so the font is only
// fetched on pages whose content actually uses var(--font-thmanyah).
const thmanyah = localFont({
  src: [
    {
      path: "../public/fonts/thmanyah/thmanyahsans-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/fonts/thmanyah/thmanyahsans-Medium.woff2",
      weight: "500 600",
      style: "normal"
    },
    {
      path: "../public/fonts/thmanyah/thmanyahsans-Bold.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  display: "swap",
  variable: "--font-thmanyah",
  preload: false,
  fallback: ["system-ui", "sans-serif"]
});

const socialImage = absoluteUrl(ogImage);

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Abdulelah Alkhathami | AI Engineer, LLM Applications & Cloud AI",
    template: "%s | Abdulelah AI"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: siteConfig.url
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Abdulelah Alkhathami | AI Engineer, LLM Applications & Cloud AI",
    description: siteConfig.description,
    siteName: "Abdulelah AI",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Abdulelah AI portfolio preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdulelah Alkhathami | AI Engineer, LLM Applications & Cloud AI",
    description: siteConfig.description,
    images: [socialImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${thmanyah.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <JsonLd data={personJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <TooltipProvider delayDuration={160}>
          <AnimatedBackground />
          <ScrollProgress />
          <Navbar />
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
          <BackToTopButton />
          <AgentPanel />
          <Footer />
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
