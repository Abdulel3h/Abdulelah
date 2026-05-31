import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { BlogPost } from "@/data/blog";
import { formatBlogDate } from "@/data/blog";

function sourceLabel(sourceType: BlogPost["sourceType"]) {
  if (sourceType === "global-pulse") {
    return "Global pulse";
  }

  if (sourceType === "curated") {
    return "Curated insight";
  }

  return "Original insight";
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-sky-300/35">
      <div className="relative border-b border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.15),rgba(124,58,237,0.10),rgba(201,168,76,0.07))] p-5">
        <div className="absolute inset-0 bg-soft-grid bg-[length:24px_24px] opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <Badge variant="sky">{post.category}</Badge>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sky-300/25 bg-sky-300/10 text-sky-100">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {sourceLabel(post.sourceType)}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <span>{formatBlogDate(post.date)}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readingTime}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold leading-8 text-white">
          <Link
            href={`/blog/${post.slug}`}
            className="focus-ring rounded transition hover:text-sky-100"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">{post.excerpt}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="muted">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="mt-5 text-xs leading-6 text-slate-400">
          For: <span className="text-slate-300">{post.audience.join(", ")}</span>
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className={buttonVariants({
            variant: "secondary",
            className: "mt-6 w-full group-hover:border-sky-300/45 group-hover:bg-sky-300/10"
          })}
        >
          Read article
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
