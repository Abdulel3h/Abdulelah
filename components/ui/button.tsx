import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-ink-900 hover:bg-accent-soft",
        secondary:
          "border border-white/[0.12] bg-white/[0.05] text-paper hover:border-accent/40 hover:bg-white/[0.09]",
        ghost: "text-paper-dim hover:bg-white/[0.06] hover:text-paper",
        gold:
          "border border-accent/40 bg-accent/[0.10] text-accent-soft hover:border-accent/70 hover:bg-accent/[0.16]",
        outline:
          "border border-white/10 bg-white/[0.035] text-paper-dim hover:border-accent/35 hover:text-paper"
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
