import { blogPosts } from "@/data/blog";
import { blogTranslationsAr } from "@/data/blog.ar";
import { getProjects } from "@/data/projects";
import { footerNav } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type SearchIndexItem = {
  id: string;
  group: "pages" | "projects" | "notes";
  label: string;
  hint?: string;
  keywords: string;
  href: string;
};

/**
 * Built on the server and handed to the search dialog as plain data, so the
 * full project and article content never ships in the client bundle.
 */
export function buildSearchIndex(locale: Locale): SearchIndexItem[] {
  const dict = getDictionary(locale);

  const pages: SearchIndexItem[] = footerNav.map((item) => ({
    id: `page-${item.key}`,
    group: "pages",
    label: dict.nav[item.key],
    keywords: `${item.key} ${item.href}`,
    href: localizeHref(item.href, locale)
  }));

  const projects: SearchIndexItem[] = getProjects(locale).map((project) => ({
    id: `project-${project.slug}`,
    group: "projects",
    label: project.name,
    hint: `${project.descriptor} · ${dict.status[project.status]}`,
    keywords: [
      project.domain,
      project.technologies.join(" "),
      project.links.github ? "github code repository public كود مستودع" : "",
      getProjects(locale === "ar" ? "en" : "ar").find((entry) => entry.slug === project.slug)?.descriptor ?? ""
    ].join(" "),
    href: localizeHref(`/projects/${project.slug}`, locale)
  }));

  const notes: SearchIndexItem[] = blogPosts.map((post) => {
    const arabicTitle = blogTranslationsAr[post.slug]?.title;
    const label = locale === "ar" ? arabicTitle ?? post.title : post.title;

    return {
      id: `note-${post.slug}`,
      group: "notes",
      label,
      keywords: `${post.category} ${post.tags.join(" ")} ${locale === "ar" ? post.title : arabicTitle ?? ""}`,
      href: localizeHref(`/blog/${post.slug}`, locale)
    };
  });

  return [...pages, ...projects, ...notes];
}
