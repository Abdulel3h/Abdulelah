import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { AnimatedBackground } from "@/components/visuals/AnimatedBackground";
import { PageTransitionWrapper } from "@/components/layout/PageTransitionWrapper";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/data/site";
import { ogImage } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Abdulelah Alkhathami | Junior AI Engineer & AI Solutions Specialist",
    template: "%s | Abdulelah AI"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Abdulelah Alkhathami | Junior AI Engineer & AI Solutions Specialist",
    description: siteConfig.description,
    siteName: "Abdulelah AI",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Abdulelah AI portfolio preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdulelah Alkhathami | Junior AI Engineer & AI Solutions Specialist",
    description: siteConfig.description,
    images: [ogImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body>
        <TooltipProvider delayDuration={160}>
          <AnimatedBackground />
          <ScrollProgress />
          <Navbar />
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
          <BackToTopButton />
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
