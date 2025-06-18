export interface SearchResult {
  pageNum: number;
  textIndex: number;
  text: string;
  context: string;
  position: { x: number; y: number; width: number; height: number };
}

export interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
  fuzzy: boolean;
  fuzzyThreshold: number;
}

export type SearchMode = "exact" | "contains" | "regex" | "fuzzy" | "wholeWord";

export interface PDFDocumentData {
  numPages: number;
  pages: Array<{
    pageNumber: number;
    textContent: string;
    viewport: { width: number; height: number };
  }>;
  title?: string;
}

export interface PDFViewerProps {
  pdfData?: ArrayBuffer;
  pdfUrl?: string;
  className?: string;
  instanceId?: string;
  highlights?: HighlightAnnotation[];
  // Toolbar functions for external header
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleFullscreen?: () => void;
  onToggleSearch?: () => void;
  // PDF state for external header
  currentPage?: number;
  totalPages?: number;
  scale?: number;
  // Callback to expose PDF viewer functions
  onPDFViewerReady?: (viewerState: {
    currentPage: number;
    totalPages: number;
    scale: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleFullscreen: () => void;
    onToggleSearch: () => void;
  }) => void;
  // Minimap control
  showMinimap?: boolean;
  // Minimap navigation callback
  onMinimapNavigation?: (scrollPercentage: number) => void;
  // Text selection callback
  onTextSelectionQuestion?: (
    question: string,
    selectedText: string,
  ) => Promise<void>;
}

export interface TextMatch {
  start: number;
  end: number;
  text: string;
}

export interface SpanMatch {
  textNode: Text;
  startOffsetInNode: number;
  endOffsetInNode: number;
}

export interface TooltipData {
  matchText: string;
  context: string;
  resultIndex: number;
  totalResults: number;
  annotationType?: HighlightType;
}

export interface HighlightRect extends DOMRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface PDFViewerState {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  pdf: any | null;
  currentPage: number;
  totalPages: number;
  scale: number;
  loading: boolean;
  error: string | null;
  isFullscreen: boolean;
}

export interface SearchState {
  showSearch: boolean;
  searchTerm: string;
  searchMode: SearchMode;
  searchResults: SearchResult[];
  currentResultIndex: number;
  isSearching: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  pageTexts: Map<number, any>;
}

export interface TooltipState {
  tooltipContent: Map<string, TooltipData>;
  highlightRects: Map<number | string, HighlightRect[]>;
}

export interface HighlightAnnotation {
  sentence: string;
  type: HighlightType;
  tooltip: string;
}

export interface TemporaryHighlight {
  text: string;
  range: Range;
  id: string;
}

export interface TextSelectionData {
  text: string;
  position: { x: number; y: number };
  range?: Range;
}

// Import the shared type from constants
import type { HighlightType } from "@/lib/constants/legend-items";
export type { HighlightType };
