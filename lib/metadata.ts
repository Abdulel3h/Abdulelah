import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import {
  defaultLocale,
  localeTags,
  localizeHref,
  locales,
  otherLocale,
  type Locale
} from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/utils";

/**
 * One share image per language, rendered from the same composition with the
 * faces the pages use (scripts/generate-og.mjs): Fraunces and Inter in
 * English, Thmanyah in Arabic.
 */
const shareImages: Record<Locale, { url: string; width: number; height: number; alt: string }> = {
  en: {
    url: absoluteUrl(siteConfig.assets.shareImages.en),
    width: 1200,
    height: 630,
    alt: "Abdulelah Alkhathami — AI product builder in Riyadh: I turn AI into products people understand."
  },
  ar: {
    url: absoluteUrl(siteConfig.assets.shareImages.ar),
    width: 1200,
    height: 630,
    alt: "عبدالإله الخثعمي — مطوّر منتجات ذكاء اصطناعي في الرياض: أحوّل الذكاء الاصطناعي إلى منتجات يفهمها الناس."
  }
};

export function shareImageFor(locale: Locale) {
  return shareImages[locale];
}

type PageMetadataOptions = {
  locale: Locale;
  /** Page title without the site name; the layout template appends it. */
  title: string;
  description: string;
  /** Locale-free route, e.g. "/projects/chatub". */
  path: string;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  /** Set for pages whose other-language version does not exist. */
  singleLocale?: boolean;
  noindex?: boolean;
  /** Use the title as-is (no " | name" suffix), e.g. the homepage. */
  absoluteTitle?: boolean;
};

/** Canonical + hreflang alternates for a locale-free route. */
export function localeAlternates(path: string, locale: Locale, singleLocale = false) {
  const canonical = absoluteUrl(localizeHref(path, locale));

  if (singleLocale) {
    return { canonical };
  }

  const languages: Record<string, string> = {};

  for (const entry of locales) {
    languages[localeTags[entry].hreflang] = absoluteUrl(localizeHref(path, entry));
  }

  languages["x-default"] = absoluteUrl(localizeHref(path, defaultLocale));

  return { canonical, languages };
}

export function createPageMetadata({
  locale,
  title,
  description,
  path,
  type = "website",
  keywords = siteConfig.keywords,
  publishedTime,
  singleLocale = false,
  noindex = false,
  absoluteTitle = false
}: PageMetadataOptions): Metadata {
  const name = locale === "ar" ? siteConfig.arabicName : siteConfig.name;
  const fullTitle = absoluteTitle || title.includes(name) ? title : `${title} | ${name}`;
  const alternates = localeAlternates(path, locale, singleLocale);
  const image = shareImageFor(locale);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      url: alternates.canonical,
      title: fullTitle,
      description,
      siteName: name,
      images: [image],
      locale: localeTags[locale].og,
      ...(singleLocale ? {} : { alternateLocale: [localeTags[otherLocale(locale)].og] }),
      ...(type === "article"
        ? {
            authors: [siteConfig.name],
            publishedTime
          }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url]
    }
  };
}
