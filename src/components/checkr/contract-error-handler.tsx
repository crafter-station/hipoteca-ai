"use client";

import { CheckrLayout } from "@/components/checkr/checkr-layout";
import {
  CanceledDisplay,
  ConnectingDisplay,
  ErrorDisplay,
  LoadingDisplay,
} from "@/components/checkr/error-display";
import type { Contract } from "@/models/contract";
import type {
  ErrorState,
  TaskProgressStatus,
  TriggerRun,
} from "@/types/checkr-analysis";

interface ContractErrorHandlerProps {
  contracts: Contract[];
  error: Error | null;
  run: TriggerRun | null;
  taskProgressStatus: TaskProgressStatus;
  isLoadingContract: boolean;
  hasAttemptedLoad: boolean;
  contract: Contract | null;
  children: React.ReactNode;
}

export function ContractErrorHandler({
  contracts,
  error,
  run,
  taskProgressStatus,
  isLoadingContract,
  hasAttemptedLoad,
  contract,
  children,
}: ContractErrorHandlerProps) {
  // Error state handling
  if (error) {
    const errorState: ErrorState = {
      type: "connection",
      title: "Error de Conexión",
      message: error.message,
    };

    return (
      <CheckrLayout contracts={contracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  // If we have runId but no run data yet, show connecting
  if (run === null && taskProgressStatus.status !== "COMPLETED") {
    return (
      <CheckrLayout contracts={contracts}>
        <ConnectingDisplay />
      </CheckrLayout>
    );
  }

  // If no runId and still loading contract, show loading
  if (!run && isLoadingContract) {
    return (
      <CheckrLayout contracts={contracts}>
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
      <CheckrLayout contracts={contracts}>
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
      <CheckrLayout contracts={contracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  if (taskProgressStatus.status === "CANCELED") {
    return (
      <CheckrLayout contracts={contracts}>
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
      <CheckrLayout contracts={contracts}>
        <ErrorDisplay errorState={errorState} />
      </CheckrLayout>
    );
  }

  // No errors, render children
  return <>{children}</>;
}
