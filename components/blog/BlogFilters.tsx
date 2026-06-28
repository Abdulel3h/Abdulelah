"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  blogAudiences,
  blogCategories,
  type BlogPost
} from "@/data/blog";
import {
  blogAudienceLabelsAr,
  blogCategoryLabelsAr,
  blogTranslationsAr,
  getBlogText,
  type BlogLanguage
} from "@/data/blog.ar";
import { cn } from "@/lib/utils";

const allAudiences = ["All audiences", ...blogAudiences];

function getSearchableText(post: BlogPost) {
  const arabic = blogTranslationsAr[post.slug];

  return [
    post.title,
    post.subtitle,
    post.excerpt,
    post.category,
    ...post.audience,
    ...post.tags,
    arabic?.title ?? "",
    arabic?.subtitle ?? "",
    arabic?.excerpt ?? ""
  ]
    .join(" ")
    .toLowerCase();
}

export function BlogFilters({
  posts,
  language = "en"
}: {
  posts: BlogPost[];
  language?: BlogLanguage;
}) {
  const isArabic = language === "ar";
  const text = getBlogText(language);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeAudience, setActiveAudience] = useState("All audiences");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);

  const filteredPosts = useMemo(() => {
    const query = deferredQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesAudience =
        activeAudience === "All audiences" ||
        post.audience.includes(activeAudience);

      return (
        matchesCategory &&
        matchesAudience &&
        (!query || getSearchableText(post).includes(query))
      );
    });
  }, [activeAudience, activeCategory, deferredQuery, posts]);

  const arabicCountLabel =
    filteredPosts.length === 1
      ? "مقال واحد"
      : filteredPosts.length === 2
        ? "مقالين"
        : `${filteredPosts.length} مقالات`;

  return (
    <div
      dir={isArabic ? "rtl" : undefined}
      lang={isArabic ? "ar" : undefined}
      className={cn(isArabic && "blog-arabic")}
    >
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-paper-dim backdrop-blur-xl">
        <Search className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <span className="sr-only">{text.searchLabel}</span>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={text.searchPlaceholder}
          aria-label={text.searchLabel}
          className="border-0 bg-transparent px-0 shadow-none"
        />
      </label>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper-faint">
          {text.exploreByTopic}
        </p>
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label={text.categoryFiltersLabel}
        >
          {blogCategories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={activeCategory === category ? "secondary" : "outline"}
              size="sm"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "shrink-0",
                activeCategory === category &&
                  "border-accent/60 bg-accent/15 text-accent"
              )}
            >
              {isArabic ? blogCategoryLabelsAr[category] ?? category : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper-faint">
          {text.usefulFor}
        </p>
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label={text.audienceFiltersLabel}
        >
          {allAudiences.map((audience) => (
            <Button
              key={audience}
              type="button"
              variant={activeAudience === audience ? "gold" : "outline"}
              size="sm"
              aria-pressed={activeAudience === audience}
              onClick={() => setActiveAudience(audience)}
              className="shrink-0"
            >
              {isArabic ? blogAudienceLabelsAr[audience] ?? audience : audience}
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-paper-dim" aria-live="polite">
        {isArabic ? (
          <>
            يعرض{" "}
            <span className="font-semibold text-accent">{arabicCountLabel}</span>
          </>
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-accent">
              {filteredPosts.length}
            </span>{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </>
        )}
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} language={language} />
        ))}
      </div>

      {!filteredPosts.length ? (
        <Card className="mt-8 p-8 text-center text-paper-dim">
          {text.emptyState}
        </Card>
      ) : null}
    </div>
  );
}
