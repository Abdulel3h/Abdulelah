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
import { cn } from "@/lib/utils";

const allAudiences = ["All audiences", ...blogAudiences];

export function BlogFilters({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeAudience, setActiveAudience] = useState("All audiences");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);

  const filteredPosts = useMemo(() => {
    const query = deferredQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const searchable = [
        post.title,
        post.subtitle,
        post.excerpt,
        post.category,
        ...post.audience,
        ...post.tags
      ]
        .join(" ")
        .toLowerCase();
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesAudience =
        activeAudience === "All audiences" ||
        post.audience.includes(activeAudience);

      return matchesCategory && matchesAudience && (!query || searchable.includes(query));
    });
  }, [activeAudience, activeCategory, deferredQuery, posts]);

  return (
    <div>
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl">
        <Search className="h-5 w-5 shrink-0 text-sky-200" aria-hidden="true" />
        <span className="sr-only">Search AI insights</span>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search AI topics, agents, cloud, privacy, education..."
          aria-label="Search AI topics, agents, cloud, privacy, education"
          className="border-0 bg-transparent px-0 shadow-none"
        />
      </label>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Explore by topic
        </p>
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Blog category filters"
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
                  "border-sky-300/60 bg-sky-300/15 text-sky-100"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Useful for
        </p>
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Blog audience filters"
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
              {audience}
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-400" aria-live="polite">
        Showing <span className="font-semibold text-sky-100">{filteredPosts.length}</span>{" "}
        {filteredPosts.length === 1 ? "article" : "articles"}
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {!filteredPosts.length ? (
        <Card className="mt-8 p-8 text-center text-slate-300">
          No article matches those filters yet. Try a broader topic or audience.
        </Card>
      ) : null}
    </div>
  );
}
