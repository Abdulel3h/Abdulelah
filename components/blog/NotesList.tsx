import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { blogPosts, type BlogPost } from "@/data/blog";
import { localizeBlogPost, type BlogLanguage } from "@/data/blog.ar";
import { localizeHref } from "@/lib/i18n/config";

/**
 * An editorial reading list of the notes — typeset rows that open each piece.
 * Follows the page language.
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
  const visible = posts.filter((post) => post.slug !== excludeSlug);

  return (
    <ol className="border-t border-white/[0.08]">
      {visible.map((post) => {
        const view = localizeBlogPost(post, language);

        return (
          <li key={post.slug}>
            <Link
              href={localizeHref(`/blog/${post.slug}`, language)}
              className="focus-ring group block border-b border-white/[0.08] py-7"
            >
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] uppercase tracking-[0.14em] text-paper-dim">
                <span>{view.dateLabel}</span>
                <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden="true" />
                <span>{view.readingTime}</span>
                <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden="true" />
                <span>{view.categoryLabel}</span>
              </span>
              <h3 className="mt-3 font-display text-2xl font-medium leading-tight text-paper transition-colors group-hover:text-accent-soft sm:text-3xl">
                {view.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-paper-dim">{view.subtitle}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-soft">
                {language === "ar" ? "اقرأ" : "Read"}
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
