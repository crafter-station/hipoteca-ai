/**
 * Constants for contract analysis processing
 */

// Task progress stages for mortgage processing
export const PROGRESS_STAGES = {
  extract_content: "Extrayendo contenido del PDF",
  extract_highlights: "Analizando cláusulas importantes",
  extract_summary: "Generando resumen financiero",
  store_contract_context: "Guardando contexto del contrato",
  completed: "Análisis de hipoteca completado",
} as const;

// Possible run statuses
export const STATUS_MAP = {
  WAITING_FOR_DEPLOY: "Esperando despliegue",
  QUEUED: "En cola",
  EXECUTING: "Ejecutando",
  COMPLETED: "Completado",
  FAILED: "Falló",
  CANCELED: "Cancelado",
  REATTEMPTING: "Reintentando",
  CRASHED: "Error crítico",
  TIMED_OUT: "Tiempo agotado",
} as const;

// Status categories for easier handling
export const STATUS_CATEGORIES = {
  COMPLETED: ["COMPLETED"],
  FAILED: ["FAILED", "CANCELED", "CRASHED", "TIMED_OUT"],
  LOADING: ["EXECUTING", "QUEUED", "REATTEMPTING"],
  PENDING: ["PENDING", "WAITING_FOR_DEPLOY"],
} as const;

// Type for all possible statuses
export type ProcessingStatus = keyof typeof STATUS_MAP;

// Helper functions to check status categories (using any for now due to complex typing)
export function isCompletedStatus(status: string): boolean {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return STATUS_CATEGORIES.COMPLETED.includes(status as any);
}

export function isFailedStatus(status: string): boolean {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return STATUS_CATEGORIES.FAILED.includes(status as any);
}

export function isLoadingStatus(status: string): boolean {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return STATUS_CATEGORIES.LOADING.includes(status as any);
}

export function isPendingStatus(status: string): boolean {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return STATUS_CATEGORIES.PENDING.includes(status as any);
}

// Error messages for different scenarios
export const ERROR_MESSAGES = {
  MISSING_TOKEN:
    "Faltan parámetros necesarios para el seguimiento en tiempo real",
  CONNECTION_ERROR: "Error de conexión",
  PROCESSING_ERROR: "Error en el procesamiento",
  PROCESSING_CANCELED: "Procesamiento cancelado",
  CRITICAL_ERROR: "Error crítico",
  TIMEOUT_ERROR: "Tiempo agotado",
  CONTRACT_NOT_FOUND: "Contrato no encontrado",
  PROCESSING_FAILED: "No se pudo procesar el contrato hipotecario",
  ANALYSIS_CANCELED: "El análisis del contrato fue cancelado",
  CRITICAL_PROCESSING_ERROR:
    "Ocurrió un error crítico durante el procesamiento",
  TIMEOUT_PROCESSING_ERROR: "El procesamiento excedió el tiempo límite",
  CONTRACT_NOT_EXISTS: "El contrato no existe o aún no ha sido procesado",
} as const;

// Progress messages for toasts
export const PROGRESS_MESSAGES = {
  extract_content: "📄 Extrayendo contenido del PDF...",
  extract_highlights: "🔍 Analizando cláusulas importantes...",
  extract_summary: "📊 Generando resumen financiero...",
  store_contract_context: "💾 Guardando análisis...",
  completed: "✅ Análisis completado",
} as const;

// Toast messages for different statuses
export const TOAST_MESSAGES = {
  QUEUED: "⏳ Tarea en cola, esperando procesamiento...",
  REATTEMPTING: "🔄 Reintentando...",
  CANCELED: "🚫 Procesamiento cancelado",
  FAILED: "❌ Error procesando el contrato",
  TIMED_OUT: "⏰ Procesamiento agotó el tiempo límite",
  CRASHED: "💥 Error crítico en el procesamiento",
  COMPLETED: "🎉 ¡Contrato procesado exitosamente!",
} as const;

// Status icons
export const STATUS_ICONS = {
  COMPLETED: "CheckCircle",
  FAILED: "X",
  LOADING: "Loader2",
  PENDING: "Circle",
} as const;

// Toast durations
export const TOAST_DURATIONS = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 4000,
  EXTENDED: 5000,
} as const;
