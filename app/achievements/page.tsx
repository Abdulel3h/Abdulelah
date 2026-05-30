import type { Metadata } from "next";
import { AchievementTimeline } from "@/components/achievements/AchievementTimeline";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { achievements } from "@/data/achievements";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Experience & Achievements",
  description:
    "Hackathons, training programs, awards, and leadership highlights from Abdulelah Alkhathami's applied AI journey.",
  path: "/achievements"
});

export default function AchievementsPage() {
  const credibilityMetrics = [
    { value: "Top 30", label: "SDAIA x Microsoft AthkaU" },
    { value: "Google Cloud", label: "Hackathon AI project" },
    { value: "Absher", label: "Tuwaiq Hackathon concept" },
    { value: "CITC", label: "Innovation Hackathon Finalist" },
    { value: "5+", label: "Applied AI domains" }
  ];

  return (
    <>
      <PageHero
        eyebrow="Achievements & Experience"
        title="Achievements & Experience"
        subtitle="A practical record of building AI ideas under real constraints, collaborating with teams, and presenting solutions in national innovation settings."
      />
      <section className="container-shell section-space">
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {credibilityMetrics.map((metric) => (
            <MetricCard key={metric.label} value={metric.value} label={metric.label} />
          ))}
        </div>
      </section>

      <section className="section-space section-band">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Timeline"
            title="Applied AI credibility timeline"
            description="These experiences show project leadership, cloud AI exposure, cross-domain thinking, and national program participation."
          />
          <div className="mt-10">
            <AchievementTimeline items={achievements} />
          </div>
        </div>
      </section>
    </>
  );
}
