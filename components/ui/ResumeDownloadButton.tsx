"use client";

import { Download } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export function ResumeDownloadButton({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button asChild className="w-full sm:w-auto">
      <a
        href={href}
        download
        onClick={() => trackEvent("resume_download", { cv: href })}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {children}
      </a>
    </Button>
  );
}
