import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import { Analytics } from "@vercel/analytics/next";
import { AgentPanel } from "@/components/agent/AgentPanel";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageFrame } from "@/components/layout/PageFrame";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnimatedBackground } from "@/components/visuals/AnimatedBackground";
import { siteConfig } from "@/data/site";
import { getDirection, localeTags, locales, otherLocale } from "@/lib/i18n/config";
import { pickClientDictionary } from "@/lib/i18n/client-dictionary";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { shareImage } from "@/lib/metadata";
import { buildSearchIndex } from "@/lib/search-index";
import { personJsonLd, websiteJsonLd } from "@/lib/structured-data";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

// Fraunces is the editorial display voice — the wordmark and large headlines.
// It is a variable font, so one file per style covers every weight.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal"],
  variable: "--font-fraunces"
});

// The italic only sets a few accent words, so it is not preloaded and never
// competes with the hero text for bandwidth.
const frauncesItalic = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["italic"],
  preload: false,
  variable: "--font-fraunces-italic"
});

// Only emitted on Vercel, where /_vercel/insights exists. Elsewhere (local
// production builds, previews on other hosts) the script would 404.
const analyticsEnabled = process.env.VERCEL === "1";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  // Chrome on Android resizes the layout when the keyboard opens, so the
  // guide's input and the contact form stay above it.
  interactiveWidget: "resizes-content"
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.home.metaTitle,
      template: `%s | ${dict.common.name}`
    },
    description: dict.home.metaDescription,
    applicationName: dict.common.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    formatDetection: { telephone: false, address: false, email: false },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.svg", type: "image/svg+xml" }
      ],
      apple: "/apple-touch-icon.png"
    },
    openGraph: {
      type: "website",
      siteName: dict.common.name,
      images: [shareImage],
      locale: localeTags[locale].og,
      alternateLocale: [localeTags[otherLocale(locale)].og]
    },
    twitter: {
      card: "summary_large_image",
      images: [shareImage.url]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  if (locale === "ar") {
    // Arabic pages set their text in Thmanyah; fetch the regular weight (body
    // text, including the hero introduction) with the HTML. Heading weights
    // load from the stylesheet and swap in.
    preload("/fonts/thmanyah/thmanyahsans-Regular.woff2", {
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous"
    });
  }

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`dark ${inter.variable} ${fraunces.variable} ${frauncesItalic.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a href="#main-content" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <JsonLd data={personJsonLd} />
        <JsonLd data={websiteJsonLd(locale)} />
        <LocaleProvider locale={locale} dictionary={pickClientDictionary(dict)}>
          <AnimatedBackground />
          <ScrollProgress />
          <Navbar />
          <PageFrame>{children}</PageFrame>
          <Footer locale={locale} />
          <BackToTopButton />
          <AgentPanel />
          <CommandMenu index={buildSearchIndex(locale)} />
          {analyticsEnabled ? <WebVitalsReporter /> : null}
        </LocaleProvider>
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
