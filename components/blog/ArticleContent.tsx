import { CheckCircle2, Lightbulb } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { getBlogText, localizeBlogPost, type BlogLanguage } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function ArticleContent({
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
      className={cn("mx-auto max-w-3xl", isArabic && "blog-arabic")}
    >
      <p className="text-lg leading-9 text-paper">{view.content.intro}</p>

      <div className="mt-12 space-y-12">
        {view.content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold leading-tight text-paper sm:text-3xl">
              {section.heading}
            </h2>
            <p className="mt-5 text-base leading-8 text-paper-dim">{section.body}</p>
            {section.bullets?.length ? (
              <ul className="mt-5 grid gap-3">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-7 text-paper-dim"
                  >
                    <CheckCircle2
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
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

      <aside className="mt-14 rounded-3xl border border-accent/25 bg-accent/[0.08] p-6 sm:p-8">
        <Lightbulb className="h-6 w-6 text-accent-soft" aria-hidden="true" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
          {text.keyTakeaway}
        </p>
        <p className="mt-3 text-base leading-8 text-amber-50/90">
          {view.content.takeaway}
        </p>
      </aside>
    </article>
  );
}
