import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WorkStory } from "@/components/work/WorkStory";
import { getFeaturedProjects } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function FeaturedWork({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.work;
  const featured = getFeaturedProjects(locale);

  return (
    <section className="section-space" aria-labelledby="work-title">
      <div className="container-shell">
        <div className="flex flex-col gap-6 border-b border-white/[0.07] pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">{t.eyebrow}</p>
            <h2
              id="work-title"
              className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl lg:text-5xl"
            >
              {t.title}
              <span className="block text-paper/70">{t.titleAccent}</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-paper-dim">{t.intro}</p>
        </div>

        <div className="mt-16 space-y-24 lg:space-y-32">
          {featured.map((project, index) => (
            <WorkStory key={project.slug} project={project} index={index} locale={locale} />
          ))}
        </div>

        <div className="mt-20 flex justify-center border-t border-white/[0.07] pt-12">
          <Link
            href={localizeHref("/projects", locale)}
            className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-paper transition hover:text-accent-soft"
          >
            {t.seeAll}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
