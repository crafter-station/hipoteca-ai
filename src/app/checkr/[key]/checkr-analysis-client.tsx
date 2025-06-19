"use client";

import {
  getProcessedContract,
  getProcessedContractByKey,
} from "@/actions/get-processed-contract";
import { TriggerProvider } from "@/components/TriggerProvider";
import { AppSidebarClient } from "@/components/app-sidebar-client";
import { PDFHeader } from "@/components/pdf-viewer";
import PDFViewer from "@/components/pdf-viewer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Contract, ContractHighlight } from "@/models/contract";
import { ContractHighlightType } from "@/models/contract";
import type { HighlightAnnotation, HighlightType } from "@/types/pdf-viewer";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface PDFData {
  name: string;
  url: string;
  key: string;
}

interface CheckrAnalysisClientProps {
  keyParam: string;
  runId: string | null;
  token: string | null;
  contracts: Contract[];
}

// Task progress stages for mortgage processing
const PROGRESS_STAGES = {
  extract_content: "Extrayendo contenido del PDF",
  extract_highlights: "Analizando cláusulas importantes",
  extract_summary: "Generando resumen financiero",
  store_contract_context: "Guardando contexto del contrato",
  completed: "Análisis de hipoteca completado",
};

// Possible run statuses
const STATUS_MAP = {
  WAITING_FOR_DEPLOY: "Esperando despliegue",
  QUEUED: "En cola",
  EXECUTING: "Ejecutando",
  COMPLETED: "Completado",
  FAILED: "Falló",
  CANCELED: "Cancelado",
  REATTEMPTING: "Reintentando",
  CRASHED: "Error crítico",
  TIMED_OUT: "Tiempo agotado",
};

// Mapping from ContractHighlightType to PDF Viewer HighlightType (for colors)
function mapContractHighlightType(
  contractType: ContractHighlightType,
): HighlightType {
  switch (contractType) {
    case ContractHighlightType.LOAN:
    case ContractHighlightType.INTEREST_RATE:
    case ContractHighlightType.MONTHLY_PAYMENT:
    case ContractHighlightType.INITIAL_EXPENSES:
    case ContractHighlightType.COSTS:
    case ContractHighlightType.FEES:
      return "FEE";

    case ContractHighlightType.MORTGAGE_TERM:
    case ContractHighlightType.INSURANCE_COVERAGE:
      return "DUTY_USER";

    case ContractHighlightType.ABUSIVE_CLAUSE:
    case ContractHighlightType.PENALTIES:
      return "ABUSE";

    case ContractHighlightType.FINANCIAL_RISK:
      return "RISK";

    case ContractHighlightType.CONSULT_THE_BANK:
    case ContractHighlightType.NEGOTIABLE_CLAUSE:
    case ContractHighlightType.POSSIBLE_FUTURE_CHANGES:
      return "VAR";

    case ContractHighlightType.UNDISCLOSED_CHARGE_IN_PDF:
      return "RISK";

    default:
      return "TERM";
  }
}

// Mapping from ContractHighlightType to Spanish titles for tooltips
function getContractHighlightTitle(
  contractType: ContractHighlightType,
): string {
  switch (contractType) {
    case ContractHighlightType.LOAN:
      return "Préstamo";
    case ContractHighlightType.INTEREST_RATE:
      return "Tipo de interés";
    case ContractHighlightType.MONTHLY_PAYMENT:
      return "Cuota mensual";
    case ContractHighlightType.INITIAL_EXPENSES:
      return "Gastos iniciales";
    case ContractHighlightType.COSTS:
      return "Costos";
    case ContractHighlightType.FEES:
      return "Comisiones";
    case ContractHighlightType.MORTGAGE_TERM:
      return "Plazo hipotecario";
    case ContractHighlightType.INSURANCE_COVERAGE:
      return "Cobertura de seguro";
    case ContractHighlightType.ABUSIVE_CLAUSE:
      return "Cláusula abusiva";
    case ContractHighlightType.PENALTIES:
      return "Penalizaciones";
    case ContractHighlightType.FINANCIAL_RISK:
      return "Riesgo financiero";
    case ContractHighlightType.CONSULT_THE_BANK:
      return "Consultar al banco";
    case ContractHighlightType.NEGOTIABLE_CLAUSE:
      return "Cláusula negociable";
    case ContractHighlightType.POSSIBLE_FUTURE_CHANGES:
      return "Posibles cambios futuros";
    case ContractHighlightType.UNDISCLOSED_CHARGE_IN_PDF:
      return "Cargo no divulgado en PDF";
    default:
      return "Término técnico";
  }
}

