import type { Metadata } from "next";
import { ChapterRail, type Chapter } from "@/components/experience/ChapterRail";
import { CTASection } from "@/components/sections/CTASection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { ImpactAreas } from "@/components/sections/ImpactAreas";
import { PhilosophyReveal } from "@/components/sections/PhilosophyReveal";
import { FeaturedWork } from "@/components/work/FeaturedWork";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Abdulelah Alkhathami — Builder of intelligent products",
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  path: "/"
});

const chapters: Chapter[] = [
  { id: "identity", label: "Identity" },
  { id: "work", label: "Work" },
  { id: "approach", label: "Approach" },
  { id: "range", label: "Range" },
  { id: "belief", label: "Belief" },
  { id: "connect", label: "Connect" }
];

export default function HomePage() {
  return (
    <>
      <ChapterRail chapters={chapters} />

      <div id="identity">
        <HeroSection />
      </div>
      <div id="work" className="scroll-mt-24">
        <FeaturedWork />
      </div>
      <div id="approach" className="scroll-mt-24">
        <HowIBuild />
      </div>
      <div id="range" className="scroll-mt-24">
        <ImpactAreas />
      </div>
      <div id="belief" className="scroll-mt-24">
        <PhilosophyReveal />
      </div>
      <div id="connect" className="scroll-mt-24">
        <CTASection
          title="Let's build something worth remembering."
          description="Hiring, collaborating, or just curious how something was made — I'd like to hear from you."
          primaryHref="/contact"
          primaryLabel="Start a conversation"
          secondaryHref="/about"
          secondaryLabel="More about me"
        />
      </div>
    </>
  );
}
