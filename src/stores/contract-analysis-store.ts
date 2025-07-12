import {
  TOAST_DURATIONS,
  TOAST_MESSAGES,
  isFailedStatus,
  isLoadingStatus,
} from "@/lib/checkr/constants";
import type { Contract } from "@/models/contract";
import type {
  PDFData,
  TaskProgressStatus,
  TriggerRun,
} from "@/types/checkr-analysis";
import { toast } from "sonner";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface PDFViewerState {
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

interface ContractAnalysisState {
  // Core state
  keyParam: string | null;
  runId: string | null;
  token: string | null;

  // Data state
  pdfData: PDFData | null;
  contract: Contract | null;
  contracts: Contract[];

  // UI state
  isLoadingContract: boolean;
  hasAttemptedLoad: boolean;
  isChatOpen: boolean;
  pdfViewerState: PDFViewerState;

  // Error state
  error: Error | null;

  // Run state (from Trigger.dev)
  run: TriggerRun | null;

  // Actions
  setKeyParam: (keyParam: string) => void;
  setRunData: (runId: string | null, token: string | null) => void;
  setPDFData: (pdfData: PDFData | null) => void;
  setContract: (contract: Contract | null) => void;
  setContracts: (contracts: Contract[]) => void;
  setIsLoadingContract: (loading: boolean) => void;
  setHasAttemptedLoad: (attempted: boolean) => void;
  setError: (error: Error | null) => void;
  setRun: (run: TriggerRun | null) => void;

  // UI actions
  toggleChat: () => void;
  updatePDFViewerState: (state: Partial<PDFViewerState>) => void;

  // Computed getters
  getTaskProgressStatus: () => TaskProgressStatus;
  getPDFUrl: () => string | null;

  // Business logic actions
  initializeForKey: (
    keyParam: string,
    runId?: string | null,
    token?: string | null,
  ) => void;
  handleRunUpdate: (run: TriggerRun) => void;
  handleTextSelectionQuestion: (
    question: string,
    selectedText: string,
  ) => Promise<void>;
  reset: () => void;
}

const initialState = {
  keyParam: null,
  runId: null,
  token: null,
  pdfData: null,
  contract: null,
  contracts: [],
  isLoadingContract: false,
  hasAttemptedLoad: false,
  isChatOpen: false,
  pdfViewerState: {},
  error: null,
  run: null,
};

export const contractAnalysisStore = create<ContractAnalysisState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Basic setters
    setKeyParam: (keyParam) => set({ keyParam }),
    setRunData: (runId, token) => set({ runId, token }),
    setPDFData: (pdfData) => set({ pdfData }),
    setContract: (contract) => set({ contract }),
    setContracts: (contracts) => set({ contracts }),
    setIsLoadingContract: (isLoadingContract) => set({ isLoadingContract }),
    setHasAttemptedLoad: (hasAttemptedLoad) => set({ hasAttemptedLoad }),
    setError: (error) => set({ error }),
    setRun: (run) => set({ run }),

    // UI actions
    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

    updatePDFViewerState: (newState) =>
      set((state) => ({
        pdfViewerState: { ...state.pdfViewerState, ...newState },
      })),

    // Computed getters
    getTaskProgressStatus: (): TaskProgressStatus => {
      const { run, contract, runId } = get();
      const currentStage = (run?.metadata?.progress as string) || null;
      const status = run?.status || (contract ? "COMPLETED" : "PENDING");
      const isCompleted = Boolean(
        (status === "COMPLETED" && contract) || (!runId && contract),
      );
      const isLoading = isLoadingStatus(status);
      const hasError = isFailedStatus(status);

      return {
        stage: currentStage,
        status,
        isCompleted,
        isLoading,
        hasError,
      };
    },

    getPDFUrl: (): string | null => {
      const { keyParam } = get();
      return keyParam ? `https://o6dbw19iyd.ufs.sh/f/${keyParam}` : null;
    },

    // Business logic actions
    initializeForKey: (keyParam, runId = null, token = null) => {
      const pdfUrl = `https://o6dbw19iyd.ufs.sh/f/${keyParam}`;
      const pdfData: PDFData = {
        name: `hipoteca-${keyParam.slice(0, 8)}.pdf`,
        url: pdfUrl,
        key: keyParam,
      };

      set({
        keyParam,
        runId,
        token,
        pdfData,
        isLoadingContract: !runId, // Start loading if no runId
        hasAttemptedLoad: false,
        contract: null,
        error: null,
        run: null,
      });
    },

    handleRunUpdate: (run) => {
      if (!run) return;

      const { status, metadata } = run;
      set({ run });

      // Show toast notifications for status changes
      if (status === "QUEUED") {
        toast.info(TOAST_MESSAGES.QUEUED, {
          id: "queued",
          duration: TOAST_DURATIONS.SHORT,
        });
      }

      if (status === "EXECUTING" && metadata?.progress) {
        const progressKey = metadata.progress as keyof typeof TOAST_MESSAGES;
        const message =
          TOAST_MESSAGES[progressKey as keyof typeof TOAST_MESSAGES];

        if (message) {
          toast.info(message, {
            id: `progress-${metadata.progress}`,
            duration: TOAST_DURATIONS.MEDIUM,
          });
        }
      }

      if (status === "REATTEMPTING") {
        toast.warning(TOAST_MESSAGES.REATTEMPTING, {
          id: "reattempting",
          duration: TOAST_DURATIONS.SHORT,
        });
      }

      if (status === "CANCELED") {
        toast.error(TOAST_MESSAGES.CANCELED, {
          id: "canceled",
          duration: TOAST_DURATIONS.LONG,
        });
      }

      if (status === "FAILED") {
        toast.error(TOAST_MESSAGES.FAILED, {
          id: "failed",
          duration: TOAST_DURATIONS.EXTENDED,
        });
      }

      if (status === "TIMED_OUT") {
        toast.error(TOAST_MESSAGES.TIMED_OUT, {
          id: "timed_out",
          duration: TOAST_DURATIONS.EXTENDED,
        });
      }

      if (status === "CRASHED") {
        toast.error(TOAST_MESSAGES.CRASHED, {
          id: "crashed",
          duration: TOAST_DURATIONS.EXTENDED,
        });
      }

      if (status === "COMPLETED" && run.output?.contractId) {
        toast.success(TOAST_MESSAGES.COMPLETED, {
          id: "completed",
          duration: TOAST_DURATIONS.LONG,
        });
      }
    },

    handleTextSelectionQuestion: async (
      question: string,
      selectedText: string,
    ) => {
      console.log("Text selection question:", { question, selectedText });
      toast.success("Pregunta recibida. Funcionalidad en desarrollo.");
    },

    reset: () => set(initialState),
  })),
);

// Export the hook
export const useContractAnalysisStore = contractAnalysisStore;

// Individual selectors for better performance and avoiding re-renders
export const useContract = () =>
  contractAnalysisStore((state) => state.contract);
export const usePDFData = () => contractAnalysisStore((state) => state.pdfData);
export const useIsLoadingContract = () =>
  contractAnalysisStore((state) => state.isLoadingContract);
export const useHasAttemptedLoad = () =>
  contractAnalysisStore((state) => state.hasAttemptedLoad);
export const useIsChatOpen = () =>
  contractAnalysisStore((state) => state.isChatOpen);
export const usePDFViewerState = () =>
  contractAnalysisStore((state) => state.pdfViewerState);
export const useToggleChat = () =>
  contractAnalysisStore((state) => state.toggleChat);
export const useUpdatePDFViewerState = () =>
  contractAnalysisStore((state) => state.updatePDFViewerState);
export const useRun = () => contractAnalysisStore((state) => state.run);
export const useError = () => contractAnalysisStore((state) => state.error);
export const useGetTaskProgressStatus = () =>
  contractAnalysisStore((state) => state.getTaskProgressStatus);
export const useHandleTextSelectionQuestion = () =>
  contractAnalysisStore((state) => state.handleTextSelectionQuestion);
