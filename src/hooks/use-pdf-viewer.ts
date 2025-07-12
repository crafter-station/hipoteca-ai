import { loadPDFJS } from "@/lib/pdf-utils";
import { useUpdatePDFViewerState } from "@/stores/contract-analysis-store";
import type { PDFViewerState } from "@/types/pdf-viewer";
import { useCallback, useEffect, useState } from "react";

export const usePDFViewer = (pdfUrl: string) => {
  const [state, setState] = useState<PDFViewerState>({
    pdf: null,
    currentPage: 1,
    totalPages: 0,
    scale: 1.5,
    loading: true,
    error: null,
    isFullscreen: false,
  });

  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const updatePDFViewerState = useUpdatePDFViewerState();

  const loadPDF = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      // @ts-ignore - loadingTask is guaranteed to exist at this point
      const pdfDoc = await loadingTask.promise;
      setState((prev) => ({
        ...prev,
        pdf: pdfDoc,
        totalPages: pdfDoc.numPages,
        loading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to load PDF",
        loading: false,
      }));
      console.error("Error loading PDF:", err);
    }
  }, [pdfUrl]);

  useEffect(() => {
    const initializePDF = async () => {
      try {
        await loadPDFJS();
        await loadPDF();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: "Failed to initialize PDF viewer",
          loading: false,
        }));
      }
    };

    initializePDF();
  }, [loadPDF]);

  const goToPage = useCallback((pageNum: number) => {
    setState((prev) => {
      if (pageNum >= 1 && pageNum <= prev.totalPages) {
        setShouldAutoScroll(true); // Enable auto-scroll for manual navigation
        return { ...prev, currentPage: pageNum };
      }
      return prev;
    });
  }, []);

  const updateCurrentPage = useCallback((pageNum: number) => {
    setState((prev) => {
      if (pageNum >= 1 && pageNum <= prev.totalPages) {
        setShouldAutoScroll(false); // Disable auto-scroll for scroll detection
        return { ...prev, currentPage: pageNum };
      }
      return prev;
    });
  }, []);

  const zoomIn = useCallback(() => {
    setState((prev) => ({ ...prev, scale: Math.min(prev.scale + 0.25, 3) }));
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => ({ ...prev, scale: Math.max(prev.scale - 0.25, 0.5) }));
  }, []);

  const setScale = useCallback((scale: number) => {
    setState((prev) => ({ ...prev, scale }));
  }, []);

  const setIsFullscreen = useCallback((isFullscreen: boolean) => {
    setState((prev) => ({ ...prev, isFullscreen }));
  }, []);

  // Update Zustand store when PDF state changes
  useEffect(() => {
    if (state.pdf) {
      updatePDFViewerState({
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        scale: state.scale,
        onPreviousPage: () => goToPage(state.currentPage - 1),
        onNextPage: () => goToPage(state.currentPage + 1),
        onZoomIn: zoomIn,
        onZoomOut: zoomOut,
      });
    }
  }, [
    state.pdf,
    state.currentPage,
    state.totalPages,
    state.scale,
    goToPage,
    zoomIn,
    zoomOut,
    updatePDFViewerState,
  ]);

  return {
    ...state,
    shouldAutoScroll,
    setShouldAutoScroll,
    goToPage,
    updateCurrentPage,
    zoomIn,
    zoomOut,
    setScale,
    setIsFullscreen,
  };
};
