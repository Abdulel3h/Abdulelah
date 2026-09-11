import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes are never useful crawl targets. Private routes are
      // deliberately not listed here: robots.txt is public, so naming them
      // would advertise them. They are protected by signed access instead.
      disallow: "/api/"
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
