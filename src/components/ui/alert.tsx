import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-ui-base border-border-base text-text-base",

        // Semantic States - Filled
        success:
          "bg-success-base border-success-base text-success-foreground [&>svg]:text-success-foreground",
        warning:
          "bg-warning-base border-warning-base text-warning-foreground [&>svg]:text-warning-foreground",
        error:
          "bg-error-base border-error-base text-error-foreground [&>svg]:text-error-foreground",
        info: "bg-info-base border-info-base text-info-foreground [&>svg]:text-info-foreground",

        // Semantic States - Light
        "success-light":
          "bg-success-subtle border-success-base text-success-strong [&>svg]:text-success-base",
        "warning-light":
          "bg-warning-subtle border-warning-base text-warning-strong [&>svg]:text-warning-base",
        "error-light":
          "bg-error-subtle border-error-base text-error-strong [&>svg]:text-error-base",
        "info-light":
          "bg-info-subtle border-info-base text-info-strong [&>svg]:text-info-base",

        // Semantic States - Soft
        "success-soft":
          "bg-success-soft border-success-soft text-success-strong [&>svg]:text-success-base",
        "warning-soft":
          "bg-warning-soft border-warning-soft text-warning-strong [&>svg]:text-warning-base",
        "error-soft":
          "bg-error-soft border-error-soft text-error-strong [&>svg]:text-error-base",
        "info-soft":
          "bg-info-soft border-info-soft text-info-strong [&>svg]:text-info-base",

        // Outline variants
        outline:
          "bg-ui-base border-border-base text-text-base hover:bg-ui-subtle [&>svg]:text-text-base",
        "outline-success":
          "bg-ui-base border-success-base text-success-base hover:bg-success-subtle [&>svg]:text-success-base",
        "outline-warning":
          "bg-ui-base border-warning-base text-warning-base hover:bg-warning-subtle [&>svg]:text-warning-base",
        "outline-error":
          "bg-ui-base border-error-base text-error-base hover:bg-error-subtle [&>svg]:text-error-base",
        "outline-info":
          "bg-ui-base border-info-base text-info-base hover:bg-info-subtle [&>svg]:text-info-base",

        // Legacy compatibility
        destructive:
          "bg-error-base border-error-base text-error-foreground [&>svg]:text-error-foreground",
      },
      size: {
        sm: "px-3 py-2 text-xs [&>svg]:size-3",
        default: "px-4 py-3 text-sm [&>svg]:size-4",
        lg: "px-6 py-4 text-base [&>svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Alert({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-current/90 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
export type { VariantProps };
