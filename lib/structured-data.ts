import type { BlogPost } from "@/data/blog";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/utils";

const PERSON_ID = `${siteConfig.url}/#person`;

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: siteConfig.name,
  alternateName: [siteConfig.arabicName, "Abdulelah Ali Alkhathami"],
  url: siteConfig.url,
  email: `mailto:${siteConfig.email}`,
  image: absoluteUrl(siteConfig.assets.profileImage),
  jobTitle: ["AI Product Builder", "AI Engineer", "AI Solutions Specialist"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Riyadh",
    addressCountry: "SA"
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Bisha"
  },
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  knowsAbout: [
    "AI Agents",
    "Retrieval-Augmented Generation",
    "LLM Applications",
    "Arabic Natural Language Processing",
    "Computer Vision",
    "Security Analytics",
    "Google Cloud",
    "Azure AI"
  ]
};

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: locale === "ar" ? siteConfig.arabicName : siteConfig.name,
    alternateName: locale === "ar" ? siteConfig.name : siteConfig.arabicName,
    url: absoluteUrl(localizeHref("/", locale)),
    description:
      locale === "ar"
        ? "موقع عبدالإله الخثعمي: مشاريع الذكاء الاصطناعي التطبيقية وأدلتها وسيرته الذاتية."
        : siteConfig.description,
    inLanguage: locale,
    publisher: { "@id": PERSON_ID }
  };
}

/** `items` use locale-free paths; they are localized here. */
export function breadcrumbJsonLd(items: { name: string; path: string }[], locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizeHref(item.path, locale))
    }))
  };
}

export function blogPostingJsonLd(
  post: BlogPost,
  view: { title: string; excerpt: string; category: string; tags: string[] },
  locale: Locale
) {
  const url = absoluteUrl(localizeHref(`/blog/${post.slug}`, locale));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: view.title,
    description: view.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    image: absoluteUrl(siteConfig.assets.ogImage),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    articleSection: view.category,
    keywords: view.tags.join(", "),
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: siteConfig.name,
      url: siteConfig.url
    },
    publisher: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: siteConfig.name,
      url: siteConfig.url
    }
  };
}

export function projectJsonLd(
  project: { name: string; title: string; summary: string; year: string; slug: string; links: { github?: string } },
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    alternateName: project.name,
    description: project.summary,
    url: absoluteUrl(localizeHref(`/projects/${project.slug}`, locale)),
    dateCreated: project.year,
    inLanguage: locale,
    creator: { "@id": PERSON_ID },
    ...(project.links.github ? { sameAs: [project.links.github] } : {})
  };
}
