import type { SpanMatch, TextMatch } from "@/types/pdf-viewer";

/**
 * Build a complete text map from text spans
 */
export const buildTextMap = (textSpans: HTMLSpanElement[]) => {
  let completeText = "";
  const indexMap: { textNode: Text; offset: number }[] = [];
  let lastCharWasSpace = true;

  for (const span of textSpans) {
    if (span.firstChild?.nodeType === Node.TEXT_NODE) {
      const textNode = span.firstChild as Text;
      const text = textNode.textContent || "";

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const isSpace = /\s/.test(char);

        if (isSpace) {
          if (!lastCharWasSpace) {
            completeText += " ";
            indexMap.push({ textNode, offset: i });
          }
        } else {
          completeText += char;
          indexMap.push({ textNode, offset: i });
        }
        lastCharWasSpace = isSpace;
      }

      if (!lastCharWasSpace) {
        completeText += " ";
        indexMap.push({ textNode, offset: text.length });
        lastCharWasSpace = true;
      }
    }
  }

  return { completeText, indexMap };
};

/**
 * Map a text match back to DOM spans
 */
export const mapMatchToSpans = (
  match: TextMatch,
  indexMap: { textNode: Text; offset: number }[],
): SpanMatch[] => {
  const spanMatches: SpanMatch[] = [];
  if (match.start >= indexMap.length || match.end > indexMap.length) return [];

  const startPoint = indexMap[match.start];
  const endPoint = indexMap[match.end - 1];

  let currentTextNode = startPoint.textNode;
  let currentStartOffset = startPoint.offset;

  for (let i = match.start; i < match.end; i++) {
    const point = indexMap[i];
    if (point.textNode !== currentTextNode) {
      spanMatches.push({
        textNode: currentTextNode,
        startOffsetInNode: currentStartOffset,
        endOffsetInNode: currentTextNode.length,
      });
      currentTextNode = point.textNode;
      currentStartOffset = 0;
    }
  }

  spanMatches.push({
    textNode: currentTextNode,
    startOffsetInNode: currentStartOffset,
    endOffsetInNode: endPoint.offset + 1,
  });

  return spanMatches;
};

/**
 * Normalize search term by replacing multiple spaces with single space
 */
export const normalizeSearchTerm = (term: string): string => {
  return term.trim().replace(/\s+/g, " ");
};
