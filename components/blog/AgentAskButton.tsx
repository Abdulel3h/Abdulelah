"use client";

import type { ReactNode } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { Button } from "@/components/ui/button";
import { openCompanion } from "@/lib/agent/companion";
import { cn } from "@/lib/utils";

export function AgentAskButton({
  children,
  className,
  prompt,
  variant = "gold"
}: {
  children: ReactNode;
  className?: string;
  prompt?: string;
  variant?: "default" | "secondary" | "gold" | "outline";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      aria-haspopup="dialog"
      className={cn("w-full sm:w-auto", className)}
      onClick={(event) => openCompanion({ prompt, returnFocusTo: event.currentTarget })}
    >
      <Monogram className="h-4 w-auto" />
      {children}
    </Button>
  );
}
