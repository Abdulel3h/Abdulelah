import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { projectSlugs } from "@/data/projects";
import { localeTags, localizeHref, locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/utils";

const staticRoutes = [
  "/",
  "/about",
  "/projects",
  "/achievements",
  "/skills",
  "/resume",
  "/contact",
  "/privacy",
  "/blog"
];

/**
 * Every public page in both languages. Each entry lists its English and
 * Arabic alternates (hreflang), so the two versions are understood as
 * translations of one page rather than duplicates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, lastModified?: Date) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [localeTags[locale].hreflang, absoluteUrl(localizeHref(path, locale))])
    );

    return locales.map((locale) => ({
      url: absoluteUrl(localizeHref(path, locale)),
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages: { ...languages, "x-default": absoluteUrl(localizeHref(path, "en")) } }
    }));
  };

  return [
    // Static pages and case studies have no tracked modification date, so
    // lastModified is omitted rather than invented.
    ...staticRoutes.flatMap((route) => entry(route)),
    ...projectSlugs.flatMap((slug) => entry(`/projects/${slug}`)),
    // Notes carry a real publication date.
    ...blogPosts.flatMap((post) => entry(`/blog/${post.slug}`, new Date(post.date)))
  ];
}
