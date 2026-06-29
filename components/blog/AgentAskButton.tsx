"use client";

import type { ReactNode } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { Button } from "@/components/ui/button";
import { OPEN_AGENT_EVENT, openCompanion } from "@/lib/agent/companion";
import { cn } from "@/lib/utils";

export { OPEN_AGENT_EVENT };

export function AgentAskButton({
  children = "Ask Abdulelah",
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
      onClick={() => openCompanion({ prompt })}
    >
      <Monogram className="h-4 w-auto" />
      {children}
    </Button>
  );
}
