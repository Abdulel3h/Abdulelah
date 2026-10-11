"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { PipelineStage } from "@/components/motion/PipelineStage";
import { StatusBadge } from "@/components/projects/ProjectMeta";
import { mixer } from "@/components/site/mixed";
import { directional, Latin, Ltr, pad } from "@/components/site/primitives";
import { Flow } from "@/components/site/work/Flow";
import { ConceptFigure } from "@/components/work/ProductPreview";
import type { PreviewKind, ProjectStatus } from "@/data/projects";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export type IndexItem = {
  slug: string;
  href: string;
  name: string;
  descriptor: string;
  line: string;
  domain: string;
  year: string;
  status: ProjectStatus;
  statusLabel: string;
  hasCode: boolean;
  previewKind: PreviewKind;
  flow: string[];
  tint: string;
};

type Filter = "all" | "working" | "concept";

type Labels = {
  filterLabel: string;
  filters: Record<Filter, string>;
  count: string;
  listLabel: string;
  previewLabel: string;
  open: string;
  howItWorks: string;
  code: string;
  conceptVisualization: string;
  conceptVisualizationNote: string;
};

/**
 * The project index: a typeset list with one useful filter — working
 * prototypes with public code versus concepts, the distinction a reviewer
 * actually needs. Every row is a plain link with all its facts, so nothing
 * depends on hover. On wide screens, hovering or focusing a row shows its
 * world beside the list: the sketch, in its tint, acting out its workflow.
 */
export function ProjectIndex({ items, labels, locale }: { items: IndexItem[]; labels: Labels; locale: Locale }) {
  const mix = mixer(locale);
  const { Forward } = directional(locale);
  const [filter, setFilter] = useState<Filter>("all");
  const visible = items.filter((item) =>
    filter === "all" ? true : filter === "working" ? item.status !== "concept" : item.status === "concept"
  );
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug);
  const active = visible.find((item) => item.slug === activeSlug) ?? visible[0];

  return (
    <div>
      <div
        role="group"
        aria-label={labels.filterLabel}
        className="flex flex-wrap items-center gap-1 border-b border-white/[0.09] pb-4"
      >
        {(Object.keys(labels.filters) as Filter[]).map((key) => {
          const pressed = filter === key;

          return (
            <button
              key={key}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(key)}
              className={cn(
                "focus-ring relative inline-flex min-h-11 items-center rounded-lg px-3.5 text-[0.98rem] transition-colors",
                pressed ? "bg-white/[0.06] text-paper" : "text-paper-dim hover:text-paper"
              )}
            >
              {labels.filters[key]}
              {pressed ? (
                <span aria-hidden="true" className="absolute inset-x-3.5 bottom-1.5 h-px bg-accent" />
              ) : null}
            </button>
          );
        })}
        <p role="status" className="ds-micro ms-auto text-paper-faint">
          {labels.count.replace("{n}", String(visible.length))}
        </p>
      </div>

      <div className="mt-2 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <ol aria-label={labels.listLabel} className="lg:col-span-7">
          {visible.map((item) => {
            const isActive = item.slug === active?.slug;

            return (
              <li key={item.slug} style={{ "--tint": item.tint } as CSSProperties}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setActiveSlug(item.slug)}
                  onFocus={() => setActiveSlug(item.slug)}
                  className="focus-ring group relative grid grid-cols-[2.25rem_1fr_auto] items-start gap-x-4 border-b border-white/[0.08] py-7 sm:gap-x-6"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-6 -start-4 hidden w-px transition-colors lg:block",
                      isActive ? "bg-[rgb(var(--tint))]" : "bg-transparent"
                    )}
                  />
                  <span className={cn("pt-2 text-sm transition-colors", isActive ? "ds-tint-text" : "text-paper-faint")}>
                    <Latin>{pad(items.indexOf(item) + 1)}</Latin>
                  </span>

                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <Latin className="ds-name text-[clamp(1.85rem,1.4rem+2vw,2.9rem)] text-paper">{item.name}</Latin>
                      <span className="ds-small text-paper-dim">{mix(item.descriptor)}</span>
                    </span>
                    <span className="ds-small mt-2 block max-w-xl ds-tone-80">{mix(item.line)}</span>
                    <span className="ds-micro mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-paper-faint">
                      <StatusBadge status={item.status} label={item.statusLabel} />
                      <span>
                        {item.domain} · <span className="ds-num">{item.year}</span>
                      </span>
                      {item.hasCode ? (
                        <span>
                          {labels.code}: <Ltr>GitHub</Ltr>
                        </span>
                      ) : null}
                    </span>
                  </span>

                  <Forward
                    aria-hidden="true"
                    className={cn(
                      "ds-forward mt-3 h-5 w-5 transition-colors",
                      isActive ? "lg:text-accent" : "text-paper-faint group-hover:text-paper"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ol>

        {active ? (
          <aside aria-label={labels.previewLabel} className="hidden lg:col-span-5 lg:block">
            <PipelineStage
              replayKey={active.slug}
              threshold={0.3}
              className="sticky top-28 pt-7"
              style={{ "--tint": active.tint } as CSSProperties}
            >
              <div className="relative">
                <div aria-hidden="true" className="ds-tint-wash absolute -inset-12 -z-10" />
                <ConceptFigure
                  key={active.slug}
                  kind={active.previewKind}
                  locale={locale}
                  caption={labels.conceptVisualization}
                  note={labels.conceptVisualizationNote}
                />
              </div>
              <p className="mt-7 text-[1.9rem] text-paper">
                <Latin className="ds-name">{active.name}</Latin>
              </p>
              <Flow steps={active.flow} label={labels.howItWorks} locale={locale} className="mt-3" />
              <Link
                href={active.href}
                tabIndex={-1}
                className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded text-[1.02rem] font-medium text-accent-soft transition-colors hover:text-accent"
              >
                {labels.open}
                <Forward className="ds-forward h-4 w-4" aria-hidden="true" />
              </Link>
            </PipelineStage>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
