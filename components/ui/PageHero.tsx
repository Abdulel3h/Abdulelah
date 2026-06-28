import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

type PageHeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  download?: boolean;
};

type PageHeroStat = {
  value: string;
  label: string;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
  stats,
  children
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  actions?: PageHeroAction[];
  stats?: PageHeroStat[];
  children?: ReactNode;
}) {
  return (
    <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
      <div className="max-w-3xl">
        <p className="eyebrow mb-6">{eyebrow}</p>
        <h1 className="text-balance font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{subtitle}</p>

        {actions?.length ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {actions.map((action) => (
              <ButtonLink
                key={action.href}
                href={action.href}
                variant={action.variant}
                download={action.download}
                showArrow={!action.download}
                className="w-full sm:w-auto"
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        ) : null}
      </div>

      {stats?.length ? (
        <div className="mt-12 grid gap-x-10 gap-y-6 border-t border-white/[0.08] pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl text-paper">{stat.value}</p>
              <p className="mt-1 text-sm leading-6 text-paper-dim">{stat.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      {children ? <div className="mt-12">{children}</div> : null}
    </section>
  );
}
