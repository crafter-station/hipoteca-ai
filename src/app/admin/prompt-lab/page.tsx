"use client";

import { CriteriaBuilder } from "@/components/prompt-lab/criteria-builder";
import { LiveTester } from "@/components/prompt-lab/live-tester";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function PromptLabPage() {
  const [criteriaChanged, setCriteriaChanged] = useState(false);

  return (
    <div className="min-h-screen bg-ui-subtle p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🏠</span>
            <h1 className="font-bold text-3xl text-text-base">
              Centro de Criterios Hipotecarios
            </h1>
          </div>
          <p className="text-lg text-text-soft">
            Define y ajusta los criterios que el sistema usa para evaluar
            contratos hipotecarios
          </p>
          <Badge variant="info-light" size="lg">
            Para Expertos Hipotecarios
          </Badge>
        </div>

        <Separator />

        {/* Main Interface */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Criteria Builder - 2/3 width */}
          <div className="xl:col-span-2">
            <Card variant="elevated" size="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">⚖️</span>
                  Configurador de Criterios
                </CardTitle>
                <CardDescription>
                  Ajusta los parámetros que determinan cómo se evalúan los
                  contratos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CriteriaBuilder onCriteriaChange={setCriteriaChanged} />
              </CardContent>
            </Card>
          </div>

          {/* Live Testing - 1/3 width */}
          <div className="xl:col-span-1">
            <Card variant="interactive" size="lg" className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🧪</span>
                  Prueba en Vivo
                </CardTitle>
                <CardDescription>
                  Ve el impacto inmediato de tus cambios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LiveTester hasChanges={criteriaChanged} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
