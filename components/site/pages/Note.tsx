import Link from "next/link";
import { AgentAskButton } from "@/components/blog/AgentAskButton";
import { mixer } from "@/components/site/mixed";
import { NoteRow } from "@/components/site/pages/Notes";
import { directional } from "@/components/site/primitives";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { BlogPost } from "@/data/blog";
import { getBlogText, localizeBlogPost } from "@/data/blog.ar";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";

/**
 * A note set for reading on screen: a measure of about 44rem, the reading
 * line height of the locale, headings in the display face, bullets as plain
 * marks (no boxes), and the takeaway as a margin note. The article text
 * itself is the author's and is shown as written.
 */
export function Note({ post, related, locale }: { post: BlogPost; related: BlogPost[]; locale: Locale }) {
  const dict = getDictionary(locale);
  const text = getBlogText(locale);
  const copy = siteCopy(locale).notes;
  const mix = mixer(locale);
  const { Forward, Outward } = directional(locale);
  const view = localizeBlogPost(post, locale);

  return (
    <>
      <div className="ds-shell pt-8 sm:pt-10">
        <Breadcrumbs
          label={dict.common.breadcrumb}
          items={[
            { label: dict.nav.home, href: localizeHref("/", locale) },
            { label: dict.nav.notes, href: localizeHref("/blog", locale) },
            { label: view.title }
          ]}
        />
      </div>

      <article aria-labelledby="article-title">
        <header className="ds-shell pt-10 lg:pt-16">
          <div className="mx-auto max-w-[44rem]">
            <p className="ds-kicker">{view.categoryLabel}</p>
            <h1 id="article-title" className="ds-heading mt-5 text-[clamp(2rem,1.45rem+2.6vw,3.4rem)]">
              {mix(view.title)}
            </h1>
            <p className="ds-lede mt-6 max-w-none">{mix(view.subtitle)}</p>
            <p className="ds-micro mt-6 flex flex-wrap gap-x-3 gap-y-1 text-paper-faint">
              <span className="ds-num">{view.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{view.readingTime}</span>
              <span aria-hidden="true">·</span>
              <span>
                {text.forAudiences} {view.audienceLabels.join(copy.audienceSeparator)}
              </span>
            </p>
            {post.sourceUrl ? (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-link focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded text-[0.95rem] text-paper"
              >
                {copy.source}: {post.sourceName ?? post.sourceUrl}
                <Outward className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">({dict.common.opensInNewTab})</span>
              </a>
            ) : null}
            <div aria-hidden="true" className="ds-draw mt-10 h-px w-24 bg-accent" />
          </div>
        </header>

        <div className="ds-shell pb-16 pt-10">
          <div className="mx-auto max-w-[44rem]">
            <p className="ds-read text-[1.2rem] text-paper">{mix(view.content.intro)}</p>

            {view.content.sections.map((section) => (
              <section key={section.heading} className="mt-14">
                <h2 className="ds-heading text-[clamp(1.4rem,1.2rem+0.9vw,1.85rem)]">{mix(section.heading)}</h2>
                <p className="ds-read mt-4 text-[1.12rem] ds-tone-80">{mix(section.body)}</p>
                {section.bullets?.length ? (
                  <ul className="mt-5 grid gap-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="ds-read flex gap-3 text-[1.05rem] ds-tone-80">
                        <span
                          aria-hidden="true"
                          className="mt-[calc((var(--ds-lh-read)*1em_-_0.25rem)/2)] h-1 w-3 shrink-0 rounded-full bg-accent/70"
                        />
                        <span>{mix(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <aside aria-label={copy.takeaway} className="ds-gloss ds-gloss-strong mt-16 py-1">
              <p className="ds-label text-accent">{copy.takeaway}</p>
              <p className="ds-read mt-2 text-[1.15rem] font-medium text-paper">{mix(view.content.takeaway)}</p>
            </aside>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <AgentAskButton
                prompt={text.articlePrompt(view.title)}
                className="h-12 rounded-[var(--ds-radius)] px-5 text-[0.98rem] font-medium"
              >
                {copy.askGuide}
              </AgentAskButton>
              <Link href={localizeHref("/projects", locale)} className="ds-btn ds-btn-quiet focus-ring group">
                {text.viewRelatedProjects}
                <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-notes" className="ds-shell border-t border-white/[0.08] pb-[var(--ds-section)] pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="related-notes" className="ds-h2">
            {copy.related}
          </h2>
          <Link
            href={localizeHref("/blog", locale)}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded text-[1.02rem] font-medium text-paper transition-colors hover:text-accent-soft"
          >
            {copy.all}
            <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ol className="mt-8 border-t border-white/[0.08]">
          {related.map((item) => (
            <NoteRow key={item.slug} post={item} locale={locale} />
          ))}
        </ol>
      </section>
    </>
  );
}
