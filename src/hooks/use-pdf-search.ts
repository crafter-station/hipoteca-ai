import { createMatcher } from "@/lib/pdf-utils";
import type { SearchMode, SearchResult, SearchState } from "@/types/pdf-viewer";
import { useState } from "react";

export const usePDFSearch = () => {
  const [state, setState] = useState<SearchState>({
    showSearch: false,
    searchTerm: "",
    searchMode: "contains",
    searchResults: [],
    currentResultIndex: -1,
    isSearching: false,
    pageTexts: new Map(),
  });

  const setShowSearch = (show: boolean) => {
    setState((prev) => ({ ...prev, showSearch: show }));
  };

  const setSearchTerm = (term: string) => {
    setState((prev) => ({ ...prev, searchTerm: term }));
  };

  const setSearchMode = (mode: SearchMode) => {
    setState((prev) => ({ ...prev, searchMode: mode }));
  };

  const setSearchResults = (results: SearchResult[]) => {
    setState((prev) => ({
      ...prev,
      searchResults: results,
      currentResultIndex: results.length > 0 ? 0 : -1,
    }));
  };

  const setCurrentResultIndex = (index: number) => {
    setState((prev) => ({ ...prev, currentResultIndex: index }));
  };

  const setIsSearching = (searching: boolean) => {
    setState((prev) => ({ ...prev, isSearching: searching }));
  };

  const setPageTexts = (pageTexts: Map<number, any>) => {
    setState((prev) => ({ ...prev, pageTexts }));
  };

  const searchInPDF = async (pdf: any, totalPages: number) => {
    if (!pdf || !state.searchTerm.trim()) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const searchTerm = state.searchTerm.trim();
    console.log(
      `🔍 Starting PDF search with term: "${searchTerm.substring(
        0,
        100,
      )}..." mode: ${state.searchMode}`,
    );
    const matcher = createMatcher(searchTerm, state.searchMode);

    try {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1 });

        // Cache page text content
        setState((prev) => ({
          ...prev,
          pageTexts: new Map(prev.pageTexts.set(pageNum, textContent)),
        }));

        // Search through text items
        console.log(
          `🔍 Searching page ${pageNum}, found ${textContent.items.length} text items`,
        );
        let pageMatches = 0;
        textContent.items.forEach((item: any, index: number) => {
          const text = item.str;
          if (matcher(text)) {
            pageMatches++;
            console.log(`✅ Found match in item ${index}: "${text}"`);
            // Get context (surrounding text)
            const contextStart = Math.max(0, index - 2);
            const contextEnd = Math.min(textContent.items.length, index + 3);
            const context = textContent.items
              .slice(contextStart, contextEnd)
              .map((i: any) => i.str)
              .join(" ");

            results.push({
              pageNum,
              textIndex: index,
              text,
              context,
              position: {
                x: item.transform[4],
                y: viewport.height - item.transform[5],
                width: item.width,
                height: item.height,
              },
            });
          }
        });
        console.log(
          `📊 Page ${pageNum} search complete: ${pageMatches} matches found`,
        );
      }

      // Set results and return them for immediate use
      setSearchResults(results);
      return results;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const navigateToResult = (index: number) => {
    if (index >= 0 && index < state.searchResults.length) {
      setCurrentResultIndex(index);
      return state.searchResults[index];
    }
    return null;
  };

  const clearSearch = () => {
    setState((prev) => ({
      ...prev,
      searchTerm: "",
      searchResults: [],
      currentResultIndex: -1,
    }));
  };

  return {
    ...state,
    setShowSearch,
    setSearchTerm,
    setSearchMode,
    setSearchResults,
    setCurrentResultIndex,
    setIsSearching,
    setPageTexts,
    searchInPDF,
    navigateToResult,
    clearSearch,
  };
};
