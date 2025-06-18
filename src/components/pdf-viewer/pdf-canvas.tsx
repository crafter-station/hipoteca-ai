"use client";

import { HighlightService } from "@/lib/highlight-service";
import { calculateResponsiveScale, findAllMatches } from "@/lib/pdf-utils";
import {
  buildTextMap,
  mapMatchToSpans,
  normalizeSearchTerm,
} from "@/lib/text-processing";
import type {
  HighlightAnnotation,
  HighlightRect,
  SearchMode,
  SearchResult,
  TooltipData,
} from "@/types/pdf-viewer";
import { useEffect, useRef, useState } from "react";
import { TextSelectionPopup } from "./text-selection-popup";
import { useCompletion } from "@ai-sdk/react";
import { useParams } from "next/navigation";

// PDF.js types
interface PDFDocument {
  numPages: number;
  getPage: (pageNum: number) => Promise<PDFPage>;
}

interface PDFPage {
  getViewport: (options: { scale: number }) => PDFViewport;
  render: (renderContext: PDFRenderContext) => { promise: Promise<void> };
  getTextContent: () => Promise<PDFTextContent>;
}

interface PDFViewport {
  width: number;
  height: number;
  scale: number;
}

interface PDFRenderContext {
  canvasContext: CanvasRenderingContext2D;
  viewport: PDFViewport;
}

interface PDFTextContent {
  items: Array<{
    str: string;
    transform: number[];
  }>;
}

// PDF.js global with renderTextLayer
declare global {
  interface Window {
    pdfjsLib: {
      getDocument: (url: string) => Promise<unknown>;
      GlobalWorkerOptions: {
        workerSrc: string;
      };
      renderTextLayer: (options: {
        textContentSource: PDFTextContent;
        container: HTMLElement;
        viewport: PDFViewport;
        textDivs: unknown[];
      }) => { promise: Promise<void> };
    };
  }
}

// Highlight service type - matching the actual hook return type
interface HighlightServiceType {
  tooltipContent: Map<string, TooltipData>;
  highlightRects: { current: Map<string | number, HighlightRect[]> };
  clearHighlights: () => void;
  addTooltipContent: (key: string, data: TooltipData) => void;
  addHighlightRect: (resultIndex: number | string, rect: HighlightRect) => void;
  createTooltip: (
    triggerElement: HTMLElement,
    data: TooltipData,
    onNavigateToResult?: (index: number) => void,
  ) => void;
  removeTooltip: () => void;
  clearTooltipTimeout: () => void;
  setTooltipTimeout: (callback: () => void, delay: number) => void;
}

interface PDFCanvasProps {
  pdf: PDFDocument | null;
  currentPage: number;
  shouldAutoScroll?: boolean;
  onAutoScrollComplete?: () => void;
  scale: number;
  isFullscreen: boolean;
  instanceId: string;
  searchTerm: string;
  searchMode: SearchMode;
  searchResults: SearchResult[];
  currentResultIndex: number;
  isSearching: boolean;
  highlightService: HighlightServiceType;
  highlights: HighlightAnnotation[];
  onNavigateToResult: (index: number) => void;
  // Callback to report page highlight data for minimap
  onPageHighlightData?: (data: Map<number, { annotations: Array<{ type: string; position: number }>; searchResults: Array<{ position: number }> }>) => void;
  // Callback for text selection questions
  onTextSelectionQuestion?: (question: string, selectedText: string) => Promise<void>;
}

const DEBUG = false;
const ANNOTATION_DEBUG = false; // Disable verbose logging for now
const TOOLTIP_DEBUG = false; // Focus on tooltip generation



