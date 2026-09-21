import { BlogCTA } from "@/components/blog/BlogCTA";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { NotesList } from "@/components/blog/NotesList";
import { featuredBlogPost } from "@/data/blog";
import { getBlogText } from "@/data/blog.ar";
import type { Locale } from "@/lib/i18n/config";

export function BlogIndexContent({ locale }: { locale: Locale }) {
  const text = getBlogText(locale);

  return (
    <>
      <section className="container-shell pt-14 sm:pt-20 lg:pt-24" aria-labelledby="notes-title">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{text.heroEyebrow}</p>
          <h1
            id="notes-title"
            className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
          >
            {text.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{text.heroSubtitle}</p>
        </div>
      </section>

      <section className="container-shell section-space" aria-label={text.startHere}>
        <p className="eyebrow mb-6">{text.startHere}</p>
        <FeaturedPost post={featuredBlogPost} language={locale} />
      </section>

      <section className="container-shell pb-16 sm:pb-20 lg:pb-24" aria-labelledby="library-title">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{text.libraryBadge}</p>
          <h2
            id="library-title"
            className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
          >
            {text.libraryTitle}
          </h2>
        </div>
        <div className="mt-10">
          <NotesList language={locale} excludeSlug={featuredBlogPost.slug} />
        </div>
      </section>

      <BlogCTA language={locale} />
    </>
  );
}
