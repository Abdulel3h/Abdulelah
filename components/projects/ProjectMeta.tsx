import { Award, Github, Lock } from "lucide-react";
import type { EvidenceType, ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Project maturity as a text label plus a shape marker (solid dot for a
 * working build, hollow ring for a concept) — never colour alone.
 */
export function StatusBadge({
  status,
  label,
  className
}: {
  status: ProjectStatus;
  label: string;
  className?: string;
}) {
  const isConcept = status === "concept";

  return (
    <span
      data-status={status}
      className={cn(
        "status-badge",
        isConcept
          ? "border-white/25 bg-white/[0.03] text-paper-dim"
          : "border-accent/45 bg-accent/[0.10] text-accent-soft",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          isConcept ? "border border-current" : "bg-current"
        )}
      />
      {label}
    </span>
  );
}

export function EvidenceTag({
  type,
  label,
  className
}: {
  type: EvidenceType;
  label: string;
  className?: string;
}) {
  const Icon = type === "public-repository" ? Github : type === "program-record" ? Award : Lock;

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-paper-dim", className)}>
      <Icon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
      {label}
    </span>
  );
}
