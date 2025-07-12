"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const tooltipVariants = cva(
  [
    // base styles
    "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) text-balance rounded-md px-3 py-1.5 text-xs",
    // animations
    "fade-in-0 zoom-in-95 animate-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out",
    // slide animations
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ],
  {
    variants: {
      variant: {
        default: "bg-text-base text-ui-base",
        primary: "bg-primary-base text-white dark:text-black",
        secondary:
          "bg-ui-base border border-border-base text-text-base shadow-md",
        success: "bg-success-base text-white",
        warning: "bg-warning-base text-black dark:text-black",
        error: "bg-error-base text-white",
        info: "bg-info-base text-white",
        dark: "bg-text-base text-ui-base",
        light: "bg-ui-base border border-border-base text-text-base shadow-lg",
        accent: "bg-primary-darker text-white dark:text-black",
        subtle:
          "bg-ui-subtle border border-border-subtle text-text-base shadow-sm",
      },
      size: {
        sm: "px-2 py-1 text-xs rounded",
        default: "px-3 py-1.5 text-xs rounded-md",
        lg: "px-4 py-2 text-sm rounded-lg",
        xl: "px-6 py-3 text-base rounded-xl",
      },
      arrow: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      arrow: true,
    },
  },
);

const tooltipArrowVariants = cva(
  "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-xs",
  {
    variants: {
      variant: {
        default: "bg-text-base fill-text-base",
        primary: "bg-primary-base fill-primary-base",
        secondary:
          "bg-ui-base fill-ui-base border-r border-b border-border-base",
        success: "bg-success-base fill-success-base",
        warning: "bg-warning-base fill-warning-base",
        error: "bg-error-base fill-error-base",
        info: "bg-info-base fill-info-base",
        dark: "bg-text-base fill-text-base",
        light: "bg-ui-base fill-ui-base border border-border-base",
        accent: "bg-primary-darker fill-primary-darker",
        subtle:
          "bg-ui-subtle fill-ui-subtle border-r border-b border-border-subtle",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TooltipProvider({
  delayDuration = 0,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
      {...props}
    />
  );
}

function Tooltip({
  delayDuration,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 4,
  variant = "default",
  size = "default",
  arrow = true,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipVariants>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {arrow && (
          <TooltipPrimitive.Arrow
            className={cn(tooltipArrowVariants({ variant }))}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

// Convenience wrapper for simple tooltips
function SimpleTooltip({
  content,
  children,
  variant = "default",
  size = "default",
  side = "top",
  delayDuration = 200,
  ...props
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: VariantProps<typeof tooltipVariants>["variant"];
  size?: VariantProps<typeof tooltipVariants>["size"];
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
} & Omit<React.ComponentProps<typeof TooltipContent>, "children">) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent variant={variant} size={size} side={side} {...props}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  tooltipVariants,
  tooltipArrowVariants,
};

export type { VariantProps };
