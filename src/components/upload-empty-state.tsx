"use client";

import { processPDF } from "@/actions/process-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFiles } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { ArrowUpFromLine, Plus, Sparkles, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function UploadEmptyState() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handleFileSelect = (file: File) => {
    if (!file || file.type !== "application/pdf") {
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    // Verify user is authenticated
    if (!user) {
      console.error("User not authenticated");
      alert("Debes iniciar sesión para analizar documentos");
      return;
    }

    console.log("Starting PDF analysis for user:", user.id);
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
        // Redirect to analysis page with key, runId and token for subscription
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
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

  const removeFile = () => {
    setSelectedFile(null);
  };

  // File Preview State
  if (selectedFile) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="w-full max-w-xl space-y-6">
          {/* Header - Same height as initial state */}
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-20 items-center justify-center">
              <img
                src="/eye-blueprint.webp"
                alt="HipotecaFindr"
                width={80}
                height={80}
              />
            </div>
            <h2 className="font-semibold text-2xl text-foreground">
              Archivo Seleccionado
            </h2>
            <p className="mx-auto max-w-sm text-muted-foreground text-sm">
              Revisa tu archivo y haz clic en "Analizar" para empezar a
              comprender tu hipoteca
            </p>
          </div>

          {/* File Preview - Same structure as upload area */}
          <div className="relative flex min-h-[140px] items-center justify-center rounded-xl border border-border bg-muted/20 p-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center">
                <img
                  src="/pdf-red-icon.webp"
                  alt="PDF"
                  height={60}
                  width={60}
                />
              </div>
              <div>
                <p className="mx-auto max-w-[200px] truncate font-medium text-foreground text-sm">
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Listo para
                  analizar
                </p>
              </div>
            </div>

            {/* Remove button positioned absolutely */}
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="absolute top-3 right-3 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons - Same height */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={removeFile}
              disabled={isAnalyzing}
              className="h-9 flex-1 rounded-lg border-none bg-muted/50 px-3 text-foreground text-sm shadow-sm hover:bg-muted focus:bg-muted focus-visible:bg-muted"
            >
              <Plus className="mr-2 h-4 w-4" />
              Cambiar Archivo
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="h-9 flex-1 rounded-lg px-3 text-sm"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analizar Hipoteca
                </>
              )}
            </Button>
          </div>

          {/* Info - Same height */}
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground text-xs">
              El análisis puede tomar unos segundos
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground/70 text-xs">
              <div className="h-1 w-1 rounded-full bg-current" />
              <span>Análisis seguro y privado</span>
              <div className="h-1 w-1 rounded-full bg-current" />
              <span>Procesamiento con IA</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial Upload State
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex items-center justify-center">
            <img
              src="/pdf-blueprint.webp"
              alt="HipotecaFindr"
              width={80}
              height={80}
            />
          </div>
          <h2 className="font-semibold text-2xl text-foreground">
            Analiza tu Hipoteca
          </h2>
          <p className="mx-auto max-w-sm text-muted-foreground text-sm">
            Sube tu contrato de hipoteca en PDF y obtén un análisis detallado
            con IA
          </p>
        </div>

        {/* Upload Area */}
        <button
          type="button"
          className={cn(
            "group relative flex min-h-[140px] w-full cursor-pointer items-center justify-center rounded-xl border-1 border-dashed p-8 transition-all duration-200",
            isDragOver
              ? "scale-105 border-primary bg-primary/5"
              : "border-primary/30 hover:bg-muted/50",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Subir archivo PDF"
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-background transition-colors">
              <ArrowUpFromLine className="h-6 w-6 text-muted-foreground transition-colors" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                Arrastra tu PDF aquí
              </p>
              <p className="text-muted-foreground text-xs">
                O haz clic para seleccionar un archivo
              </p>
            </div>
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </button>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 flex-1 rounded-lg border-none bg-muted/50 px-3 text-foreground text-sm shadow-sm hover:bg-muted focus:bg-muted focus-visible:bg-muted"
          >
            <Plus className="mr-2 h-4 w-4" />
            Seleccionar PDF
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 flex-1 rounded-lg px-3 text-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Comenzar Análisis
          </Button>
        </div>

        {/* Info */}
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-xs">
            Formatos soportados: PDF • Tamaño máximo: 10MB
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground/70 text-xs">
            <div className="h-1 w-1 rounded-full bg-current" />
            <span>Análisis seguro y privado</span>
            <div className="h-1 w-1 rounded-full bg-current" />
            <span>Procesamiento con IA</span>
          </div>
          {user && (
            <p className="mt-2 text-muted-foreground/60 text-xs">
              Conectado como:{" "}
              {user.firstName ||
                user.username ||
                user.emailAddresses[0]?.emailAddress}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
