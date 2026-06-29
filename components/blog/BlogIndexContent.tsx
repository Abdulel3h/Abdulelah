"use client";

import { BlogCTA } from "@/components/blog/BlogCTA";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { NotesList } from "@/components/blog/NotesList";
import { useBlogLanguage } from "@/components/blog/BlogLanguageProvider";
import { featuredBlogPost } from "@/data/blog";
import { getBlogText } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function BlogIndexContent() {
  const { language, isArabic } = useBlogLanguage();
  const text = getBlogText(language);

  return (
    <div
      dir={isArabic ? "rtl" : undefined}
      lang={isArabic ? "ar" : undefined}
      className={cn(isArabic && "blog-arabic")}
    >
      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{text.heroEyebrow}</p>
          <h1 className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            {text.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">
            {text.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="container-shell section-space">
        <p className="eyebrow mb-6">{text.startHere}</p>
        <FeaturedPost post={featuredBlogPost} language={language} />
      </section>

      <section className="container-shell pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{text.libraryBadge}</p>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl">
            {text.libraryTitle}
          </h2>
        </div>
        <div className="mt-10">
          <NotesList language={language} excludeSlug={featuredBlogPost.slug} />
        </div>
      </section>

      <BlogCTA language={language} />
    </div>
  );
}
