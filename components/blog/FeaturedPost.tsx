import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { BlogPost } from "@/data/blog";
import { formatBlogDate } from "@/data/blog";

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="premium-panel p-6 sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-soft-grid bg-[length:30px_30px] opacity-20" aria-hidden="true" />
      <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_0.34fr] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="gold">Featured article</Badge>
            <Badge variant="sky">{post.category}</Badge>
          </div>
          <h2 className="mt-6 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {post.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            {post.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className={buttonVariants({ className: "mt-7" })}
          >
            Read featured article
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <Sparkles className="h-5 w-5 text-amber-200" aria-hidden="true" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Original insight
          </p>
          <p className="mt-3 text-sm text-slate-200">{formatBlogDate(post.date)}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
            <Clock3 className="h-4 w-4 text-sky-200" aria-hidden="true" />
            {post.readingTime}
          </p>
          <p className="mt-4 text-xs leading-6 text-slate-400">
            Written for {post.audience.join(", ")}.
          </p>
        </div>
      </div>
    </article>
  );
}
