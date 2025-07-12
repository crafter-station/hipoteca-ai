import type { ContractHighlight } from "@/models/contract";
import { ContractHighlightType } from "@/models/contract";
import type { HighlightAnnotation, HighlightType } from "@/types/pdf-viewer";

/**
 * Mapping from ContractHighlightType to PDF Viewer HighlightType (for colors)
 */
export function mapContractHighlightType(
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

/**
 * Mapping from ContractHighlightType to Spanish titles for tooltips
 */
export function getContractHighlightTitle(
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

/**
 * Convert Contract highlights to PDF Viewer highlights
 */
export function convertContractHighlights(
  contractHighlights: ContractHighlight[],
): HighlightAnnotation[] {
  return contractHighlights.map((highlight) => ({
    sentence: highlight.sentence,
    type: mapContractHighlightType(highlight.type),
    tooltip: `${getContractHighlightTitle(highlight.type)}: ${
      highlight.description
    }`,
  }));
}
