import { ArrowUpRight, Download } from "lucide-react";
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
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => {
        const className = cn(
          buttonVariants({
            variant: action.type === "download" ? "gold" : "outline",
            size: "sm"
          }),
          "h-auto min-h-9 whitespace-normal px-3 py-2 text-left text-xs"
        );
        const content = (
          <>
            {action.label}
            {action.type === "download" ? (
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </>
        );

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
