import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchMode, SearchResult } from "@/types/pdf-viewer";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

interface SearchPanelProps {
  showSearch: boolean;
  searchTerm: string;
  searchMode: SearchMode;
  isSearching: boolean;
  searchResults: SearchResult[];
  currentResultIndex: number;
  onSearchTermChange: (term: string) => void;
  onSearchModeChange: (mode: SearchMode) => void;
  onSearch: () => void;
  onClose: () => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
}

export function SearchPanel({
  showSearch,
  searchTerm,
  searchMode,
  isSearching,
  searchResults,
  currentResultIndex,
  onSearchTermChange,
  onSearchModeChange,
  onSearch,
  onClose,
  onNavigatePrevious,
  onNavigateNext,
}: SearchPanelProps) {
  if (!showSearch) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="border-b bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in PDF..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            autoFocus
          />
          <Select value={searchMode} onValueChange={onSearchModeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="exact">Exact</SelectItem>
              <SelectItem value="wholeWord">Whole Word</SelectItem>
              <SelectItem value="regex">Regex</SelectItem>
              <SelectItem value="fuzzy">Fuzzy</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onSearch} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""}
            </Badge>
            {currentResultIndex >= 0 && (
              <span className="text-muted-foreground text-sm">
                {currentResultIndex + 1} of {searchResults.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigatePrevious}
              disabled={searchResults.length === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateNext}
              disabled={searchResults.length === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
