"use client";

import { Logo } from "@/components/shared/logo";
import { FileText, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Inicializando...");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const textCycle = [
      "Inicializando...",
      "Cargando historial...",
      "Preparando análisis...",
      "Conectando con IA...",
      "Casi listo...",
    ];

    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % textCycle.length;
      setLoadingText(textCycle[textIndex]);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
    }, 500);

    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Placeholder */}
      <div className="m-2 flex w-[15rem] flex-col rounded-lg border bg-card p-2">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Logo className="size-8 opacity-80" />
            <span className="font-semibold text-sm">HipotecaFindr</span>
          </div>

          {/* Nuevo Análisis Button Placeholder */}
          <div className="h-8 w-full animate-pulse rounded-md border bg-muted/30" />

          {/* Search Button Placeholder */}
          <div className="flex h-9 w-full items-center gap-2 rounded-md bg-muted/20 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground/50" />
            <span className="text-muted-foreground/50 text-sm">
              Buscar análisis
            </span>
          </div>
        </div>

        {/* Historial Section */}
        <div className="flex-1">
          <div className="mt-4 p-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-muted-foreground text-xs">
                Historial de Análisis
              </h3>
              <div className="h-3 w-6 animate-pulse rounded bg-muted/50" />
            </div>
          </div>

          {/* Contract Items Placeholder */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-2 rounded-md bg-muted/20 p-2"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <FileText className="h-4 w-4 text-muted-foreground/30" />
                <div
                  className="h-3 rounded bg-muted/50"
                  style={{ width: `${60 + i * 10}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Placeholder */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/20 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
            <User className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted/50" />
            <div className="h-2 w-1/2 animate-pulse rounded bg-muted/30" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 animate-[slide_20s_linear_infinite] bg-[length:60px_60px] bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-8 text-center">
          {/* Main Logo/Icon */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="h-24 w-24 animate-spin rounded-full border-2 border-transparent border-t-primary/60 border-r-primary/30" />

            {/* Inner pulsing circle */}
            <div className="absolute inset-3 animate-pulse rounded-full bg-gradient-to-br from-primary/20 to-primary/5" />

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Logo className="size-12 opacity-90" />
              </div>
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <h1 className="font-bold text-2xl text-foreground">
              HipotecaFindr
            </h1>
            <p className="text-muted-foreground text-sm">
              Inteligencia Artificial para Análisis Hipotecario
            </p>
          </div>

          {/* Dynamic loading text */}
          <div className="space-y-4">
            <div className="h-1 w-64 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-full animate-[loading_2s_ease-in-out_infinite] bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            </div>

            <p className="min-h-[20px] font-medium text-muted-foreground text-sm">
              {loadingText}
              <span className="text-primary">{dots}</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-60px) translateY(-60px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        

      `}</style>
    </div>
  );
}