export function PDFCanvas({
  pdf,
  currentPage,
  shouldAutoScroll = true,
  onAutoScrollComplete,
  scale,
  isFullscreen,
  instanceId,
  searchTerm,
  searchMode,
  searchResults,
  currentResultIndex,
  isSearching,
  highlightService,
  highlights,
  onNavigateToResult,
  onPageHighlightData,
  onTextSelectionQuestion,
}: PDFCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<
    Map<
      number,
      {
        canvas: HTMLCanvasElement | null;
        textLayer: HTMLDivElement | null;
        container: HTMLDivElement | null;
      }
    >
  >(new Map());
  const [totalPages, setTotalPages] = useState(0);

  // Get contract key from params
  const { key } = useParams<{ key: string }>();

  // Use explain completion hook
  const explainCompletion = useCompletion({
    api: "/api/explain",
  });

  // Track page highlight data for minimap
  const pageHighlightDataRef = useRef<Map<number, { annotations: Array<{ type: string; position: number }>; searchResults: Array<{ position: number }> }>>(new Map());
  const [highlightDataVersion, setHighlightDataVersion] = useState(0);

  // Text selection state
  const [textSelection, setTextSelection] = useState<{
    text: string;
    position: { x: number; y: number };
    range?: Range;
  } | null>(null);

  // Temporary highlight state
  const [temporaryHighlight, setTemporaryHighlight] = useState<{
    id: string;
    range: Range;
    text: string;
  } | null>(null);

  // Track render tasks to cancel them if needed
  const renderTasksRef = useRef<Map<number, { promise: Promise<void>; cancel: () => void }>>(new Map());

  // Track which pages are currently being rendered to avoid duplicate renders
  const renderingPagesRef = useRef<Set<number>>(new Set());

  // Initialize pages when PDF loads
  useEffect(() => {
    if (pdf) {
      setTotalPages(pdf.numPages);
    }
  }, [pdf]);

  // Cleanup render tasks when component unmounts or PDF changes
  useEffect(() => {
    return () => {
      // Cancel all pending render tasks
      renderTasksRef.current.forEach((task) => {
        try {
          task.cancel();
        } catch (err) {
          // Ignore cancellation errors
        }
      });
      renderTasksRef.current.clear();
      renderingPagesRef.current.clear();
    };
  }, [pdf]);

  // Render all pages
  const renderAllPages = async () => {
    if (!pdf || !containerRef.current) return;

    try {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        await renderPage(pageNum);
      }
    } catch (err) {
      console.error("Error rendering pages:", err);
    }
  };

  // Render a specific page
  const renderPage = async (pageNum: number) => {
    if (!pdf || !containerRef.current) return;

    // Skip if this page is already being rendered
    if (renderingPagesRef.current.has(pageNum)) {
      if (DEBUG) console.log(`Page ${pageNum} already being rendered, skipping`);
      return;
    }

    // Mark this page as being rendered
    renderingPagesRef.current.add(pageNum);

    try {
      // Cancel any existing render task for this page only if it's still pending
      const existingTask = renderTasksRef.current.get(pageNum);
      if (existingTask) {
        try {
          existingTask.cancel();
        } catch (err) {
          // Ignore if already completed or cancelled
        }
        renderTasksRef.current.delete(pageNum);
      }

      const page = await pdf.getPage(pageNum);
      const pageRefs_current = pageRefs.current.get(pageNum);

      if (!pageRefs_current) {
        if (DEBUG)
          console.log(`Page ${pageNum} refs not found, skipping render`);
        return;
      }

      const { canvas, textLayer, container } = pageRefs_current;

      // Calculate responsive scale based on container width
      if (!containerRef.current) {
        console.warn(`Container ref is null for page ${pageNum}`);
        return;
      }

      const containerWidth = containerRef.current.clientWidth - 32; // Account for padding
      const pageViewport = page.getViewport({ scale: 1 });
      const responsiveScale = calculateResponsiveScale(
        containerWidth,
        pageViewport,
        scale,
      );

      const viewport = page.getViewport({ scale: responsiveScale });

      // @ts-ignore - canvas is guaranteed to exist at this point
      const context = canvas.getContext("2d");
      if (!context) return;

      // Clear the canvas before rendering
      // @ts-ignore - canvas is guaranteed to exist at this point
      context.clearRect(0, 0, canvas.width, canvas.height);

      // @ts-ignore - canvas is guaranteed to exist at this point
      canvas.height = viewport.height;
      // @ts-ignore - canvas is guaranteed to exist at this point
      canvas.width = viewport.width;

      // @ts-ignore - textLayer is guaranteed to exist at this point
      textLayer.innerHTML = "";
      // @ts-ignore - textLayer is guaranteed to exist at this point
      textLayer.style.width = `${viewport.width}px`;
      // @ts-ignore - textLayer is guaranteed to exist at this point
      textLayer.style.height = `${viewport.height}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Start the render task and store it for potential cancellation
      const renderTask = page.render(renderContext) as { promise: Promise<void>; cancel: () => void };
      renderTasksRef.current.set(pageNum, renderTask);

      await renderTask.promise;

      // Remove the completed task from tracking
      renderTasksRef.current.delete(pageNum);
      renderingPagesRef.current.delete(pageNum);

      const textContent = await page.getTextContent();

      if (textLayer) {
        textLayer.innerHTML = "";
        textLayer.style.width = `${viewport.width}px`;
        textLayer.style.height = `${viewport.height}px`;
        textLayer.style.left = "0px";
        textLayer.style.top = "0px";
        textLayer.style.margin = "0px";
        textLayer.style.padding = "0px";
        textLayer.style.setProperty(
          "--scale-factor",
          viewport.scale.toString(),
        );
        textLayer.className = "textLayer";

        await window.pdfjsLib.renderTextLayer({
          textContentSource: textContent,
          container: textLayer,
          viewport: viewport,
          textDivs: [],
        }).promise;

        setTimeout(() => {
          // Fix text layer dimensions to match rendered canvas exactly
          // @ts-ignore - canvas is guaranteed to exist at this point
          const canvasRect = canvas.getBoundingClientRect();
          const adjustedScale = canvasRect.width / pageViewport.width;
          // @ts-ignore - textLayer is guaranteed to exist at this point
          textLayer.style.width = `${canvasRect.width}px`;
          // @ts-ignore - textLayer is guaranteed to exist at this point
          textLayer.style.height = `${canvasRect.height}px`;
          // @ts-ignore - textLayer is guaranteed to exist at this point
          textLayer.style.setProperty(
            "--scale-factor",
            adjustedScale.toString(),
          );

          // Highlight search results for this page
          highlightSearchResults(pageNum);

          // Highlight annotations for this page
          highlightAnnotations(pageNum);

          // Create unified hover areas after both search and annotations are processed
          // Use a longer delay to ensure all async operations are complete
          setTimeout(() => {
            if (TOOLTIP_DEBUG) {
              console.log(
                `🔄 PAGE ${pageNum}: Creating hover areas after highlights processed`,
                {
                  tooltipContentSize:
                    highlightService?.tooltipContent?.size || 0,
                  highlightRectsSize:
                    highlightService?.highlightRects?.current?.size || 0,
                },
              );
            }
            createUnifiedHoverAreas();
          }, 200); // Delay after highlights are processed
        }, 300); // Increased timeout to ensure text layer is fully ready
      }
    } catch (err) {
      // Remove the failed task from tracking
      renderTasksRef.current.delete(pageNum);
      renderingPagesRef.current.delete(pageNum);

      // Don't log cancellation errors as they're expected
      if (err instanceof Error && !err.message.includes('Rendering cancelled')) {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    }
  };

  // Highlight search results for a specific page
  const highlightSearchResults = (pageNum: number) => {
    const pageRefs_current = pageRefs.current.get(pageNum);
    if (
      !pageRefs_current ||
      !pageRefs_current.textLayer ||
      !pageRefs_current.container
    ) {
      if (DEBUG)
        console.log(
          `highlightSearchResults: textLayerRef or parent not found for page ${pageNum}`,
        );
      return;
    }

    // Initialize page highlight data if not exists
    if (!pageHighlightDataRef.current.has(pageNum)) {
      pageHighlightDataRef.current.set(pageNum, { annotations: [], searchResults: [] });
    }

    const { textLayer, container } = pageRefs_current;

    // Remove existing highlights for this specific page only
    HighlightService.removeExistingHighlights(textLayer);

    // Only proceed if we have a search term
    if (!searchTerm.trim()) {
      if (DEBUG)
        console.log(
          `highlightSearchResults: No search term for page ${pageNum}`,
        );
      return;
    }

    // Don't highlight while search is in progress
    if (isSearching) {
      if (DEBUG)
        console.log(
          `highlightSearchResults: Search in progress for page ${pageNum}, waiting...`,
        );
      return;
    }

    if (DEBUG)
      console.log(
        `🔍 highlightSearchResults: Starting highlighting for page ${pageNum}`,
        {
          searchResultsLength: searchResults.length,
          searchTerm: searchTerm.trim(),
          pageNum,
          isSearching,
          textLayerChildren: textLayer.children.length,
          containerBounds: container.getBoundingClientRect(),
        },
      );

    // Get all text spans and build a complete text map
    const textSpans = Array.from(textLayer.querySelectorAll("span"));
    if (textSpans.length === 0) {
      if (DEBUG)
        console.log(
          `⚠️ highlightSearchResults: No text spans found on page ${pageNum}`,
        );
      return;
    }

    if (DEBUG)
      console.log(`📝 Found ${textSpans.length} text spans on page ${pageNum}`);

    // @ts-ignore - container is guaranteed to exist at this point
    const textLayerParentRect = container?.getBoundingClientRect();
    const { completeText, indexMap } = buildTextMap(textSpans);
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm);

    if (DEBUG) {
      console.log(
        `📄 Page ${pageNum} complete text (first 200 chars):`,
        `${completeText.substring(0, 200)}...`,
      );
      console.log(`🔍 Normalized search term: "${normalizedSearchTerm}"`);
      console.log("📐 Text layer parent rect:", textLayerParentRect);
    }

    // Find all matches in the complete text
    const allMatches = findAllMatches(
      completeText,
      normalizedSearchTerm,
      searchMode,
    );
    if (DEBUG)
      console.log(
        `🎯 Found ${allMatches.length} matches in complete text for page ${pageNum}:`,
        allMatches,
      );

    // Update search results for this page
    const currentData = pageHighlightDataRef.current.get(pageNum)!;
    // Clear previous search results for this page
    currentData.searchResults = [];

    if (allMatches.length === 0) {
      if (DEBUG)
        console.log(
          `❌ No matches found for "${normalizedSearchTerm}" on page ${pageNum}`,
        );
      return;
    }

    // Map matches back to spans and create highlights
    allMatches.forEach((match, matchIndex) => {
      // Track search result position for minimap
      const currentData = pageHighlightDataRef.current.get(pageNum)!;
      const position = match.start / completeText.length;
      currentData.searchResults.push({ position });
      // Trigger data update
      setHighlightDataVersion(prev => prev + 1);

      const spanMatches = mapMatchToSpans(match, indexMap);
      if (DEBUG)
        console.log(
          `📍 Match ${matchIndex + 1} on page ${pageNum}: ${spanMatches.length} span matches`,
          spanMatches,
        );

      const matchedText = completeText.substring(match.start, match.end);

      // Find corresponding search result for this match
      const correspondingResult = searchResults.find(
        (sr) =>
          sr.pageNum === pageNum &&
          matchedText.includes(sr.text.replace(/\s+/g, " ")),
      );

      if (DEBUG) {
        console.log(
          `🔗 Correspondence check for match ${matchIndex + 1} on page ${pageNum}:`,
          {
            matchedText: matchedText.substring(0, 100),
            correspondingResult: correspondingResult
              ? {
                text: `${correspondingResult.text.substring(0, 50)}...`,
                pageNum: correspondingResult.pageNum,
              }
              : "NOT FOUND",
          },
        );
      }

      const resultIndex = correspondingResult
        ? searchResults.indexOf(correspondingResult)
        : -1;
      if (DEBUG)
        console.log(
          `📊 Result index for match ${matchIndex + 1} on page ${pageNum}: ${resultIndex}`,
        );

      const isCurrent = resultIndex === currentResultIndex;

      spanMatches.forEach((spanMatch, spanIndex) => {
        // Create a unique index for matches that don't have a corresponding search result
        const effectiveResultIndex =
          resultIndex >= 0
            ? resultIndex
            : `page-${pageNum}-match-${matchIndex}`;

        if (DEBUG) {
          console.log(
            `🎨 Creating highlight overlay for match ${matchIndex + 1}, span ${spanIndex + 1} on page ${pageNum}`,
            {
              effectiveResultIndex,
              isCurrent,
              spanMatch: {
                textContent: spanMatch.textNode.textContent?.substring(0, 50),
                startOffset: spanMatch.startOffsetInNode,
                endOffset: spanMatch.endOffsetInNode,
              },
            },
          );
        }

        HighlightService.createHighlightOverlay(
          spanMatch,
          isCurrent,
          textLayerParentRect,
          textLayer,
          instanceId,
          correspondingResult?.text || matchedText,
          correspondingResult?.context ||
          `Found in page text: "${matchedText}"`,
          effectiveResultIndex,
          highlightService.addHighlightRect,
          highlightService.addTooltipContent,
          Math.max(searchResults.length, allMatches.length), // Use the higher count
          (element, data, navFn) => {
            highlightService.clearTooltipTimeout();
            highlightService.createTooltip(element, data, navFn);
          },
          () => {
            highlightService.setTooltipTimeout(() => {
              highlightService.removeTooltip();
            }, 400);
          },
          onNavigateToResult,
        );
      });
    });

    if (DEBUG) {
      console.log(`✅ Finished highlighting page ${pageNum}`, {
        totalMatches: allMatches.length,
        highlightRectsSize: highlightService.highlightRects?.current?.size || 0,
        tooltipContentSize: highlightService.tooltipContent?.size || 0,
      });
    }
  };

  // Clear all highlights and highlight only pages with matches
  const highlightAllPages = () => {
    // Clear highlight service data before re-highlighting all pages
    highlightService.clearHighlights();

    // Get unique page numbers that have search results
    const pagesWithResults = new Set(
      searchResults.map((result) => result.pageNum),
    );

    if (DEBUG) {
      console.log(
        "🎯 Highlighting only pages with search results:",
        Array.from(pagesWithResults),
      );
    }

    // Only highlight pages that have search results
    pagesWithResults.forEach((pageNum) => {
      highlightSearchResults(pageNum);
    });

    // If no search results but we have a search term, try to highlight all pages
    // (this handles cases where search results might not be populated yet but we have matches)
    if (searchResults.length === 0 && searchTerm.trim()) {
      if (DEBUG)
        console.log(
          "🔍 No search results yet, but have search term - highlighting all pages",
        );
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        highlightSearchResults(pageNum);
      }
    }
  };

  // Create unified hover areas for pages with highlights (simplified - tooltips now handled directly)
  const createUnifiedHoverAreas = () => {
    if (TOOLTIP_DEBUG) {
      console.log("🎯 TOOLTIP SUMMARY: Available tooltips", {
        totalTooltips: highlightService?.tooltipContent?.size || 0,
        tooltipKeys:
          highlightService?.tooltipContent?.size > 0
            ? Array.from(highlightService.tooltipContent.keys())
            : [],
      });
    }

    // Clear any existing unified hover areas (legacy cleanup)
    document
      .querySelectorAll(".unified-hover-area")
      .forEach((el) => el.remove());

    // Handle group hover for search results (simplified)
    pageRefs.current.forEach((pageRef, pageNum) => {
      if (!pageRef?.textLayer) return;

      // Check if this page actually has highlights
      const hasSearchHighlights =
        pageRef.textLayer.querySelectorAll(".search-highlight-overlay").length >
        0;
      const hasAnnotationHighlights =
        pageRef.textLayer.querySelectorAll("[data-annotation-key]").length > 0;

      if (hasSearchHighlights || hasAnnotationHighlights) {
        if (TOOLTIP_DEBUG) {
          console.log(
            `📄 PAGE ${pageNum}: Has highlights (search: ${hasSearchHighlights}, annotations: ${hasAnnotationHighlights})`,
          );
        }
      }
    });

    if (TOOLTIP_DEBUG) {
      console.log(
        "✅ Simplified hover areas setup complete - tooltips handled directly on highlight elements",
      );
    }
  };

  // Scroll to current page
  const scrollToCurrentPage = () => {
    const pageRefs_current = pageRefs.current.get(currentPage);
    if (pageRefs_current?.container && containerRef.current) {
      const container = containerRef.current;
      const pageContainer = pageRefs_current.container;

      // Calculate scroll position to center the page
      const containerRect = container.getBoundingClientRect();
      const pageRect = pageContainer.getBoundingClientRect();
      const containerScrollTop = container.scrollTop;
      const targetScrollTop =
        containerScrollTop +
        pageRect.top -
        containerRect.top -
        (containerRect.height - pageRect.height) / 2;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }
  };

  // Highlight annotations using the same algorithm as search results
  const highlightAnnotations = (pageNum: number) => {
    const pageRefs_current = pageRefs.current.get(pageNum);
    if (
      !pageRefs_current ||
      !pageRefs_current.textLayer ||
      !highlights.length
    ) {
      if (ANNOTATION_DEBUG && highlights.length > 0) {
        console.log(
          `❌ ANNOTATION: Skipping page ${pageNum} - missing refs or no highlights`,
          {
            hasPageRefs: !!pageRefs_current,
            hasTextLayer: !!pageRefs_current?.textLayer,
            highlightsCount: highlights.length,
          },
        );
      }
      return;
    }

    // Initialize/reset page highlight data for this page to avoid stale data
    pageHighlightDataRef.current.set(pageNum, { annotations: [], searchResults: [] });

    const { textLayer, container } = pageRefs_current;

    // Remove existing annotation highlights for this page
    textLayer.querySelectorAll("[data-annotation-key]").forEach((el) => {
      el.classList.remove(
        "highlight-term",
        "highlight-fee",
        "highlight-duty-user",
        "highlight-duty-bank",
        "highlight-var",
        "highlight-risk",
        "highlight-abuse",
      );
      el.removeAttribute("data-annotation-key");
      el.removeAttribute("data-page");
    });

    if (ANNOTATION_DEBUG) {
      console.log(
        `🔍 ANNOTATION: Processing ${highlights.length} annotations for page ${pageNum}`,
      );
    }

    // Get all text spans and build a complete text map (same as search algorithm)
    const textSpans = Array.from(textLayer.querySelectorAll("span"));
    if (textSpans.length === 0) {
      if (ANNOTATION_DEBUG) {
        console.log(`⚠️ ANNOTATION: No text spans found on page ${pageNum}`);
      }
      return;
    }


    // @ts-ignore - container is guaranteed to exist at this point
    const textLayerParentRect = container.getBoundingClientRect();
    const { completeText, indexMap } = buildTextMap(textSpans);

    if (ANNOTATION_DEBUG) {
      console.log(
        `📄 ANNOTATION: Page ${pageNum} complete text (first 200 chars):`,
        `${completeText.substring(0, 200)}...`,
      );
    }

    // Process each annotation
    highlights.forEach((annotation, annotationIndex) => {
      const normalizedSentence = normalizeSearchTerm(annotation.sentence);

      // Debug annotation types (reduced)
      if (annotationIndex === 0) {
        console.log(`🔍 PROCESSING: ${highlights.length} annotations for page ${pageNum}`);
      }

      if (ANNOTATION_DEBUG) {
        console.log(
          `🔍 ANNOTATION: Looking for "${normalizedSentence}" on page ${pageNum}`,
        );
      }

      // Find all matches using the same algorithm as search
      const allMatches = findAllMatches(
        completeText,
        normalizedSentence,
        "contains",
      );



      if (allMatches.length === 0) {
        if (ANNOTATION_DEBUG) {
          console.log(
            `❌ ANNOTATION: No matches found for "${normalizedSentence}" on page ${pageNum}`,
          );
        }
        return;
      }

      if (ANNOTATION_DEBUG) {
        console.log(
          `🎯 ANNOTATION: Found ${allMatches.length} matches for "${normalizedSentence}" on page ${pageNum}`,
        );
      }

      // Process each match (usually just one for annotations)
      allMatches.forEach((match, matchIndex) => {
        // Track this annotation for minimap - always add each match
        const currentData = pageHighlightDataRef.current.get(pageNum)!;

        // Calculate position based on where the match was found in the page
        const position = match.start / completeText.length;
        currentData.annotations.push({ type: annotation.type, position });

        if (ANNOTATION_DEBUG) {
          console.log(`📍 MINIMAP DATA: Added ${annotation.type} at position ${position.toFixed(4)} on page ${pageNum}`);
        }

        // Trigger data update
        setHighlightDataVersion(prev => prev + 1);
        const spanMatches = mapMatchToSpans(match, indexMap);

        if (spanMatches.length === 0) return;

        const annotationKey = `annotation-${pageNum}-${annotationIndex}`;
        const highlightClass = getHighlightClass(annotation.type);

        if (ANNOTATION_DEBUG) {
          console.log(
            `🎨 ANNOTATION: Creating highlight for ${annotationKey} with ${spanMatches.length} span matches`,
          );
        }

        // Apply highlighting to matched spans (same as search algorithm)
        spanMatches.forEach((spanMatch) => {
          // Create highlight overlay using the same method as search results
          HighlightService.createHighlightOverlay(
            spanMatch,
            false, // annotations are never "current"
            textLayerParentRect,
            textLayer,
            instanceId,
            annotation.sentence,
            annotation.tooltip,
            annotationKey, // Use annotation key as effectiveResultIndex
            highlightService.addHighlightRect,
            highlightService.addTooltipContent,
            highlights.length,
            (element, data, navFn) => {
              highlightService.clearTooltipTimeout();
              highlightService.createTooltip(element, data, navFn);
            },
            () => {
              highlightService.setTooltipTimeout(() => {
                highlightService.removeTooltip();
              }, 400);
            },
            onNavigateToResult,
            annotation.type, // Pass the annotation type
          );

          // Apply annotation-specific CSS class to the created highlight overlays
          setTimeout(() => {
            const createdHighlights = textLayer.querySelectorAll(
              `[id*="${annotationKey}"]`,
            );
            createdHighlights.forEach((highlight) => {
              highlight.classList.remove(
                "search-highlight",
                "current-highlight",
              );
              highlight.classList.add(highlightClass);
              highlight.setAttribute("data-annotation-key", annotationKey);
              highlight.setAttribute("data-page", pageNum.toString());
            });
          }, 10);
        });

        if (TOOLTIP_DEBUG) {
          console.log(`💾 TOOLTIP STORED: ${annotationKey}`, {
            tooltipKey: `result-${annotationKey}`,
            sentence: `${annotation.sentence.substring(0, 50)}...`,
            tooltip: `${annotation.tooltip.substring(0, 50)}...`,
            type: annotation.type,
            pageNum: pageNum,
          });
        }
      });
    });

    // Debug: Show what data we're sending to minimap for this page
    if (ANNOTATION_DEBUG) {
      const finalData = pageHighlightDataRef.current.get(pageNum);
      console.log(`🎯 FINAL MINIMAP DATA for page ${pageNum}:`, {
        annotations: finalData?.annotations.length || 0,
        annotationDetails: finalData?.annotations.map(a => ({ type: a.type, position: a.position.toFixed(4) })) || [],
        searchResults: finalData?.searchResults.length || 0
      });
    }

    // Note: createUnifiedHoverAreas() is now called from renderPage after both search and annotations are processed
  };

  // Get CSS class for highlight type
  const getHighlightClass = (type: string): string => {
    const classMap: Record<string, string> = {
      TERM: "highlight-term",
      FEE: "highlight-fee",
      DUTY_USER: "highlight-duty-user",
      DUTY_BANK: "highlight-duty-bank",
      VAR: "highlight-var",
      RISK: "highlight-risk",
      ABUSE: "highlight-abuse",
    };
    return classMap[type] || "highlight-term";
  };

  // Handle text selection
  // Create temporary highlight using a more robust approach
  const createTemporaryHighlight = (range: Range, text: string): string => {
    const highlightId = `temp-highlight-${Date.now()}`;

    try {
      // Clone the range to avoid modifying the original selection
      const clonedRange = range.cloneRange();

      // Get all text nodes in the range
      const walker = document.createTreeWalker(
        clonedRange.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Check if this text node intersects with our range
            const nodeRange = document.createRange();
            nodeRange.selectNodeContents(node);

            return clonedRange.intersectsNode(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          }
        }
      );

      const textNodes: Text[] = [];
      let node: Text | null;
      while ((node = walker.nextNode() as Text)) {
        textNodes.push(node);
      }

      if (textNodes.length === 0) {
        console.warn("No text nodes found in range");
        return '';
      }

      // Create highlight spans for each text node segment
      const highlightSpans: HTMLElement[] = [];

      textNodes.forEach((textNode, index) => {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(textNode);

        // Calculate intersection with our selection range
        const startOffset = textNode === clonedRange.startContainer
          ? Math.max(0, clonedRange.startOffset)
          : 0;
        const endOffset = textNode === clonedRange.endContainer
          ? Math.min(textNode.textContent?.length || 0, clonedRange.endOffset)
          : textNode.textContent?.length || 0;

        if (startOffset < endOffset) {
          // Split the text node and wrap the middle part
          const beforeText = textNode.textContent?.substring(0, startOffset) || '';
          const highlightText = textNode.textContent?.substring(startOffset, endOffset) || '';
          const afterText = textNode.textContent?.substring(endOffset) || '';

          const parent = textNode.parentNode;
          if (parent) {
            // Create highlight span
            const highlightSpan = document.createElement('span');
            highlightSpan.setAttribute('data-temp-highlight', highlightId);
            highlightSpan.setAttribute('data-temp-highlight-part', index.toString());

            // Use inline styles to ensure visibility - bright yellow for maximum visibility
            highlightSpan.style.backgroundColor = 'rgba(255, 255, 0, 0.6)'; // bright yellow
            highlightSpan.style.border = '1px solid rgba(255, 193, 7, 0.8)'; // amber border
            highlightSpan.style.borderRadius = '2px';
            highlightSpan.style.padding = '1px 2px';
            highlightSpan.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            highlightSpan.style.transition = 'all 0.2s ease-in-out';
            highlightSpan.style.display = 'inline';
            highlightSpan.style.position = 'relative';
            highlightSpan.style.zIndex = '10';

            highlightSpan.textContent = highlightText;

            // Replace the original text node with the split parts
            if (beforeText) {
              parent.insertBefore(document.createTextNode(beforeText), textNode);
            }
            parent.insertBefore(highlightSpan, textNode);
            if (afterText) {
              parent.insertBefore(document.createTextNode(afterText), textNode);
            }
            parent.removeChild(textNode);

            highlightSpans.push(highlightSpan);

            console.log("🎨 HIGHLIGHT SPAN CREATED:", {
              part: index,
              text: highlightText,
              backgroundColor: highlightSpan.style.backgroundColor,
              element: highlightSpan,
              parent: parent.nodeName,
              isConnected: highlightSpan.isConnected
            });
          }
        }
      });

      console.log("✨ TEMPORARY HIGHLIGHT CREATED:", {
        highlightId,
        text,
        spans: highlightSpans.length
      });

      // Verify highlights are in DOM
      setTimeout(() => {
        const verifyElements = document.querySelectorAll(`[data-temp-highlight="${highlightId}"]`);
        console.log("🔍 HIGHLIGHT VERIFICATION:", {
          highlightId,
          expectedSpans: highlightSpans.length,
          foundInDOM: verifyElements.length,
          elements: Array.from(verifyElements).map(el => ({
            text: el.textContent,
            styles: {
              backgroundColor: (el as HTMLElement).style.backgroundColor,
              border: (el as HTMLElement).style.border,
              display: (el as HTMLElement).style.display
            },
            isVisible: (el as HTMLElement).offsetParent !== null
          }))
        });
      }, 100);

      return highlightId;
    } catch (error) {
      console.error("Error creating temporary highlight:", error);
      return '';
    }
  };

  // Remove temporary highlight
  const removeTemporaryHighlight = (highlightId: string) => {
    const highlightElements = document.querySelectorAll(`[data-temp-highlight="${highlightId}"]`);

    if (highlightElements.length > 0) {
      highlightElements.forEach((highlightElement) => {
        // Replace the highlight span with its text content
        const parent = highlightElement.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(highlightElement.textContent || ''), highlightElement);
        }
      });

      // Normalize all affected parents to merge adjacent text nodes
      const parents = new Set<Node>();
      highlightElements.forEach((element) => {
        if (element.parentNode) {
          parents.add(element.parentNode);
        }
      });

      parents.forEach((parent) => {
        if (parent.normalize) {
          parent.normalize();
        }
      });

      console.log("🗑️ TEMPORARY HIGHLIGHT REMOVED:", {
        highlightId,
        spans: highlightElements.length
      });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      console.log("❌ NO VALID SELECTION - ignoring");
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) {
      console.log("❌ SELECTION TOO SHORT - ignoring");
      return;
    }

    console.log("📝 TEXT SELECTION:", { selectedText, length: selectedText.length });

    // Get the position of the selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    console.log("📍 SELECTION POSITION:", { rect, scrollX: window.scrollX, scrollY: window.scrollY });

    // Create temporary highlight
    const highlightId = createTemporaryHighlight(range, selectedText);

    // Clear the selection since we now have a visual highlight
    selection.removeAllRanges();

    // Position the popup near the selection
    const position = {
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 10, // 10px below the selection
    };

    setTextSelection({
      text: selectedText,
      position,
      range: range.cloneRange(),
    });

    setTemporaryHighlight({
      id: highlightId,
      range: range.cloneRange(),
      text: selectedText,
    });

    console.log("✅ TEXT SELECTION SET:", { text: selectedText, position, highlightId });
  };

  // Handle question submission
  const handleQuestionSubmit = async (question: string, selectedText: string) => {
    console.log("📤 SUBMITTING QUESTION:", { question, selectedText });

    try {
      // Find the page index where the text was selected
      let pageIndex = 1; // Default to page 1
      if (temporaryHighlight?.range) {
        // Try to find which page the selection is on
        const pageContainers = containerRef.current?.querySelectorAll('[data-page-number]');
        pageContainers?.forEach((container, index) => {
          if (container.contains(temporaryHighlight.range.commonAncestorContainer) ||
            container.contains(temporaryHighlight.range.commonAncestorContainer.parentElement)) {
            pageIndex = index + 1;
          }
        });
      }

      // Call the explain API with the question and context
      await explainCompletion.complete(selectedText, {
        body: { pageIndex, contractId: key },
      });

      // Convert temporary highlight to permanent highlight
      if (temporaryHighlight) {
        // Remove the temporary highlight
        removeTemporaryHighlight(temporaryHighlight.id);

        // TODO: Add permanent highlight with tooltip containing the AI response
        // This would integrate with the existing highlight system
        console.log("🔄 CONVERTING TO PERMANENT HIGHLIGHT:", {
          text: selectedText,
          question,
          highlightId: temporaryHighlight.id,
          aiResponse: explainCompletion.completion
        });
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  // Close text selection popup
  const closeTextSelection = () => {
    console.log("🚫 CLOSING TEXT SELECTION");

    // Remove temporary highlight if it exists
    if (temporaryHighlight) {
      removeTemporaryHighlight(temporaryHighlight.id);
    }

    setTextSelection(null);
    setTemporaryHighlight(null);
  };

  // Report page highlight data to parent when it changes
  useEffect(() => {
    if (onPageHighlightData) {
      onPageHighlightData(new Map(pageHighlightDataRef.current));
    }
  }, [highlightDataVersion, onPageHighlightData]);

  // Effects
  useEffect(() => {
    if (pdf && totalPages > 0) {
      renderAllPages();
    }
  }, [pdf, totalPages, scale]);

  // Add resize observer to handle container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (pdf && totalPages > 0) {
        setTimeout(() => renderAllPages(), 100);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pdf, totalPages]);

  // Highlight when search results change
  useEffect(() => {
    if (DEBUG) {
      console.log(
        "useEffect highlightSearchResults triggered. SearchTerm:",
        searchTerm,
        "SearchResults length:",
        searchResults.length,
        "CurrentResultIndex:",
        currentResultIndex,
      );
    }
    if (pdf && totalPages > 0) {
      // Add a small delay to ensure state has been fully updated
      setTimeout(() => {
        highlightAllPages();
      }, 50);
    }
  }, [searchResults, currentResultIndex, scale, isSearching]);

  // Create unified hover areas when tooltip content changes (debounced)
  useEffect(() => {
    if (highlightService?.tooltipContent?.size > 0 && totalPages > 0) {
      // Only create hover areas if we're not in the middle of rendering pages
      // This prevents conflicts with the renderPage timing
      const timeoutId = setTimeout(() => {
        if (ANNOTATION_DEBUG) {
          console.log(
            "🔄 EFFECT: Tooltip content changed, creating hover areas:",
            {
              tooltipContentSize: highlightService.tooltipContent.size,
              highlightRectsSize:
                highlightService.highlightRects.current?.size || 0,
            },
          );
        }
        // Only call if all pages are rendered to avoid conflicts
        const allPagesRendered = Array.from(
          { length: totalPages },
          (_, i) => i + 1,
        ).every((p) => {
          const pageRef = pageRefs.current.get(p);
          return pageRef?.textLayer && pageRef.textLayer.children.length > 0;
        });

        if (allPagesRendered) {
          createUnifiedHoverAreas();
        }
      }, 500); // Longer delay to avoid conflicts with renderPage

      return () => clearTimeout(timeoutId);
    }
  }, [highlightService?.tooltipContent?.size, totalPages]); // Only trigger when size changes

  // Scroll to current page when it changes (only if shouldAutoScroll is true)
  useEffect(() => {
    if (currentPage && totalPages > 0 && shouldAutoScroll) {
      setTimeout(() => {
        scrollToCurrentPage();
        // Reset the auto-scroll flag after completing the scroll
        if (onAutoScrollComplete) {
          onAutoScrollComplete();
        }
      }, 200);
    }
  }, [currentPage, shouldAutoScroll, onAutoScrollComplete]);

  // Add text selection listener
  useEffect(() => {

    // Only use mouseup to detect when user finishes selecting
    const handleMouseUp = (event: MouseEvent) => {
      console.log("🖱️ MOUSE UP EVENT");

      // Don't trigger if the mouseup is inside the text selection popup
      const target = event.target as HTMLElement;
      const isInsidePopup = target.closest('[data-text-selection-popup]');
      if (isInsidePopup) {
        console.log("🚫 MOUSE UP INSIDE POPUP - ignoring");
        return;
      }

      // Only handle if the mouseup happened within our PDF container
      if (containerRef.current?.contains(target)) {
        // Delay to ensure selection is complete and stable
        setTimeout(() => {
          const selection = window.getSelection();
          console.log("🔍 CHECKING SELECTION ON MOUSE UP:", {
            selection: selection?.toString(),
            isCollapsed: selection?.isCollapsed,
            rangeCount: selection?.rangeCount,
          });

          // Check if the selection is within our PDF container
          if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectionContainer = range.commonAncestorContainer;
            const isSelectionInPDF = containerRef.current?.contains(
              selectionContainer.nodeType === Node.TEXT_NODE
                ? selectionContainer.parentElement
                : selectionContainer as HTMLElement
            );

            if (isSelectionInPDF && selection.toString().trim().length >= 3) {
              console.log("✅ VALID PDF SELECTION DETECTED");
              handleTextSelection();
            } else {
              console.log("❌ SELECTION NOT IN PDF OR TOO SHORT");
            }
          }
        }, 200); // Longer delay to ensure user has finished selecting
      }
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="flex-1 overflow-auto bg-muted px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            return (
              <div key={pageNum} className="relative">
                {/* Page number indicator */}
                <div className="-top-6 absolute left-0 font-medium text-muted-foreground text-sm">
                  Page {pageNum}
                </div>

                {/* This div is the positioning parent for highlights */}
                <div
                  ref={(el) => {
                    if (el) {
                      const existing = pageRefs.current.get(pageNum);
                      if (existing) {
                        existing.container = el;
                      } else {
                        // We'll set canvas and textLayer when we create them
                        pageRefs.current.set(pageNum, {
                          container: el,
                          canvas: null as any,
                          textLayer: null as any,
                        });
                      }
                    }
                  }}
                  className="relative max-w-full bg-card shadow-lg"
                  style={{
                    lineHeight: "0",
                    margin: "0px",
                    padding: "0px",
                    border: "none",
                  }}
                >
                  <canvas
                    ref={(el) => {
                      if (el) {
                        const existing = pageRefs.current.get(pageNum);
                        if (existing) {
                          existing.canvas = el;
                        } else {
                          pageRefs.current.set(pageNum, {
                            canvas: el,
                            textLayer: null as any,
                            container: null as any,
                          });
                        }
                      }
                    }}
                    className="block h-auto max-w-full"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      display: "block",
                      margin: "0px",
                      padding: "0px",
                      border: "none",
                    }}
                  />
                  {/* Text layer for selection, highlights will be appended here too */}
                  <div
                    ref={(el) => {
                      if (el) {
                        const existing = pageRefs.current.get(pageNum);
                        if (existing) {
                          existing.textLayer = el;
                        } else {
                          pageRefs.current.set(pageNum, {
                            textLayer: el,
                            canvas: null as any,
                            container: null as any,
                          });
                        }
                      }
                    }}
                    className="pointer-events-auto absolute overflow-hidden"
                    style={{
                      userSelect: "text",
                      left: "0px",
                      top: "0px",
                      right: "0px",
                      bottom: "0px",
                      margin: "0px",
                      padding: "0px",
                    }}
                    onMouseUp={(e) => {
                      const selection = window.getSelection();
                      if (selection && selection.toString().trim().length > 0) {
                        // Check if selection is within this textLayer
                        let node = selection.anchorNode;
                        let found = false;
                        while (node) {
                          if (node === e.currentTarget) {
                            found = true;
                            break;
                          }
                          node = node.parentNode;
                        }
                        if (found && typeof (window as any).onPDFTextSelect === 'function') {
                          (window as any).onPDFTextSelect(selection.toString(), pageNum);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text Selection Popup */}
      {textSelection && (
        <TextSelectionPopup
          selectedText={textSelection.text}
          position={textSelection.position}
          onClose={closeTextSelection}
          onSubmitQuestion={handleQuestionSubmit}
          isLoading={explainCompletion.isLoading}
          aiResponse={explainCompletion.completion}
          aiError={explainCompletion.error?.message}
        />
      )}
    </>
  );
}
