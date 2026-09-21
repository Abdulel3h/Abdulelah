import type { Metadata } from "next";
import { ChapterRail, type Chapter } from "@/components/experience/ChapterRail";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { ImpactAreas } from "@/components/sections/ImpactAreas";
import { PhilosophyReveal } from "@/components/sections/PhilosophyReveal";
import { FeaturedWork } from "@/components/work/FeaturedWork";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return createPageMetadata({
    locale,
    title: dict.home.metaTitle,
    description: dict.home.metaDescription,
    path: "/",
    absoluteTitle: true
  });
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const chapters: Chapter[] = [
    { id: "identity", label: dict.home.chapters.identity },
    { id: "work", label: dict.home.chapters.work },
    { id: "approach", label: dict.home.chapters.approach },
    { id: "range", label: dict.home.chapters.range },
    { id: "belief", label: dict.home.chapters.belief },
    { id: "connect", label: dict.home.chapters.connect }
  ];

  return (
    <>
      <ChapterRail chapters={chapters} label={dict.home.chapters.label} />

      <div id="identity">
        <HeroSection locale={locale} />
      </div>
      <div id="work" className="scroll-mt-24">
        <FeaturedWork locale={locale} />
      </div>
      <div id="approach" className="scroll-mt-24">
        <HowIBuild locale={locale} />
      </div>
      <div id="range" className="scroll-mt-24">
        <ImpactAreas locale={locale} />
      </div>
      <div id="belief" className="scroll-mt-24">
        <PhilosophyReveal eyebrow={dict.home.belief.eyebrow} statement={dict.home.belief.statement} />
      </div>
      <div id="connect" className="scroll-mt-24">
        <ClosingSection locale={locale} />
      </div>
    </>
  );
}
