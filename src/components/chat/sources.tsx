import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Source } from "@/lib/chat-utils";
import { Building2, ExternalLink, FileText } from "lucide-react";

interface SourcesProps {
  sources: Source[];
}

export function Sources({ sources }: SourcesProps) {
  if (sources.length === 0) return null;

  const mortgagePdf =
    "https://www.bde.es/f/webbde/Secciones/Publicaciones/Folletos/Fic/Guia_hipotecaria_2013.pdf";
  const contractDoc =
    "https://o6dbw19iyd.ufs.sh/f/dgFwWFXCXZVhT5Loy8B7YUFvSi8RlzkwVJnbZ6ypt93rXGOs";

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-border/50" />
        <span className="font-medium text-muted-foreground/70 text-xs uppercase tracking-wider">
          Referencias
        </span>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      <div className="space-y-2">
        {sources.map((source, index) => {
          let link: string | null = null;
          let documentName: string;
          let documentIcon: React.ReactNode;

          if (source.name === "Mortgage Knowledge") {
            link =
              source.pages.length > 0
                ? `${mortgagePdf}#page=${source.pages[0]}`
                : null;
            documentName = "Guía Hipotecaria BdE";
            documentIcon = (
              <Building2 className="h-3.5 w-3.5 text-muted-foreground/60" />
            );
          } else {
            link =
              source.pages.length > 0
                ? `${contractDoc}#page=${source.pages[0]}`
                : null;
            documentName = "Tu Contrato";
            documentIcon = (
              <FileText className="h-3.5 w-3.5 text-muted-foreground/60" />
            );
          }

          return (
            <div
              key={`${source.name}-${source.pages.join("-")}`}
              className="rounded-md border border-border/30 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted/50 font-medium text-muted-foreground/80 text-xs">
                      {index + 1}
                    </span>
                    {documentIcon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="truncate font-medium text-muted-foreground text-xs">
                        {documentName}
                      </span>
                      {source.pages.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {source.pages.slice(0, 3).map((page) => (
                            <Badge
                              key={page}
                              variant="outline"
                              className="h-auto border-border/50 px-1 py-0 text-muted-foreground/70 text-xs"
                            >
                              p.{page}
                            </Badge>
                          ))}
                          {source.pages.length > 3 && (
                            <Badge
                              variant="outline"
                              className="h-auto border-border/30 px-1 py-0 text-muted-foreground/50 text-xs"
                            >
                              +{source.pages.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {source.pages.length > 0 && (
                      <p className="text-muted-foreground/60 text-xs">
                        {source.pages.length === 1
                          ? "1 página referenciada"
                          : `${source.pages.length} páginas referenciadas`}
                      </p>
                    )}
                  </div>
                </div>

                {link && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 flex-shrink-0 p-0 hover:bg-muted/60 hover:text-muted-foreground"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Abrir ${documentName} en nueva pestaña`}
                      className="flex items-center justify-center"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
