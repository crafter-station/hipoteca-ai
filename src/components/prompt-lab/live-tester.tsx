"use client";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";

interface LiveTesterProps {
  hasChanges: boolean;
}

export function LiveTester({ hasChanges }: LiveTesterProps) {
  const [testType, setTestType] = useState<"chat" | "summary">("chat");
  const [inputText, setInputText] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with real backend call using current criteria
  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setAiResponse(null);
    setTimeout(() => {
      setLoading(false);
      setAiResponse(
        testType === "chat"
          ? "Ejemplo de respuesta del asistente hipotecario basada en los criterios actuales."
          : "Resumen automático del contrato según los criterios definidos.",
      );
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={testType === "chat" ? "default" : "outline"}
          size="sm"
          onClick={() => setTestType("chat")}
        >
          💬 Chat
        </Button>
        <Button
          variant={testType === "summary" ? "default" : "outline"}
          size="sm"
          onClick={() => setTestType("summary")}
        >
          📊 Resumen
        </Button>
        {hasChanges && (
          <Badge variant="warning-light" size="sm" dot>
            Sin guardar
          </Badge>
        )}
      </div>
      <Separator />
      <div>
        <label
          htmlFor="live-tester-textarea"
          className="mb-1 block font-medium text-sm text-text-base"
        >
          Pega un fragmento de contrato hipotecario para probar
        </label>
        <textarea
          id="live-tester-textarea"
          className="min-h-[80px] w-full rounded-md border border-base bg-ui-base p-2 text-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary-base"
          placeholder="Ejemplo: El tipo de interés será del 3,5%..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button
        onClick={handleTest}
        disabled={!inputText.trim() || loading || hasChanges}
        className="w-full"
      >
        {loading ? "Analizando..." : "Probar Respuesta"}
      </Button>
      {hasChanges && (
        <Alert variant="warning">
          <AlertCircleIcon className="size-4" />
          <div className="flex flex-col gap-2">
            <h4 className="flex items-center gap-2 font-semibold">
              Guarda los cambios en los criterios antes de probar para ver el
              efecto real.
            </h4>
          </div>
        </Alert>
      )}
      {aiResponse && !loading && (
        <Card variant="outlined" className="mt-2">
          <CardContent className="space-y-2 p-4">
            <div className="text-sm text-text-soft">Respuesta del sistema:</div>
            <div className="whitespace-pre-line text-base text-text-base">
              {aiResponse}
            </div>
          </CardContent>
        </Card>
      )}
      {error && (
        <Alert variant="error">
          <AlertCircleIcon className="size-4" />
          <div className="flex flex-col gap-2">
            <h4 className="flex items-center gap-2 font-semibold text-text-base">
              Error al analizar el contrato
            </h4>
            <p className="text-sm text-text-soft">{error}</p>
          </div>
        </Alert>
      )}
    </div>
  );
}
