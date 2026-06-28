import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { BlogPost } from "@/data/blog";
import { getBlogText, localizeBlogPost, type BlogLanguage } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function FeaturedPost({
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
      className={cn("premium-panel p-6 sm:p-8 lg:p-10", isArabic && "blog-arabic")}
    >
      <div className="absolute inset-0 bg-soft-grid bg-[length:30px_30px] opacity-20" aria-hidden="true" />
      <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-accent0/15 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_0.34fr] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="gold">{text.featuredBadge}</Badge>
            <Badge variant="sky">{view.categoryLabel}</Badge>
          </div>
          <h2 className="mt-6 max-w-4xl text-3xl font-semibold leading-tight text-paper sm:text-4xl">
            {view.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-paper-dim">
            {view.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {view.tagLabels.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className={buttonVariants({ className: "mt-7" })}
          >
            {text.readFeatured}
            <ArrowRight
              className={cn("h-4 w-4", isArabic && "rotate-180")}
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <Sparkles className="h-5 w-5 text-accent-soft" aria-hidden="true" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper-dim">
            {view.sourceLabel}
          </p>
          <p className="mt-3 text-sm text-paper">{view.dateLabel}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-paper-dim">
            <Clock3 className="h-4 w-4 text-accent" aria-hidden="true" />
            {view.readingTime}
          </p>
          <p className="mt-4 text-xs leading-6 text-paper-dim">
            {text.writtenFor}{" "}
            {view.audienceLabels.join(isArabic ? "، " : ", ")}.
          </p>
        </div>
      </div>
    </article>
  );
}
