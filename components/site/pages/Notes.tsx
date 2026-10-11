import Link from "next/link";
import { mixer } from "@/components/site/mixed";
import { directional, PageHead } from "@/components/site/primitives";
import { blogPosts, featuredBlogPost, type BlogPost } from "@/data/blog";
import { localizeBlogPost } from "@/data/blog.ar";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { siteCopy } from "@/lib/i18n/experience";

/** One note as a typeset row: date and reading time, the title, one line. */
export function NoteRow({ post, locale }: { post: BlogPost; locale: Locale }) {
  const view = localizeBlogPost(post, locale);
  const mix = mixer(locale);
  const { Forward } = directional(locale);

  return (
    <li>
      <Link
        href={localizeHref(`/blog/${post.slug}`, locale)}
        className="focus-ring group grid gap-3 border-b border-white/[0.08] py-8 md:grid-cols-12 md:gap-10"
      >
        <span className="ds-micro text-paper-faint md:col-span-3 md:pt-2">
          <span className="ds-num">{view.dateLabel}</span>
          <span aria-hidden="true"> · </span>
          {view.readingTime}
          <span className="mt-1 block text-accent">{view.categoryLabel}</span>
        </span>
        <span className="md:col-span-8">
          <span className="ds-heading block text-[clamp(1.35rem,1.15rem+0.9vw,1.9rem)] transition-colors group-hover:text-accent-soft">
            {mix(view.title)}
          </span>
          <span className="ds-small mt-2 block max-w-2xl text-paper-dim">{mix(view.subtitle)}</span>
        </span>
        <span className="hidden justify-end pt-3 md:col-span-1 md:flex">
          <Forward className="ds-forward h-5 w-5 text-paper-faint group-hover:text-accent" aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}

export function Notes({ locale }: { locale: Locale }) {
  const copy = siteCopy(locale).notes;
  const mix = mixer(locale);
  const { Forward } = directional(locale);
  const featured = localizeBlogPost(featuredBlogPost, locale);
  const rest = blogPosts.filter((post) => post.slug !== featuredBlogPost.slug);

  return (
    <>
      <PageHead id="notes-title" kicker={copy.kicker} title={copy.title} lede={copy.lede} />

      <section aria-labelledby="notes-featured" className="ds-shell pt-14 lg:pt-20">
        <h2 id="notes-featured" className="ds-label">
          {copy.featured}
        </h2>
        <Link
          href={localizeHref(`/blog/${featuredBlogPost.slug}`, locale)}
          className="focus-ring group relative mt-4 block overflow-hidden rounded-[var(--ds-radius)] border border-white/[0.1] px-6 py-10 transition-colors hover:border-accent/40 sm:px-10 sm:py-14"
        >
          <span
            aria-hidden="true"
            className="absolute -end-24 -top-24 h-80 w-80"
            style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.14), transparent 72%)" }}
          />
          <span className="ds-micro relative text-paper-faint">
            <span className="ds-num">{featured.dateLabel}</span> · {featured.readingTime} ·{" "}
            <span className="text-accent">{featured.categoryLabel}</span>
          </span>
          <span className="ds-heading relative mt-4 block max-w-3xl text-[clamp(1.9rem,1.4rem+2.2vw,3.2rem)]">
            {mix(featured.title)}
          </span>
          <span className="ds-lede relative mt-4 block">{mix(featured.subtitle)}</span>
          <span className="relative mt-8 inline-flex items-center gap-2 text-[1.02rem] font-medium text-accent-soft">
            {copy.read}
            <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      </section>

      <section aria-labelledby="notes-library" className="ds-shell pb-[var(--ds-section)] pt-16 lg:pt-24">
        <h2 id="notes-library" className="ds-h2">
          {copy.library}
        </h2>
        <ol className="mt-8 border-t border-white/[0.08]">
          {rest.map((post) => (
            <NoteRow key={post.slug} post={post} locale={locale} />
          ))}
        </ol>
      </section>
    </>
  );
}
