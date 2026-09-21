import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";

/** The single closing section a page may end with (the footer carries none). */
export function CTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="section-space" aria-labelledby="closing-title">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900/60 p-7 shadow-glow sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="absolute -end-24 -top-24 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.16), transparent 72%)" }}
          />
          <div className="relative max-w-3xl">
            <h2
              id="closing-title"
              className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl lg:text-[2.75rem]"
            >
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-paper-dim">{description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href={primaryHref} showArrow className="w-full">
                  {primaryLabel}
                </ButtonLink>
              </Magnetic>
              {secondaryHref && secondaryLabel ? (
                <ButtonLink href={secondaryHref} variant="secondary" className="w-full sm:w-auto">
                  {secondaryLabel}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
