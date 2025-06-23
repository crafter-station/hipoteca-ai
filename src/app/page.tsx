"use client";

import { SectionWrapper } from "@/components/landing/section-wrapper";
import { SmoothScrollLink } from "@/components/landing/smooth-scroll-link";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUpFromLine,
  Bot,
  CheckCircle,
  FileText,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        <SectionWrapper
          id="hero"
          className="bg-gradient-radial-hero"
          customHeight={true}
        >
          <div className="flex h-full animate-fade-in-up flex-col px-4 py-8 text-center sm:px-6 sm:py-12 md:justify-center md:px-8 md:py-16">
            <div className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8">
              {/* Header */}
              <div className="space-y-3 text-center sm:space-y-4">
                {/* Badge */}
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block rounded-full bg-primary/10 px-4 py-2 font-medium text-primary text-sm uppercase tracking-wider">
                    IA Hipotecaria
                  </span>
                </div>
                <h1 className="font-bold text-foreground text-xl leading-tight sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  Tu hipoteca oculta secretos.
                  <br />
                  <span className="text-primary italic underline decoration-2 decoration-primary/30 underline-offset-4">
                    Descúbrelos ahora
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-foreground/70 text-sm leading-relaxed sm:text-base md:text-lg">
                  <strong>Analizador impulsado por IA</strong> que convierte tus
                  documentos hipotecarios complejos en insights claros y
                  accionables.
                </p>
              </div>

              {/* Upload Area - Interactive */}
              <SmoothScrollLink href="/checkr/new" className="block">
                <button
                  type="button"
                  className={cn(
                    "group relative flex min-h-[140px] w-full cursor-pointer items-center justify-center rounded-xl border-1 border-dashed p-8 transition-all duration-200 sm:min-h-[160px] sm:p-10",
                    "border-primary/30 hover:scale-[1.02] hover:border-primary hover:bg-primary/5",
                  )}
                  aria-label="Subir archivo PDF"
                >
                  <div className="space-y-4 text-center sm:space-y-5">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border bg-background transition-colors sm:h-16 sm:w-16">
                      <ArrowUpFromLine className="h-7 w-7 text-muted-foreground transition-colors sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base md:text-lg">
                        Arrastra tu contrato de hipoteca aquí
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        O haz clic para comenzar el análisis
                      </p>
                    </div>
                  </div>
                </button>
              </SmoothScrollLink>

              {/* Single Powerful CTA */}
              <div className="flex justify-center">
                <Button size="lg" asChild className="h-12 md:h-14">
                  <SmoothScrollLink
                    className="p-0 text-[16px] md:text-[18px]"
                    href="/checkr/new"
                  >
                    <Sparkles className="size-4 sm:size-5" />
                    Descubre qué esconde tu hipoteca
                  </SmoothScrollLink>
                </Button>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Problem Section */}
        <SectionWrapper id="problem" className="bg-muted/30">
          <div className="max-w-4xl animate-fade-in-up text-center">
            <div className="mb-6">
              <span className="inline-block rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                El Problema
              </span>
            </div>
            <h2 className="mb-6 font-bold text-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Las hipotecas deberían ser tu mayor canal de confianza,
              <br className="hidden sm:block" />
              <span className="text-primary italic">
                no un callejón sin salida.
              </span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background sm:h-14 sm:w-14">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-base text-foreground sm:text-lg">
                  Se ignoran.
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  La mayoría de personas firman sin entender los términos clave.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background sm:h-14 sm:w-14">
                  <FileText className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-base text-foreground sm:text-lg">
                  Frustran a los usuarios.
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  El lenguaje legal complejo no se puede entender sin
                  experiencia.
                </p>
              </div>

              <div className="text-center sm:col-span-2 md:col-span-1">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background sm:h-14 sm:w-14">
                  <Bot className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-base text-foreground sm:text-lg">
                  No pueden competir.
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  La gente recurre a ChatGPT, perdiendo detalles críticos del
                  contrato.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Solution Section */}
        <SectionWrapper id="solution" className="bg-background">
          <div className="max-w-4xl animate-fade-in-up text-center">
            <h2 className="mb-6 font-bold text-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl">
              HipotecaFindr revoluciona el análisis hipotecario{" "}
              <span className="text-primary italic">gracias a la IA.</span>
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-base lg:mb-12">
              HipotecaFindr convierte tus documentos hipotecarios en insights
              instantáneos, mientras aprendes exactamente qué significa tu
              contrato.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
              <div className="rounded-xl border border-border bg-card p-4 text-center sm:p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-14 sm:w-14">
                  <CheckCircle className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-base text-foreground sm:text-lg">
                  Entiende mientras lees
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Explicaciones instantáneas de términos complejos y riesgos
                  potenciales.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center sm:p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-14 sm:w-14">
                  <AlertTriangle className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-base text-foreground sm:text-lg">
                  Detecta riesgos ocultos
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  IA identifica cláusulas abusivas y condiciones desfavorables.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center sm:col-span-2 sm:p-6 md:col-span-1">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-14 sm:w-14">
                  <Bot className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-base text-foreground sm:text-lg">
                  Chatea con tu contrato
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Preguntas en lenguaje natural con respuestas precisas.
                </p>
              </div>
            </div>

            <div className="mt-8 lg:mt-12">
              <p className="mb-4 text-muted-foreground text-sm italic sm:text-base">
                Análisis semántico que entiende el lenguaje hipotecario.
                Naturalmente.
              </p>

              {/* Demo Upload Area */}
              <div className="mx-auto max-w-md">
                <SmoothScrollLink href="/checkr/new" className="block">
                  <button
                    type="button"
                    className={cn(
                      "group relative flex min-h-[100px] w-full cursor-pointer items-center justify-center rounded-xl border-1 border-dashed p-4 transition-all duration-200 sm:min-h-[120px] sm:p-6",
                      "border-primary/30 hover:scale-105 hover:border-primary hover:bg-primary/5",
                    )}
                  >
                    <div className="space-y-2 text-center sm:space-y-3">
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border bg-background transition-colors sm:h-10 sm:w-10">
                        <Sparkles className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm sm:text-base">
                          Prueba con tu contrato
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          Análisis gratuito • Sin registro
                        </p>
                      </div>
                    </div>
                  </button>
                </SmoothScrollLink>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>

      {/* Simple Footer */}
      <footer className="border-border/30 border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Bot className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            <span className="font-bold text-foreground text-lg sm:text-xl">
              Hipoteca<span className="text-primary">Findr</span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} HipotecaFindr. Todos los derechos
            reservados.
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Análisis de hipotecas con IA • Desarrollado con ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
