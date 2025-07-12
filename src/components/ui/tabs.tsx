"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    // base
    "inline-flex w-fit items-center justify-center",
  ],
  {
    variants: {
      variant: {
        default: ["bg-ui-soft text-text-soft rounded-md p-0.5"],
        underline: [
          "bg-ui-base h-auto -space-x-px p-0 shadow-xs border-b border-border-base rtl:space-x-reverse",
        ],
        pills: ["gap-1 bg-transparent"],
        segmented: ["bg-ui-base  border border-border-base rounded-lg p-1"],
        modern: [
          "bg-ui-base border border-border-base rounded-xl p-1 shadow-sm",
        ],
      },
      size: {
        sm: "text-sm",
        default: "",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const tabsTriggerVariants = cva(
  [
    // base
    "inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-out outline-none",
    "focus-visible:ring-[3px] focus-visible:ring-secondary-base/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "rounded-sm px-3 py-1.5 text-sm font-medium",
          "hover:text-text-base",
          "data-[state=active]:bg-ui-base data-[state=active]:text-text-base data-[state=active]:shadow-xs",
        ],
        underline: [
          "relative overflow-hidden rounded-none border border-border-base py-2 px-4 text-sm font-medium",
          "hover:bg-ui-subtle",
          "data-[state=active]:bg-ui-subtle data-[state=active]:text-text-base",
          "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5",
          "data-[state=active]:after:bg-secondary-base",
          "first:rounded-s last:rounded-e",
        ],
        pills: [
          "rounded-full px-4 py-2 text-sm font-medium",
          "hover:bg-ui-subtle hover:text-text-base",
          "data-[state=active]:bg-secondary-base data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none",
        ],
        segmented: [
          "rounded-md px-3 py-1.5 text-sm font-medium",
          "hover:bg-ui-subtle hover:text-text-base",
          "data-[state=active]:bg-secondary-base data-[state=active]:text-secondary-foreground data-[state=active]:shadow-sm",
        ],
        modern: [
          "rounded-lg px-4 py-2 text-sm font-medium",
          "hover:bg-ui-subtle hover:text-text-base",
          "data-[state=active]:bg-secondary-base data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md",
        ],
      },
      size: {
        sm: "text-xs px-2 py-1",
        default: "",
        lg: "text-base px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, size, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  );
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({ className, variant, size, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsListVariants,
  tabsTriggerVariants,
};
export type { TabsListProps, TabsTriggerProps };
