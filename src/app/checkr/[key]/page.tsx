"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { PdfViewer } from "@/components/shared/pdf-viewer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PDFData {
  name: string;
  url: string;
  key: string;
}

export default function CheckrAnalysisPage() {
  const params = useParams();
  const key = params.key as string;
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (key) {
      // Construct the real UploadThing URL
      const pdfUrl = `https://o6dbw19iyd.ufs.sh/f/${key}`;

      // Set PDF data with real URL
      setPdfData({
        name: `hipoteca-${key.slice(0, 8)}.pdf`, // Generate a name based on key
        url: pdfUrl,
        key: key,
      });

      setIsLoading(false);
    }
  }, [key]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Application Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
          {/* Toggle sidebar button (visible on mobile) */}
          <SidebarTrigger variant="outline" />

          {/* Central content for mortgage PDF analysis */}
          <main className="flex-1 p-4">
            <div className="flex h-full flex-col gap-4">
              {/* PDF Header */}
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-foreground text-lg">
                    {pdfData?.name || "Cargando..."}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Análisis de contrato hipotecario • ID: {key}
                  </p>
                </div>
              </div>

              {/* PDF Viewer Area */}
              <div className="flex-1 overflow-hidden rounded-lg border border-border bg-background">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="max-w-md space-y-4 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                        <FileText className="h-8 w-8 animate-pulse text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-2 font-semibold text-foreground text-xl">
                          Cargando PDF...
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Preparando tu contrato de hipoteca para visualización
                        </p>
                      </div>
                    </div>
                  </div>
                ) : pdfData ? (
                  <PdfViewer pdfUrl={pdfData.url} className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="max-w-md space-y-4 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5">
                        <FileText className="h-8 w-8 text-destructive" />
                      </div>
                      <div>
                        <h3 className="mb-2 font-semibold text-foreground text-xl">
                          Error al cargar PDF
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          No se pudo encontrar el archivo solicitado
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
