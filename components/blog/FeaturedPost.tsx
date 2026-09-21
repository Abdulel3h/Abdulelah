import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { BlogPost } from "@/data/blog";
import { getBlogText, localizeBlogPost, type BlogLanguage } from "@/data/blog.ar";
import { localizeHref } from "@/lib/i18n/config";

export function FeaturedPost({ post, language = "en" }: { post: BlogPost; language?: BlogLanguage }) {
  const text = getBlogText(language);
  const view = localizeBlogPost(post, language);

  return (
    <article className="premium-panel p-6 sm:p-8 lg:p-10" aria-labelledby={`featured-${post.slug}`}>
      <div className="absolute inset-0 bg-soft-grid bg-[length:30px_30px] opacity-20" aria-hidden="true" />
      <div className="absolute -end-12 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_0.34fr] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="gold">{text.featuredBadge}</Badge>
            <Badge variant="sky">{view.categoryLabel}</Badge>
          </div>
          <h2
            id={`featured-${post.slug}`}
            className="mt-6 max-w-4xl font-display text-3xl font-medium leading-tight text-paper sm:text-4xl"
          >
            {view.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-paper-dim">{view.subtitle}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {view.tagLabels.map((tag) => (
              <li key={tag}>
                <Badge variant="muted">{tag}</Badge>
              </li>
            ))}
          </ul>
          <Link href={localizeHref(`/blog/${post.slug}`, language)} className={buttonVariants({ className: "mt-7" })}>
            {text.readFeatured}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-paper-dim">{view.sourceLabel}</p>
          <p className="mt-3 text-sm text-paper">{view.dateLabel}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-paper-dim">
            <Clock3 className="h-4 w-4 text-accent" aria-hidden="true" />
            {view.readingTime}
          </p>
          <p className="mt-4 text-xs leading-6 text-paper-dim">
            {text.writtenFor} {view.audienceLabels.join(language === "ar" ? "، " : ", ")}.
          </p>
        </div>
      </div>
    </article>
  );
}
