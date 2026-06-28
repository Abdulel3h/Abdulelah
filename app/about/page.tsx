import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/sections/CTASection";
import { CompanionCue } from "@/components/agent/CompanionCue";
import { JourneyPath } from "@/components/about/JourneyPath";
import { Reveal } from "@/components/ui/Reveal";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";
import { skillGroups } from "@/data/skills";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Abdulelah Alkhathami is a builder and product thinker from Riyadh — how he thinks, how he works, and the path from his first hackathon to a portfolio of shipped products.",
  path: "/about"
});

const approach = [
  {
    title: "Understand the context",
    body: "I start with the environment, not the model. Who's affected, what they trust, what already exists — that's where the real design lives."
  },
  {
    title: "Find the real problem",
    body: "The stated problem is rarely the actual one. I keep asking until the friction is obvious and the goal is sharp."
  },
  {
    title: "Build the smallest thing that works",
    body: "A rough system that runs beats a perfect plan that doesn't. I get to something real, fast, and learn from it."
  },
  {
    title: "Refine until it feels effortless",
    body: "Then I sweat the details — wording, timing, spacing — until the whole thing feels calm and obvious to use."
  }
];

export default function AboutPage() {
  return (
    <>
      {/* Opening identity */}
      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow mb-6">
              About · <span lang="ar">عبدالإله الخثعمي</span>
            </p>
            <h1 className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
              I build things{" "}
              <span className="italic text-paper/65">that didn&apos;t exist yesterday.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-paper-dim">
              I&apos;m Abdulelah — a builder and product thinker from Riyadh. I like
              taking a messy, real-world problem and turning it into something
              people can actually pick up and use.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[360px]">
            <div
              className="absolute -inset-5 -z-10 rounded-[2.5rem]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(201,167,92,0.12), transparent 75%)"
              }}
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-white/[0.14] shadow-glow">
              <Image
                src={siteConfig.assets.profileImage}
                alt="Portrait of Abdulelah Alkhathami"
                fill
                sizes="(max-width: 1024px) 70vw, 360px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who I am */}
      <section className="container-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">Who I am</p>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl">
              A builder, first.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="max-w-2xl space-y-6 text-lg leading-8 text-paper-dim">
              <p>
                I studied Information Systems, but I learned the most by building —
                shipping projects across education, sustainability, government
                security, legal guidance, fintech, and immersive learning.
              </p>
              <p>
                Those projects taught me that good products are shaped by{" "}
                <span className="text-paper">domain understanding</span> as much as
                technology. The model is never the point; the person on the other
                side of the screen is.
              </p>
              <p>
                I led{" "}
                <span className="text-paper">ChatUB</span> as my graduation project,
                competed in national hackathons, and reached the Top 30 of SDAIA ×
                Microsoft&apos;s AthkaU. I&apos;m happiest with an unsolved problem in
                front of me.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-shell pt-4">
        <div className="max-w-2xl">
          <CompanionCue
            title="Prefer the two-minute version?"
            body="Ask me how Abdulelah thinks, what he cares about, and where he's strongest."
            prompt="Give me the two-minute overview of who Abdulelah is, how he thinks, and where he's strongest."
            cta="Give me the overview"
          />
        </div>
      </section>

      {/* The path */}
      <section className="section-space section-band">
        <div className="container-shell">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow mb-5">The path</p>
              <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl">
                From a first finalist run to a portfolio of shipped products.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12">
            <JourneyPath />
          </div>
        </div>
      </section>

      {/* How I approach a problem */}
      <section className="container-shell section-space">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">How I work</p>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl">
              The way a problem becomes a product.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {approach.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.06}>
              <div className="flex gap-5">
                <span className="font-display text-3xl leading-none text-accent/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-paper">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-7 text-paper-dim">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What I reach for */}
      <section className="section-space section-band">
        <div className="container-shell">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow mb-5">What I reach for</p>
              <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl">
                The tools, when the work calls for them.
              </h2>
              <p className="mt-5 text-base leading-8 text-paper-dim">
                Not a checklist — just what I keep close. Anything marked{" "}
                <span className="text-accent">core</span>{" "}
                is where I&apos;m strongest.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group, index) => (
              <Reveal key={group.title} delay={index * 0.04}>
                <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-paper-faint">
                  {group.title}
                </h3>
                <ul className="mt-4">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-2.5 text-sm"
                    >
                      <span
                        className={
                          skill.level === "Strong" ? "text-paper" : "text-paper-dim"
                        }
                      >
                        {skill.name}
                      </span>
                      {skill.level === "Strong" ? (
                        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-accent">
                          core
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Belief */}
      <section className="container-shell section-space">
        <Reveal>
          <figure className="mx-auto max-w-4xl text-center">
            <blockquote className="font-display text-2xl font-medium leading-snug text-paper sm:text-3xl lg:text-4xl">
              “Real innovation starts when technology respects context, privacy,
              and real human needs.”
            </blockquote>
            <figcaption className="mt-10 flex flex-col items-center gap-4">
              <SignatureMonogram className="h-12 w-auto text-accent" />
              <span className="eyebrow">
                <span lang="ar">عبدالإله الخثعمي</span> · Abdulelah Alkhathami
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      <CTASection
        title="If you're building something that matters, let's talk."
        description="I'm always open to a good problem — whether you're hiring, collaborating, or just curious how something was made."
        primaryHref="/contact"
        primaryLabel="Start a conversation"
        secondaryHref="/projects"
        secondaryLabel="See the work"
      />
    </>
  );
}
