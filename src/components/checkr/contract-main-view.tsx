"use client";

import { AppSidebarClient } from "@/components/app-sidebar-client";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ProcessingDisplay } from "@/components/checkr/processing-display";
import { PDFHeader } from "@/components/pdf-viewer";
import PDFViewer from "@/components/pdf-viewer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { convertContractHighlights } from "@/lib/checkr/highlight-utils";
import type { Contract } from "@/models/contract";
import {
  useContract,
  useGetTaskProgressStatus,
  useIsChatOpen,
  usePDFData,
  usePDFViewerState,
  useRun,
  useToggleChat,
  useUpdatePDFViewerState,
} from "@/stores/contract-analysis-store";
import type { PDFViewerState } from "@/types/checkr-analysis";

interface ContractMainViewProps {
  keyParam: string;
  contracts: Contract[];
  onTextSelectionQuestion: (
    question: string,
    selectedText: string,
  ) => Promise<void>;
  onPDFViewerReady: (state: PDFViewerState) => void;
}

export function ContractMainView({
  keyParam,
  contracts,
  onTextSelectionQuestion,
  onPDFViewerReady,
}: ContractMainViewProps) {
  const contract = useContract();
  const pdfData = usePDFData();
  const isChatOpen = useIsChatOpen();
  const pdfViewerState = usePDFViewerState();
  const toggleChat = useToggleChat();
  const updatePDFViewerState = useUpdatePDFViewerState();
  const run = useRun();
  const getTaskProgressStatus = useGetTaskProgressStatus();

  const taskProgressStatus = getTaskProgressStatus();

  // Memoized highlights to prevent infinite re-renders
  const highlights = contract
    ? convertContractHighlights(contract.highlights)
    : [];

  const handlePDFViewerReady = (newState: PDFViewerState) => {
    updatePDFViewerState(newState);
    onPDFViewerReady(newState);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebarClient contracts={contracts} />

        <div className="flex min-w-0 flex-1 flex-col bg-ui-base">
          {/* Sticky Header with PDF Info */}
          <PDFHeader
            pdfName={pdfData?.name}
            status={taskProgressStatus.status}
            isLoading={false}
            // Toolbar props
            contract={contract}
            currentPage={pdfViewerState.currentPage}
            totalPages={pdfViewerState.totalPages}
            scale={pdfViewerState.scale}
            onPreviousPage={pdfViewerState.onPreviousPage}
            onNextPage={pdfViewerState.onNextPage}
            onZoomIn={pdfViewerState.onZoomIn}
            onZoomOut={pdfViewerState.onZoomOut}
            onToggleFullscreen={pdfViewerState.onToggleFullscreen}
            onToggleSearch={pdfViewerState.onToggleSearch}
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
                      highlights={highlights}
                      contract={contract || undefined}
                      onPDFViewerReady={handlePDFViewerReady}
                      onTextSelectionQuestion={onTextSelectionQuestion}
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
