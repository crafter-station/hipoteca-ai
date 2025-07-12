import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ContractHighlightType } from "@/models/contract";
import { Info } from "lucide-react";
import { useMemo } from "react";

interface HighlightLegendProps {
  className?: string;
}

// Mapping from ContractHighlightType to PDF Viewer HighlightType (for colors)
function mapContractHighlightTypeToColor(
  contractType: ContractHighlightType,
): string {
  switch (contractType) {
    // Financial terms and fees - Orange
    case ContractHighlightType.LOAN:
    case ContractHighlightType.INTEREST_RATE:
    case ContractHighlightType.MONTHLY_PAYMENT:
    case ContractHighlightType.INITIAL_EXPENSES:
    case ContractHighlightType.COSTS:
    case ContractHighlightType.FEES:
      return "#EA580C"; // FEE color

    // User obligations - Green
    case ContractHighlightType.MORTGAGE_TERM:
    case ContractHighlightType.INSURANCE_COVERAGE:
      return "#16A34A"; // DUTY_USER color

    // Risks and penalties - Red
    case ContractHighlightType.ABUSIVE_CLAUSE:
    case ContractHighlightType.PENALTIES:
      return "#DC2626"; // ABUSE color

    case ContractHighlightType.FINANCIAL_RISK:
      return "#EAB308"; // RISK color

    // Variable conditions and consultations - Purple
    case ContractHighlightType.CONSULT_THE_BANK:
    case ContractHighlightType.NEGOTIABLE_CLAUSE:
    case ContractHighlightType.POSSIBLE_FUTURE_CHANGES:
      return "#7C3AED"; // VAR color

    case ContractHighlightType.UNDISCLOSED_CHARGE_IN_PDF:
      return "#EAB308"; // RISK color

    // Default fallback - Blue
    default:
      return "#2563EB"; // TERM color
  }
}

// Spanish titles for ContractHighlightType
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

// Descriptions for ContractHighlightType
function getContractHighlightDescription(
  contractType: ContractHighlightType,
): string {
  switch (contractType) {
    case ContractHighlightType.LOAN:
      return "Información sobre el préstamo hipotecario";
    case ContractHighlightType.INTEREST_RATE:
      return "Tipo de interés aplicado al préstamo";
    case ContractHighlightType.MONTHLY_PAYMENT:
      return "Importe de la cuota mensual a pagar";
    case ContractHighlightType.INITIAL_EXPENSES:
      return "Gastos iniciales del proceso hipotecario";
    case ContractHighlightType.COSTS:
      return "Costos asociados al préstamo";
    case ContractHighlightType.FEES:
      return "Comisiones bancarias aplicables";
    case ContractHighlightType.MORTGAGE_TERM:
      return "Duración del préstamo hipotecario";
    case ContractHighlightType.INSURANCE_COVERAGE:
      return "Seguros requeridos para el préstamo";
    case ContractHighlightType.ABUSIVE_CLAUSE:
      return "Cláusulas potencialmente abusivas";
    case ContractHighlightType.PENALTIES:
      return "Penalizaciones por incumplimiento";
    case ContractHighlightType.FINANCIAL_RISK:
      return "Riesgos financieros importantes";
    case ContractHighlightType.CONSULT_THE_BANK:
      return "Aspectos que requieren consulta bancaria";
    case ContractHighlightType.NEGOTIABLE_CLAUSE:
      return "Cláusulas que pueden ser negociadas";
    case ContractHighlightType.POSSIBLE_FUTURE_CHANGES:
      return "Condiciones que pueden cambiar en el futuro";
    case ContractHighlightType.UNDISCLOSED_CHARGE_IN_PDF:
      return "Cargos no claramente especificados";
    default:
      return "Términos técnicos del contrato";
  }
}

export function HighlightLegend({ className = "" }: HighlightLegendProps) {
  // Create legend items from ContractHighlightType - memoized to prevent re-creation
  const contractLegendItems = useMemo(
    () =>
      Object.values(ContractHighlightType).map((contractType) => ({
        type: contractType,
        color: mapContractHighlightTypeToColor(contractType),
        label: getContractHighlightTitle(contractType),
        description: getContractHighlightDescription(contractType),
      })),
    [],
  );
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Info size={16} />
            Leyenda
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-96 w-96 overflow-y-auto">
          <h3 className="mb-3 font-semibold text-sm">
            Tipos de Destacados del Contrato
          </h3>
          <div className="space-y-2">
            {contractLegendItems.map((item) => (
              <div key={item.type} className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-muted-foreground text-xs leading-tight">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t pt-3 text-muted-foreground text-xs">
            💡 Pasa el cursor sobre cualquier destacado para ver detalles
            específicos del análisis
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
