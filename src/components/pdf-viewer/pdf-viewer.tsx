"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePDFHighlights } from "@/hooks/use-pdf-highlights";
import { usePDFSearch } from "@/hooks/use-pdf-search";
import { usePDFViewer } from "@/hooks/use-pdf-viewer";
import type { PDFViewerProps } from "@/types/pdf-viewer";
import { useCallback, useEffect, useRef } from "react";
import { PageNavigation } from "./page-navigation";
import { PDFCanvas } from "./pdf-canvas";
import { SearchPanel } from "./search-panel";
import { Toolbar } from "./toolbar";

// PDF.js types
declare global {
  interface Window {
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
  pdfData,
  className = "",
  pdfUrl = "https://arxiv.org/pdf/1706.03762",
  instanceId = "default",
  highlights = [],
}: PDFViewerProps) {
  console.log({ highlights, pdfUrl, instanceId });
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const pdfViewer = usePDFViewer(pdfUrl);
  const pdfSearch = usePDFSearch();
  const pdfHighlights = usePDFHighlights(instanceId);

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
          pdfSearch.setShowSearch(true);
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
  }, [pdfSearch, handleNavigateToResult]);

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

  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

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
      className={`flex flex-col ${pdfViewer.isFullscreen ? "h-screen" : "h-full"} bg-muted ${className}`}
    >
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

      {/* Toolbar */}
      <Toolbar
        currentPage={pdfViewer.currentPage}
        totalPages={pdfViewer.totalPages}
        scale={pdfViewer.scale}
        onPreviousPage={() => pdfViewer.goToPage(pdfViewer.currentPage - 1)}
        onNextPage={() => pdfViewer.goToPage(pdfViewer.currentPage + 1)}
        onZoomIn={pdfViewer.zoomIn}
        onZoomOut={pdfViewer.zoomOut}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleSearch={() => pdfSearch.setShowSearch(!pdfSearch.showSearch)}
      />

      {/* PDF Canvas */}
      <PDFCanvas
        pdf={pdfViewer.pdf}
        currentPage={pdfViewer.currentPage}
        scale={pdfViewer.scale}
        isFullscreen={pdfViewer.isFullscreen}
        instanceId={instanceId}
        searchTerm={pdfSearch.searchTerm}
        searchMode={pdfSearch.searchMode}
        searchResults={pdfSearch.searchResults}
        currentResultIndex={pdfSearch.currentResultIndex}
        isSearching={pdfSearch.isSearching}
        highlightService={pdfHighlights}
        highlights={highlights}
        onNavigateToResult={handleNavigateToResult}
      />

      {/* Page Navigation */}
      <PageNavigation
        currentPage={pdfViewer.currentPage}
        totalPages={pdfViewer.totalPages}
        onPageChange={pdfViewer.goToPage}
      />
    </div>
  );
}
