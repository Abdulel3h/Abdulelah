import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CompanionCue } from "@/components/agent/CompanionCue";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, Ltr, pad } from "@/components/site/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";
import { getSkillGroups } from "@/data/skills";
import { siteConfig } from "@/data/site";
import { getTimeline } from "@/data/timeline";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";

/**
 * About: personality and direction, not a CV. One line on who he is, the
 * facts as margin notes beside the arched portrait, four short principles,
 * the path from 2023 to now on one line, the tools he reaches for first, and
 * where to find him.
 */
export function About({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const site = siteCopy(locale);
  const copy = site.about;
  const mix = mixer(locale);
  const { Forward, Outward } = directional(locale);
  const timeline = getTimeline(locale);
  // Technical groups only; the professional skills live on /skills.
  const technical = getSkillGroups(locale).slice(0, -1).flatMap((group) => group.skills);
  const core = technical.filter((skill) => skill.level === "Strong");
  const practical = technical.filter((skill) => skill.level === "Practical Experience");

  return (
    <>
      <header className="ds-shell grid gap-12 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-14 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="ds-kicker">{copy.kicker}</p>
          <h1 id="about-title" className="ds-h1 mt-5 max-w-[14ch]">
            {copy.title}
          </h1>
          <div aria-hidden="true" className="ds-draw mt-7 h-px w-24 bg-accent" />
          <p className="ds-lede mt-7">{copy.lede}</p>

          <dl className="mt-10 grid gap-4 sm:grid-cols-[1fr_1.35fr_0.6fr] sm:gap-6">
            {copy.facts.map((fact) => (
              <div key={fact.label} className="ds-gloss">
                <dt className="ds-label">{fact.label}</dt>
                <dd className="ds-text mt-1 text-[1rem] text-paper">{mix(fact.value)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="relative mx-auto w-full max-w-[22rem] lg:col-span-5 lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-10 -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.13), transparent 72%)" }}
          />
          <div className="ds-arch relative aspect-[4/5.2] overflow-hidden border border-white/[0.14] bg-paper">
            <Image
              src={siteConfig.assets.profileImage}
              alt={copy.portraitAlt}
              fill
              priority
              sizes="(min-width: 1024px) 34vw, 22rem"
              className="object-cover object-top"
            />
          </div>
          {/* The name in the other script. */}
          <figcaption className="mt-4 text-paper-faint">
            {locale === "ar" ? (
              <Latin className="text-[0.95rem]">{siteConfig.name}</Latin>
            ) : (
              <span lang="ar" dir="rtl" className="text-[0.95rem]">
                {siteConfig.arabicName}
              </span>
            )}
          </figcaption>
        </figure>
      </header>

      <section aria-labelledby="think-title" className="ds-shell ds-section">
        <h2 id="think-title" className="ds-kicker">
          {copy.thinkKicker}
        </h2>
        <ol className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {copy.think.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 0.06} className="ds-rise border-t border-white/[0.1] pt-5">
              <Latin className="text-sm text-accent">{pad(index + 1)}</Latin>
              <h3 className="ds-title mt-3 text-[1.35rem]">{item.title}</h3>
              <p className="ds-small mt-2 text-paper-dim">{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="path-title" className="border-y border-white/[0.08] bg-white/[0.015]">
        <div className="ds-shell py-16 lg:py-24">
          <p className="ds-kicker">{copy.pathKicker}</p>
          <h2 id="path-title" className="ds-h2 mt-4">
            {copy.pathTitle}
          </h2>
          <ol className="relative mt-12 grid border-s border-white/[0.12] ps-6 lg:grid-cols-4 lg:border-s-0 lg:border-t lg:ps-0">
            {timeline.map((event, index) => {
              const latest = index === timeline.length - 1;

              return (
                <Reveal
                  as="li"
                  key={event.year}
                  delay={index * 0.06}
                  className="ds-rise relative pb-10 last:pb-0 lg:pb-0 lg:pe-8 lg:pt-8"
                >
                  <span
                    aria-hidden="true"
                    className={
                      latest
                        ? "absolute -start-[1.81rem] top-2 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(201,167,92,0.18)] lg:-top-[0.34rem] lg:start-0"
                        : "absolute -start-[1.72rem] top-2.5 h-1.5 w-1.5 rounded-full bg-paper-faint lg:-top-[0.2rem] lg:start-0.5"
                    }
                  />
                  <Latin className={latest ? "text-[2.4rem] leading-none text-accent" : "text-[2.4rem] leading-none ds-tone-60"}>
                    {event.year}
                  </Latin>
                  <h3 className="ds-title mt-4 text-[1.1rem]">{mix(event.title)}</h3>
                  <p className="ds-small mt-2 text-paper-dim">{mix(event.description)}</p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section aria-labelledby="tools-title" className="ds-shell ds-section grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="ds-kicker">{copy.toolsKicker}</p>
          <h2 id="tools-title" className="ds-h2 mt-4">
            {copy.toolsTitle}
          </h2>
          <Link
            href={localizeHref("/skills", locale)}
            className="focus-ring group mt-6 inline-flex min-h-11 items-center gap-2 rounded text-[1.02rem] font-medium text-accent-soft transition-colors hover:text-accent"
          >
            {copy.toolsAll}
            <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="lg:col-span-7">
          <h3 className="ds-label">{copy.toolsCore}</h3>
          <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-3">
            {core.map((skill, index) => (
              <li
                key={skill.name}
                className="ds-text flex items-center gap-2 text-[clamp(1.35rem,1.1rem+1vw,2rem)] font-medium text-paper"
              >
                {index > 0 ? (
                  <span aria-hidden="true" className="text-accent/60">
                    ·
                  </span>
                ) : null}
                {mix(skill.name)}
              </li>
            ))}
          </ul>
          <h3 className="ds-label mt-10">{copy.toolsPractical}</h3>
          <ul className="ds-small mt-3 flex flex-wrap gap-x-1 gap-y-1 text-paper-dim">
            {practical.map((skill, index) => (
              <li key={skill.name} className="flex items-center gap-1">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-paper-faint">
                    ·
                  </span>
                ) : null}
                {mix(skill.name)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ds-shell pb-[var(--ds-section)]">
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="ds-quote text-[clamp(1.6rem,1.2rem+1.9vw,2.75rem)]">
            {site.quote.open}
            {copy.quote}
            {site.quote.close}
          </blockquote>
          <figcaption className="mt-8 flex flex-col items-center gap-3">
            <SignatureMonogram className="h-11 w-auto text-accent" />
            <span className="ds-small text-paper-dim">{dict.common.name}</span>
          </figcaption>
        </figure>

        <div className="mx-auto mt-16 max-w-4xl border-t border-white/[0.08] pt-10">
          <p className="ds-label">{copy.linksKicker}</p>
          <ul className="mt-3 grid gap-x-8 sm:grid-cols-3">
            <li>
              <Link
                href={localizeHref("/resume", locale)}
                className="focus-ring group flex min-h-14 items-center justify-between gap-3 border-b border-white/[0.08] text-[1.02rem] text-paper transition-colors hover:text-accent-soft"
              >
                {copy.cv}
                <Forward className="ds-forward h-4 w-4 text-paper-dim" aria-hidden="true" />
              </Link>
            </li>
            {[
              { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
              { label: "GitHub", href: siteConfig.social.github, icon: Github }
            ].map((profile) => {
              const Icon = profile.icon;

              return (
                <li key={profile.href}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring group flex min-h-14 items-center justify-between gap-3 border-b border-white/[0.08] text-[1.02rem] text-paper transition-colors hover:text-accent-soft"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-paper-dim" aria-hidden="true" />
                      <Ltr>{profile.label}</Ltr>
                      <span className="sr-only">({dict.common.opensInNewTab})</span>
                    </span>
                    <Outward className="ds-forward h-4 w-4 text-paper-dim" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-10">
            <CompanionCue
              title={dict.about.cueTitle}
              body={dict.about.cueBody}
              prompt={dict.about.cuePrompt}
              cta={dict.about.cueCta}
            />
          </div>
        </div>
      </section>
    </>
  );
}
