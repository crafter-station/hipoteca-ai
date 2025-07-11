"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePDFHighlights } from "@/hooks/use-pdf-highlights";
import { usePDFSearch } from "@/hooks/use-pdf-search";
import { usePDFViewer } from "@/hooks/use-pdf-viewer";
import { useUpdatePDFViewerState } from "@/stores/contract-analysis-store";
import type { PDFViewerProps } from "@/types/pdf-viewer";
import { useCallback, useEffect, useRef, useState } from "react";
import { PDFCanvas } from "./pdf-canvas";
import { PDFMinimap } from "./pdf-minimap";
import { SearchPanel } from "./search-panel";

export { SearchPanel } from "./search-panel";
export { Toolbar } from "./toolbar";
export { PDFCanvas } from "./pdf-canvas";
export { PDFHeader } from "./pdf-header";
export { PDFMinimap } from "./pdf-minimap";

// PDF.js types
declare global {
  interface Window {
    // @ts-ignore - pdfjsLib is not defined in the global scope
    pdfjsLib: {
      getDocument: (url: string) => Promise<unknown>;
      GlobalWorkerOptions: {
        workerSrc: string;
      };
    };
    [key: `navigateToResult_${string}`]: (index: number) => void;
  }
}

export default function PDFViewer({
  className = "",
  pdfUrl = "https://arxiv.org/pdf/1706.03762",
  instanceId = "default",
  highlights = [],
  onToggleFullscreen: externalOnToggleFullscreen,
  onToggleSearch: externalOnToggleSearch,
  // Callback to expose PDF viewer functions
  onPDFViewerReady,
  // Minimap control
  showMinimap = true,
  isMinimapCompact = false,
  onMinimapNavigation,
}: PDFViewerProps) {
  console.log({ highlights, pdfUrl, instanceId });
  const containerRef = useRef<HTMLDivElement>(null);

  // State for minimap
  const [scrollState, setScrollState] = useState({
    scrollTop: 0,
    clientHeight: 0,
    scrollHeight: 0,
  });

  // State for programmatic scroll control
  const [programmaticScrollTop, setProgrammaticScrollTop] = useState<
    number | undefined
  >(undefined);

  // State for minimap page highlight data
  const [pageHighlightData, setPageHighlightData] = useState<
    Map<
      number,
      {
        annotations: Array<{ type: string; position: number }>;
        searchResults: Array<{ position: number }>;
      }
    >
  >(new Map());

  // Custom hooks
  const pdfViewer = usePDFViewer(pdfUrl);
  const pdfSearch = usePDFSearch();
  const pdfHighlights = usePDFHighlights(instanceId);
  const updatePDFViewerState = useUpdatePDFViewerState();

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      pdfViewer.setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [pdfViewer]);

  // Handle navigation - stable reference with useCallback
  const handleNavigateToResult = useCallback(
    (index: number) => {
      const result = pdfSearch.navigateToResult(index);
      if (result) {
        pdfViewer.goToPage(result.pageNum);
      }
    },
    [pdfSearch, pdfViewer],
  );

  // Handle page highlight data from PDF canvas
  const handlePageHighlightData = useCallback(
    (
      data: Map<
        number,
        {
          annotations: Array<{ type: string; position: number }>;
          searchResults: Array<{ position: number }>;
        }
      >,
    ) => {
      setPageHighlightData(data);
    },
    [],
  );

  // Handle scroll changes from PDF canvas
  const handleScrollChange = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      setScrollState({ scrollTop, scrollHeight, clientHeight });
    },
    [],
  );

  // Handle minimap navigation
  const handleMinimapNavigation = useCallback(
    (scrollPercentage: number) => {
      if (scrollState.scrollHeight > scrollState.clientHeight) {
        const targetScrollTop =
          scrollPercentage *
          (scrollState.scrollHeight - scrollState.clientHeight);
        setProgrammaticScrollTop(targetScrollTop);
      }
    },
    [scrollState.scrollHeight, scrollState.clientHeight],
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === "f") {
          e.preventDefault();
          const toggleSearch =
            externalOnToggleSearch || (() => pdfSearch.setShowSearch(true));
          toggleSearch();
        }
      }
      if (pdfSearch.showSearch && pdfSearch.searchResults.length > 0) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const nextIndex =
            (pdfSearch.currentResultIndex + 1) % pdfSearch.searchResults.length;
          handleNavigateToResult(nextIndex);
        } else if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault();
          const prevIndex =
            pdfSearch.currentResultIndex > 0
              ? pdfSearch.currentResultIndex - 1
              : pdfSearch.searchResults.length - 1;
          handleNavigateToResult(prevIndex);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pdfSearch, handleNavigateToResult, externalOnToggleSearch]);

  // Handle search
  const handleSearch = async () => {
    if (pdfViewer.pdf) {
      const results = await pdfSearch.searchInPDF(
        pdfViewer.pdf,
        pdfViewer.totalPages,
      );
      if (results.length > 0) {
        pdfViewer.goToPage(results[0].pageNum);
      }
    }
  };

  const handleNavigatePrevious = () => {
    const prevIndex =
      pdfSearch.currentResultIndex > 0
        ? pdfSearch.currentResultIndex - 1
        : pdfSearch.searchResults.length - 1;
    handleNavigateToResult(prevIndex);
  };

  const handleNavigateNext = () => {
    const nextIndex =
      (pdfSearch.currentResultIndex + 1) % pdfSearch.searchResults.length;
    handleNavigateToResult(nextIndex);
  };

  // Handle fullscreen toggle - use external handler if provided
  const handleToggleFullscreen =
    externalOnToggleFullscreen ||
    (() => {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

  const handleToggleSearch =
    externalOnToggleSearch ||
    (() => pdfSearch.setShowSearch(!pdfSearch.showSearch));

  // Memoized navigation functions to prevent infinite loops
  const handlePreviousPage = useCallback(() => {
    pdfViewer.goToPage(pdfViewer.currentPage - 1);
  }, [pdfViewer.goToPage, pdfViewer.currentPage]);

  const handleNextPage = useCallback(() => {
    pdfViewer.goToPage(pdfViewer.currentPage + 1);
  }, [pdfViewer.goToPage, pdfViewer.currentPage]);

  // Expose PDF viewer functions to parent (for backward compatibility)
  // biome-ignore lint/correctness/useExhaustiveDependencies: Keep dependencies minimal to avoid infinite loops
  useEffect(() => {
    if (onPDFViewerReady && pdfViewer.pdf) {
      onPDFViewerReady({
        currentPage: pdfViewer.currentPage,
        totalPages: pdfViewer.totalPages,
        scale: pdfViewer.scale,
        onPreviousPage: handlePreviousPage,
        onNextPage: handleNextPage,
        onZoomIn: pdfViewer.zoomIn,
        onZoomOut: pdfViewer.zoomOut,
        onToggleFullscreen: handleToggleFullscreen,
        onToggleSearch: handleToggleSearch,
      });
    }
  }, [pdfViewer.pdf]); // Only run when PDF loads, not on every state change

  // Add navigate function to window for tooltip buttons
  useEffect(() => {
    const windowWithNav = window as unknown as Window & {
      [key: string]: unknown;
    };
    windowWithNav[`navigateToResult_${instanceId}`] = handleNavigateToResult;
    return () => {
      delete windowWithNav[`navigateToResult_${instanceId}`];
    };
  }, [instanceId, handleNavigateToResult]);

  // Update current page based on scroll position
  useEffect(() => {
    if (
      pdfViewer.totalPages > 0 &&
      scrollState.scrollHeight > scrollState.clientHeight
    ) {
      // Only calculate if there's actual scrollable content
      // Estimate page height (total height / number of pages)
      const estimatedPageHeight =
        scrollState.scrollHeight / pdfViewer.totalPages;
      // Calculate which page is currently at the top of the viewport (more intuitive)
      const calculatedPage = Math.max(
        1,
        Math.min(
          pdfViewer.totalPages,
          Math.floor(scrollState.scrollTop / estimatedPageHeight) + 1,
        ),
      );

      // Only update if the page actually changed to avoid unnecessary re-renders
      if (calculatedPage !== pdfViewer.currentPage) {
        pdfViewer.updateCurrentPage(calculatedPage);
      }
    } else if (
      scrollState.scrollHeight <= scrollState.clientHeight &&
      pdfViewer.currentPage !== 1
    ) {
      // If there's no scroll, we should be on page 1
      pdfViewer.updateCurrentPage(1);
    }
  }, [
    scrollState.scrollTop,
    scrollState.scrollHeight,
    scrollState.clientHeight,
    pdfViewer.totalPages,
    pdfViewer.currentPage,
    pdfViewer.updateCurrentPage,
  ]);

  if (pdfViewer.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2" />
          <p>Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (pdfViewer.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6">
          <p className="mb-4 text-destructive">{pdfViewer.error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex ${pdfViewer.isFullscreen ? "h-screen" : "h-full"} bg-muted ${className}`}
    >
      {/* Main PDF Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Search Panel */}
        <SearchPanel
          showSearch={pdfSearch.showSearch}
          searchTerm={pdfSearch.searchTerm}
          searchMode={pdfSearch.searchMode}
          isSearching={pdfSearch.isSearching}
          searchResults={pdfSearch.searchResults}
          currentResultIndex={pdfSearch.currentResultIndex}
          onSearchTermChange={pdfSearch.setSearchTerm}
          onSearchModeChange={pdfSearch.setSearchMode}
          onSearch={handleSearch}
          onClose={() => pdfSearch.setShowSearch(false)}
          onNavigatePrevious={handleNavigatePrevious}
          onNavigateNext={handleNavigateNext}
        />

        {/* PDF Canvas */}
        <PDFCanvas
          pdf={pdfViewer.pdf}
          currentPage={pdfViewer.currentPage}
          shouldAutoScroll={pdfViewer.shouldAutoScroll}
          onAutoScrollComplete={() => pdfViewer.setShouldAutoScroll(false)}
          scale={pdfViewer.scale}
          instanceId={instanceId}
          searchTerm={pdfSearch.searchTerm}
          searchMode={pdfSearch.searchMode}
          searchResults={pdfSearch.searchResults}
          currentResultIndex={pdfSearch.currentResultIndex}
          isSearching={pdfSearch.isSearching}
          highlightService={pdfHighlights}
          highlights={highlights}
          onNavigateToResult={handleNavigateToResult}
          onPageHighlightData={handlePageHighlightData}
          scrollTop={programmaticScrollTop}
          onScrollChange={handleScrollChange}
        />
      </div>

      {/* Minimap */}
      {showMinimap && pdfViewer.pdf && (
        <PDFMinimap
          totalPages={pdfViewer.totalPages}
          currentPage={pdfViewer.currentPage}
          pageHeight={pdfViewer.pdf ? 1100 : 800} // Better estimate based on standard PDF page height
          viewerScrollTop={scrollState.scrollTop}
          viewerClientHeight={scrollState.clientHeight}
          viewerScrollHeight={scrollState.scrollHeight}
          pageHighlightData={pageHighlightData}
          instanceId={instanceId}
          isCompact={isMinimapCompact}
          onNavigation={onMinimapNavigation || handleMinimapNavigation}
          className="flex-shrink-0"
        />
      )}
    </div>
  );
}
