import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { HeroPortrait } from "@/components/sections/HeroPortrait";
import { HeroStage } from "@/components/sections/HeroStage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * First viewport. Everything essential — who, what, where, the evidence and
 * the next step — is plain server-rendered HTML that paints immediately: no
 * opacity:0 start states and no staggered JavaScript entrance. That removes
 * the multi-second render delay that previously held back mobile LCP. The
 * entrance (name sheen, signal along the rule, proof points) is CSS only and
 * adds light to text that is already painted (see globals.css).
 */
export function HeroSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const hero = dict.home.hero;

  return (
    <HeroStage className="container-shell relative grid min-h-[calc(100svh-5.5rem)] items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24 lg:pt-16">
      <div className="relative z-10">
        <p className="eyebrow mb-6 max-w-xl leading-6">{hero.eyebrow}</p>

        <h1
          id="hero-title"
          className="font-display font-medium leading-[0.95] tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(2.75rem, 7.2vw, 5.5rem)" }}
        >
          <span className="hero-name-line">{dict.common.firstName}</span>
          <span className="hero-name-line block text-paper/85" style={{ "--sheen-delay": ".48s" } as CSSProperties}>
            {dict.common.lastName}
          </span>
        </h1>

        <p className="mt-5 text-base font-semibold text-accent-soft sm:text-lg">{hero.positioning}</p>

        <p className="mt-5 max-w-xl text-lg leading-8 text-paper-dim sm:text-xl sm:leading-9">
          {hero.leadStart}{" "}
          <span className="font-display italic text-paper">{hero.leadEmphasis}</span>{" "}
          {hero.leadEnd}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Magnetic className="w-full sm:w-auto">
            <ButtonLink href={localizeHref("/projects", locale)} showArrow className="w-full">
              {hero.primary}
            </ButtonLink>
          </Magnetic>
          <ButtonLink
            href={localizeHref("/resume", locale)}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {hero.secondary}
          </ButtonLink>
          <Link
            href={localizeHref("/about", locale)}
            className="focus-ring group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-paper-dim transition hover:text-paper sm:justify-start"
          >
            {hero.tertiary}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-10 max-w-xl">
          <div className="accent-rule signal-rule" />
          <ul
            aria-label={hero.proofLabel}
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-paper-dim"
          >
            {hero.proof.map((item, index) => (
              <li key={item} className="inline-flex items-center gap-4" style={{ "--i": index } as CSSProperties}>
                {index > 0 ? (
                  <span className="proof-dot h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
                ) : null}
                <span className="proof-item">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <HeroPortrait
        src={siteConfig.assets.profileImage}
        alt={hero.portraitAlt}
        name={siteConfig.name}
        arabicName={siteConfig.arabicName}
      />
    </HeroStage>
  );
}
