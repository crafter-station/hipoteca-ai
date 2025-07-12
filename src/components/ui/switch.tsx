"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const switchVariants = cva(
  [
    // base
    "peer inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-all duration-200 ease-out outline-none",
    // focus
    "focus-visible:ring-[3px] focus-visible:ring-primary-base/50",
    // disabled
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "data-[state=checked]:bg-primary-base data-[state=unchecked]:bg-border-base",
        ],
        success: [
          "data-[state=checked]:bg-success-base data-[state=unchecked]:bg-border-base",
        ],
        warning: [
          "data-[state=checked]:bg-warning-base data-[state=unchecked]:bg-border-base",
        ],
        error: [
          "data-[state=checked]:bg-error-base data-[state=unchecked]:bg-border-base",
        ],
        info: [
          "data-[state=checked]:bg-info-base data-[state=unchecked]:bg-border-base",
        ],
      },
      size: {
        sm: "h-4 w-7",
        default: "h-6 w-10",
        lg: "h-7 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const switchThumbVariants = cva(
  [
    // base
    "pointer-events-none block rounded-full shadow-xs ring-0 transition-transform duration-200 ease-out",
    "bg-ui-base",
  ],
  {
    variants: {
      size: {
        sm: "size-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0 data-[state=checked]:rtl:-translate-x-3",
        default:
          "size-5 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=checked]:rtl:-translate-x-4",
        lg: "size-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:rtl:-translate-x-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

function Switch({ className, variant, size, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
export type { SwitchProps };
