import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { journeyTimeline } from "@/data/timeline";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "AI Journey Timeline",
  description:
    "Timeline of Abdulelah Alkhathami's AI projects, hackathons, training programs, and graduation milestone.",
  path: "/journey"
});

export default function JourneyPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Journey Timeline"
        title="From hackathon finalist to applied AI portfolio."
        subtitle="A focused timeline of Abdulelah's growth through national programs, AI projects, cloud work, and Information Systems graduation."
      />
      <section className="container-shell section-space">
      <div className="grid gap-5">
        {journeyTimeline.map((item, index) => (
          <TimelineItem key={item.year} item={item} index={index} />
        ))}
      </div>
    </section>
    </>
  );
}
