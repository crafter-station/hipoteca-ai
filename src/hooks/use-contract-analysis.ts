import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  getProcessedContract,
  getProcessedContractByKey,
} from "@/actions/get-processed-contract";
import {
  PROGRESS_MESSAGES,
  TOAST_DURATIONS,
  TOAST_MESSAGES,
  isFailedStatus,
  isLoadingStatus,
} from "@/lib/checkr/constants";
import { convertContractHighlights } from "@/lib/checkr/highlight-utils";
import type { Contract } from "@/models/contract";
import type {
  ContractAnalysisState,
  PDFViewerReadyHandler,
  TaskProgressStatus,
  TextSelectionHandler,
} from "@/types/checkr-analysis";

interface UseContractAnalysisProps {
  keyParam: string;
  runId: string | null;
  token: string | null;
  contracts: Contract[];
}

export function useContractAnalysis({
  keyParam,
  runId,
  token,
  contracts,
}: UseContractAnalysisProps) {
  const router = useRouter();

  // State management
  const [state, setState] = useState<ContractAnalysisState>({
    pdfData: null,
    contract: null,
    isLoadingContract: !runId, // Start loading if no runId
    hasAttemptedLoad: false,
    isChatOpen: false,
    pdfViewerState: {},
  });

  // Use refs to track loading state to avoid dependency cycles
  const loadingInitiatedRef = useRef(false);

  // Real-time run hook (only if we have runId)
  const { run, error } = useRealtimeRun(runId || "", {
    enabled: !!runId,
  });

  // Memoized highlights to prevent infinite re-renders
  const memoizedHighlights = useMemo(() => {
    return state.contract
      ? convertContractHighlights(state.contract.highlights)
      : [];
  }, [state.contract]);

  // Task progress status
  const taskProgressStatus = useMemo<TaskProgressStatus>(() => {
    const currentStage = (run?.metadata?.progress as string) || null;
    const status = run?.status || (state.contract ? "COMPLETED" : "PENDING");
    const isCompleted = Boolean(
      (status === "COMPLETED" && state.contract) || (!runId && state.contract),
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
  }, [run, state.contract, runId]);

  // Handle text selection questions
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleTextSelectionQuestion = useCallback<TextSelectionHandler>(
    async (question: string, selectedText: string) => {
      // Log the question for now - can be integrated with chat system later
      console.log("Text selection question:", { question, selectedText });

      // TODO: Integrate with chat system
      // Example integration:
      // try {
      //   const response = await fetch('/api/chat', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       question,
      //       context: selectedText,
      //       contractId: state.contract?.id,
      //     }),
      //   });
      //   const result = await response.json();
      //   toast.success("Pregunta enviada exitosamente");
      // } catch (error) {
      //   toast.error("Error enviando la pregunta");
      // }

      toast.success("Pregunta recibida. Funcionalidad en desarrollo.");
    },
    [state.contract],
  );

  // Handle PDF viewer ready callback
  const handlePDFViewerReady = useCallback<PDFViewerReadyHandler>(
    (newState) => {
      setState((prevState) => ({
        ...prevState,
        pdfViewerState: {
          ...prevState.pdfViewerState,
          ...newState,
        },
      }));
    },
    [],
  );

  // Toggle chat panel
  const toggleChat = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isChatOpen: !prevState.isChatOpen,
    }));
  }, []);

  // Set PDF data based on key
  useEffect(() => {
    if (keyParam) {
      // Reset loading flag when keyParam changes
      loadingInitiatedRef.current = false;

      const pdfUrl = `https://o6dbw19iyd.ufs.sh/f/${keyParam}`;
      setState((prevState) => ({
        ...prevState,
        pdfData: {
          name: `hipoteca-${keyParam.slice(0, 8)}.pdf`,
          url: pdfUrl,
          key: keyParam,
        },
      }));
    }
  }, [keyParam]);

  // If no runId, try to fetch contract directly by key
  useEffect(() => {
    if (!runId && keyParam && !loadingInitiatedRef.current) {
      loadingInitiatedRef.current = true;

      setState((prevState) => ({
        ...prevState,
        isLoadingContract: true,
        hasAttemptedLoad: true,
      }));

      getProcessedContractByKey(keyParam)
        .then((contractData) => {
          if (contractData) {
            setState((prevState) => ({
              ...prevState,
              contract: contractData,
              pdfData: prevState.pdfData
                ? {
                    ...prevState.pdfData,
                    name: contractData.pdfName,
                  }
                : null,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching contract by key:", error);
        })
        .finally(() => {
          setState((prevState) => ({
            ...prevState,
            isLoadingContract: false,
          }));
        });
    }
  }, [keyParam, runId]);

  // Handle run updates and show toast notifications
  useEffect(() => {
    if (!run) return;

    const { status, metadata } = run;

    // Show toast notifications for status changes
    if (status === "QUEUED") {
      toast.info(TOAST_MESSAGES.QUEUED, {
        id: "queued",
        duration: TOAST_DURATIONS.SHORT,
      });
    }

    if (status === "EXECUTING" && metadata?.progress) {
      const progressKey = metadata.progress as keyof typeof PROGRESS_MESSAGES;
      const message = PROGRESS_MESSAGES[progressKey];

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

      getProcessedContract(run.output.contractId as string)
        .then((contractData) => {
          if (contractData) {
            setState((prevState) => ({
              ...prevState,
              contract: contractData,
              pdfData: prevState.pdfData
                ? {
                    ...prevState.pdfData,
                    name: contractData.pdfName,
                  }
                : null,
            }));
            router.replace(`/checkr/${keyParam}`, { scroll: false });
          }
        })
        .catch((error) => {
          console.error("Error fetching contract:", error);
          toast.error("Error cargando el contrato procesado");
        });
    }
  }, [run, keyParam, router]);

  // Memoize the return value to prevent infinite re-renders
  return useMemo(
    () => ({
      // State
      pdfData: state.pdfData,
      contract: state.contract,
      isLoadingContract: state.isLoadingContract,
      hasAttemptedLoad: state.hasAttemptedLoad,
      isChatOpen: state.isChatOpen,
      pdfViewerState: state.pdfViewerState,

      // Computed state
      memoizedHighlights,
      taskProgressStatus,

      // Real-time data
      run,
      error,

      // Handlers
      handleTextSelectionQuestion,
      handlePDFViewerReady,
      toggleChat,
    }),
    [
      state.pdfData,
      state.contract,
      state.isLoadingContract,
      state.hasAttemptedLoad,
      state.isChatOpen,
      state.pdfViewerState,
      memoizedHighlights,
      taskProgressStatus,
      run,
      error,
      handleTextSelectionQuestion,
      handlePDFViewerReady,
      toggleChat,
    ],
  );
}
