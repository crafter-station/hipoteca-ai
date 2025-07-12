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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CHAT_SYSTEM_PROMPT } from "@/prompts/chat-system-prompt";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface PromptEditorProps {
  type: "chat" | "extract";
}

export function PromptEditor({ type }: PromptEditorProps) {
  const [promptContent, setPromptContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [model, setModel] = useState("gpt-4o-mini");
  const [temperature, setTemperature] = useState("0.1");
  const [maxTokens, setMaxTokens] = useState("2000");
  const [enableTools, setEnableTools] = useState(true);

  const getDefaultPrompt = () => {
    if (type === "chat") {
      return CHAT_SYSTEM_PROMPT;
    }
    // For extract type, we'll read from the file
    return `Eres un extractor especializado en datos financieros de contratos hipotecarios.

TAREA: Extrae los datos financieros clave del contrato hipotecario.

INSTRUCCIONES:
- Analiza todo el contenido proporcionado
- Extrae solo datos que estén explícitamente mencionados
- Si no encuentras un dato, usa valores por defecto razonables
- Para montos monetarios, incluye la moneda y formato original
- Para porcentajes, usa decimales (ej: 3.85 para 3.85%)

CRITERIOS DE RIESGO:
- Tasas de interés altas vs mercado
- Comisiones excesivas
- Penalizaciones por reembolso anticipado
- Cláusulas de tipo variable sin límites
- Vinculación de productos
- Gastos no transparentes`;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setPromptContent(getDefaultPrompt());
  }, []);

  const handleContentChange = (value: string) => {
    setPromptContent(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setHasChanges(false);
    console.log("Saving prompt:", {
      type,
      content: promptContent,
      model,
      temperature,
      maxTokens,
      enableTools,
    });
  };

  const handleReset = () => {
    setPromptContent(getDefaultPrompt());
    setHasChanges(false);
  };

  const getPromptSections = () => {
    if (type === "chat") {
      return [
        { id: "identity", label: "Identidad", icon: "🤖" },
        { id: "tools", label: "Herramientas", icon: "🛠️" },
        { id: "restrictions", label: "Restricciones", icon: "🚫" },
        { id: "language", label: "Idioma", icon: "🌍" },
        { id: "guidelines", label: "Guías de Respuesta", icon: "📋" },
        { id: "sources", label: "Formato de Fuentes", icon: "📚" },
      ];
    }
    return [
      { id: "task", label: "Tarea Principal", icon: "🎯" },
      { id: "instructions", label: "Instrucciones", icon: "📝" },
      { id: "criteria", label: "Criterios de Riesgo", icon: "⚠️" },
      { id: "output", label: "Formato de Salida", icon: "📊" },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card variant="outlined" size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            ⚙️ Configuración del Modelo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="model-select"
                className="font-medium text-sm text-text-base"
              >
                Modelo
              </label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="temperature-input"
                className="font-medium text-sm text-text-base"
              >
                Temperatura
              </label>
              <Input
                id="temperature-input"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="max-tokens-input"
                className="font-medium text-sm text-text-base"
              >
                Max Tokens
              </label>
              <Input
                id="max-tokens-input"
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enable-tools-switch"
                checked={enableTools}
                onCheckedChange={setEnableTools}
              />
              <label
                htmlFor="enable-tools-switch"
                className="font-medium text-sm text-text-base"
              >
                Habilitar Herramientas
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompt Sections Guide */}
      <Card variant="ghost" size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            🗺️ Secciones del Prompt
          </CardTitle>
          <CardDescription>
            Guía visual de las secciones principales que debe contener tu prompt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getPromptSections().map((section) => (
              <Badge
                key={section.id}
                variant="info-light"
                size="sm"
                className="gap-1"
              >
                <span>{section.icon}</span>
                {section.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-text-base">
              Editor de Prompt
            </h3>
            {hasChanges && (
              <Badge variant="warning-light" size="sm" dot>
                Sin guardar
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Resetear
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
              Guardar Cambios
            </Button>
          </div>
        </div>

        <Textarea
          value={promptContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="min-h-[500px] font-mono text-sm leading-relaxed"
          placeholder="Escribe tu prompt aquí..."
        />

        <div className="flex items-center justify-between text-sm text-text-soft">
          <span>
            {promptContent.length} caracteres •{" "}
            {promptContent.split("\n").length} líneas
          </span>
          <span>~{Math.ceil(promptContent.length / 4)} tokens estimados</span>
        </div>
      </div>

      {/* Quick Tips */}
      <Alert variant="info-light">
        <InfoIcon className="size-4" />
        <h4 className="font-semibold text-text-base">
          Consejos para {type === "chat" ? "Chat" : "Extracción"}
        </h4>
        <ul className="ml-4 space-y-1 text-sm text-text-soft">
          {type === "chat" ? (
            <>
              <li>
                • Define claramente la identidad y especialización del asistente
              </li>
              <li>• Especifica las herramientas disponibles y cómo usarlas</li>
              <li>• Incluye restricciones claras sobre temas permitidos</li>
              <li>• Establece formato consistente para las fuentes</li>
            </>
          ) : (
            <>
              <li>• Especifica exactamente qué datos extraer del contrato</li>
              <li>
                • Define criterios claros para evaluar riesgos hipotecarios
              </li>
              <li>• Incluye formato JSON estructurado para la salida</li>
              <li>• Considera casos edge y valores por defecto</li>
            </>
          )}
        </ul>
      </Alert>
    </div>
  );
}
