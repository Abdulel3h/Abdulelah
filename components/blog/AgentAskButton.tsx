"use client";

import { Bot } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const OPEN_AGENT_EVENT = "open-abdulelah-ai";

export function AgentAskButton({
  children = "Ask Abdulelah AI",
  className,
  prompt,
  variant = "gold"
}: {
  children?: ReactNode;
  className?: string;
  prompt?: string;
  variant?: "default" | "secondary" | "gold" | "outline";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className={cn("w-full sm:w-auto", className)}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent(OPEN_AGENT_EVENT, {
            detail: { prompt }
          })
        );
      }}
    >
      <Bot className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  );
}
