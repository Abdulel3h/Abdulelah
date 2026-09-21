"use client";

import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { AgentAction } from "@/types/agent";

/** Evidence links under an answer: project pages, CVs, email, GitHub. */
export function AgentActions({
  actions,
  onAction
}: {
  actions: AgentAction[];
  onAction?: (action: AgentAction) => void;
}) {
  const { t } = useI18n();
  const promptActions = actions.filter((action) => action.type === "prompt");
  const evidenceActions = actions.filter((action) => action.type !== "prompt").slice(0, 5);
  const visibleActions = [...promptActions, ...evidenceActions];

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {visibleActions.map((action) => {
        const className = cn(
          "focus-ring inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-start text-xs font-medium leading-5 transition [overflow-wrap:anywhere]",
          action.type === "download"
            ? "border-accent/45 bg-accent/[0.1] text-accent-soft hover:border-accent"
            : "border-white/[0.14] bg-white/[0.04] text-paper hover:border-accent/40"
        );
        const icon =
          action.type === "download" ? (
            <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : action.type === "email" ? (
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : action.type === "prompt" ? (
            <ArrowRight className="h-3.5 w-3.5 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
          );

        if (action.type === "contact" || action.type === "prompt") {
          return (
            <li key={`${action.type}-${action.href}`}>
              <button type="button" className={className} onClick={() => onAction?.(action)}>
                {action.label}
                {icon}
              </button>
            </li>
          );
        }

        if (action.type === "internal") {
          return (
            <li key={`${action.type}-${action.href}`}>
              <Link href={action.href} className={className} onClick={() => onAction?.(action)}>
                {action.label}
                {icon}
              </Link>
            </li>
          );
        }

        const external = action.type === "external";

        return (
          <li key={`${action.type}-${action.href}`}>
            <a
              href={action.href}
              className={className}
              download={action.type === "download" || undefined}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={() => {
                if (action.type === "download") {
                  trackEvent("cv_downloaded", {
                    cv: action.href.includes("Specialist") ? "specialist" : "engineer",
                    source: "guide"
                  });
                }

                onAction?.(action);
              }}
            >
              {action.label}
              {icon}
              {external ? <span className="sr-only">({t.common.opensInNewTab})</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
