"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PDFMinimapProps {
  totalPages: number;
  currentPage: number;
  pageHeight: number; // Original page height for aspect ratio
  viewerScrollTop: number;
  viewerClientHeight: number;
  viewerScrollHeight: number;
  pageHighlightData: Map<
    number,
    {
      annotations: Array<{ type: string; position: number }>;
      searchResults: Array<{ position: number }>;
    }
  >;
  instanceId: string;
  onNavigation: (scrollPercentage: number) => void;
  className?: string;
  isCompact?: boolean; // New prop for compact mode when chat is open
}

interface PageHighlight {
  pageNum: number;
  type: "search" | "annotation";
  annotationType?: string;
  isCurrent?: boolean;
  position: number; // 0-1, relative position within page
}

// Color mapping for different highlight types - MATCHING highlight-legend.tsx
const HIGHLIGHT_COLORS = {
  // Search highlights
  search: "#3b82f6", // blue-500
  "search-current": "#ef4444", // red-500

  // Annotation highlights - MATCHING ContractHighlightType colors
  TERM: "#2563EB", // blue-600 (default/technical terms)
  FEE: "#EA580C", // orange-600 (financial terms and fees)
  DUTY_USER: "#16A34A", // green-600 (user obligations)
  DUTY_BANK: "#06b6d4", // cyan-500 (bank duties)
  VAR: "#7C3AED", // purple-600 (variable conditions)
  RISK: "#EAB308", // yellow-500 (financial risks)
  ABUSE: "#DC2626", // red-600 (abusive clauses)

  // Fallbacks para otros tipos que puedan aparecer
  DEFAULT: "#2563EB", // blue por defecto
} as const;

const MINIMAP_WIDTH = 120; // px
const MINIMAP_WIDTH_COMPACT = 20; // px - much thinner when chat is open
const MINIMAP_PAGE_PADDING = 2; // px
const MINIMAP_LINE_HEIGHT = 1.5; // px for simulated content lines

