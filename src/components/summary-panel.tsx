"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, FileText, Info, Scale } from "lucide-react";

// Define the props type for data consistency
export type Fee = { label: string; amount: string; due: string };
export type PenaltyTrigger = { exists: boolean; detail: string };
export type SummaryData = {
  rate_percent: number;
  apr_percent: number;
  term_years: number;
  monthly_payment: string;
  total_interest_paid: string;
  fees: Fee[];
  prepayment_penalty: PenaltyTrigger;
  variable_rate_trigger: PenaltyTrigger;
  red_flags: string[];
  plain_summary: string;
  lawyer_summary: string;
  risk_score: number; // 1-100 scale
  health_label: "Riesgoso" | "Aceptable" | "Bueno" | "Excelente";
};

interface SummaryPanelProps {
  data: SummaryData | null;
}

export default function SummaryPanel({ data }: SummaryPanelProps) {
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-slate-500">
        Cargando resumen...
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Copiado al portapapeles:", text);
      },
      (err) => {
        console.error("Error al copiar:", err);
      },
    );
  };

  return (
    <div className="h-full space-y-6 px-6 pb-6 text-foreground">
      {/* Health Gauge - Centered */}
      <div className="flex justify-center">
        <HealthGauge score={data.risk_score} />
      </div>

      {/* Financial Data Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-lg">
          Datos Financieros
        </h3>
        {/* Fila 1 de Tiles - Fondo A */}
        <div className="grid grid-cols-2 gap-3">
          <Tile
            label="Tasa Interés"
            value={`${data.rate_percent}%`}
            onCopy={handleCopy}
            bgColor="bg-card"
          />
          <Tile
            label="TAE"
            value={`${data.apr_percent}%`}
            onCopy={handleCopy}
            bgColor="bg-card"
          />
        </div>
        {/* Fila 2 de Tiles - Fondo B */}
        <div className="grid grid-cols-2 gap-3">
          <Tile
            label="Plazo"
            value={`${data.term_years} años`}
            onCopy={handleCopy}
            bgColor="bg-muted/50"
          />
          <Tile
            label="Cuota Mensual"
            value={data.monthly_payment}
            onCopy={handleCopy}
            bgColor="bg-muted/50"
          />
        </div>
        {/* Fila 3 de Tiles - Fondo A */}
        <div className="grid grid-cols-1 gap-3">
          <Tile
            label="Coste Total Intereses"
            value={data.total_interest_paid}
            className="col-span-2"
            onCopy={handleCopy}
            bgColor="bg-card"
          />
        </div>
      </div>

      {data.red_flags && data.red_flags.length > 0 && (
        <div>
          <h3 className="mb-4 font-semibold text-foreground text-lg">
            Alertas Clave
          </h3>
          <div className="space-y-3">
            {data.red_flags.map((flag) => (
              <MinimalAlert key={flag} message={flag} />
            ))}
          </div>
        </div>
      )}

      {/* Summary Tabs with Custom Style */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground text-lg">
          Análisis del Documento
        </h3>
        <Tabs defaultValue="plain">
          <ScrollArea>
            <TabsList className="-space-x-px mb-3 h-auto w-full bg-background p-0 shadow-xs rtl:space-x-reverse">
              <TabsTrigger
                value="plain"
                className="relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <FileText
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Vista Rápida
              </TabsTrigger>
              <TabsTrigger
                value="legal"
                className="relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <Scale
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Análisis Legal
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="plain">
            <div className="rounded-lg border border-info/20 bg-info-foreground p-4">
              <div className="flex items-start space-x-2">
                <div className="text-info text-lg">🔍</div>
                <div>
                  <h4 className="mb-2 font-semibold text-info text-sm">
                    Resumen Ejecutivo
                  </h4>
                  <p className="text-info/80 text-sm leading-relaxed">
                    {data.plain_summary}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="legal">
            <div className="rounded-lg border border-purple/20 bg-purple-foreground p-4">
              <div className="flex items-start space-x-2">
                <div className="text-lg text-purple">⚖️</div>
                <div>
                  <h4 className="mb-2 font-semibold text-purple text-sm">
                    Análisis Jurídico
                  </h4>
                  <p className="text-purple/80 text-sm leading-relaxed">
                    {data.lawyer_summary}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface TileProps {
  label: string;
  value: string;
  className?: string;
  bgColor?: string;
  onCopy: (text: string) => void;
}

function Tile({
  label,
  value,
  className = "",
  bgColor = "bg-card",
  onCopy,
}: TileProps) {
  const tileBaseStyle = `rounded-lg p-3.5 border border-border shadow-sm relative group ${bgColor}`;
  return (
    <div className={`${tileBaseStyle} ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 h-6 w-6 text-muted-foreground opacity-0 transition-opacity duration-150 hover:text-orange group-hover:opacity-100"
        onClick={() => onCopy(value)}
        aria-label={`Copiar ${label}`}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <span className="mb-0.5 block font-medium text-muted-foreground text-xs">
        {label}
      </span>
      <span className="font-semibold text-card-foreground text-lg">
        {value}
      </span>
    </div>
  );
}

interface HealthGaugeProps {
  score: number; // 1-100 scale
}

function HealthGauge({ score }: HealthGaugeProps) {
  // Clamp score between 1 and 100
  const clampedScore = Math.min(Math.max(score, 1), 100);

  // Convert to percentage for the arc
  const percentage = clampedScore;

  // Determine color and health level
  let colorVar = "success";
  let healthLevel = "Excelente";
  let healthColor = "text-success";
  let gradientId = "successGradient";

  if (clampedScore >= 70) {
    colorVar = "danger";
    healthLevel = "Alto Riesgo";
    healthColor = "text-danger";
    gradientId = "dangerGradient";
  } else if (clampedScore >= 40) {
    colorVar = "warning";
    healthLevel = "Precaución";
    healthColor = "text-warning";
    gradientId = "warningGradient";
  } else if (clampedScore >= 20) {
    colorVar = "info";
    healthLevel = "Bueno";
    healthColor = "text-info";
    gradientId = "infoGradient";
  }

  // Calculate the stroke-dasharray for the arc
  const radius = 55; // Increased size
  const circumference = Math.PI * radius; // Half circle
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative">
      <svg
        width="140"
        height="90"
        viewBox="0 0 140 90"
        className="overflow-visible"
        aria-label="Health gauge"
      >
        <title>Health Gauge Score: {clampedScore}</title>
        {/* Define gradients using CSS variables */}
        <defs>
          <radialGradient id="successGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="var(--success)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="infoGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="var(--info)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--info)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="warningGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="var(--warning)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--warning)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dangerGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="var(--danger)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--danger)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background circle with gradient */}
        <circle
          cx="70"
          cy="70"
          r="50"
          fill={`url(#${gradientId})`}
          opacity="0.1"
        />

        {/* Background arc */}
        <path
          d="M 15 75 A 55 55 0 0 1 125 75"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d="M 15 75 A 55 55 0 0 1 125 75"
          fill="none"
          stroke={`var(--${colorVar})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          className="transition-all duration-1000 ease-out"
          style={{
            transformOrigin: "70px 75px",
          }}
        />

        {/* Center score - just the number, larger */}
        <text
          x="70"
          y="65"
          textAnchor="middle"
          className="fill-foreground font-bold text-3xl"
        >
          {clampedScore}
        </text>
      </svg>
      <div className="mt-2 text-center">
        <p className={`font-semibold text-sm ${healthColor}`}>{healthLevel}</p>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="flex cursor-help items-center justify-center text-muted-foreground text-xs">
                Salud Hipotecaria
                <Info className="ml-1 h-3 w-3" />
              </p>
            </TooltipTrigger>
            <TooltipContent className="w-60 rounded-md border bg-card p-3 text-card-foreground text-xs shadow-lg">
              <p className="mb-2 font-medium">Escala de Riesgo (1-100):</p>
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-success">1-19:</span>{" "}
                  Excelente - Condiciones muy favorables
                </p>
                <p>
                  <span className="font-semibold text-info">20-39:</span> Bueno
                  - Condiciones aceptables
                </p>
                <p>
                  <span className="font-semibold text-warning">40-69:</span>{" "}
                  Precaución - Revisar términos
                </p>
                <p>
                  <span className="font-semibold text-danger">70-100:</span>{" "}
                  Alto Riesgo - Cláusulas desfavorables
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

interface MinimalAlertProps {
  message: string;
}

function MinimalAlert({ message }: MinimalAlertProps) {
  return (
    <div className="group relative">
      {/* Minimal left border indicator */}
      <div className="absolute top-0 bottom-0 left-0 w-1 rounded-full bg-gradient-to-b from-warning to-orange" />

      {/* Content */}
      <div className="rounded-lg border border-warning/20 bg-gradient-to-r from-warning-foreground/50 to-transparent py-3 pr-3 pl-4 transition-all duration-200 hover:border-warning/30 hover:from-warning-foreground">
        <p className="font-medium text-sm text-warning leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
