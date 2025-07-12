import { ERROR_MESSAGES } from "@/lib/checkr/constants";
import type { ErrorState } from "@/types/checkr-analysis";
import { AlertCircle, Loader2 } from "lucide-react";

interface ErrorDisplayProps {
  errorState: ErrorState;
}

export function ErrorDisplay({ errorState }: ErrorDisplayProps) {
  const getErrorContent = () => {
    switch (errorState.type) {
      case "missing-token":
        return {
          icon: <AlertCircle className="h-8 w-8 text-error-base" />,
          title: "Error de Configuración",
          message: ERROR_MESSAGES.MISSING_TOKEN,
          bgClass: "from-error-subtle to-error-soft",
        };

      case "connection":
        return {
          icon: <AlertCircle className="h-8 w-8 text-error-base" />,
          title: "Error de Conexión",
          message: errorState.message,
          bgClass: "from-error-subtle to-error-soft",
        };

      case "processing":
        return {
          icon: <AlertCircle className="h-8 w-8 text-error-base" />,
          title: "Error en el Procesamiento",
          message: ERROR_MESSAGES.PROCESSING_FAILED,
          bgClass: "from-error-subtle to-error-soft",
        };

      case "not-found":
        return {
          icon: <AlertCircle className="h-8 w-8 text-error-base" />,
          title: "Contrato No Encontrado",
          message: ERROR_MESSAGES.CONTRACT_NOT_EXISTS,
          bgClass: "from-error-subtle to-error-soft",
        };

      case "critical":
        return {
          icon: <AlertCircle className="h-8 w-8 text-error-base" />,
          title: errorState.title,
          message: errorState.message,
          bgClass: "from-error-subtle to-error-soft",
        };

      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-error-base" />,
          title: "Error Desconocido",
          message: "Ha ocurrido un error inesperado",
          bgClass: "from-error-subtle to-error-soft",
        };
    }
  };

  const { icon, title, message, bgClass } = getErrorContent();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${bgClass}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-text-base text-xl">{title}</h3>
          <p className="text-sm text-text-soft">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface ConnectingDisplayProps {
  message?: string;
}

export function ConnectingDisplay({
  message = "Estableciendo conexión en tiempo real",
}: ConnectingDisplayProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-info-subtle to-info-soft">
          <Loader2 className="h-8 w-8 animate-spin text-info-base" />
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-text-base text-xl">
            Conectando...
          </h3>
          <p className="text-sm text-text-soft">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface LoadingDisplayProps {
  message?: string;
}

export function LoadingDisplay({
  message = "Buscando el contrato procesado",
}: LoadingDisplayProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-info-subtle to-info-soft">
          <Loader2 className="h-8 w-8 animate-spin text-info-base" />
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-text-base text-xl">
            Cargando Análisis...
          </h3>
          <p className="text-sm text-text-soft">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface CanceledDisplayProps {
  message?: string;
}

export function CanceledDisplay({
  message = "El análisis del contrato fue cancelado",
}: CanceledDisplayProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <img
          src="/x-red-icon.webp"
          alt="Cancel"
          className="mx-auto h-24 w-24"
        />
        <div>
          <h3 className="mb-2 font-semibold text-text-base text-xl">
            Procesamiento Cancelado
          </h3>
          <p className="text-sm text-text-soft">{message}</p>
        </div>
      </div>
    </div>
  );
}
