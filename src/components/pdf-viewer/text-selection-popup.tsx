"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Utility to extract <explanation> and <sources> from the AI response
function parseExplanationAndSources(content: string): {
  explanation: string;
  sources: { name: string; pages: number[] }[];
} {
  const explanationMatch = content.match(
    /<explanation>([\s\S]*?)<\/explanation>/,
  );
  const sourcesMatch = content.match(/<sources>([\s\S]*?)<\/sources>/);
  const explanation = explanationMatch ? explanationMatch[1].trim() : content;
  const sources: { name: string; pages: number[] }[] = [];
  if (sourcesMatch) {
    const sourcesXml = sourcesMatch[1];
    const sourceMatches = sourcesXml.matchAll(/<source>([\s\S]*?)<\/source>/g);
    for (const match of sourceMatches) {
      const sourceXml = match[1];
      const nameMatch = sourceXml.match(/<name>([\s\S]*?)<\/name>/);
      const pagesMatch = sourceXml.match(/<pages>([\s\S]*?)<\/pages>/);
      if (nameMatch && pagesMatch) {
        const pages =
          pagesMatch[1]
            .match(/<page>(\d+)<\/page>/g)
            ?.map((p) =>
              Number.parseInt(p.replace(/<page>(\d+)<\/page>/, "$1"), 10),
            ) || [];
        sources.push({ name: nameMatch[1].trim(), pages });
      }
    }
  }
  return { explanation, sources };
}

function SourcesBox({
  sources,
}: { sources: { name: string; pages: number[] }[] }) {
  if (!sources.length) return null;
  const mortgagePdf =
    "https://www.bde.es/f/webbde/Secciones/Publicaciones/Folletos/Fic/Guia_hipotecaria_2013.pdf";
  const contractDoc =
    "https://o6dbw19iyd.ufs.sh/f/dgFwWFXCXZVhT5Loy8B7YUFvSi8RlzkwVJnbZ6ypt93rXGOs";
  return (
    <div className="mt-3 rounded-md border border-gray-400 border-dotted bg-muted/60 p-2 text-muted-foreground text-xs dark:border-green-700 dark:text-green-400">
      <div className="mb-1 font-bold text-[0.7rem] text-gray-700 uppercase tracking-widest dark:text-green-400">
        Referencias
      </div>
      <div className="space-y-1">
        {sources.map((source, i) => {
          let link: string | null = null;
          if (source.name === "Mortgage Knowledge" && source.pages.length > 0) {
            link = `${mortgagePdf}#page=${source.pages[0]}`;
          } else if (source.name === "Contract Context") {
            link = `${contractDoc}#page=${source.pages[0]}`;
          }
          return (
            <div
              key={`${source.name}-${source.pages.join("-")}`}
              className="flex items-baseline gap-2"
            >
              <span className="inline-block min-w-[1.5em] text-center font-bold text-green-700 dark:text-green-400">
                {i + 1}.
              </span>
              <span className="flex items-center gap-1">
                {source.name === "Mortgage Knowledge"
                  ? "Guía Hipotecaria del Banco de España"
                  : "Tu contrato hipotecario"}
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-green-700 hover:underline dark:text-green-400"
                    title="Abrir documento de referencia"
                  >
                    <span style={{ fontSize: "1em", verticalAlign: "middle" }}>
                      🔗
                    </span>
                  </a>
                )}
              </span>
              <span className="ml-2 text-[0.9em] text-gray-500 dark:text-green-700">
                Páginas: {source.pages.join(", ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TextSelectionPopupProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
  onSubmitQuestion: (question: string, selectedText: string) => void;
  isLoading?: boolean;
  aiResponse?: string;
  aiError?: string;
}

export function TextSelectionPopup({
  selectedText,
  position,
  onClose,
  onSubmitQuestion,
  isLoading = false,
  aiResponse,
  aiError,
}: TextSelectionPopupProps) {
  const [question, setQuestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Auto-focus textarea when popup opens
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        // Add a delay to avoid interfering with text selection
        setTimeout(() => {
          onClose();
        }, 200);
      }
    };

    // Use mouseup instead of mousedown to avoid conflicts with text selection
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = () => {
    if (question.trim() && !isLoading) {
      onSubmitQuestion(question.trim(), selectedText);
      setQuestion("");
    }
  };

  // Calculate popup position to avoid going off-screen
  const getPopupStyle = () => {
    const popup = popupRef.current;
    if (!popup) return { left: position.x, top: position.y };

    const rect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = position.x;
    let top = position.y;

    // Adjust horizontal position if popup would go off-screen (400px width)
    if (left + 400 > viewportWidth) {
      left = viewportWidth - 420; // 400px width + 20px margin
    }
    if (left < 20) {
      left = 20;
    }

    // Adjust vertical position if popup would go off-screen (larger height for AI response)
    const estimatedHeight = aiResponse ? 300 : 160;
    if (top + estimatedHeight > viewportHeight) {
      top = position.y - estimatedHeight - 20; // Place above selection
    }
    if (top < 20) {
      top = 20;
    }

    return { left, top };
  };

  const popupStyle = getPopupStyle();

  return (
    <div
      ref={popupRef}
      data-text-selection-popup
      className="fade-in-0 zoom-in-95 fixed z-50 w-96 animate-in duration-200"
      style={{
        left: `${popupStyle.left}px`,
        top: `${popupStyle.top}px`,
      }}
    >
      <Card className="gap-0 border-border bg-background p-2 shadow-lg">
        <CardHeader className="px-3 pt-2 pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 font-medium text-sm">
              <MessageCircle className="h-3.5 w-3.5 text-primary" />
              Preguntar
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-5 w-5 p-0"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-3 pt-0 pb-3">
          {/* Selected text preview - more compact */}
          <div className="max-h-12 overflow-y-auto rounded bg-muted/30 text-muted-foreground text-xs">
            "
            {selectedText.length > 80
              ? `${selectedText.substring(0, 80)}...`
              : selectedText}
            "
          </div>

          {/* Question input with send button overlay */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Qué significa esto? ¿Es normal?"
              className="min-h-[50px] resize-none pr-10 text-sm"
              disabled={isLoading}
            />

            {/* Send button positioned over textarea */}
            <Button
              onClick={handleSubmit}
              size="sm"
              disabled={!question.trim() || isLoading}
              className="absolute right-2 bottom-2 h-6 w-6 rounded-full p-0"
            >
              {isLoading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* AI Response */}
          {(aiResponse || aiError || isLoading) && (
            <div className="mt-3 rounded-md border bg-accent/50 p-3">
              {isLoading && !aiResponse && (
                <div className="text-center text-muted-foreground text-sm">
                  <div className="mb-2 animate-pulse font-medium text-primary">
                    Buscando información…
                  </div>
                </div>
              )}

              {aiResponse &&
                (() => {
                  const { explanation, sources } =
                    parseExplanationAndSources(aiResponse);
                  return (
                    <div className="text-foreground text-sm">
                      <div className="whitespace-pre-line">{explanation}</div>
                      <SourcesBox sources={sources} />
                    </div>
                  );
                })()}

              {aiError && (
                <div className="text-destructive text-sm">Error: {aiError}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
