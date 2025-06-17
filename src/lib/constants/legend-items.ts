// Shared legend items for PDF annotation highlighting
export const legendItems = [
  {
    type: "TERM",
    color: "#2563EB",
    label: "Definición técnica",
    description: "Jerga hipotecaria (TAE, Euríbor, etc.)",
  },
  {
    type: "FEE",
    color: "#EA580C",
    label: "Costos & comisiones",
    description: "Tasas, comisiones, gastos directos",
  },
  {
    type: "DUTY_USER",
    color: "#16A34A",
    label: "Tu obligación",
    description: "Lo que debes hacer/pagar/entregar",
  },
  {
    type: "DUTY_BANK",
    color: "#0D9488",
    label: "Deber del banco",
    description: "Responsabilidades de la entidad",
  },
  {
    type: "VAR",
    color: "#7C3AED",
    label: "Condición variable",
    description: "Cambia en el tiempo (revisiones, bonificaciones)",
  },
  {
    type: "RISK",
    color: "#EAB308",
    label: "Riesgo / advertencia",
    description: "Alertas importantes sobre consecuencias",
  },
  {
    type: "ABUSE",
    color: "#DC2626",
    label: "Cláusula abusiva",
    description: "Condiciones potencialmente abusivas",
  },
] as const;

// Export types derived from the legend items
export type LegendItem = (typeof legendItems)[number];
export type LegendItemType = LegendItem["type"];
export type HighlightType = LegendItemType; // Alias for backward compatibility
