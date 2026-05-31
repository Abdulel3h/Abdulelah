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
  "/blog",
  "/journey"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-29");

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified
    })),
    ...blogPosts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date)
    }))
  ];
}
