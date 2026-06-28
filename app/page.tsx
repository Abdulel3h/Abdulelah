import type { Metadata } from "next";
import { CTASection } from "@/components/sections/CTASection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroSection } from "@/components/sections/HeroSection";
import { HomeTicker } from "@/components/sections/HomeTicker";
import { ImpactAreas } from "@/components/sections/ImpactAreas";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Abdulelah Alkhathami — Builder of intelligent products",
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  path: "/"
});

const proofMetrics = [
  { value: "6+", label: "AI projects across applied domains" },
  { value: "NLP + LLMs", label: "Intelligent search and response systems" },
  { value: "Cloud AI", label: "Google Cloud and Azure service exposure" },
  { value: "Leadership", label: "Graduation project and hackathon delivery" }
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeTicker />
      <section className="section-space section-band">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Proof of direction"
            title="Applied AI, not just AI demos"
            description="The portfolio is built around real project settings: academic services, public digital security, city sustainability, banking inclusion, legal guidance, and immersive learning."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {proofMetrics.map((metric) => (
              <MetricCard key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
        </div>
      </section>
      <FeaturedProjects />
      <ImpactAreas />
      <CTASection />
    </>
  );
}
