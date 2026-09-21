"use client";

import { Download } from "lucide-react";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Direct CV download. Records only which CV was chosen. */
export function ResumeDownloadButton({
  href,
  cv,
  source,
  meta,
  children,
  className
}: {
  href: string;
  cv: "engineer" | "specialist";
  source: string;
  meta?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      download
      type="application/pdf"
      onClick={() => trackEvent("cv_downloaded", { cv, source })}
      className={cn(buttonVariants({ className: "w-full sm:w-auto" }), className)}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      {children}
      {meta ? <span className="sr-only"> ({meta})</span> : null}
    </a>
  );
}
