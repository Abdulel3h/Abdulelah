import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ContactCard({
  icon: Icon,
  label,
  value,
  href
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
  const content = (
    <Card className="flex items-start gap-4 p-5 transition hover:border-accent/30">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm text-paper-dim">{label}</p>
        <p className="mt-1 break-words text-base font-semibold text-paper">{value}</p>
      </div>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      className="focus-ring block rounded-2xl"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}
