import type { Contract } from "@/models/contract";
import type { useRealtimeRun } from "@trigger.dev/react-hooks";
import type { useRouter } from "next/navigation";

/**
 * Trigger.dev run interface
 */
export interface TriggerRun {
  id: string;
  status: string;
  metadata?: Record<string, unknown>;
  output?: Record<string, unknown>;
}

/**
 * PDF data structure for contract analysis
 */
export interface PDFData {
  name: string;
  url: string;
  key: string;
}

/**
 * Props for the main CheckrAnalysisClient component
 */
export interface CheckrAnalysisClientProps {
  keyParam: string;
  runId: string | null;
  token: string | null;
  contracts: Contract[];
}

/**
 * PDF viewer state interface
 */
export interface PDFViewerState {
  currentPage?: number;
  totalPages?: number;
  scale?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleFullscreen?: () => void;
  onToggleSearch?: () => void;
}

/**
 * Contract analysis state interface
 */
export interface ContractAnalysisState {
  pdfData: PDFData | null;
  contract: Contract | null;
  isLoadingContract: boolean;
  hasAttemptedLoad: boolean;
  isChatOpen: boolean;
  pdfViewerState: PDFViewerState;
}

/**
 * Props for the shared content component
 */
export interface CheckrAnalysisContentProps {
  keyParam: string;
  runId: string | null;
  token: string | null;
  run: ReturnType<typeof useRealtimeRun>["run"] | null;
  error: ReturnType<typeof useRealtimeRun>["error"] | null;
  pdfData: PDFData | null;
  setPdfData: React.Dispatch<React.SetStateAction<PDFData | null>>;
  contract: Contract | null;
  setContract: React.Dispatch<React.SetStateAction<Contract | null>>;
  router: ReturnType<typeof useRouter>;
  contracts: Contract[];
}

/**
 * Status configuration for task progress
 */
export interface TaskProgressStatus {
  stage: string | null;
  status: string;
  isCompleted: boolean;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Error state interface
 */
export interface ErrorState {
  type:
    | "missing-token"
    | "connection"
    | "processing"
    | "not-found"
    | "critical";
  message: string;
  title: string;
}

/**
 * Text selection handler type
 */
export type TextSelectionHandler = (
  question: string,
  selectedText: string,
) => Promise<void>;

/**
 * PDF viewer ready handler type
 */
export type PDFViewerReadyHandler = (state: PDFViewerState) => void;
