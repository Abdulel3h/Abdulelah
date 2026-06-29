import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLanguageProvider } from "@/components/blog/BlogLanguageProvider";
import { BlogLanguageToggle } from "@/components/blog/BlogLanguageToggle";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  blogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts
} from "@/data/blog";
import { createPageMetadata } from "@/lib/metadata";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found"
    };
  }

  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: [...post.tags, post.category, ...post.audience],
    publishedTime: post.date
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post);

  return (
    <BlogLanguageProvider>
      <JsonLd data={blogPostingJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Notes", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` }
        ])}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
      <BlogLanguageToggle />
    </BlogLanguageProvider>
  );
}
