import { DomainsShowcase } from "@/components/sections/DomainsShowcase";
import { Reveal } from "@/components/ui/Reveal";

export function ImpactAreas() {
  return (
    <section className="section-space section-band">
      <div className="container-shell">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="eyebrow mb-5">Range</p>
              <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl">
                One way of thinking, across very different problems.
              </h2>
            </div>
            <p className="max-w-md text-base leading-8 text-paper-dim lg:pb-2">
              From a classroom to a city&apos;s heat map to a government&apos;s
              security desk — the domain changes, the care doesn&apos;t.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <DomainsShowcase />
        </Reveal>
      </div>
    </section>
  );
}