// Convert Contract highlights to PDF Viewer highlights
function convertContractHighlights(
  contractHighlights: ContractHighlight[],
): HighlightAnnotation[] {
  return contractHighlights.map((highlight) => ({
    sentence: highlight.sentence,
    type: mapContractHighlightType(highlight.type),
    tooltip: `${getContractHighlightTitle(highlight.type)}: ${highlight.description}`,
  }));
}

function TaskStatusIcon({ status }: { status: string }) {
  if (status === "COMPLETED") {
    return <CheckCircle className="h-4.5 w-4.5 text-green-600" />;
  }

  if (["FAILED", "CANCELED", "CRASHED", "TIMED_OUT"].includes(status)) {
    return (
      <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-white text-xs">
        <X className="h-3 w-3" />
      </div>
    );
  }

  if (["EXECUTING", "QUEUED", "REATTEMPTING"].includes(status)) {
    return <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />;
  }

  if (status === "PENDING") {
    return (
      <div className="h-4.5 w-4.5 rounded-full border-2 border-muted-foreground/30" />
    );
  }

  return null;
}

// Component with real-time updates (when we have runId and token)
function CheckrAnalysisWithRealtime({
  keyParam,
  runId,
  contracts,
}: {
  keyParam: string;
  runId: string;
  contracts: Contract[];
}) {
  const router = useRouter();
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Use the useRealtimeRun hook for real-time updates with the actual runId
  const { run, error } = useRealtimeRun(runId);

  return (
    <CheckrAnalysisContent
      keyParam={keyParam}
      runId={runId}
      token="temp"
      run={run}
      error={error}
      pdfData={pdfData}
      setPdfData={setPdfData}
      contract={contract}
      setContract={setContract}
      router={router}
      contracts={contracts}
    />
  );
}

// Component without real-time updates (when accessing directly without runId/token)
function CheckrAnalysisStatic({
  keyParam,
  contracts,
}: {
  keyParam: string;
  contracts: Contract[];
}) {
  const router = useRouter();
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Memoize highlights to prevent infinite re-renders - MUST be at top level
  const memoizedHighlights = useMemo(() => {
    return contract ? convertContractHighlights(contract.highlights) : [];
  }, [contract]);

  // PDF viewer state for toolbar functionality
  const [pdfViewerState, setPdfViewerState] = useState<{
    currentPage?: number;
    totalPages?: number;
    scale?: number;
    onPreviousPage?: () => void;
    onNextPage?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onToggleFullscreen?: () => void;
    onToggleSearch?: () => void;
  }>({});

  // Safe callback to update PDF viewer state - wrapped in useCallback to prevent infinite loops
  const handlePDFViewerReady = useCallback(
    (newState: typeof pdfViewerState) => {
      setPdfViewerState(newState);
    },
    [],
  );

  return (
    <CheckrAnalysisContent
      keyParam={keyParam}
      runId={null}
      token={null}
      run={null}
      error={null}
      pdfData={pdfData}
      setPdfData={setPdfData}
      contract={contract}
      setContract={setContract}
      router={router}
      contracts={contracts}
    />
  );
}

