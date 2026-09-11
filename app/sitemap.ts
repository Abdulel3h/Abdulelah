import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

const staticRoutes = [
  "",
  "/about",
  "/projects",
  "/achievements",
  "/skills",
  "/resume",
  "/contact",
  "/privacy",
  "/blog"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Static pages and project case studies have no tracked modification date.
    // A shared placeholder date is wrong for most of them and a freshly
    // generated timestamp would be a fabricated freshness signal, so
    // lastModified is omitted until real update metadata exists.
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`
    })),
    // Blog posts do carry a real publication date.
    ...blogPosts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date)
    }))
  ];
}
