import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    // base
    "inline-flex items-center justify-center rounded-full leading-none font-medium whitespace-nowrap shrink-0",
    "transition-[color,box-shadow] duration-200 ease-out",
    // focus
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-base/50",
    // disabled
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        // Filled variants
        default: "bg-primary-base text-primary-foreground",
        secondary: "bg-secondary-base text-secondary-foreground",

        // Status variants - filled
        success: "bg-success-base text-success-foreground",
        warning: "bg-warning-base text-warning-foreground",
        error: "bg-error-base text-error-foreground",
        info: "bg-info-base text-info-foreground",

        // Light variants
        "success-light": "bg-success-subtle text-success-strong",
        "warning-light": "bg-warning-subtle text-warning-strong",
        "error-light": "bg-error-subtle text-error-strong",
        "info-light": "bg-info-subtle text-info-strong",

        // Soft variants
        "success-soft": "bg-success-soft text-success-strong",
        "warning-soft": "bg-warning-soft text-warning-strong",
        "error-soft": "bg-error-soft text-error-strong",
        "info-soft": "bg-info-soft text-info-strong",

        // Outline variants
        outline: "border border-text-base text-text-base bg-transparent",
        "outline-success":
          "border border-success-base text-success-base bg-transparent",
        "outline-warning":
          "border border-warning-base text-warning-base bg-transparent",
        "outline-error":
          "border border-error-base text-error-base bg-transparent",
        "outline-info": "border border-info-base text-info-base bg-transparent",
      },
      size: {
        xs: "h-4 px-1.5 text-xs gap-1",
        sm: "h-5 px-2 text-xs gap-1",
        default: "h-6 px-2.5 text-sm gap-1.5",
        lg: "h-7 px-3 text-sm gap-1.5",
      },
      dot: {
        true: "pl-1.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      dot: false,
    },
  },
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: "success" | "warning" | "error" | "info" | "default";
}

function Badge({
  className,
  variant,
  size,
  dot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  // Auto-detect dotColor based on variant if not provided
  const getDefaultDotColor = () => {
    if (dotColor) return dotColor; // User override takes precedence

    // Auto-detect for light variants
    if (variant?.includes("-light")) {
      if (variant === "success-light") return "success";
      if (variant === "warning-light") return "warning";
      if (variant === "error-light") return "error";
      if (variant === "info-light") return "info";
    }

    // Auto-detect for soft variants
    if (variant?.includes("-soft")) {
      if (variant === "success-soft") return "success";
      if (variant === "warning-soft") return "warning";
      if (variant === "error-soft") return "error";
      if (variant === "info-soft") return "info";
    }

    // Auto-detect for outline variants
    if (variant?.includes("outline-")) {
      if (variant === "outline-success") return "success";
      if (variant === "outline-warning") return "warning";
      if (variant === "outline-error") return "error";
      if (variant === "outline-info") return "info";
    }

    return "default";
  };

  // For filled variants, dot should be ui-base (white/black) for contrast
  // For light/soft/outline variants, dot should be the auto-detected or specified color
  const getActualDotColor = () => {
    const filledVariants = [
      "default",
      "secondary",
      "success",
      "warning",
      "error",
      "info",
    ];

    if (filledVariants.includes(variant || "default")) {
      return "ui-base"; // White dot on colored background
    }

    // For light, soft, outline variants - use auto-detected or specified dotColor
    return getDefaultDotColor();
  };

  const actualDotColor = getActualDotColor();

  const dotColorClasses = {
    success: "bg-success-base",
    warning: "bg-warning-base",
    error: "bg-error-base",
    info: "bg-info-base",
    default: "bg-text-base",
    "ui-base": "bg-ui-base", // White/black dot for filled variants
  };

  return (
    <span
      className={cn(badgeVariants({ variant, size, dot }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            dotColorClasses[actualDotColor as keyof typeof dotColorClasses],
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
