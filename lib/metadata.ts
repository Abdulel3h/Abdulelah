import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";

export const ogImage = siteConfig.assets.ogImage;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords = siteConfig.keywords,
  publishedTime
}: PageMetadataOptions): Metadata {
  const fullTitle =
    title.includes(siteConfig.name) || title.includes(siteConfig.brand)
      ? title
      : `${title} | ${siteConfig.brand}`;
  const pageUrl = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteConfig.name }],
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      type,
      url: pageUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.brand,
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
      description
    }
  };
}
