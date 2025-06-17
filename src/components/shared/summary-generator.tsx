"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FileTextIcon, Settings2 } from "lucide-react";
import { useState } from "react";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh-CN", label: "Simplified Chinese" },
];

interface SummaryGeneratorProps {
  className?: string;
}

export function SummaryGenerator({ className }: SummaryGeneratorProps) {
  const [pageSelectionMode, setPageSelectionMode] = useState("all-pages");
  const [singlePage, setSinglePage] = useState("1");
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("11");
  const [language, setLanguage] = useState("en");
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  const handleGenerateSummary = () => {
    console.log("Generating summary with options:", {
      pageSelectionMode,
      singlePage: pageSelectionMode === "single-page" ? singlePage : undefined,
      startPage: pageSelectionMode === "pages-interval" ? startPage : undefined,
      endPage: pageSelectionMode === "pages-interval" ? endPage : undefined,
      language,
    });

    setGeneratedSummary(
      `This is a placeholder summary for the selected options (Mode: ${pageSelectionMode}, Language: ${language}). Replace this with actual AI-generated content.`,
    );
  };

  return (
    <div className={cn("flex h-full flex-col gap-3 p-3", className)}>
      <Accordion
        type="single"
        collapsible
        defaultValue="summarize-options"
        className="w-full"
      >
        <AccordionItem value="summarize-options" className="border-border/50">
          <AccordionTrigger className="px-2 py-2 font-medium text-sm hover:no-underline">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Summarize options
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 rounded-md bg-muted/30 px-2 pt-3 pb-2">
            <div className="space-y-3">
              <Label className="font-semibold text-muted-foreground text-xs">
                Select the pages you want to summarize
              </Label>
              <RadioGroup
                defaultValue="all-pages"
                onValueChange={setPageSelectionMode}
                className="space-y-1"
              >
                <div className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50">
                  <RadioGroupItem value="all-pages" id="all-pages" />
                  <Label
                    htmlFor="all-pages"
                    className="flex-1 cursor-pointer font-normal text-sm"
                  >
                    All pages
                  </Label>
                </div>

                <div className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50">
                  <RadioGroupItem value="single-page" id="single-page" />
                  <Label
                    htmlFor="single-page"
                    className="flex-1 cursor-pointer font-normal text-sm"
                  >
                    Single Page
                  </Label>
                  {pageSelectionMode === "single-page" && (
                    <Input
                      type="number"
                      min="1"
                      value={singlePage}
                      onChange={(e) => setSinglePage(e.target.value)}
                      className="h-7 w-16 text-sm"
                      aria-label="Single page number"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50">
                  <RadioGroupItem value="pages-interval" id="pages-interval" />
                  <Label
                    htmlFor="pages-interval"
                    className="flex-1 cursor-pointer font-normal text-sm"
                  >
                    Pages interval
                  </Label>
                  {pageSelectionMode === "pages-interval" && (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="1"
                        value={startPage}
                        onChange={(e) => setStartPage(e.target.value)}
                        className="h-7 w-14 text-sm"
                        aria-label="Start page for interval"
                      />
                      <span className="text-muted-foreground text-sm">–</span>
                      <Input
                        type="number"
                        min="1"
                        value={endPage}
                        onChange={(e) => setEndPage(e.target.value)}
                        className="h-7 w-14 text-sm"
                        aria-label="End page for interval"
                      />
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="file-summary-language-selector"
                className="font-semibold text-muted-foreground text-xs"
              >
                Select the language for the summary
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  id="file-summary-language-selector"
                  className="h-8 text-sm"
                >
                  <SelectValue placeholder="Use default language preference" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className="text-sm"
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateSummary}
              className="h-8 w-full text-sm"
            >
              Generate Summary
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex-1 overflow-y-auto rounded-md border bg-background p-3">
        {generatedSummary ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h3 className="mb-2 font-semibold text-base">Generated Summary:</h3>
            <p className="text-muted-foreground text-sm">{generatedSummary}</p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <FileTextIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="mb-1 font-medium text-sm">
              This file has no summaries yet.
            </p>
            <p className="text-xs">
              Configure options above and click "Generate Summary".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
