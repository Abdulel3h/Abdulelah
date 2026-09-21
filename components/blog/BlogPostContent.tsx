import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { AgentAskButton } from "@/components/blog/AgentAskButton";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { NotesList } from "@/components/blog/NotesList";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { BlogPost } from "@/data/blog";
import { getBlogText, localizeBlogPost } from "@/data/blog.ar";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function BlogPostContent({
  post,
  relatedPosts,
  locale
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const text = getBlogText(locale);
  const view = localizeBlogPost(post, locale);

  return (
    <>
      <div className="container-shell pt-10 sm:pt-14">
        <Breadcrumbs
          label={dict.common.breadcrumb}
          items={[
            { label: dict.nav.home, href: localizeHref("/", locale) },
            { label: dict.nav.notes, href: localizeHref("/blog", locale) },
            { label: view.title }
          ]}
        />
      </div>

      <section className="container-shell pt-6" aria-labelledby="article-title">
        <div className="premium-panel p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-20" aria-hidden="true" />
          <div className="absolute -end-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-5xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="sky">{view.categoryLabel}</Badge>
              <Badge variant="gold">{view.sourceLabel}</Badge>
            </div>
            <h1
              id="article-title"
              className="mt-6 text-balance font-display text-4xl font-medium leading-tight text-paper sm:text-5xl lg:text-6xl"
            >
              {view.title}
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-8 text-paper-dim sm:text-lg">{view.subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-paper-dim">
              <span>{view.dateLabel}</span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-accent" aria-hidden="true" />
                {view.readingTime}
              </span>
              <span>
                {text.forAudiences} {view.audienceLabels.join(locale === "ar" ? "، " : ", ")}
              </span>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {view.tagLabels.map((tag) => (
                <li key={tag}>
                  <Badge variant="muted">{tag}</Badge>
                </li>
              ))}
            </ul>
            {post.sourceUrl ? (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-accent transition hover:text-paper"
              >
                {text.externalSource} {post.sourceName ?? post.sourceUrl}
                <ArrowUpRight className="external-mark" aria-hidden="true" />
                <span className="sr-only">({dict.common.opensInNewTab})</span>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <ArticleContent post={post} language={locale} />
      </section>

      <section className="section-space section-band" aria-labelledby="continue-title">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">{text.continueBadge}</p>
            <h2 id="continue-title" className="font-display text-3xl font-medium text-paper sm:text-4xl">
              {text.continueTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-paper-dim">{text.continueBody}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AgentAskButton prompt={text.articlePrompt(view.title)}>
                {text.askAboutTopic}
              </AgentAskButton>
              <ButtonLink
                href={localizeHref("/projects", locale)}
                variant="secondary"
                showArrow
                className="w-full sm:w-auto"
              >
                {text.viewRelatedProjects}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell section-space" aria-labelledby="related-notes-title">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{text.relatedBadge}</p>
          <h2
            id="related-notes-title"
            className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
          >
            {text.relatedTitle}
          </h2>
          <p className="mt-5 text-base leading-8 text-paper-dim">{text.relatedBody}</p>
        </div>
        <div className="mt-9">
          <NotesList posts={relatedPosts} language={locale} />
        </div>
        <Link
          href={localizeHref("/blog", locale)}
          className="focus-ring mt-9 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-accent transition hover:text-paper"
        >
          {text.browseAll}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
