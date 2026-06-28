import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
    <section className="container-shell pt-14 sm:pt-20 lg:pt-24">
      <div className="premium-panel animate-hero-enter p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-soft-grid bg-[length:34px_34px] opacity-20" aria-hidden="true" />
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-4xl">
          <Badge variant="sky" className="mb-5">
            {eyebrow}
          </Badge>
          <h1 className="text-balance font-display text-4xl font-medium leading-[1.03] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-paper-dim sm:text-lg">
            {subtitle}
          </p>
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
          <div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="rounded-2xl bg-white/[0.045] p-4">
                <p className="text-xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{stat.label}</p>
              </Card>
            ))}
          </div>
        ) : null}

        {children ? <div className="relative mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
