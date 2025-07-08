"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  ArrowUpFromLine,
  Eye,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { WhatsAppIcon } from "./icons/whatsapp-icon";
import { XLogoIcon } from "./icons/x-logo-icon";

export function UploadEmptyState() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file || file.type !== "application/pdf") {
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="flex h-full w-full flex-col">
          <div className="flex min-h-[80vh] w-full items-center justify-center px-4 py-6 sm:min-h-screen sm:p-8">
            <div className="w-full max-w-4xl">
              {/* Header */}
              <div className="mb-8 text-center sm:mb-12">
                <div className="mb-4 inline-flex items-center rounded-full border border-primary-base/20 bg-primary-subtle px-3 py-1.5 font-medium text-primary-base text-xs">
                  {selectedFile ? "📄 Archivo listo" : "🚀 Beta pública"}
                </div>
                <h1 className="mb-3 font-bold text-3xl text-text-base tracking-tight sm:mb-4 sm:text-4xl md:text-5xl">
                  {selectedFile ? "¡Archivo Cargado!" : "Analiza tu Hipoteca"}
                </h1>
                <p className="font-medium text-base text-text-subtle sm:text-lg">
                  {selectedFile
                    ? "Comenzando análisis de tu contrato..."
                    : "Gratis, sin registro, resultado en <60 s."}
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {/* Upload Box */}
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <div
                  className={cn(
                    "group relative flex min-h-[140px] w-full cursor-pointer items-center justify-center rounded-xl border border-primary/30 border-dashed p-6 transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:bg-primary/5 sm:min-h-[160px] sm:p-8",
                    isDragOver && "scale-[1.02] border-primary bg-primary/5",
                    selectedFile &&
                      "border-success-base/30 bg-success-subtle/10 hover:border-success-base hover:bg-success-subtle/20",
                  )}
                  {...(!selectedFile && {
                    onDrop: handleDrop,
                    onDragOver: handleDragOver,
                    onDragLeave: handleDragLeave,
                    onClick: () => fileInputRef.current?.click(),
                  })}
                >
                  <div className="p-6 text-center sm:p-8 md:p-12">
                    {/* PDF Icon */}
                    <div
                      className={cn(
                        "mx-auto mb-6 flex h-12 w-12 items-center justify-center sm:mb-8 sm:h-16 sm:w-16",
                        selectedFile
                          ? "text-success-base"
                          : "text-primary-base",
                      )}
                    >
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-label="PDF Document Icon"
                      >
                        <title>PDF Document Icon</title>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                    </div>

                    {selectedFile ? (
                      <>
                        {/* File Info */}
                        <p className="mb-2 break-all font-medium text-text-base">
                          {selectedFile.name}
                        </p>
                        <p className="mb-6 text-sm text-text-soft">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                          <Button
                            size="lg"
                            className="h-12 w-full cursor-pointer bg-success-base px-6 font-semibold text-base text-success-foreground shadow-lg hover:bg-success-darker sm:h-14 sm:w-auto sm:px-10 sm:text-lg"
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="mr-3 size-5 animate-spin sm:size-6" />
                                <span>PROCESANDO...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-3 size-5 sm:size-6" />
                                <span>ANALIZAR HIPOTECA</span>
                              </>
                            )}
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="h-12 w-full cursor-pointer px-6 font-semibold text-base sm:h-14 sm:w-auto sm:px-10 sm:text-lg"
                            onClick={handleCancelUpload}
                          >
                            <X className="mr-3 size-5 sm:size-6" />
                            <span>CANCELAR</span>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Upload Button */}
                        <Button
                          size="lg"
                          className="mb-4 h-12 w-full cursor-pointer bg-primary-base px-6 font-semibold text-base text-primary-foreground shadow-lg hover:bg-primary-darker sm:mb-6 sm:h-14 sm:w-auto sm:px-10 sm:text-lg"
                        >
                          <ArrowUpFromLine className="mr-3 size-5 sm:size-6" />
                          <span className="block sm:hidden">
                            SUBIR CONTRATO
                          </span>
                          <span className="hidden sm:block">
                            SUBIR CONTRATO DE HIPOTECA
                          </span>
                        </Button>

                        {/* Drop Text */}
                        <p className="text-text-soft text-xs sm:text-sm">
                          o arrastra los archivos aquí
                        </p>

                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleInputChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Simple Description */}
                <div className="text-center">
                  <p className="mx-auto max-w-2xl text-sm text-text-subtle leading-relaxed sm:text-base">
                    Sube tu contrato de hipoteca y recibe un análisis completo
                    en minutos. Te ayudamos a entender todos los términos y
                    condiciones de tu préstamo hipotecario.
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 py-3 sm:gap-8 sm:py-4">
                  <div className="flex items-center gap-2 text-text-soft text-xs">
                    <Shield className="h-4 w-4" />
                    <span>GDPR</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-soft text-xs">
                    <Lock className="h-4 w-4" />
                    <span>SSL 256-bit</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-soft text-xs">
                    <Eye className="h-4 w-4" />
                    <span>No almacenamos tu contrato</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - Below the fold */}
          <div className="w-full bg-ui-subtle py-12 sm:py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-8">
              {/* Section Header */}
              <div className="mb-10 text-center sm:mb-16">
                {/* Badge */}
                <div className="mb-3 inline-flex items-center rounded-full border border-primary-base/20 bg-primary-subtle px-3 py-1.5 font-medium text-primary-base text-xs sm:mb-4">
                  ✨ Análisis con IA
                </div>
                <h2 className="mb-2 font-semibold text-2xl text-text-base sm:mb-3 sm:text-3xl">
                  ¿Qué obtendrás en menos de un minuto?
                </h2>
                <p className="mx-auto max-w-2xl text-sm text-text-subtle sm:text-base">
                  Nuestra IA analiza tu contrato de hipoteca y te ofrece
                  información clara y accionable para que tomes las mejores
                  decisiones.
                </p>
              </div>

              {/* Feature Cards - Grid */}
              <div className="mb-12 grid grid-cols-1 items-center gap-8 rounded-2xl border border-border-base bg-ui-base p-6 sm:mb-20 sm:gap-12 sm:p-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <h3 className="font-semibold text-text-base text-xl sm:text-2xl">
                    Resumen Inteligente en Español
                  </h3>
                  <p className="text-sm text-text-subtle leading-relaxed sm:text-base">
                    Olvídate del lenguaje legal complicado. Te damos un resumen
                    claro de los puntos más importantes de tu hipoteca: cuánto
                    pagas, cuándo, y qué condiciones tienes.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-info-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Términos clave explicados de forma sencilla
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-info-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Cronograma de pagos visualizado
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-info-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Condiciones especiales destacadas
                      </span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full sm:mt-6 sm:w-auto">
                    Ver ejemplo de resumen
                    <ArrowUpFromLine className="ml-3 h-4 w-4 rotate-90" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-md rounded-2xl border border-border-base bg-ui-subtle p-6 shadow-lg sm:p-8">
                    <div className="space-y-4">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info-subtle sm:h-8 sm:w-8">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-info-base"
                          >
                            <title>Resumen de documento</title>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-xs sm:text-sm">
                          Tu Hipoteca Resumida
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full rounded bg-ui-soft" />
                        <div className="h-3 w-4/5 rounded bg-ui-soft" />
                        <div className="rounded border-info-base border-l-4 bg-info-subtle p-3">
                          <div className="font-medium text-[10px] text-info-base sm:text-xs">
                            Cuota mensual: €1,247
                          </div>
                        </div>
                        <div className="h-3 w-full rounded bg-ui-soft" />
                        <div className="h-3 w-3/4 rounded bg-ui-soft" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Semáforo de Riesgos (Image Left) */}
              <div className="mb-12 grid grid-cols-1 items-center gap-8 rounded-2xl border border-border-base bg-ui-base p-6 sm:mb-20 sm:gap-12 sm:p-8 lg:grid-cols-2">
                <div className="order-2 flex justify-center lg:order-1">
                  <div className="w-full max-w-md rounded-2xl border border-border-base bg-ui-subtle p-6 shadow-lg sm:p-8">
                    <div className="space-y-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info-subtle sm:h-8 sm:w-8">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-info-base"
                          >
                            <title>Análisis de riesgos</title>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-xs sm:text-sm">
                          Análisis de Riesgos
                        </h4>
                      </div>

                      <div className="text-center">
                        <div className="mb-1 font-bold text-2xl text-info-base sm:mb-2 sm:text-3xl">
                          85/100
                        </div>
                        <div className="mb-3 text-[10px] text-text-soft sm:mb-4 sm:text-xs">
                          Puntuación de tu hipoteca
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-success-subtle p-2 sm:p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-success-base" />
                            <span className="font-medium text-xs sm:text-sm">
                              Tipo de interés
                            </span>
                          </div>
                          <span className="text-[10px] text-success-base sm:text-xs">
                            Bueno
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-warning-subtle p-2 sm:p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-warning-base" />
                            <span className="font-medium text-xs sm:text-sm">
                              Comisiones
                            </span>
                          </div>
                          <span className="text-[10px] text-warning-base sm:text-xs">
                            Revisar
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-error-subtle p-2 sm:p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-error-base" />
                            <span className="font-medium text-xs sm:text-sm">
                              Cláusula suelo
                            </span>
                          </div>
                          <span className="text-[10px] text-error-base sm:text-xs">
                            Atención
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 space-y-6 lg:order-2">
                  <h3 className="font-semibold text-text-base text-xl sm:text-2xl">
                    Semáforo de Riesgos y Costos
                  </h3>
                  <p className="text-sm text-text-subtle leading-relaxed sm:text-base">
                    Te mostramos qué cláusulas son favorables, cuáles debes
                    revisar y cuáles requieren tu atención inmediata. Todo con
                    un sistema de colores fácil de entender.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-success-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Verde: Condiciones favorables
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-warning-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Amarillo: Revisar antes de firmar
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-error-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Rojo: Requiere atención inmediata
                      </span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full sm:mt-6 sm:w-auto">
                    Ver análisis de riesgos
                    <ArrowUpFromLine className="ml-3 h-4 w-4 rotate-90" />
                  </Button>
                </div>
              </div>

              {/* Feature 3: Chat/Pregúntale (Image Right) */}
              <div className="mb-12 grid grid-cols-1 items-center gap-8 rounded-2xl border border-border-base bg-ui-base p-6 sm:mb-20 sm:gap-12 sm:p-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <h3 className="font-semibold text-text-base text-xl sm:text-2xl">
                    Pregúntale a tu Hipoteca
                  </h3>
                  <p className="text-sm text-text-subtle leading-relaxed sm:text-base">
                    Haz preguntas específicas sobre tu contrato en lenguaje
                    natural. Nuestra IA te responde al instante basándose en la
                    información de tu documento.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-info-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Preguntas en español natural
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-info-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Respuestas basadas en tu contrato
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-info-base" />
                      <span className="text-text-subtle text-xs sm:text-sm">
                        Explicaciones claras y detalladas
                      </span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full sm:mt-6 sm:w-auto">
                    Prueba el chat inteligente
                    <ArrowUpFromLine className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-md rounded-2xl border border-border-base bg-ui-subtle p-6 shadow-lg sm:p-8">
                    <div className="space-y-4">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info-subtle sm:h-8 sm:w-8">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-info-base"
                          >
                            <title>Chat inteligente</title>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-xs sm:text-sm">
                          Chat con tu Hipoteca
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {/* User message */}
                        <div className="flex justify-end">
                          <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary-base px-2.5 py-1.5 text-[10px] text-primary-foreground sm:px-3 sm:py-2 sm:text-xs">
                            ¿Puedo hacer pagos anticipados?
                          </div>
                        </div>

                        {/* Bot response */}
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border-base bg-ui-soft px-3 py-2 text-xs">
                            <p className="mb-1 font-medium text-success-base">
                              ¡Sí puedes! 🎉
                            </p>
                            <p className="text-text-base">
                              Tu contrato permite pagos anticipados sin comisión
                              hasta el 10% anual del capital pendiente.
                            </p>
                          </div>
                        </div>

                        {/* Typing indicator */}
                        <div className="flex justify-start">
                          <div className="rounded-2xl rounded-bl-sm border border-border-base bg-ui-soft px-3 py-2 text-xs">
                            <div className="flex gap-1">
                              <div className="h-1 w-1 animate-pulse rounded-full bg-text-soft" />
                              <div
                                className="h-1 w-1 animate-pulse rounded-full bg-text-soft"
                                style={{ animationDelay: "0.2s" }}
                              />
                              <div
                                className="h-1 w-1 animate-pulse rounded-full bg-text-soft"
                                style={{ animationDelay: "0.4s" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="w-full border-border-base border-t bg-ui-base py-8 sm:py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-8">
              {/* Share Section */}
              <div className="space-y-4 text-center sm:space-y-6">
                <h3 className="font-semibold text-text-base text-xl sm:text-2xl">
                  ¿Te ha resultado útil?
                </h3>
                <p className="mx-auto max-w-2xl text-sm text-text-subtle sm:text-base">
                  Comparte HipotecaFindr con otros que estén buscando entender
                  mejor sus hipotecas.
                </p>
                {/* Social Share Buttons */}
                <div className="mb-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-full border-border-base text-text-subtle hover:text-info-base sm:h-9 sm:w-auto"
                  >
                    <WhatsAppIcon className="mr-2.5 h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-full border-border-base text-text-subtle hover:text-info-base sm:h-9 sm:w-auto"
                  >
                    <Mail className="mr-2.5 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-full border-border-base text-text-subtle hover:text-info-base sm:h-9 sm:w-auto"
                  >
                    <XLogoIcon className="mr-2.5 h-4 w-4" />
                    Tweet
                  </Button>
                </div>
              </div>

              {/* Legal Footer */}
              <div className="mt-auto space-y-4 border-border-base border-t px-4 py-6 text-center sm:space-y-6 sm:px-6 sm:py-8">
                <p className="mx-auto max-w-4xl text-text-soft text-xs leading-relaxed">
                  <strong className="text-text-base">Aviso Legal:</strong> Este
                  análisis es únicamente informativo y no constituye
                  asesoramiento financiero, legal o fiscal. Te recomendamos
                  consultar con un profesional antes de tomar decisiones
                  importantes sobre tu hipoteca. No nos hacemos responsables de
                  las decisiones tomadas basándose exclusivamente en esta
                  información.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 text-text-soft text-xs sm:flex-row sm:gap-6">
                  <span className="order-last sm:order-first">
                    © {new Date().getFullYear()} HipotecaFindr
                  </span>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 sm:gap-x-6">
                    <button
                      type="button"
                      className="transition-colors hover:text-text-base"
                    >
                      Términos de Uso
                    </button>
                    <span className="hidden sm:inline">•</span>
                    <button
                      type="button"
                      className="transition-colors hover:text-text-base"
                    >
                      Política de Privacidad
                    </button>
                    <span className="hidden sm:inline">•</span>
                    <button
                      type="button"
                      className="transition-colors hover:text-text-base"
                    >
                      Contacto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
