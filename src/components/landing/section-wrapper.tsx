import { cn } from "@/lib/utils";
import type React from "react";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  hasPadding?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  hasPadding = true,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "full-section relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden",
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
