"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EvidenceTag, StatusBadge } from "@/components/projects/ProjectMeta";
import { ConceptFigure } from "@/components/work/ProductPreview";
import type { EvidenceType, PreviewKind, ProjectStatus } from "@/data/projects";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export type WorkIndexItem = {
  slug: string;
  href: string;
  name: string;
  descriptor: string;
  summary: string;
  domain: string;
  year: string;
  role: string;
  status: ProjectStatus;
  statusLabel: string;
  evidenceType: EvidenceType;
  evidenceLabel: string;
  previewKind: PreviewKind;
  flow: string[];
};

type Labels = {
  listLabel: string;
  role: string;
  open: string;
  conceptVisualization: string;
  conceptVisualizationNote: string;
  previewLabel: string;
  architecture: string;
};

/**
 * The full project list. Every row is a plain link to the case study and
 * shows the facts a reviewer scans for (purpose, domain, year, role, status,
 * evidence), so nothing depends on hover. On wide screens, hovering or
 * focusing a row also updates the preview panel; the active row is marked
 * with a bar and an arrow, not colour alone.
 */
export function WorkIndex({
  items,
  labels,
  locale
}: {
  items: WorkIndexItem[];
  labels: Labels;
  locale: Locale;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <ol aria-label={labels.listLabel} className="border-t border-white/[0.08]">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <li key={item.slug}>
              <Link
                href={item.href}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                data-active={isActive || undefined}
                className="focus-ring group relative block rounded-lg border-b border-white/[0.08] py-6 ps-5 pe-2 transition-colors active:bg-white/[0.04] lg:ps-6"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-5 start-0 w-0.5 rounded-full transition-colors",
                    isActive ? "lg:bg-accent" : "bg-transparent group-hover:bg-white/20"
                  )}
                />
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-2 font-display text-sm tabular-nums",
                      isActive ? "lg:text-accent" : "text-paper-dim"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="font-display text-2xl font-medium leading-tight text-paper sm:text-3xl lg:text-[2.2rem]">
                        {item.name}
                      </h2>
                      <span className="text-[0.72rem] uppercase tracking-[0.14em] text-paper-dim">
                        {item.domain} · {item.year}
                      </span>
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-paper-dim">{item.summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <StatusBadge status={item.status} label={item.statusLabel} />
                      <EvidenceTag type={item.evidenceType} label={item.evidenceLabel} />
                      <span className="text-xs text-paper-dim">
                        <span className="sr-only">{labels.role}: </span>
                        {item.role}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "mt-2 h-5 w-5 shrink-0 transition-all rtl:-scale-x-100",
                      isActive
                        ? "text-paper-dim lg:translate-x-0 lg:text-accent"
                        : "text-paper-dim group-hover:text-paper"
                    )}
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <aside aria-label={labels.previewLabel} className="hidden lg:block">
        <div className="sticky top-28">
          <ConceptFigure
            key={active.slug}
            kind={active.previewKind}
            locale={locale}
            caption={labels.conceptVisualization}
            note={labels.conceptVisualizationNote}
          />

          <p className="mt-6 max-w-md font-display text-2xl leading-snug text-paper">{active.name}</p>
          <p className="mt-1 max-w-md text-sm text-paper-dim">{active.descriptor}</p>

          <ol aria-label={labels.architecture} className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-paper-dim">
            {active.flow.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                {index > 0 ? (
                  <ArrowRight className="h-3 w-3 text-accent/70 rtl:-scale-x-100" aria-hidden="true" />
                ) : null}
                <span className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1">{step}</span>
              </li>
            ))}
          </ol>

          <Link
            href={active.href}
            tabIndex={-1}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-accent-soft transition hover:text-accent"
          >
            {labels.open} {active.name}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </aside>
    </div>
  );
}
