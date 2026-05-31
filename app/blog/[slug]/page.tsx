import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock3, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentAskButton } from "@/components/blog/AgentAskButton";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { BlogCard } from "@/components/blog/BlogCard";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  blogPosts,
  formatBlogDate,
  getBlogPostBySlug,
  getRelatedBlogPosts
} from "@/data/blog";
import { createPageMetadata } from "@/lib/metadata";

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
  const sourceLabel =
    post.sourceType === "original"
      ? "Original insight"
      : post.sourceType === "curated"
        ? "Curated insight"
        : "Global pulse";

  return (
    <>
      <section className="container-shell pt-12 sm:pt-16 lg:pt-20">
        <Link
          href="/blog"
          className="focus-ring mb-8 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Abdulelah AI Insights
        </Link>

        <div className="premium-panel p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-20" aria-hidden="true" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-5xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="sky">{post.category}</Badge>
              <Badge variant="gold">{sourceLabel}</Badge>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
              {post.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
              <span>{formatBlogDate(post.date)}</span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-sky-200" aria-hidden="true" />
                {post.readingTime}
              </span>
              <span>For {post.audience.join(", ")}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="muted">
                  {tag}
                </Badge>
              ))}
            </div>
            {post.sourceUrl ? (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-sky-100 transition hover:text-white"
              >
                External source: {post.sourceName ?? "Read source"}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <ArticleContent post={post} />
      </section>

      <section className="section-space section-band">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="badge mb-4">Continue exploring</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Ask a question or view applied work
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Use the portfolio Navigator to explore this topic in context, or
              move into project case studies that show applied AI thinking.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AgentAskButton
                prompt={`Explain the "${post.title}" article and how it relates to Abdulelah's portfolio.`}
              >
                Ask Abdulelah AI about this topic
              </AgentAskButton>
              <ButtonLink href="/projects" variant="secondary" showArrow className="w-full sm:w-auto">
                View related projects
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="max-w-3xl">
          <p className="badge mb-4">Related posts</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Keep building your AI perspective
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Move across fundamentals, product thinking, and applied examples.
          </p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.slug} post={relatedPost} />
          ))}
        </div>
        <Link
          href="/blog"
          className="focus-ring mt-9 inline-flex items-center gap-2 rounded text-sm font-semibold text-sky-100 transition hover:text-white"
        >
          Browse all insights
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
