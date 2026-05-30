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
          "bg-sky-300 text-slate-950 shadow-[0_18px_60px_rgba(56,189,248,0.22)] hover:bg-sky-200",
        secondary:
          "border border-white/[0.12] bg-white/[0.07] text-white hover:border-sky-300/40 hover:bg-white/10",
        ghost: "text-slate-300 hover:bg-white/[0.07] hover:text-white",
        gold:
          "border border-gold/40 bg-gold/[0.12] text-amber-100 hover:border-gold/70 hover:bg-gold/[0.18]",
        outline:
          "border border-white/10 bg-white/[0.035] text-slate-200 hover:border-sky-300/35 hover:text-white"
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
