import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { blogPosts, formatBlogDate, type BlogPost } from "@/data/blog";
import {
  blogCategoryLabelsAr,
  blogTranslationsAr,
  type BlogLanguage
} from "@/data/blog.ar";

/**
 * An editorial reading list of the notes — no filter chips, no card grid. Each
 * entry is a typeset row that opens the piece. Bilingual-aware.
 */
export function NotesList({
  language = "en",
  excludeSlug,
  posts = blogPosts
}: {
  language?: BlogLanguage;
  excludeSlug?: string;
  posts?: BlogPost[];
}) {
  const isArabic = language === "ar";
  const visible = posts.filter((post) => post.slug !== excludeSlug);

  return (
    <ol className="border-t border-white/[0.08]">
      {visible.map((post) => {
        const arabic = blogTranslationsAr[post.slug];
        const title = isArabic ? arabic?.title ?? post.title : post.title;
        const subtitle = isArabic ? arabic?.subtitle ?? post.subtitle : post.subtitle;
        const category = isArabic
          ? blogCategoryLabelsAr[post.category] ?? post.category
          : post.category;

        return (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="focus-ring group block border-b border-white/[0.08] py-7"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] uppercase tracking-[0.16em] text-paper-faint">
                <span>{formatBlogDate(post.date)}</span>
                <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden="true" />
                <span>{post.readingTime}</span>
                <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden="true" />
                <span>{category}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-medium leading-tight text-paper transition-colors group-hover:text-accent-soft sm:text-3xl">
                {title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-paper-dim">
                {subtitle}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-soft">
                {isArabic ? "اقرأ" : "Read"}
                <ArrowUpRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
