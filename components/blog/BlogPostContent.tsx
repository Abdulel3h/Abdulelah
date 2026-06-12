"use client";

import { ArrowLeft, ArrowRight, Clock3, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AgentAskButton } from "@/components/blog/AgentAskButton";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { BlogCard } from "@/components/blog/BlogCard";
import { useBlogLanguage } from "@/components/blog/BlogLanguageProvider";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { BlogPost } from "@/data/blog";
import { getBlogText, localizeBlogPost } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function BlogPostContent({
  post,
  relatedPosts
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  const { language, isArabic } = useBlogLanguage();
  const text = getBlogText(language);
  const view = localizeBlogPost(post, language);
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div
      dir={isArabic ? "rtl" : undefined}
      lang={isArabic ? "ar" : undefined}
      className={cn(isArabic && "blog-arabic")}
    >
      <section className="container-shell pt-12 sm:pt-16 lg:pt-20">
        <Link
          href="/blog"
          className="focus-ring mb-8 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <BackArrow className="h-4 w-4" aria-hidden="true" />
          {text.backToBlog}
        </Link>

        <div className="premium-panel p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-20" aria-hidden="true" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-5xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="sky">{view.categoryLabel}</Badge>
              <Badge variant="gold">{view.sourceLabel}</Badge>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {view.title}
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
              {view.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
              <span>{view.dateLabel}</span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-sky-200" aria-hidden="true" />
                {view.readingTime}
              </span>
              <span>
                {text.forAudiences}{" "}
                {view.audienceLabels.join(isArabic ? "، " : ", ")}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {view.tagLabels.map((tag) => (
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
                {text.externalSource} {post.sourceName ?? post.sourceUrl}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <ArticleContent post={post} language={language} />
      </section>

      <section className="section-space section-band">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="badge mb-4">{text.continueBadge}</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              {text.continueTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              {text.continueBody}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AgentAskButton prompt={text.articlePrompt(view.title)}>
                {text.askAboutTopic}
              </AgentAskButton>
              <ButtonLink
                href="/projects"
                variant="secondary"
                showArrow
                className="w-full sm:w-auto"
              >
                {text.viewRelatedProjects}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="max-w-3xl">
          <p className="badge mb-4">{text.relatedBadge}</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            {text.relatedTitle}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            {text.relatedBody}
          </p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <BlogCard
              key={relatedPost.slug}
              post={relatedPost}
              language={language}
            />
          ))}
        </div>
        <Link
          href="/blog"
          className="focus-ring mt-9 inline-flex items-center gap-2 rounded text-sm font-semibold text-sky-100 transition hover:text-white"
        >
          {text.browseAll}
          <ForwardArrow className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
