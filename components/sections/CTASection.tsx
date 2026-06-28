import { ButtonLink } from "@/components/ui/ButtonLink";

export function CTASection({
  title = "Explore my work in AI, cloud, and intelligent systems.",
  description = "Recruiters, technology teams, innovation programs, and collaborators can review projects, download role-specific resumes, or reach out directly.",
  primaryHref = "/projects",
  primaryLabel = "Explore Projects",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Me"
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(201,167,92,0.16),rgba(12,12,14,0.9),rgba(201,167,92,0.12))] p-8 shadow-glow sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-25" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <h2 className="text-3xl font-semibold text-paper sm:text-4xl">{title}</h2>
            <p className="mt-5 text-base leading-8 text-paper-dim">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={primaryHref} showArrow className="w-full sm:w-auto">
                {primaryLabel}
              </ButtonLink>
              <ButtonLink href={secondaryHref} variant="secondary" className="w-full sm:w-auto">
                {secondaryLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
