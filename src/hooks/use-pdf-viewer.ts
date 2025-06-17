import { loadPDFJS } from "@/lib/pdf-utils";
import type { PDFViewerState } from "@/types/pdf-viewer";
import { useEffect, useState } from "react";

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

  const loadPDF = async () => {
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
  };

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
  }, [pdfUrl]);

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= state.totalPages) {
      setState((prev) => ({ ...prev, currentPage: pageNum }));
    }
  };

  const zoomIn = () => {
    setState((prev) => ({ ...prev, scale: Math.min(prev.scale + 0.25, 3) }));
  };

  const zoomOut = () => {
    setState((prev) => ({ ...prev, scale: Math.max(prev.scale - 0.25, 0.5) }));
  };

  const setScale = (scale: number) => {
    setState((prev) => ({ ...prev, scale }));
  };

  const setIsFullscreen = (isFullscreen: boolean) => {
    setState((prev) => ({ ...prev, isFullscreen }));
  };

  return {
    ...state,
    goToPage,
    zoomIn,
    zoomOut,
    setScale,
    setIsFullscreen,
  };
};
