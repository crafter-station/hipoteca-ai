import type { HighlightRect, TooltipData } from "@/types/pdf-viewer";
import { useCallback, useRef, useState } from "react";

export const usePDFHighlights = (instanceId: string) => {
  // Use ref instead of state for tooltipContent to avoid re-renders
  const tooltipContentRef = useRef<Map<string, TooltipData>>(new Map());
  const [, forceUpdate] = useState({});
  
  const highlightRects = useRef<Map<number | string, HighlightRect[]>>(
    new Map()
  );
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHighlights = useCallback(() => {
    tooltipContentRef.current.clear();
    highlightRects.current.clear();
    forceUpdate({});
  }, []);

  const addTooltipContent = useCallback((key: string, data: TooltipData) => {
    tooltipContentRef.current.set(key, data);
    // Only trigger re-render if component actually needs the tooltip data
  }, []);

  const addHighlightRect = useCallback(
    (resultIndex: number | string, rect: HighlightRect) => {
      const currentRects = highlightRects.current.get(resultIndex) || [];
      currentRects.push(rect);
      highlightRects.current.set(resultIndex, currentRects);
    },
    []
  );

  const createTooltip = useCallback(
    (
      triggerElement: HTMLElement,
      data: TooltipData,
      onNavigateToResult?: (index: number) => void
    ) => {
      console.log(
        `🎯 TOOLTIP SHOWN: "${data.matchText.substring(0, 50)}..." (${
          data.resultIndex === -1 ? "annotation" : "search result"
        })`
      );

      // Check if tooltip already exists for this instance
      const existingTooltip = document.getElementById(
        `active-tooltip-${instanceId}`
      );
      if (existingTooltip) {
        // Clear any pending removal timeout
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = null;
        }
        // Keep the existing tooltip visible and reset its state
        existingTooltip.style.opacity = "1";
        existingTooltip.style.transform = "translateY(-100%) scale(1)";
        console.log(`♻️ Reusing existing tooltip for instance ${instanceId}`);
        return;
      }

      // Only create new tooltip if none exists

      const tooltip = document.createElement("div");
      tooltip.id = `active-tooltip-${instanceId}`;
      tooltip.className =
        "fixed pointer-events-auto z-[9999] bg-popover border border-border rounded-lg shadow-lg p-3 w-80";

      const rect = triggerElement.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - 160}px`; // 160px = half of w-80 (320px/2)
      tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
      tooltip.style.transformOrigin = "center bottom";

      // Initial state for animation
      tooltip.style.opacity = "0";
      tooltip.style.transform = "translateY(-100%) scale(0.8)";
      tooltip.style.transition =
        "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Trigger animation after a frame
      requestAnimationFrame(() => {
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translateY(-100%) scale(1)";
      });

      const isNavigable = data.resultIndex >= 0;
      const matchInfo = isNavigable
        ? `Match ${data.resultIndex + 1} of ${data.totalResults}`
        : "Text match found";

      tooltip.innerHTML = `
      <div class="space-y-2">
        <div class="font-semibold text-primary">
          "${
            data.matchText.length > 100
              ? `${data.matchText.substring(0, 100)}...`
              : data.matchText
          }"
        </div>
        <div class="text-muted-foreground text-sm leading-relaxed">
          ${data.context}
        </div>
        <div class="text-accent-foreground text-xs border-t border-border pt-2 space-y-1">
          <div>${matchInfo}</div>
          <div class="text-muted-foreground">
            Instance: ${instanceId}
          </div>
          ${
            isNavigable
              ? `
          <div class="flex gap-2 pt-1">
            <button 
              class="text-xs bg-accent text-accent-foreground px-2 py-1 rounded hover:bg-accent/80 transition-colors cursor-pointer"
              onclick="window.navigateToResult_${instanceId}(${data.resultIndex})"
            >
              Navigate
            </button>
          </div>
          `
              : `
          <div class="text-muted-foreground text-xs">
            This match spans multiple text elements and cannot be navigated to directly.
          </div>
          `
          }
        </div>
      </div>
    `;

      // Register navigation function on window if provided
      if (onNavigateToResult && isNavigable) {
        (window as any)[`navigateToResult_${instanceId}`] = (index: number) => {
          onNavigateToResult(index);
          removeTooltip();
        };
      }

      // Add hover events to keep tooltip open when hovering over it
      tooltip.addEventListener("mouseenter", () => {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
      });

      tooltip.addEventListener("mouseleave", () => {
        tooltipTimeoutRef.current = setTimeout(() => {
          removeTooltip();
        }, 600);
      });

      document.body.appendChild(tooltip);
    },
    [instanceId]
  );

  const removeTooltip = useCallback(() => {
    const existingTooltip = document.getElementById(
      `active-tooltip-${instanceId}`
    );
    if (existingTooltip) {
      // Check if it's already being removed (has opacity 0)
      if (existingTooltip.style.opacity === "0") {
        console.log(
          `⏭️ Tooltip already being removed for instance ${instanceId}`
        );
        return;
      }

      console.log(`🗑️ Removing tooltip for instance ${instanceId}`);
      // Animate out with opacity and scale
      existingTooltip.style.opacity = "0";
      existingTooltip.style.transform = "translateY(-100%) scale(0.8)";

      // Remove after animation completes
      setTimeout(() => {
        if (existingTooltip.parentNode) {
          existingTooltip.remove();
          console.log(`✅ Tooltip removed from DOM for instance ${instanceId}`);
        }
      }, 300);
    }
  }, [instanceId]);

  const clearTooltipTimeout = useCallback(() => {
    if (tooltipTimeoutRef.current) {
      console.log(`⏰ Clearing tooltip timeout for instance ${instanceId}`);
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  }, [instanceId]);

  const setTooltipTimeout = useCallback(
    (callback: () => void, delay: number) => {
      tooltipTimeoutRef.current = setTimeout(callback, delay);
    },
    []
  );

  return {
    tooltipContent: tooltipContentRef.current,
    highlightRects: highlightRects, // Return the ref itself, not .current
    clearHighlights,
    addTooltipContent,
    addHighlightRect,
    createTooltip,
    removeTooltip,
    clearTooltipTimeout,
    setTooltipTimeout,
  };
};
