"use client";

import { TriggerProvider } from "@/components/TriggerProvider";
import { AppSidebarClient } from "@/components/app-sidebar-client";
import { ChatSidebar } from "@/components/chat-sidebar";
import { CheckrLayout } from "@/components/checkr/checkr-layout";
import {
  CanceledDisplay,
  ConnectingDisplay,
  ErrorDisplay,
  LoadingDisplay,
} from "@/components/checkr/error-display";
import { ProcessingDisplay } from "@/components/checkr/processing-display";
import { PDFHeader } from "@/components/pdf-viewer";
import PDFViewer from "@/components/pdf-viewer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useContractAnalysis } from "@/hooks/use-contract-analysis";
import type {
  CheckrAnalysisClientProps,
  ErrorState,
} from "@/types/checkr-analysis";
import { useMemo } from "react";

/**
 * Component with real-time updates (when we have runId and token)
 */
function CheckrAnalysisWithRealtime({
  keyParam,
  runId,
  contracts,
}: {
  keyParam: string;
  runId: string;
  contracts: CheckrAnalysisClientProps["contracts"];
}) {
  const analysisState = useContractAnalysis({
    keyParam,
    runId,
    token: "temp", // Will be handled by TriggerProvider
    contracts,
  });

  return (
    <CheckrAnalysisContent
      keyParam={keyParam}
      analysisState={analysisState}
      contracts={contracts}
    />
  );
}

/**
 * Component without real-time updates (when accessing directly without runId/token)
 */
function CheckrAnalysisStatic({
  keyParam,
  contracts,
}: {
  keyParam: string;
  contracts: CheckrAnalysisClientProps["contracts"];
}) {
  const analysisState = useContractAnalysis({
    keyParam,
    runId: null,
    token: null,
    contracts,
  });

  return (
    <CheckrAnalysisContent
      keyParam={keyParam}
      analysisState={analysisState}
      contracts={contracts}
    />
  );
}

/**
 * Shared content component
 */
