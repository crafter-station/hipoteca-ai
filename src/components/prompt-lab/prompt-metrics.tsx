"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface PromptMetricsProps {
  promptType: "chat" | "extract";
}

export function PromptMetrics({ promptType }: PromptMetricsProps) {
  const [timeframe, setTimeframe] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Mock data - in real implementation, this would come from analytics
  const metrics = {
    chat: {
      totalQueries: 1247,
      avgResponseTime: 1850,
      avgAccuracy: 89.2,
      avgSatisfaction: 4.3,
      topicDistribution: [
        { topic: "Análisis TAE", count: 342, accuracy: 91 },
        { topic: "Cláusulas Riesgo", count: 298, accuracy: 87 },
        { topic: "Comparación Ofertas", count: 243, accuracy: 88 },
        { topic: "Costes Adicionales", count: 189, accuracy: 92 },
        { topic: "Condiciones Especiales", count: 175, accuracy: 85 },
      ],
      performance: {
        fast: 78, // % of responses under 2s
        accurate: 89, // % accuracy
        helpful: 85, // % positive feedback
      },
    },
    extract: {
      totalExtractions: 892,
      avgProcessingTime: 3200,
      avgAccuracy: 92.1,
      dataCompleteness: 94.5,
      fieldAccuracy: [
        { field: "TAE", accuracy: 96, importance: "critical" },
        { field: "Cuota Mensual", accuracy: 95, importance: "critical" },
        { field: "Plazo", accuracy: 98, importance: "high" },
        { field: "Comisiones", accuracy: 89, importance: "high" },
        { field: "Penalizaciones", accuracy: 87, importance: "medium" },
        { field: "Seguros", accuracy: 82, importance: "medium" },
      ],
      performance: {
        complete: 94, // % data completeness
        accurate: 92, // % accuracy
        consistent: 96, // % consistency across runs
      },
    },
  };

  const currentMetrics = metrics[promptType];

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "critical":
        return { variant: "error-light" as const, label: "Crítico" };
      case "high":
        return { variant: "warning-light" as const, label: "Alto" };
      case "medium":
        return { variant: "info-light" as const, label: "Medio" };
      default:
        return { variant: "info-light" as const, label: "Bajo" };
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-success-strong";
    if (accuracy >= 80) return "text-warning-strong";
    return "text-error-strong";
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-text-base">
            Métricas de {promptType === "chat" ? "Chat" : "Extracción"}
          </h3>
          <p className="text-sm text-text-soft">
            Rendimiento en los últimos{" "}
            {timeframe === "7d"
              ? "7 días"
              : timeframe === "30d"
                ? "30 días"
                : "90 días"}
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "🔄" : "↻"} Actualizar
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-3 gap-4">
        {promptType === "chat" ? (
          <>
            <Card variant="outlined" size="sm">
              <CardContent className="text-center">
                <div className="font-bold text-2xl text-text-base">
                  {currentMetrics.totalQueries}
                </div>
                <div className="text-sm text-text-soft">Consultas Totales</div>
                <Badge variant="success-soft" size="xs" className="mt-1">
                  +12% vs anterior
                </Badge>
              </CardContent>
            </Card>

            <Card variant="outlined" size="sm">
              <CardContent className="text-center">
                <div className="font-bold text-2xl text-text-base">
                  {currentMetrics.avgResponseTime}ms
                </div>
                <div className="text-sm text-text-soft">Tiempo Promedio</div>
                <Badge variant="info-soft" size="xs" className="mt-1">
                  -5% vs anterior
                </Badge>
              </CardContent>
            </Card>

            <Card variant="outlined" size="sm">
              <CardContent className="text-center">
                <div
                  className={`font-bold text-2xl ${getAccuracyColor(currentMetrics.avgAccuracy)}`}
                >
                  {currentMetrics.avgAccuracy}%
                </div>
                <div className="text-sm text-text-soft">Precisión Promedio</div>
                <Badge variant="success-soft" size="xs" className="mt-1">
                  +3% vs anterior
                </Badge>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card variant="outlined" size="sm">
              <CardContent className="text-center">
                <div className="font-bold text-2xl text-text-base">
                  {currentMetrics.totalExtractions}
                </div>
                <div className="text-sm text-text-soft">Extracciones</div>
                <Badge variant="success-soft" size="xs" className="mt-1">
                  +8% vs anterior
                </Badge>
              </CardContent>
            </Card>

            <Card variant="outlined" size="sm">
              <CardContent className="text-center">
                <div className="font-bold text-2xl text-text-base">
                  {currentMetrics.avgProcessingTime}ms
                </div>
                <div className="text-sm text-text-soft">Procesamiento</div>
                <Badge variant="warning-soft" size="xs" className="mt-1">
                  +2% vs anterior
                </Badge>
              </CardContent>
            </Card>

            <Card variant="outlined" size="sm">
              <CardContent className="text-center">
                <div
                  className={`font-bold text-2xl ${getAccuracyColor(currentMetrics.dataCompleteness)}`}
                >
                  {currentMetrics.dataCompleteness}%
                </div>
                <div className="text-sm text-text-soft">Completitud</div>
                <Badge variant="success-soft" size="xs" className="mt-1">
                  +1% vs anterior
                </Badge>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Detailed Breakdown */}
      {promptType === "chat" ? (
        <div className="space-y-4">
          <Card variant="outlined" size="sm">
            <CardHeader>
              <CardTitle className="text-base">
                Distribución por Temas
              </CardTitle>
              <CardDescription>
                Análisis de los tipos de consultas más frecuentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentMetrics.topicDistribution.map((topic) => (
                <div key={topic.topic} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{topic.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text-soft">
                        {topic.count} consultas
                      </span>
                      <span
                        className={`font-medium ${getAccuracyColor(topic.accuracy)}`}
                      >
                        {topic.accuracy}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(topic.count / currentMetrics.totalQueries) * 100}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card variant="outlined" size="sm">
            <CardHeader>
              <CardTitle className="text-base">Precisión por Campo</CardTitle>
              <CardDescription>
                Análisis de la calidad de extracción por tipo de dato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentMetrics.fieldAccuracy.map((field) => (
                <div key={field.field} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{field.field}</span>
                      <Badge
                        {...getImportanceBadge(field.importance)}
                        size="xs"
                      >
                        {getImportanceBadge(field.importance).label}
                      </Badge>
                    </div>
                    <span
                      className={`font-medium ${getAccuracyColor(field.accuracy)}`}
                    >
                      {field.accuracy}%
                    </span>
                  </div>
                  <Progress value={field.accuracy} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Summary */}
      <Card variant="gradient" size="sm">
        <CardHeader>
          <CardTitle className="text-base">Resumen de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {Object.entries(currentMetrics.performance).map(
              ([perfKey, value]) => (
                <div key={perfKey} className="space-y-1">
                  <div
                    className={`font-bold text-xl ${getAccuracyColor(value as number)}`}
                  >
                    {value}%
                  </div>
                  <div className="text-sm text-text-soft capitalize">
                    {perfKey === "fast" && "Velocidad"}
                    {perfKey === "accurate" && "Precisión"}
                    {perfKey === "helpful" && "Utilidad"}
                    {perfKey === "complete" && "Completitud"}
                    {perfKey === "consistent" && "Consistencia"}
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card variant="outlined" size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            💡 Recomendaciones de Optimización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {promptType === "chat" ? (
              <>
                <div className="flex items-start gap-2">
                  <Badge variant="warning-light" size="xs">
                    Velocidad
                  </Badge>
                  <span>
                    Optimizar prompts para reducir tiempo de respuesta en
                    consultas complejas
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="info-light" size="xs">
                    Precisión
                  </Badge>
                  <span>
                    Mejorar contexto sobre cláusulas especiales para aumentar
                    precisión
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <Badge variant="warning-light" size="xs">
                    Seguros
                  </Badge>
                  <span>
                    Ajustar criterios de extracción para seguros vinculados (82%
                    precisión)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="info-light" size="xs">
                    Consistencia
                  </Badge>
                  <span>
                    Implementar validación cruzada para mejorar consistencia
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
