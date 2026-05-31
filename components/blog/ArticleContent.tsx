import { CheckCircle2, Lightbulb } from "lucide-react";
import type { BlogPost } from "@/data/blog";

export function ArticleContent({ post }: { post: BlogPost }) {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-lg leading-9 text-slate-200">{post.content.intro}</p>

      <div className="mt-12 space-y-12">
        {post.content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {section.heading}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">{section.body}</p>
            {section.bullets?.length ? (
              <ul className="mt-5 grid gap-3">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-7 text-slate-300"
                  >
                    <CheckCircle2
                      className="mt-1 h-4 w-4 shrink-0 text-sky-200"
                      aria-hidden="true"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <aside className="mt-14 rounded-3xl border border-gold/25 bg-gold/[0.08] p-6 sm:p-8">
        <Lightbulb className="h-6 w-6 text-amber-100" aria-hidden="true" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
          Key takeaway
        </p>
        <p className="mt-3 text-base leading-8 text-amber-50/90">
          {post.content.takeaway}
        </p>
      </aside>
    </article>
  );
}
