import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  className?: string;
  showArrow?: boolean;
  download?: boolean;
  external?: boolean;
  /** Screen-reader note for external links, e.g. "opens in a new tab". */
  externalLabel?: string;
  onClick?: () => void;
};

export function buttonLinkClassName(
  variant: ButtonLinkProps["variant"] = "primary",
  className?: string
) {
  const mappedVariant = variant === "primary" ? "default" : variant;

  return cn(buttonVariants({ variant: mappedVariant, className }));
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  showArrow,
  download,
  external,
  externalLabel,
  onClick
}: ButtonLinkProps) {
  const styles = buttonLinkClassName(variant, className);
  const arrow = showArrow ? (
    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
  ) : null;

  if (external || download) {
    return (
      <a
        href={href}
        className={styles}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick}
      >
        {children}
        {external ? <ArrowUpRight className="external-mark" aria-hidden="true" /> : arrow}
        {external && externalLabel ? <span className="sr-only">({externalLabel})</span> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={styles} onClick={onClick}>
      {children}
      {arrow}
    </Link>
  );
}
