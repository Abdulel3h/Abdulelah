import { ArrowUpRight, Award, Camera, Github, Lock } from "lucide-react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { StatusBadge } from "@/components/projects/ProjectMeta";
import type { LocalizedProject } from "@/data/projects";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const icons = {
  repository: Github,
  screenshots: Camera,
  "program-record": Award,
  private: Lock
} as const;

/**
 * The standard evidence panel every case study carries: status and why,
 * what can be inspected (with links only when real), what is not claimed,
 * and the stack.
 */
export function EvidencePanel({ project, locale }: { project: LocalizedProject; locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.caseStudy.evidence;

  return (
    <section
      id="evidence"
      aria-labelledby="evidence-title"
      className="rounded-3xl border border-white/[0.12] bg-ink-800/70 p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="evidence-title" className="font-display text-2xl font-medium text-paper">
            {t.title}
          </h2>
          <p className="mt-1 text-sm text-paper-dim">{t.intro}</p>
        </div>
        <StatusBadge status={project.status} label={dict.status[project.status]} />
      </div>

      <dl className="mt-6 grid gap-6">
        <div>
          <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-paper-dim">{t.statusLabel}</dt>
          <dd className="mt-2 text-sm leading-7 text-paper">{project.statusDetail}</dd>
        </div>

        <div>
          <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-paper-dim">{t.itemsLabel}</dt>
          <dd className="mt-2">
            <ul className="grid gap-3">
              {project.evidence.map((item) => {
                const Icon = icons[item.kind];
                const external = Boolean(item.href?.startsWith("http"));

                return (
                  <li key={`${item.kind}-${item.label}`} className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <div className="min-w-0">
                      {item.href ? (
                        <TrackedLink
                          href={external ? item.href : localizeHref(item.href, locale)}
                          external={external}
                          event="evidence_opened"
                          props={{ project: project.slug, type: item.kind, source: "case-study" }}
                          className="focus-ring inline-flex min-h-6 items-center gap-1.5 rounded text-sm font-semibold text-paper underline decoration-accent/50 underline-offset-4 transition hover:text-accent-soft"
                        >
                          {item.label}
                          {external ? (
                            <>
                              <ArrowUpRight className="external-mark" aria-hidden="true" />
                              <span className="sr-only">({dict.common.opensInNewTab})</span>
                            </>
                          ) : null}
                        </TrackedLink>
                      ) : (
                        <p className="text-sm font-semibold text-paper">{item.label}</p>
                      )}
                      <p className="mt-1 text-sm leading-6 text-paper-dim">{item.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </dd>
        </div>

        <div>
          <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-paper-dim">{t.notClaimed}</dt>
          <dd className="mt-2 text-sm leading-7 text-paper-dim">{project.notClaimed}</dd>
        </div>

        <div>
          <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-paper-dim">{t.stack}</dt>
          <dd className="mt-2">
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <li key={technology} className="chip" dir="ltr">
                  {technology}
                </li>
              ))}
            </ul>
            {project.technologiesNote ? (
              <p className="mt-3 text-xs leading-6 text-paper-dim">{project.technologiesNote}</p>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  );
}
