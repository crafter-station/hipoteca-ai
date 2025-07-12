"use client";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent } from "react";

interface CriteriaBuilderProps {
  onCriteriaChange: (changed: boolean) => void;
}

export function CriteriaBuilder({ onCriteriaChange }: CriteriaBuilderProps) {
  const [hasChanges, setHasChanges] = useState(false);

  // Criterios de evaluación
  const [riskCriteria, setRiskCriteria] = useState({
    maxTae: 4.5,
    maxCommissions: 1.5,
    allowVariableRate: true,
    maxPrepaymentPenalty: 1.0,
    requireInsurance: false,
    maxTermYears: 30,
  });

  const [responseCriteria, setResponseCriteria] = useState({
    language: "spanish",
    tone: "professional-friendly",
    citeSources: true,
    maxResponseLength: 150,
    includeRecommendations: true,
  });

  const handleCriteriaChange = (
    section: "risk" | "response",
    key: string,
    value: string | number | boolean,
  ) => {
    if (section === "risk") {
      setRiskCriteria((prev) => ({ ...prev, [key]: value }));
    } else {
      setResponseCriteria((prev) => ({ ...prev, [key]: value }));
    }
    setHasChanges(true);
    onCriteriaChange(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    onCriteriaChange(false);
    // TODO: Implementar guardado real
  };

  const handleReset = () => {
    setRiskCriteria({
      maxTae: 4.5,
      maxCommissions: 1.5,
      allowVariableRate: true,
      maxPrepaymentPenalty: 1.0,
      requireInsurance: false,
      maxTermYears: 30,
    });
    setResponseCriteria({
      language: "spanish",
      tone: "professional-friendly",
      citeSources: true,
      maxResponseLength: 150,
      includeRecommendations: true,
    });
    setHasChanges(false);
    onCriteriaChange(false);
  };

  const getRiskLevel = (tae: number) => {
    if (tae <= 3.5)
      return { label: "Excelente", variant: "success-light" as const };
    if (tae <= 4.0) return { label: "Bueno", variant: "info-light" as const };
    if (tae <= 4.5)
      return { label: "Aceptable", variant: "warning-light" as const };
    return { label: "Riesgoso", variant: "error-light" as const };
  };

  return (
    <div className="space-y-6">
      {/* Save/Reset Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-text-base">
            Criterios de Evaluación
          </h3>
          {hasChanges && (
            <Badge variant="warning-light" size="sm" dot>
              Cambios pendientes
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            🔄 Restaurar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
            💾 Guardar Criterios
          </Button>
        </div>
      </div>

      {/* Risk Assessment Criteria */}
      <Card variant="outlined" size="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚠️ Criterios de Riesgo Financiero
          </CardTitle>
          <CardDescription>
            Define los umbrales que determinan si un contrato es seguro para el
            cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* TAE Threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="max-tae"
                className="font-medium text-sm text-text-base"
              >
                TAE Máxima Recomendada
              </label>
              <Badge {...getRiskLevel(riskCriteria.maxTae)} size="sm">
                {getRiskLevel(riskCriteria.maxTae).label}
              </Badge>
            </div>
            <div className="space-y-2">
              <Input
                id="max-tae"
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={riskCriteria.maxTae}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleCriteriaChange(
                    "risk",
                    "maxTae",
                    Number.parseFloat(e.target.value),
                  )
                }
                className="text-center font-semibold text-lg"
              />
              <p className="text-text-soft text-xs">
                Contratos con TAE superior serán marcados como riesgosos
              </p>
            </div>
          </div>
          <Separator />
          {/* Commissions */}
          <div className="space-y-3">
            <label
              htmlFor="max-commissions"
              className="font-medium text-sm text-text-base"
            >
              Comisiones Máximas Aceptables (% sobre préstamo)
            </label>
            <div className="grid grid-cols-1 gap-2">
              <Input
                id="max-commissions"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={riskCriteria.maxCommissions}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleCriteriaChange(
                    "risk",
                    "maxCommissions",
                    Number.parseFloat(e.target.value),
                  )
                }
                className="text-center"
              />
              <p className="text-text-soft text-xs">
                Incluye comisiones de apertura, estudio, tasación
              </p>
            </div>
          </div>
          <Separator />
          {/* Variable Rate */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label
                htmlFor="allow-variable-rate"
                className="font-medium text-sm text-text-base"
              >
                Permitir Tipo Variable
              </label>
              <p className="text-text-soft text-xs">
                Si acepta hipotecas con interés variable
              </p>
            </div>
            <Switch
              id="allow-variable-rate"
              checked={riskCriteria.allowVariableRate}
              onCheckedChange={(value: boolean) =>
                handleCriteriaChange("risk", "allowVariableRate", value)
              }
            />
          </div>
          {/* Prepayment Penalty */}
          <div className="space-y-3">
            <label
              htmlFor="max-prepayment-penalty"
              className="font-medium text-sm text-text-base"
            >
              Penalización Máxima por Amortización (% sobre cantidad)
            </label>
            <div className="grid grid-cols-1 gap-2">
              <Input
                id="max-prepayment-penalty"
                type="number"
                step="0.1"
                min="0"
                max="3"
                value={riskCriteria.maxPrepaymentPenalty}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleCriteriaChange(
                    "risk",
                    "maxPrepaymentPenalty",
                    Number.parseFloat(e.target.value),
                  )
                }
                className="text-center"
              />
              <p className="text-text-soft text-xs">
                Coste por amortizar anticipadamente
              </p>
            </div>
          </div>
          {/* Insurance Requirement */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label
                htmlFor="require-insurance"
                className="font-medium text-sm text-text-base"
              >
                Marcar Vinculación de Seguros como Riesgo
              </label>
              <p className="text-text-soft text-xs">
                Si debe alertar sobre seguros obligatorios
              </p>
            </div>
            <Switch
              id="require-insurance"
              checked={riskCriteria.requireInsurance}
              onCheckedChange={(value: boolean) =>
                handleCriteriaChange("risk", "requireInsurance", value)
              }
            />
          </div>
        </CardContent>
      </Card>
      {/* Response Behavior Criteria */}
      <Card variant="outlined" size="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💬 Comportamiento de Respuestas
          </CardTitle>
          <CardDescription>
            Configura cómo debe comunicarse el sistema con los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language */}
          <div className="space-y-2">
            <label
              htmlFor="response-language"
              className="font-medium text-sm text-text-base"
            >
              Idioma Principal
            </label>
            <Select
              value={responseCriteria.language}
              onValueChange={(value: string) =>
                handleCriteriaChange("response", "language", value)
              }
            >
              <SelectTrigger id="response-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spanish">🇪🇸 Español</SelectItem>
                <SelectItem value="catalan">🏴 Catalán</SelectItem>
                <SelectItem value="english">🇬🇧 Inglés</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Tone */}
          <div className="space-y-2">
            <label
              htmlFor="response-tone"
              className="font-medium text-sm text-text-base"
            >
              Tono de Comunicación
            </label>
            <Select
              value={responseCriteria.tone}
              onValueChange={(value: string) =>
                handleCriteriaChange("response", "tone", value)
              }
            >
              <SelectTrigger id="response-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional-friendly">
                  😊 Profesional y Cercano
                </SelectItem>
                <SelectItem value="formal">👔 Formal y Técnico</SelectItem>
                <SelectItem value="simple">🗣️ Simple y Directo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Response Length */}
          <div className="space-y-2">
            <label
              htmlFor="max-response-length"
              className="font-medium text-sm text-text-base"
            >
              Longitud Máxima de Respuesta (palabras)
            </label>
            <Input
              id="max-response-length"
              type="number"
              min="50"
              max="300"
              value={responseCriteria.maxResponseLength}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleCriteriaChange(
                  "response",
                  "maxResponseLength",
                  Number.parseInt(e.target.value),
                )
              }
              className="text-center"
            />
          </div>
          {/* Source Citations */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label
                htmlFor="cite-sources"
                className="font-medium text-sm text-text-base"
              >
                Incluir Siempre Referencias
              </label>
              <p className="text-text-soft text-xs">
                Citar páginas del contrato en cada respuesta
              </p>
            </div>
            <Switch
              id="cite-sources"
              checked={responseCriteria.citeSources}
              onCheckedChange={(value: boolean) =>
                handleCriteriaChange("response", "citeSources", value)
              }
            />
          </div>
          {/* Recommendations */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label
                htmlFor="include-recommendations"
                className="font-medium text-sm text-text-base"
              >
                Incluir Recomendaciones Automáticas
              </label>
              <p className="text-text-soft text-xs">
                Sugerir acciones al detectar riesgos
              </p>
            </div>
            <Switch
              id="include-recommendations"
              checked={responseCriteria.includeRecommendations}
              onCheckedChange={(value: boolean) =>
                handleCriteriaChange(
                  "response",
                  "includeRecommendations",
                  value,
                )
              }
            />
          </div>
        </CardContent>
      </Card>
      {/* Preview of Current Settings */}
      <Alert>
        <EyeIcon className="size-4" />
        <div className="flex flex-col gap-2">
          <h4 className="flex items-center gap-2 font-semibold text-text-base">
            Vista Previa de Criterios Actuales
          </h4>
          <div className="space-y-1 text-sm text-text-soft">
            <p>
              • <strong>Riesgo:</strong> TAE máxima {riskCriteria.maxTae}%,
              comisiones hasta {riskCriteria.maxCommissions}%
            </p>
            <p>
              • <strong>Respuestas:</strong> {responseCriteria.language}, tono{" "}
              {responseCriteria.tone}, máximo{" "}
              {responseCriteria.maxResponseLength} palabras
            </p>
            <p>
              • <strong>Referencias:</strong>{" "}
              {responseCriteria.citeSources ? "Incluidas" : "Opcionales"},
              recomendaciones{" "}
              {responseCriteria.includeRecommendations
                ? "activas"
                : "desactivadas"}
            </p>
          </div>
        </div>
      </Alert>
    </div>
  );
}
