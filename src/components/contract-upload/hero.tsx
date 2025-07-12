"use client";

import { processPDF } from "@/actions/process-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFiles } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import {
  ArrowUpFromLine,
  Eye,
  Loader2,
  Lock,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function ContractUploadHero() {
  const router = useRouter();
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

  const handleAnalyzeContract = async () => {
    if (!selectedFile) return;

    console.log("Starting PDF analysis");
    setIsAnalyzing(true);
    try {
      const [{ ufsUrl, name, key }] = await uploadFiles("documentUploader", {
        files: [selectedFile],
        onUploadProgress: ({ file, progress }) => {
          console.log("Processing file", "progress", progress);
        },
      });

      console.log("File uploaded successfully:", { ufsUrl, name, key });
      const resp = await processPDF(ufsUrl, name);

      if (!resp.error && resp.runId && resp.token) {
        console.log("PDF processing started successfully:", resp);
        router.push(`/checkr/${key}?runId=${resp.runId}&token=${resp.token}`);
      } else {
        console.error("Error processing PDF:", resp.error);
        alert("Error al procesar el PDF. Por favor, inténtalo de nuevo.");
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error al subir el archivo. Por favor, inténtalo de nuevo.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-4 py-6 sm:min-h-screen sm:p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary-base/20 bg-primary-subtle px-3 py-1.5 font-medium text-primary-base text-xs">
            {selectedFile ? "📄 Archivo listo" : "🚀 Beta pública"}
          </div>
          <h1 className="mb-3 font-bold text-3xl text-text-base tracking-tight sm:mb-4 sm:text-4xl md:text-5xl">
            {selectedFile ? "¡Contrato Cargado!" : "Analiza tu Hipoteca"}
          </h1>
          {!selectedFile && (
            <p className="font-medium text-base text-text-subtle sm:text-lg">
              Gratis, sin registro, resultado en &lt;60 s.
            </p>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Upload Box */}
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
                  selectedFile ? "text-success-base" : "text-primary-base",
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
                      variant="success"
                      className="h-12 w-full cursor-pointer px-6 font-semibold text-base shadow-lg sm:h-14 sm:w-auto sm:px-10 sm:text-lg"
                      onClick={handleAnalyzeContract}
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
                    <span className="block sm:hidden">SUBIR CONTRATO</span>
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
              Sube tu contrato de hipoteca y recibe un análisis completo en
              minutos. Te ayudamos a entender todos los términos y condiciones
              de tu préstamo hipotecario.
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
  );
}
