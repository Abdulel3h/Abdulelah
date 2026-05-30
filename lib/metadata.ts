import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const ogImage = siteConfig.assets.ogImage;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords = siteConfig.keywords
}: PageMetadataOptions): Metadata {
  const fullTitle =
    title.includes(siteConfig.name) || title.includes(siteConfig.brand)
      ? title
      : `${title} | ${siteConfig.brand}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path
    },
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: siteConfig.brand,
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
      title: fullTitle,
      description,
      images: [ogImage]
    }
  };
}
