import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { BlogPost } from "@/data/blog";
import { getBlogText, localizeBlogPost, type BlogLanguage } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function BlogCard({
  post,
  language = "en"
}: {
  post: BlogPost;
  language?: BlogLanguage;
}) {
  const isArabic = language === "ar";
  const text = getBlogText(language);
  const view = localizeBlogPost(post, language);

  return (
    <article
      dir={isArabic ? "rtl" : undefined}
      lang={isArabic ? "ar" : undefined}
      className={cn(
        "glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-accent/35",
        isArabic && "blog-arabic"
      )}
    >
      <div className="relative border-b border-white/10 bg-[linear-gradient(135deg,rgba(201,167,92,0.15),rgba(201,167,92,0.10),rgba(201,167,92,0.07))] p-5">
        <div className="absolute inset-0 bg-soft-grid bg-[length:24px_24px] opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <Badge variant="sky">{view.categoryLabel}</Badge>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-paper-dim">
          {view.sourceLabel}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-paper-dim">
          <span>{view.dateLabel}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {view.readingTime}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold leading-8 text-paper">
          <Link
            href={`/blog/${post.slug}`}
            className="focus-ring rounded transition hover:text-accent"
          >
            {view.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-paper-dim">{view.excerpt}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {view.tagLabels.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="muted">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="mt-5 text-xs leading-6 text-paper-dim">
          {text.forLabel}{" "}
          <span className="text-paper-dim">
            {view.audienceLabels.join(isArabic ? "، " : ", ")}
          </span>
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className={buttonVariants({
            variant: "secondary",
            className: "mt-6 w-full group-hover:border-accent/45 group-hover:bg-accent/10"
          })}
        >
          {text.readArticle}
          <ArrowRight
            className={cn("h-4 w-4", isArabic && "rotate-180")}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
