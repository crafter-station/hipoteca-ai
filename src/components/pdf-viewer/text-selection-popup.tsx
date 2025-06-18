"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TextSelectionPopupProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
  onSubmitQuestion: (question: string, selectedText: string) => void;
  isLoading?: boolean;
}

export function TextSelectionPopup({
  selectedText,
  position,
  onClose,
  onSubmitQuestion,
  isLoading = false,
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

    // Adjust horizontal position if popup would go off-screen (320px width)
    if (left + 320 > viewportWidth) {
      left = viewportWidth - 340; // 320px width + 20px margin
    }
    if (left < 20) {
      left = 20;
    }

    // Adjust vertical position if popup would go off-screen (even smaller height now)
    if (top + 160 > viewportHeight) {
      top = position.y - 180; // Place above selection
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
      className="fade-in-0 zoom-in-95 fixed z-50 w-80 animate-in duration-200"
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
        </CardContent>
      </Card>
    </div>
  );
}
