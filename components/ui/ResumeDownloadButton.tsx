import { Download } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ResumeDownloadButton({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button asChild className="w-full sm:w-auto">
      <a href={href} download>
        <Download className="h-4 w-4" aria-hidden="true" />
        {children}
      </a>
    </Button>
  );
}
