import type { SearchMode, TextMatch } from "@/types/pdf-viewer";

/**
 * Simple fuzzy matching algorithm
 */
export const fuzzyMatch = (
  text: string,
  pattern: string,
  threshold: number,
): boolean => {
  if (pattern.length === 0) return true;
  if (text.length === 0) return false;

  const matrix: number[][] = [];
  for (let i = 0; i <= text.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= pattern.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= text.length; i++) {
    for (let j = 1; j <= pattern.length; j++) {
      if (text[i - 1] === pattern[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1,
        );
      }
    }
  }

  const distance = matrix[text.length][pattern.length];
  const similarity = 1 - distance / Math.max(text.length, pattern.length);
  return similarity >= threshold;
};

/**
 * Create a matcher function based on search mode
 */
export const createMatcher = (term: string, mode: SearchMode) => {
  switch (mode) {
    case "exact":
      return (text: string) => text === term;
    case "contains":
      return (text: string) => text.toLowerCase().includes(term.toLowerCase());
    case "regex":
      try {
        const regex = new RegExp(term, "gi");
        return (text: string) => regex.test(text);
      } catch {
        return () => false;
      }
    case "fuzzy":
      return (text: string) =>
        fuzzyMatch(text.toLowerCase(), term.toLowerCase(), 0.8);
    case "wholeWord": {
      const wordRegex = new RegExp(
        `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "gi",
      );
      return (text: string) => wordRegex.test(text);
    }
    default:
      return () => false;
  }
};

/**
 * Find all matches in text based on search mode
 */
export const findAllMatches = (
  text: string,
  searchTerm: string,
  mode: SearchMode,
): TextMatch[] => {
  const matches: TextMatch[] = [];
  if (!searchTerm) return matches;

  switch (mode) {
    case "exact": {
      let exactStartIndex = 0;
      while (true) {
        const index = text.indexOf(searchTerm, exactStartIndex);
        if (index === -1) break;
        matches.push({
          start: index,
          end: index + searchTerm.length,
          text: text.substring(index, index + searchTerm.length),
        });
        exactStartIndex = index + searchTerm.length;
      }
      break;
    }
    case "contains": {
      const lowerTextContains = text.toLowerCase();
      const lowerTermContains = searchTerm.toLowerCase();
      let containsStartIndex = 0;
      while (true) {
        const index = lowerTextContains.indexOf(
          lowerTermContains,
          containsStartIndex,
        );
        if (index === -1) break;
        matches.push({
          start: index,
          end: index + searchTerm.length,
          text: text.substring(index, index + searchTerm.length),
        });
        containsStartIndex = index + 1;
      }
      break;
    }
    case "wholeWord": {
      const wordRegex = new RegExp(
        `\\b(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`,
        "gi",
      );
      const matchRegex = wordRegex.exec(text);
      if (matchRegex) {
        matches.push({
          start: matchRegex.index,
          end: matchRegex.index + matchRegex[0].length,
          text: matchRegex[0],
        });
      }
      break;
    }
    case "regex":
      try {
        const regex = new RegExp(searchTerm, "gi");
        const matchRegex = regex.exec(text);
        if (matchRegex) {
          matches.push({
            start: matchRegex.index,
            end: matchRegex.index + matchRegex[0].length,
            text: matchRegex[0],
          });
          if (!regex.global) break;
        }
      } catch (e) {
        console.error("Regex error:", e);
      }
      break;
    case "fuzzy": {
      const words = text.split(/\s+/);
      let currentPos = 0;
      for (const word of words) {
        const wordStart = text.indexOf(word, currentPos);
        if (fuzzyMatch(word.toLowerCase(), searchTerm.toLowerCase(), 0.8)) {
          matches.push({
            start: wordStart,
            end: wordStart + word.length,
            text: word,
          });
        }
        currentPos = wordStart + word.length;
      }
      break;
    }
  }
  return matches;
};

/**
 * Calculate responsive scale based on container width
 */
export const calculateResponsiveScale = (
  containerWidth: number,
  pageViewport: { width: number; height: number },
  currentScale: number,
): number => {
  const maxScale = containerWidth / pageViewport.width;
  return Math.min(currentScale, maxScale);
};

/**
 * Load PDF.js library dynamically
 */
export const loadPDFJS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve();
      return;
    }

    // Load PDF.js CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf_viewer.min.css";
    document.head.appendChild(cssLink);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });
};