export function PDFMinimap({
  totalPages,
  currentPage,
  pageHeight,
  viewerScrollTop,
  viewerClientHeight,
  viewerScrollHeight,
  pageHighlightData,
  instanceId,
  onNavigation,
  className = "",
  isCompact = false,
}: PDFMinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pageHighlights, setPageHighlights] = useState<
    Map<number, PageHighlight[]>
  >(new Map());
  const [minimapContentHeight, setMinimapContentHeight] = useState(0);

  // Update minimap content height when ref becomes available
  useEffect(() => {
    const updateHeight = () => {
      if (minimapRef.current) {
        const height = minimapRef.current.clientHeight;
        setMinimapContentHeight(height);
      } else {
        setMinimapContentHeight(0);
      }
    };

    // Initial calculation
    updateHeight();

    // Also listen for resize events
    const resizeObserver = new ResizeObserver(updateHeight);
    if (minimapRef.current) {
      resizeObserver.observe(minimapRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Run once on mount

  // Calculate scale factor
  const scale = useMemo(() => {
    if (!minimapContentHeight || !totalPages || !pageHeight) {
      return 0;
    }
    // Total height of all pages in the viewer
    const totalPagesHeight = totalPages * pageHeight;
    // Scale to fit all pages in the minimap
    const calculatedScale = minimapContentHeight / totalPagesHeight;
    return calculatedScale;
  }, [minimapContentHeight, totalPages, pageHeight]);

  // Calculate viewport highlight style
  const viewportStyle = useMemo(() => {
    // Don't show viewport if dimensions aren't ready
    if (!scale || !viewerScrollHeight || !minimapContentHeight) {
      return { top: 0, height: 0, visible: false };
    }

    // Calculate viewport size as percentage of total content
    let viewportHeightPercentage = viewerClientHeight / viewerScrollHeight;

    // If the PDF hasn't fully loaded and scroll dimensions seem equal, use a balanced approach
    if (viewerScrollHeight <= viewerClientHeight + 10 && totalPages > 1) {
      // For initial load, assume we can see about 70-80% of a page (accounting for padding, zoom, etc.)
      // This gives a more realistic viewport size than calculating from theoretical page heights
      const estimatedVisiblePortion = 0.75; // 75% of a page visible
      viewportHeightPercentage = estimatedVisiblePortion / totalPages;

      // Ensure minimum and maximum bounds for usability
      viewportHeightPercentage = Math.max(
        0.15,
        Math.min(0.8, viewportHeightPercentage),
      );
    }

    // Calculate the percentage of scroll position (handle case where no scroll is possible)
    const scrollPercentage =
      viewerScrollHeight > viewerClientHeight
        ? viewerScrollTop / (viewerScrollHeight - viewerClientHeight)
        : 0;

    const result = {
      top:
        scrollPercentage *
        (minimapContentHeight -
          viewportHeightPercentage * minimapContentHeight),
      height: Math.max(20, viewportHeightPercentage * minimapContentHeight), // Minimum 20px height
      visible: true,
    };

    return result;
  }, [
    scale,
    viewerScrollTop,
    viewerClientHeight,
    viewerScrollHeight,
    minimapContentHeight,
    totalPages,
  ]);

  // Calculate page highlights from real data
  const calculatePageHighlights = useCallback(() => {
    const highlightMap = new Map<number, PageHighlight[]>();

    // Only process if we have actual data
    if (pageHighlightData.size === 0) {
      setPageHighlights(highlightMap);
      return;
    }

    // Process real page highlight data
    for (const [pageNum, data] of pageHighlightData) {
      const pageHighlightList: PageHighlight[] = [];

      // Add search highlights
      for (const searchResult of data.searchResults) {
        pageHighlightList.push({
          pageNum,
          type: "search",
          position: searchResult.position,
        });
      }

      // Add annotation highlights using real positions
      for (const annotation of data.annotations) {
        pageHighlightList.push({
          pageNum,
          type: "annotation",
          annotationType: annotation.type,
          position: annotation.position,
        });
      }

      if (pageHighlightList.length > 0) {
        highlightMap.set(pageNum, pageHighlightList);
      }
    }

    setPageHighlights(highlightMap);
  }, [pageHighlightData]);

  // Recalculate when dependencies change
  useEffect(() => {
    calculatePageHighlights();
  }, [calculatePageHighlights]);

  // Handle navigation
  const handleNavigation = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!minimapRef.current || !viewerScrollHeight || !minimapContentHeight)
        return;

      event.preventDefault(); // Prevent any default behavior

      const rect = minimapRef.current.getBoundingClientRect();
      const clickY = event.clientY - rect.top;

      // Calculate viewport height percentage
      const viewportHeightPercentage = viewerClientHeight / viewerScrollHeight;
      const viewportPixelHeight =
        viewportHeightPercentage * minimapContentHeight;

      // Adjust clickY if clicking on viewport highlight to center the drag
      let adjustedClickY = clickY;
      const target = event.target as HTMLElement;
      if (target.classList.contains("minimap-viewport-highlight")) {
        adjustedClickY = clickY - viewportPixelHeight / 2;
      }

      // Calculate scroll percentage with proper bounds
      const maxScrollableArea = minimapContentHeight - viewportPixelHeight;
      const scrollPercentage =
        maxScrollableArea > 0
          ? Math.max(0, Math.min(1, adjustedClickY / maxScrollableArea))
          : 0;

      // Use requestAnimationFrame for immediate response
      requestAnimationFrame(() => {
        onNavigation(scrollPercentage);
      });
    },
    [
      minimapContentHeight,
      onNavigation,
      viewerScrollHeight,
      viewerClientHeight,
    ],
  );

  // Handle mouse down
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleNavigation(event);
    document.body.style.userSelect = "none";
  };

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (
        !isDragging ||
        !minimapRef.current ||
        !viewerScrollHeight ||
        !minimapContentHeight
      )
        return;

      event.preventDefault(); // Prevent text selection during drag

      const rect = minimapRef.current.getBoundingClientRect();
      const clickY = event.clientY - rect.top;

      // Calculate viewport height percentage
      const viewportHeightPercentage = viewerClientHeight / viewerScrollHeight;
      const viewportPixelHeight =
        viewportHeightPercentage * minimapContentHeight;

      // Center viewport on cursor
      const adjustedClickY = clickY - viewportPixelHeight / 2;

      // Calculate scroll percentage with proper bounds
      const maxScrollableArea = minimapContentHeight - viewportPixelHeight;
      const scrollPercentage =
        maxScrollableArea > 0
          ? Math.max(0, Math.min(1, adjustedClickY / maxScrollableArea))
          : 0;

      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        onNavigation(scrollPercentage);
      });
    },
    [
      isDragging,
      minimapContentHeight,
      onNavigation,
      viewerScrollHeight,
      viewerClientHeight,
    ],
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate page dimensions in minimap
  const currentMinimapWidth = isCompact ? MINIMAP_WIDTH_COMPACT : MINIMAP_WIDTH;
  const minimapPageActualHeight = pageHeight * scale;
  const minimapPageWidth = isCompact
    ? currentMinimapWidth - MINIMAP_PAGE_PADDING * 2 // Use full width in compact mode
    : pageHeight * (8.5 / 11) * scale; // Standard page aspect ratio

  // Don't render highlights if dimensions aren't ready yet
  const shouldRenderHighlights = scale > 0 && minimapPageActualHeight > 10;

  return (
    <div
      className={`flex flex-col border-border border-l bg-card ${className}`}
    >
      {/* Minimap Content */}
      <div
        ref={minimapRef}
        className={`relative flex-1 select-none overflow-hidden bg-card transition-all duration-300 ${
          isDragging ? "cursor-grabbing" : "cursor-pointer"
        }`}
        style={{
          width: `${currentMinimapWidth}px`,
          minHeight: "400px", // Ensure minimum height for proper scaling
          padding: isCompact ? "2px 1px" : "8px 2px",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Loading state for highlights - only show if no pages are visible */}
        {pageHighlightData.size === 0 && totalPages > 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50">
            <div className="px-2 text-center text-muted-foreground text-xs">
              <div className="animate-pulse">Loading highlights...</div>
            </div>
          </div>
        )}

        {/* Pages representation */}
        <div className="absolute top-0 left-0 h-full w-full">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageIndex = index;
            const pageNum = index + 1;
            const pageTop = pageIndex * pageHeight * scale;
            const pageDisplayHeight = Math.max(
              1,
              minimapPageActualHeight - MINIMAP_PAGE_PADDING * 2,
            );
            const pageDisplayWidth = Math.max(
              1,
              minimapPageWidth - MINIMAP_PAGE_PADDING * 2,
            );

            // Basic virtualization: don't render if fully out of view (but always show some pages)
            if (
              pageTop + pageDisplayHeight < -50 ||
              pageTop > minimapContentHeight + 50
            ) {
              return null;
            }

            const isCurrentPage = pageNum === currentPage;
            const highlights = pageHighlights.get(pageNum) || [];

            return (
              <div
                key={`${instanceId}-minimap-page-${pageNum}`}
                className={`absolute overflow-hidden border ${
                  isCurrentPage && !isCompact
                    ? "border-primary bg-primary/10"
                    : isCurrentPage && isCompact
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-muted/30"
                }`}
                style={{
                  top: `${pageTop + MINIMAP_PAGE_PADDING}px`,
                  left: isCompact
                    ? `${MINIMAP_PAGE_PADDING}px`
                    : `${MINIMAP_PAGE_PADDING + (MINIMAP_WIDTH - MINIMAP_PAGE_PADDING * 2 - pageDisplayWidth) / 2}px`,
                  height: `${pageDisplayHeight}px`,
                  width: `${pageDisplayWidth}px`,
                  boxSizing: "content-box",
                }}
              >
                {/* Simulated content lines */}
                {Array.from(
                  {
                    length: Math.floor(pageDisplayHeight / MINIMAP_LINE_HEIGHT),
                  },
                  (_, lineIndex) => {
                    const lineTop = lineIndex * MINIMAP_LINE_HEIGHT;
                    if (lineTop >= pageDisplayHeight) return null;

                    return (
                      <div
                        key={`${instanceId}-line-${pageNum}-${lineTop}`}
                        className="bg-muted-foreground/20"
                        style={{
                          position: "absolute",
                          top: `${lineTop}px`,
                          left: isCompact ? "1px" : "2px",
                          width: isCompact
                            ? "calc(100% - 2px)"
                            : "calc(100% - 4px)",
                          height: `${Math.max(0.5, MINIMAP_LINE_HEIGHT - 0.5)}px`,
                        }}
                      />
                    );
                  },
                )}

                {/* Highlight indicators */}
                {shouldRenderHighlights &&
                  highlights.map((highlight, highlightIndex) => {
                    const color =
                      highlight.type === "search"
                        ? highlight.isCurrent
                          ? HIGHLIGHT_COLORS["search-current"]
                          : HIGHLIGHT_COLORS.search
                        : HIGHLIGHT_COLORS[
                            highlight.annotationType as keyof typeof HIGHLIGHT_COLORS
                          ] || HIGHLIGHT_COLORS.DEFAULT;

                    const highlightTop = highlight.position * pageDisplayHeight;

                    return (
                      <div
                        key={`${instanceId}-highlight-${pageNum}-${highlightIndex}-${highlight.type}-${highlight.annotationType || "unknown"}-${highlight.position.toFixed(6)}`}
                        className="absolute rounded-sm"
                        style={{
                          top: `${Math.max(0, highlightTop - 2)}px`,
                          left: "0px",
                          width: "100%",
                          height: isCompact ? "6px" : "4px", // Más alto en modo compacto
                          backgroundColor: color,
                          opacity: highlight.type === "search" ? 0.9 : 0.85, // Más opaco
                          borderRadius: isCompact ? "2px" : "1px",
                          boxShadow: isCompact
                            ? `0 0 3px ${color}`
                            : `0 0 2px ${color}`, // Más glow en compacto
                        }}
                      />
                    );
                  })}

                {/* Page number indicator for current page - hide in compact mode */}
                {isCurrentPage && !isCompact && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded bg-primary/80 px-1 font-bold text-primary-foreground text-xs">
                      {pageNum}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Viewport Highlight */}
        {viewportStyle.visible && (
          <div
            className={`minimap-viewport-highlight absolute left-0 w-full rounded-sm border border-primary bg-primary/20 transition-opacity duration-150 hover:bg-primary/30 ${
              isDragging ? "cursor-grabbing bg-primary/40" : "cursor-grab"
            }`}
            style={{
              top: `${viewportStyle.top}px`,
              height: `${Math.max(5, viewportStyle.height)}px`,
              willChange: "top, height",
              userSelect: "none",
            }}
            onMouseDown={(e) => {
              e.stopPropagation(); // Prevent triggering the container's onMouseDown
              e.preventDefault(); // Prevent text selection
              setIsDragging(true);
              handleNavigation(e);
              document.body.style.userSelect = "none";
              document.body.style.cursor = "grabbing";
            }}
          />
        )}
      </div>
    </div>
  );
}
