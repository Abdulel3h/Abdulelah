import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AgentAction } from "@/types/agent";

export function AgentActions({
  actions,
  onAction
}: {
  actions: AgentAction[];
  onAction?: (action: AgentAction) => void;
}) {
  const promptActions = actions.filter((action) => action.type === "prompt");
  const evidenceActions = actions
    .filter((action) => action.type !== "prompt")
    .slice(0, 5);
  const visibleActions = [...promptActions, ...evidenceActions];

  return (
    <div dir="ltr" className="mt-3 flex flex-wrap gap-2 text-left">
      {visibleActions.map((action) => {
        const className = cn(
          buttonVariants({
            variant: action.type === "download" ? "gold" : "outline",
            size: "sm"
          }),
          "h-auto max-w-full whitespace-normal text-left [overflow-wrap:anywhere]",
          action.type === "prompt"
            ? "min-h-8 rounded-full px-2.5 py-1.5 text-[11px]"
            : "min-h-9 px-3 py-2 text-xs"
        );
        const content = (
          <>
            {action.label}
            {action.type === "download" ? (
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            ) : action.type === "email" ? (
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            ) : action.type === "prompt" ? (
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </>
        );

        if (action.type === "contact" || action.type === "prompt") {
          return (
            <button
              key={action.href}
              type="button"
              className={className}
              onClick={() => onAction?.(action)}
            >
              {content}
            </button>
          );
        }

        if (action.type === "internal") {
          return (
            <Link
              key={action.href}
              href={action.href}
              className={className}
              onClick={() => onAction?.(action)}
            >
              {content}
            </Link>
          );
        }

        return (
          <a
            key={action.href}
            href={action.href}
            className={className}
            download={action.type === "download"}
            target={action.type === "external" ? "_blank" : undefined}
            rel={action.type === "external" ? "noopener noreferrer" : undefined}
            onClick={() => onAction?.(action)}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
