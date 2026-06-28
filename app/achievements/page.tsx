import type { Metadata } from "next";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { achievements } from "@/data/achievements";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Recognition",
  description:
    "Where Abdulelah Alkhathami's work has been tested — national hackathons, the SDAIA x Microsoft AthkaU Top 30, and Google Cloud programs.",
  path: "/achievements"
});

const milestones = [...achievements].sort(
  (a, b) => Number(b.year) - Number(a.year)
);

export default function AchievementsPage() {
  return (
    <>
      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Recognition</p>
          <h1 className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            Where the work has been tested.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">
            I learn fastest under real constraints. These are the rooms where the
            ideas had to hold up — a{" "}
            <span className="text-paper">Top 30 finish</span>{" "}
            in SDAIA × Microsoft&apos;s AthkaU, national hackathons with{" "}
            <span className="text-paper">Google Cloud</span> and{" "}
            <span className="text-paper">Absher</span>, and a CITC innovation
            final.
          </p>
        </div>
      </section>

      <section className="container-shell section-space">
        <ol className="border-t border-white/[0.08]">
          {milestones.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 0.04}>
                <div className="grid gap-x-10 gap-y-4 border-b border-white/[0.08] py-9 md:grid-cols-[9rem_1fr]">
                  <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
                    <span className="font-display text-3xl text-paper/40 md:text-[2.6rem]">
                      {item.year}
                    </span>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
                      {item.organization}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-medium leading-snug text-paper">
                      {item.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-paper-dim">
                      {item.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <CTASection
        title="The next room is the interesting one."
        description="If you're running a team, a program, or a problem worth solving — let's talk."
        primaryHref="/contact"
        primaryLabel="Start a conversation"
        secondaryHref="/projects"
        secondaryLabel="See the work"
      />
    </>
  );
}
