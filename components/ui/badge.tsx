import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/[0.06] text-slate-200",
        sky: "border-sky-300/20 bg-sky-300/10 text-sky-100",
        gold: "border-gold/30 bg-gold/10 text-amber-100",
        violet: "border-violet-300/25 bg-violet-400/10 text-violet-100",
        muted: "border-white/10 bg-white/[0.035] text-slate-400"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
