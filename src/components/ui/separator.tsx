"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const separatorVariants = cva(
  "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
  {
    variants: {
      variant: {
        default: "bg-border-base",
        subtle: "bg-border-subtle",
        strong: "bg-border-strong",
        primary: "bg-primary-base",
        success: "bg-success-base",
        warning: "bg-warning-base",
        error: "bg-error-base",
        gradient: "bg-gradient-to-r from-primary-base to-primary-darker",
        dashed:
          "bg-transparent border-t border-dashed border-border-base data-[orientation=vertical]:border-t-0 data-[orientation=vertical]:border-l",
        dotted:
          "bg-transparent border-t border-dotted border-border-base data-[orientation=vertical]:border-t-0 data-[orientation=vertical]:border-l",
      },
      size: {
        sm: "data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
        default:
          "data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
        lg: "data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5",
        xl: "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Separator };
