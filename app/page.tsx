import type { Metadata } from "next";
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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedWork />
      <HowIBuild />
      <ImpactAreas />
      <PhilosophyReveal />
      <CTASection
        title="Let's build something worth remembering."
        description="Hiring, collaborating, or just curious how something was made — I'd like to hear from you."
        primaryHref="/contact"
        primaryLabel="Start a conversation"
        secondaryHref="/about"
        secondaryLabel="More about me"
      />
    </>
  );
}
