import type { Metadata } from "next";
import Image from "next/image";
import { CompanionCue } from "@/components/agent/CompanionCue";
import { JourneyPath } from "@/components/about/JourneyPath";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";
import { getSkillGroups } from "@/data/skills";
import { siteConfig } from "@/data/site";
import { getTimeline } from "@/data/timeline";
import { localizeHref } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).about;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/about" });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).about;
  const otherName = locale === "ar" ? siteConfig.name : siteConfig.arabicName;
  const otherLang = locale === "ar" ? "en" : "ar";

  return (
    <>
      <section className="container-shell pt-14 sm:pt-20 lg:pt-24" aria-labelledby="about-title">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow mb-6">
              {t.eyebrow} ·{" "}
              <bdi lang={otherLang} dir={otherLang === "ar" ? "rtl" : "ltr"}>
                {otherName}
              </bdi>
            </p>
            <h1
              id="about-title"
              className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
            >
              {t.title} <span className="italic text-paper/70">{t.titleAccent}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-paper-dim">{t.intro}</p>
          </div>

          <div className="relative mx-auto w-full max-w-[340px]">
            <div
              className="absolute -inset-3 -z-10 rounded-[2.5rem] sm:-inset-5"
              style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.12), transparent 75%)" }}
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-white/[0.14] shadow-glow">
              <Image
                src={siteConfig.assets.profileImage}
                alt={t.portraitAlt}
                fill
                priority
                sizes="(max-width: 1024px) 70vw, 340px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell section-space" aria-labelledby="who-title">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-5">{t.whoEyebrow}</p>
            <h2
              id="who-title"
              className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
            >
              {t.whoTitle}
            </h2>
          </div>
          <div className="max-w-2xl space-y-6 text-lg leading-8 text-paper-dim">
            {t.who.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="mt-12 max-w-2xl">
          <CompanionCue title={t.cueTitle} body={t.cueBody} prompt={t.cuePrompt} cta={t.cueCta} />
        </div>
      </section>

      <section className="section-space section-band" aria-labelledby="path-title">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">{t.pathEyebrow}</p>
            <h2
              id="path-title"
              className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
            >
              {t.pathTitle}
            </h2>
          </div>
          <div className="mt-12">
            <JourneyPath events={getTimeline(locale)} />
          </div>
        </div>
      </section>

      <section className="container-shell section-space" aria-labelledby="work-style-title">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{t.workEyebrow}</p>
          <h2
            id="work-style-title"
            className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
          >
            {t.workTitle}
          </h2>
        </div>
        <ol className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {t.approach.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 0.06}>
              <div className="flex gap-5">
                <span className="font-display text-3xl leading-none text-accent" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-paper">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-paper-dim">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section-space section-band" aria-labelledby="tools-title">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">{t.toolsEyebrow}</p>
            <h2
              id="tools-title"
              className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl"
            >
              {t.toolsTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-paper-dim">{t.toolsIntro}</p>
          </div>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {getSkillGroups(locale).map((group) => (
              <div key={group.title}>
                <h3 className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-paper-dim">
                  {group.title}
                </h3>
                <ul className="mt-4">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-2.5 text-sm"
                    >
                      <span className={skill.level === "Strong" ? "text-paper" : "text-paper-dim"}>
                        {skill.name}
                      </span>
                      {skill.level === "Strong" ? (
                        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-accent">{t.core}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="font-display text-2xl font-medium leading-snug text-paper sm:text-3xl lg:text-4xl">
            {locale === "ar" ? `«${t.quote}»` : `“${t.quote}”`}
          </blockquote>
          <figcaption className="mt-10 flex flex-col items-center gap-4">
            <SignatureMonogram className="h-12 w-auto text-accent" />
            <span className="eyebrow">
              <bdi lang="ar" dir="rtl">
                {siteConfig.arabicName}
              </bdi>{" "}
              ·{" "}
              <bdi lang="en" dir="ltr">
                {siteConfig.name}
              </bdi>
            </span>
          </figcaption>
        </figure>
      </section>

      <CTASection
        title={t.closingTitle}
        description={t.closingBody}
        primaryHref={localizeHref("/contact", locale)}
        primaryLabel={t.closingPrimary}
        secondaryHref={localizeHref("/projects", locale)}
        secondaryLabel={t.closingSecondary}
      />
    </>
  );
}
