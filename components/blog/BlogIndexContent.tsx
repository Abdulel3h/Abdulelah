"use client";

import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { GlobalPulse } from "@/components/blog/GlobalPulse";
import { useBlogLanguage } from "@/components/blog/BlogLanguageProvider";
import { PageHero } from "@/components/ui/PageHero";
import { blogCategories, blogPosts, featuredBlogPost } from "@/data/blog";
import { getBlogText } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function BlogIndexContent() {
  const { language, isArabic } = useBlogLanguage();
  const text = getBlogText(language);

  return (
    <>
      <div
        dir={isArabic ? "rtl" : undefined}
        lang={isArabic ? "ar" : undefined}
        className={cn(isArabic && "blog-arabic")}
      >
        <PageHero
          eyebrow={text.heroEyebrow}
          title={text.heroTitle}
          subtitle={text.heroSubtitle}
          stats={[
            { value: String(blogPosts.length), label: text.statArticlesLabel },
            {
              value: String(blogCategories.length - 1),
              label: text.statTopicsLabel
            },
            { value: text.statCuratedValue, label: text.statCuratedLabel },
            { value: text.statGlobalValue, label: text.statGlobalLabel }
          ]}
        />

        <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
          <p className="badge mb-5">{text.startHere}</p>
          <FeaturedPost post={featuredBlogPost} language={language} />
        </section>

        <section className="container-shell section-space">
          <div className="max-w-3xl">
            <p className="badge mb-4">{text.libraryBadge}</p>
            <h2 className="text-3xl font-semibold text-paper sm:text-4xl">
              {text.libraryTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-paper-dim">
              {text.libraryBody}
            </p>
          </div>
          <div className="mt-9">
            <BlogFilters posts={blogPosts} language={language} />
          </div>
        </section>
      </div>

      <GlobalPulse language={language} />
      <BlogCTA language={language} />
    </>
  );
}