// Shared content component
function CheckrAnalysisContent({
  keyParam,
  runId,
  token,
  run,
  error,
  pdfData,
  setPdfData,
  contract,
  setContract,
  router,
  contracts,
}: {
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
}) {
  console.log({ contract });
  const [isLoadingContract, setIsLoadingContract] = useState(!runId); // Start loading if no runId
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Memoize highlights to prevent infinite re-renders - MUST be at top level
  const memoizedHighlights = useMemo(() => {
    return contract ? convertContractHighlights(contract.highlights) : [];
  }, [contract]);

  // PDF viewer state for toolbar functionality
  const [pdfViewerState, setPdfViewerState] = useState<{
    currentPage?: number;
    totalPages?: number;
    scale?: number;
    onPreviousPage?: () => void;
    onNextPage?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onToggleFullscreen?: () => void;
    onToggleSearch?: () => void;
  }>({});

  // Safe callback to update PDF viewer state - wrapped in useCallback to prevent infinite loops
  const handlePDFViewerReady = useCallback(
    (newState: typeof pdfViewerState) => {
      // Only update if state actually changed to prevent infinite loops
      setPdfViewerState((prevState) => {
        // Check if any values actually changed
        const hasChanged =
          prevState.currentPage !== newState.currentPage ||
          prevState.totalPages !== newState.totalPages ||
          prevState.scale !== newState.scale;

        if (hasChanged || !prevState.onPreviousPage) {
          return newState;
        }

        return prevState;
      });
    },
    [],
  );

  // Handle text selection questions
  const handleTextSelectionQuestion = useCallback(
    async (question: string, selectedText: string) => {
      // For now, just log the question - you can integrate with your chat/AI system here
      console.log("Text selection question:", { question, selectedText });

      // You could integrate this with your chat system, for example:
      // - Create a new chat session with the selected text as context
      // - Send the question to your AI service
      // - Show the response in a toast or modal

      // Example integration (uncomment and modify as needed):
      /*
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: selectedText,
          contractId: contract?.id,
        }),
      });
      
      const result = await response.json();
      toast.success("Pregunta enviada exitosamente");
      // Handle the response as needed
    } catch (error) {
      toast.error("Error enviando la pregunta");
    }
    */

      toast.success("Pregunta recibida. Funcionalidad en desarrollo.");
    },
    [],
  );

  // Set PDF data based on key
  useEffect(() => {
    if (keyParam) {
      const pdfUrl = `https://o6dbw19iyd.ufs.sh/f/${keyParam}`;
      setPdfData({
        name: `hipoteca-${keyParam.slice(0, 8)}.pdf`,
        url: pdfUrl,
        key: keyParam,
      });
    }
  }, [keyParam, setPdfData]);

  // If no runId, try to fetch contract directly by key
  useEffect(() => {
    if (!runId && keyParam && !contract && !hasAttemptedLoad) {
      setIsLoadingContract(true);
      setHasAttemptedLoad(true);
      getProcessedContractByKey(keyParam)
        .then((contractData) => {
          if (contractData) {
            setContract(contractData);
            setPdfData((prev) =>
              prev
                ? {
                    ...prev,
                    name: contractData.pdfName,
                  }
                : null,
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching contract by key:", error);
        })
        .finally(() => {
          setIsLoadingContract(false);
        });
    }
  }, [keyParam, runId, contract, hasAttemptedLoad, setContract, setPdfData]);

  // Handle run updates
  useEffect(() => {
    if (!run) return;

    // Show toast notifications for status changes
    if (run.status === "QUEUED") {
      toast.info("⏳ Tarea en cola, esperando procesamiento...", {
        id: "queued",
        duration: 2000,
      });
    }

    if (run.status === "EXECUTING" && run.metadata?.progress) {
      const progressMessages = {
        extract_content: "📄 Extrayendo contenido del PDF...",
        extract_highlights: "🔍 Analizando cláusulas importantes...",
        extract_summary: "📊 Generando resumen financiero...",
        store_contract_context: "💾 Guardando análisis...",
        completed: "✅ Análisis completado",
      };

      const message =
        progressMessages[
          run.metadata.progress as keyof typeof progressMessages
        ];
      if (message) {
        toast.info(message, {
          id: `progress-${run.metadata.progress}`,
          duration: 3000,
        });
      }
    }

    if (run.status === "REATTEMPTING") {
      toast.warning("🔄 Reintentando...", {
        id: "reattempting",
        duration: 2000,
      });
    }

    if (run.status === "CANCELED") {
      toast.error("🚫 Procesamiento cancelado", {
        id: "canceled",
        duration: 4000,
      });
    }

    if (run.status === "FAILED") {
      toast.error("❌ Error procesando el contrato", {
        id: "failed",
        duration: 5000,
      });
    }

    if (run.status === "TIMED_OUT") {
      toast.error("⏰ Procesamiento agotó el tiempo límite", {
        id: "timed_out",
        duration: 5000,
      });
    }

    if (run.status === "CRASHED") {
      toast.error("💥 Error crítico en el procesamiento", {
        id: "crashed",
        duration: 5000,
      });
    }

    if (run.status === "COMPLETED" && run.output?.contractId) {
      toast.success("🎉 ¡Contrato procesado exitosamente!", {
        id: "completed",
        duration: 4000,
      });

      getProcessedContract(run.output.contractId as string)
        .then((contractData) => {
          if (contractData) {
            setContract(contractData);
            setPdfData((prev) =>
              prev
                ? {
                    ...prev,
                    name: contractData.pdfName,
                  }
                : null,
            );
            router.replace(`/checkr/${keyParam}`, { scroll: false });
          }
        })
        .catch((error) => {
          console.error("Error fetching contract:", error);
          toast.error("Error cargando el contrato procesado");
        });
    }
  }, [run, keyParam, router, setContract, setPdfData]);

  // If we have runId but no token, show error
  if (runId && !token) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebarClient contracts={contracts} />
          <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
            <SidebarTrigger variant="outline" />
            <main className="flex flex-1 items-center justify-center p-4">
              <div className="max-w-md space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground text-xl">
                    Error de Configuración
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Faltan parámetros necesarios para el seguimiento en tiempo
                    real
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebarClient contracts={contracts} />
          <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
            <SidebarTrigger variant="outline" />
            <main className="flex flex-1 items-center justify-center p-4">
              <div className="max-w-md space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground text-xl">
                    Error de Conexión
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {error.message}
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // If we have runId but no run data yet, show connecting
  if (runId && !run) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebarClient contracts={contracts} />
          <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
            <SidebarTrigger variant="outline" />
            <main className="flex flex-1 items-center justify-center p-4">
              <div className="max-w-md space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground text-xl">
                    Conectando...
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Estableciendo conexión en tiempo real
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // If no runId and still loading contract, show loading
  if (!runId && isLoadingContract) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebarClient contracts={contracts} />
          <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
            <SidebarTrigger variant="outline" />
            <main className="flex flex-1 items-center justify-center p-4">
              <div className="max-w-md space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground text-xl">
                    Cargando Análisis...
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Buscando el contrato procesado
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // If no runId and no contract found after attempting to load, show not found
  if (!runId && !contract && !isLoadingContract && hasAttemptedLoad) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebarClient contracts={contracts} />
          <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
            <SidebarTrigger variant="outline" />
            <main className="flex flex-1 items-center justify-center p-4">
              <div className="max-w-md space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground text-xl">
                    Contrato No Encontrado
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    El contrato no existe o aún no ha sido procesado
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Determine current status and stage
  const currentStage = (run?.metadata?.progress as string) || null;
  const status = run?.status || (contract ? "COMPLETED" : "PENDING");
  const isCompleted =
    (status === "COMPLETED" && contract) || (!runId && contract);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebarClient contracts={contracts} />

        <div className="flex min-w-0 flex-1 flex-col bg-background">
          {/* Sticky Header with PDF Info */}
          <PDFHeader
            pdfName={pdfData?.name}
            status={status}
            isLoading={isLoadingContract}
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
          />

          <main className="flex-1 overflow-hidden p-2">
            <div className="flex h-full flex-col gap-4">
              {/* Processing Status or PDF Viewer */}
              {isCompleted && pdfData ? (
                <div className="flex-1 overflow-hidden rounded-lg border border-border bg-background">
                  <PDFViewer
                    pdfUrl={pdfData.url}
                    className="h-full w-full"
                    instanceId={`contract-${keyParam}`}
                    highlights={memoizedHighlights}
                    contract={contract}
                    onPDFViewerReady={handlePDFViewerReady}
                    onTextSelectionQuestion={handleTextSelectionQuestion}
                    showMinimap={true}
                  />
                </div>
              ) : status === "FAILED" ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="max-w-md space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground text-xl">
                        Error en el Procesamiento
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        No se pudo procesar el contrato hipotecario
                      </p>
                    </div>
                  </div>
                </div>
              ) : status === "CANCELED" ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="max-w-md space-y-4 text-center">
                    <img
                      src="/x-red-icon.webp"
                      alt="Cancel"
                      className="mx-auto h-24 w-24 dark:brightness-90 dark:contrast-125"
                    />
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground text-xl">
                        Procesamiento Cancelado
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        El análisis del contrato fue cancelado
                      </p>
                    </div>
                  </div>
                </div>
              ) : ["CRASHED", "TIMED_OUT"].includes(status) ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="max-w-md space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground text-xl">
                        {status === "CRASHED"
                          ? "Error Crítico"
                          : "Tiempo Agotado"}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {status === "CRASHED"
                          ? "Ocurrió un error crítico durante el procesamiento"
                          : "El procesamiento excedió el tiempo límite"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 rounded-lg border border-border/50 bg-muted/20 p-6">
                  <div className="flex h-full flex-col items-center justify-center space-y-6">
                    <img
                      src="/clock-blueprint.webp"
                      alt="Clock"
                      className="h-16 w-16 dark:brightness-90 dark:contrast-110 dark:hue-rotate-180"
                    />

                    <div className="text-center">
                      <h3 className="mb-2 font-semibold text-foreground text-xl">
                        Procesando Contrato Hipotecario
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Analizando tu contrato con inteligencia artificial...
                      </p>
                    </div>

                    {runId && (
                      <div className="w-full max-w-md rounded-lg border border-border/50 bg-background/50 p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="font-medium text-muted-foreground text-sm uppercase">
                            Tareas de Procesamiento
                          </h4>
                          {status === "REATTEMPTING" && (
                            <div className="flex items-center gap-1 text-orange-600 text-xs dark:text-orange-400">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Reintentando...
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {Object.entries(PROGRESS_STAGES).map(
                            ([stage, description]) => {
                              // If no currentStage (task in queue, not started, or just started executing), all tasks are pending
                              if (!currentStage || status === "QUEUED") {
                                return (
                                  <div
                                    key={stage}
                                    className="flex items-center justify-between rounded-md bg-muted/50 p-3 text-muted-foreground transition-colors"
                                  >
                                    <div>
                                      <p className="font-medium text-sm">
                                        {description}
                                      </p>
                                      <p className="text-xs opacity-80">
                                        Pendiente
                                      </p>
                                    </div>
                                    <TaskStatusIcon status="PENDING" />
                                  </div>
                                );
                              }

                              const stageKeys = Object.keys(PROGRESS_STAGES);
                              const currentStageIndex =
                                stageKeys.indexOf(currentStage);
                              const thisStageIndex = stageKeys.indexOf(stage);

                              const isCompleted =
                                currentStage === "completed" ||
                                currentStageIndex > thisStageIndex;

                              const isCurrent = currentStage === stage;
                              const isRetrying =
                                isCurrent && status === "REATTEMPTING";

                              const taskStatus = isCompleted
                                ? "COMPLETED"
                                : isCurrent
                                  ? isRetrying
                                    ? "REATTEMPTING"
                                    : "EXECUTING"
                                  : "PENDING";

                              return (
                                <div
                                  key={stage}
                                  className={`flex items-center justify-between rounded-md p-3 transition-colors ${
                                    isCompleted
                                      ? "bg-green-50 text-green-900 dark:bg-green-950/20 dark:text-green-100"
                                      : isCurrent
                                        ? isRetrying
                                          ? "bg-orange-50 text-orange-900 dark:bg-orange-950/20 dark:text-orange-100"
                                          : "bg-blue-50 text-blue-900 dark:bg-blue-950/20 dark:text-blue-100"
                                        : "bg-muted/50 text-muted-foreground"
                                  }`}
                                >
                                  <div>
                                    <p className="font-medium text-sm">
                                      {description}
                                    </p>
                                    <p className="text-xs opacity-80">
                                      {isCompleted
                                        ? "Completado"
                                        : isCurrent
                                          ? isRetrying
                                            ? "Reintentando..."
                                            : "En progreso"
                                          : "Pendiente"}
                                    </p>
                                  </div>
                                  <TaskStatusIcon status={taskStatus} />
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function CheckrAnalysisClient({
  keyParam,
  runId,
  token,
  contracts,
}: CheckrAnalysisClientProps) {
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
