import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts, getBlogPostBySlug, getRelatedBlogPosts } from "@/data/blog";
import { localizeBlogPost } from "@/data/blog.ar";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Unknown slugs render the localized not-found page (404) on the server.
export const dynamicParams = true;

export function generateStaticParams() {
  return locales.flatMap((locale) => blogPosts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: getDictionary(locale).blog.notFoundTitle, robots: { index: false } };
  }

  const view = localizeBlogPost(post, locale);

  return createPageMetadata({
    locale,
    title: view.title,
    description: view.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: [...view.tagLabels, view.categoryLabel],
    publishedTime: post.date
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const view = localizeBlogPost(post, locale);

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd(
          post,
          { title: view.title, excerpt: view.excerpt, category: view.categoryLabel, tags: view.tagLabels },
          locale
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.notes, path: "/blog" },
            { name: view.title, path: `/blog/${post.slug}` }
          ],
          locale
        )}
      />
      <BlogPostContent post={post} relatedPosts={getRelatedBlogPosts(post)} locale={locale} />
    </>
  );
}
