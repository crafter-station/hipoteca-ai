"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

interface PdfViewerProps {
  pdfUrl: string;
  className?: string;
}

// Client-side only PDF viewer to avoid SSR issues
function ClientPdfViewer({ pdfUrl, className }: PdfViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Suppress React 19 ref warnings from React PDF library
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("element.ref was removed") ||
          args[0].includes("ref is now a regular prop"))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn("flex h-full w-full flex-col bg-background", className)}
      >
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
        </div>
      </div>
    );
  }

  // Import React PDF components only on client side
  const {
    RPProvider,
    RPConfig,
    RPTheme,
    RPDefaultLayout,
    RPPages,
  } = require("@pdf-viewer/react");

  // Custom variables that map to our shadcn design tokens
  const customVariables = {
    "--rp-font-family":
      "var(--font-geist-sans), Inter, Avenir, Helvetica, Arial, sans-serif",
    "--rp-primary-color": "var(--primary)",
    "--rp-border-radius": "var(--radius)",
    "--rp-text-color": "var(--foreground)",
    "--rp-outline-color": "var(--ring)",
    "--rp-font-size": "14px",

    // Drop zone
    "--rp-drop-mask-background-color": "var(--background)",
    "--rp-drop-zone-border": "var(--border)",
    "--rp-drop-zone-font-color": "var(--muted-foreground)",

    // Loader
    "--rp-loader-backdrop-color": "var(--background)",

    // Icons
    "--rp-icon-disabled": "var(--muted-foreground)",
    "--rp-icon-font-size": "calc(14px * 1.25)",

    // Toolbar
    "--rp-toolbar-background": "var(--background)",
    "--rp-toolbar-border-color": "var(--border)",
    "--rp-toolbar-padding": "0.5rem",

    // Thumbnail
    "--rp-thumbnail-border-color": "var(--border)",
    "--rp-thumbnail-background-color": "var(--card)",
    "--rp-thumbnail-active-color": "var(--accent)",

    // Button
    "--rp-button-hover-background": "var(--accent)",
    "--rp-button-padding": "8px",

    // Input
    "--rp-input-padding": "0.5rem",
    "--rp-input-border-radius": "var(--radius)",
    "--rp-input-background-color": "var(--input)",

    // Pages
    "--rp-pages-background-color": "var(--muted)",

    // Annotations
    "--rp-annotation-layer__link-hover-background": "var(--accent)",

    // Dropdown
    "--rp-dropdown-background-color": "var(--popover)",
    "--rp-dropdown-padding": "8px",
    "--rp-dropdown-hover-background-color": "var(--accent)",
    "--rp-dropdown-separator-color": "var(--border)",
    "--rp-dropdown-separator-margin": "8px",

    // Popover
    "--rp-popover-font-size": "calc(14px * 0.875)",
    "--rp-popover-background-color": "var(--popover)",

    // Dialog
    "--rp-overlay-background-color": "rgba(0, 0, 0, 0.8)",
    "--rp-dialog-background-color": "var(--card)",
    "--rp-properties-divider-color": "var(--border)",
    "--rp-properties-divider-margin": "16px",
    "--rp-property-item-gap": "12px",
    "--rp-dialog-title-color": "var(--foreground)",
    "--rp-property-item-label-color": "var(--muted-foreground)",

    // Print progress
    "--rp-print-progress-background": "var(--popover)",
    "--rp-print-progress-color": "var(--foreground)",

    // Checkbox
    "--rp-checkbox-border-radius": "var(--radius)",
    "--rp-checkbox-border-color": "var(--border)",

    // Highlight
    "--rp-highlight-background-color": "var(--accent)",
    "--rp-text-layer-highlight-border-radius": "var(--radius)",

    // Tooltip
    "--rp-tooltip-background-color": "var(--popover)",
  };

  return (
    <div className={cn("flex h-full w-full flex-col bg-background", className)}>
      <RPConfig licenseKey="8NZ2M-RQENN-NESEP-998M1-KISU">
        <RPProvider src={pdfUrl}>
          <RPTheme customVariables={customVariables}>
            <RPDefaultLayout>
              <RPPages />
            </RPDefaultLayout>
          </RPTheme>
        </RPProvider>
      </RPConfig>
    </div>
  );
}

// Export with dynamic import to prevent SSR issues
export const PdfViewer = dynamic(() => Promise.resolve(ClientPdfViewer), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
    </div>
  ),
});
