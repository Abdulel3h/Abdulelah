import type { BlogPost } from "@/data/blog";
import { siteConfig } from "@/data/site";
import { ogImage } from "@/lib/metadata";
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
  jobTitle: ["AI Engineer", "AI Solutions Specialist"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Riyadh",
    addressCountry: "SA"
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Bisha"
  },
  sameAs: [
    siteConfig.social.github,
    siteConfig.social.linkedin,
    siteConfig.url
  ],
  knowsAbout: [
    "AI Agents",
    "RAG Systems",
    "LLM Applications",
    "Arabic AI Systems",
    "Cloud AI",
    "NLP",
    "Intelligent Systems",
    "Cybersecurity AI",
    "Google Cloud",
    "Azure AI"
  ]
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Abdulelah Alkhathami Portfolio",
  alternateName: [siteConfig.brand, siteConfig.arabicName],
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: ["en", "ar"],
  publisher: { "@id": PERSON_ID }
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function blogPostingJsonLd(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    image: absoluteUrl(ogImage),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    articleSection: post.category,
    keywords: post.tags.join(", "),
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
