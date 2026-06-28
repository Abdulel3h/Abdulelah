import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  children?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  children
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
      <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-paper sm:text-4xl lg:text-[2.9rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-paper-dim sm:text-lg">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
