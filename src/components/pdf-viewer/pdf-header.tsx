"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { FileText, Loader2 } from "lucide-react";

interface PDFHeaderProps {
  pdfName?: string;
  status: string;
  isLoading?: boolean;
}

// Status mapping for display
const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completado",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "text-green-600 dark:text-green-400",
  },
  EXECUTING: {
    label: "Ejecutando",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  QUEUED: {
    label: "En cola",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
  REATTEMPTING: {
    label: "Reintentando",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-300",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  FAILED: {
    label: "Error",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    iconColor: "text-red-600 dark:text-red-400",
  },
  CRASHED: {
    label: "Error crítico",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    iconColor: "text-red-600 dark:text-red-400",
  },
  CANCELED: {
    label: "Cancelado",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-300",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  TIMED_OUT: {
    label: "Tiempo agotado",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
} as const;

const DEFAULT_STATUS = {
  label: "Procesando",
  bgColor: "bg-gray-100 dark:bg-gray-800",
  textColor: "text-gray-700 dark:text-gray-300",
  iconColor: "text-gray-600 dark:text-gray-400",
};

export function PDFHeader({
  pdfName,
  status,
  isLoading = false,
}: PDFHeaderProps) {
  const statusConfig =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || DEFAULT_STATUS;
  const showSpinner = status === "REATTEMPTING" || isLoading;

  return (
    <header className="sticky top-0 z-50 m-2 rounded-lg border border-border bg-sidebar shadow-sm">
      <div className="flex h-14 items-center gap-3 px-2">
        {/* Sidebar Trigger */}
        <SidebarTrigger variant="ghost" size="sm" className="h-8 w-8" />

        {/* PDF Status Icon */}
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${statusConfig.bgColor}`}
        >
          <FileText className={`h-4 w-4 ${statusConfig.iconColor}`} />
        </div>

        {/* PDF Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-medium text-foreground text-sm">
              {pdfName || "Contrato hipotecario"}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {showSpinner && <Loader2 className="h-3 w-3 animate-spin" />}
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