function CheckrAnalysisContent({
  keyParam,
  analysisState,
  contracts,
}: {
  keyParam: string;
  analysisState: ReturnType<typeof useContractAnalysis>;
  contracts: CheckrAnalysisClientProps["contracts"];
}) {
  const {
    pdfData,
    contract,
    isLoadingContract,
    hasAttemptedLoad,
    isChatOpen,
    memoizedHighlights,
    taskProgressStatus,
    run,
    error,
    handleTextSelectionQuestion,
    handlePDFViewerReady,
    toggleChat,
  } = analysisState;

  // Memoize contracts to prevent unnecessary re-renders
  const memoizedContracts = useMemo(() => contracts, [contracts]);

  // Error state handling
  if (error) {
    const errorState: ErrorState = {
      type: "connection",
      title: "Error de Conexión",
      message: error.message,
    };

    return (
      <CheckrLayout contracts={memoizedContracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  // If we have runId but no run data yet, show connecting
  if (run === null && taskProgressStatus.status !== "COMPLETED") {
    return (
      <CheckrLayout contracts={memoizedContracts}>
        <ConnectingDisplay />
      </CheckrLayout>
    );
  }

  // If no runId and still loading contract, show loading
  if (!run && isLoadingContract) {
    return (
      <CheckrLayout contracts={memoizedContracts}>
        <LoadingDisplay />
      </CheckrLayout>
    );
  }

  // If no runId and no contract found after attempting to load, show not found
  if (!run && !contract && !isLoadingContract && hasAttemptedLoad) {
    const errorState: ErrorState = {
      type: "not-found",
      title: "Contrato No Encontrado",
      message: "El contrato no existe o aún no ha sido procesado",
    };

    return (
      <CheckrLayout contracts={memoizedContracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  // Handle different error states
  if (taskProgressStatus.status === "FAILED") {
    const errorState: ErrorState = {
      type: "processing",
      title: "Error en el Procesamiento",
      message: "No se pudo procesar el contrato hipotecario",
    };

    return (
      <CheckrLayout contracts={memoizedContracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  if (taskProgressStatus.status === "CANCELED") {
    return (
      <CheckrLayout contracts={memoizedContracts}>
        <CanceledDisplay />
      </CheckrLayout>
    );
  }

  if (["CRASHED", "TIMED_OUT"].includes(taskProgressStatus.status)) {
    const errorState: ErrorState = {
      type: "critical",
      title:
        taskProgressStatus.status === "CRASHED"
          ? "Error Crítico"
          : "Tiempo Agotado",
      message:
        taskProgressStatus.status === "CRASHED"
          ? "Ocurrió un error crítico durante el procesamiento"
          : "El procesamiento excedió el tiempo límite",
    };

    return (
      <CheckrLayout contracts={memoizedContracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  // Main application layout
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebarClient contracts={memoizedContracts} />
        <div className="flex min-w-0 flex-1 flex-col bg-ui-base">
          {/* Sticky Header with PDF Info */}
          <PDFHeader
            pdfName={pdfData?.name}
            status={taskProgressStatus.status}
            isLoading={isLoadingContract}
            // Toolbar props
            contract={contract}
            currentPage={analysisState.pdfViewerState.currentPage}
            totalPages={analysisState.pdfViewerState.totalPages}
            scale={analysisState.pdfViewerState.scale}
            onPreviousPage={analysisState.pdfViewerState.onPreviousPage}
            onNextPage={analysisState.pdfViewerState.onNextPage}
            onZoomIn={analysisState.pdfViewerState.onZoomIn}
            onZoomOut={analysisState.pdfViewerState.onZoomOut}
            onToggleFullscreen={analysisState.pdfViewerState.onToggleFullscreen}
            onToggleSearch={analysisState.pdfViewerState.onToggleSearch}
            onToggleChat={toggleChat}
            isChatOpen={isChatOpen}
          />

          <main className="flex-1 overflow-hidden p-2">
            <div className="flex h-full gap-2">
              <div className="flex flex-1 flex-col gap-4">
                {/* Processing Status or PDF Viewer */}
                {taskProgressStatus.isCompleted && pdfData ? (
                  <div className="flex-1 overflow-hidden rounded-lg border border-border-base bg-ui-base">
                    <PDFViewer
                      pdfUrl={pdfData.url}
                      className="h-full w-full"
                      instanceId={`contract-${keyParam}`}
                      highlights={memoizedHighlights}
                      onPDFViewerReady={handlePDFViewerReady}
                      onTextSelectionQuestion={handleTextSelectionQuestion}
                      showMinimap={true}
                      isMinimapCompact={isChatOpen}
                    />
                  </div>
                ) : (
                  <ProcessingDisplay
                    currentStage={taskProgressStatus.stage}
                    status={taskProgressStatus.status}
                    runId={run?.id || ""}
                  />
                )}
              </div>

              {/* Chat Sidebar */}
              <ChatSidebar isOpen={isChatOpen} onToggle={toggleChat} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/**
 * Main component with proper provider wrapping
 */
export function CheckrAnalysisClientRefactored({
  keyParam,
  runId,
  token,
  contracts,
}: CheckrAnalysisClientProps) {
  // If we have runId but no token, show error
  if (runId && !token) {
    const errorState: ErrorState = {
      type: "missing-token",
      title: "Error de Configuración",
      message:
        "Faltan parámetros necesarios para el seguimiento en tiempo real",
    };

    return (
      <CheckrLayout contracts={contracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  // If we have a token and runId, wrap with TriggerProvider for real-time updates
  if (token && runId) {
    return (
      <TriggerProvider accessToken={token}>
        <CheckrAnalysisWithRealtime
          keyParam={keyParam}
          runId={runId}
          contracts={contracts}
        />
      </TriggerProvider>
    );
  }

  // No token or runId - render without TriggerProvider (direct contract access mode)
  return <CheckrAnalysisStatic keyParam={keyParam} contracts={contracts} />;
}
