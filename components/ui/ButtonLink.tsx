import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
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
  external
}: ButtonLinkProps) {
  const styles = buttonLinkClassName(variant, className);

  if (external || download) {
    return (
      <a
        href={href}
        className={styles}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
        {showArrow ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
      {showArrow ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
    </Link>
  );
}
