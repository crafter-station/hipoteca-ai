import { cn } from "@/lib/utils";
import type React from "react";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  hasPadding?: boolean;
  customHeight?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  hasPadding = true,
  customHeight = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "full-section relative flex w-full flex-col items-center overflow-hidden",
        !customHeight && "min-h-[100dvh] justify-center",
        customHeight && "min-h-screen",
        hasPadding && "px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div className="container mx-auto flex h-full w-full flex-col items-center justify-center">
        {children}
      </div>
    </section>
  );
}
