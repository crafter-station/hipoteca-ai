import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { HighlightLegend } from "./highlight-legend";

interface ToolbarProps {
  currentPage: number;
  totalPages: number;
  scale: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onToggleSearch: () => void;
}

export function Toolbar({
  currentPage,
  totalPages,
  scale,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onToggleSearch,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-card p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage <= 1}
          title="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          title="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <HighlightLegend />
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSearch}
          title="Search in document"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="min-w-[60px] text-center text-muted-foreground text-sm">
          {Math.round(scale * 100)}%
        </span>
        <Button variant="outline" size="sm" onClick={onZoomIn} title="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          title="Toggle fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
