import { legendItems } from "@/lib/constants/legend-items";
import type { HighlightRect, SpanMatch, TooltipData } from "@/types/pdf-viewer";
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";

// Global state for tooltip management
const DEBUG = false;
const TOOLTIP_DEBUG = false;
let currentTooltip: HTMLElement | null = null;
let currentTooltipTarget: HTMLElement | null = null;
let hideTimeoutId: NodeJS.Timeout | null = null;

// Define window interface for mouse tracking
interface WindowWithMouse extends Window {
  lastMouseX?: number;
  lastMouseY?: number;
}

// Define tooltip element with cleanup function
interface TooltipElement extends HTMLElement {
  __cleanup?: () => void;
}

export namespace HighlightService {
  export function createHighlightOverlay(
    spanMatch: SpanMatch,
    isCurrent: boolean,
    textLayerParentRect: DOMRect,
    textLayerRef: HTMLDivElement,
    instanceId: string,
    matchText?: string,
    context?: string,
    resultIndex?: number | string,
    onRectCreated?: (resultIndex: number | string, rect: HighlightRect) => void,
    onTooltipDataCreated?: (key: string, data: TooltipData) => void,
    totalResults?: number,
    onTooltipCreate?: (
      element: HTMLElement,
      data: TooltipData,
      onNavigateToResult?: (index: number) => void,
    ) => void,
    onTooltipRemove?: () => void,
    onNavigateToResult?: (index: number) => void,
    annotationType?: string,
  ) {
    const { textNode, startOffsetInNode, endOffsetInNode } = spanMatch;
    if (startOffsetInNode >= endOffsetInNode) {
      if (DEBUG)
        console.log(
          "Skipping highlight for zero-length match in node",
          textNode.textContent,
        );
      return;
    }

    try {
      const range = document.createRange();
      range.setStart(textNode, startOffsetInNode);
      range.setEnd(textNode, endOffsetInNode);

      const rects = range.getClientRects();
      const extractedText = textNode.substringData(
        startOffsetInNode,
        endOffsetInNode - startOffsetInNode,
      );

      if (DEBUG) {
        console.log(
          "Highlighting rects from range:",
          rects,
          "for text:",
          extractedText,
        );
      }

      // Store tooltip data first
      let tooltipData: TooltipData | null = null;
      if (
        matchText &&
        context &&
        resultIndex !== undefined &&
        onTooltipDataCreated
      ) {
        const numericIndex = typeof resultIndex === "number" ? resultIndex : -1;
        tooltipData = {
          matchText,
          context,
          resultIndex: numericIndex,
          totalResults: totalResults || 0,
          annotationType: annotationType as TooltipData["annotationType"],
        };

        onTooltipDataCreated(`result-${resultIndex}`, tooltipData);

        if (TOOLTIP_DEBUG) {
          console.log(`💬 Stored tooltip data for result ${resultIndex}:`, {
            matchText: `${matchText.substring(0, 50)}...`,
            context: `${context.substring(0, 50)}...`,
            numericIndex,
            totalResults: totalResults || 0,
          });
        }
      }

      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        const highlight = document.createElement("div");
        const groupClass =
          typeof resultIndex === "number" ? `group-${resultIndex}` : "";
        const highlightId = `${instanceId}-highlight-${resultIndex}-${i}`;

        highlight.className = `search-highlight-overlay ${
          isCurrent ? "current-highlight" : "search-highlight"
        } group ${groupClass}`;
        highlight.id = highlightId;
        highlight.style.position = "absolute";
        highlight.style.left = `${rect.left - textLayerParentRect.left}px`;
        highlight.style.top = `${rect.top - textLayerParentRect.top}px`;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.pointerEvents = "auto";
        highlight.style.zIndex = isCurrent ? "3" : "2";
        highlight.style.cursor = "pointer";

        // Add improved tooltip events with immediate response
        if (tooltipData && resultIndex !== undefined) {
          highlight.addEventListener("mouseenter", () => {
            showTooltip(
              highlight,
              tooltipData,
              resultIndex,
              onNavigateToResult,
            );
          });

          highlight.addEventListener("mouseleave", () => {
            hideTooltipIfNotHovered(highlight);
          });
        }

        // Store rect data for compatibility
        if (onRectCreated && resultIndex !== undefined) {
          const highlightRect: HighlightRect = {
            left: rect.left - textLayerParentRect.left,
            top: rect.top - textLayerParentRect.top,
            right: rect.right - textLayerParentRect.left,
            bottom: rect.bottom - textLayerParentRect.top,
            width: rect.width,
            height: rect.height,
          } as HighlightRect;

          onRectCreated(resultIndex, highlightRect);
        }

        textLayerRef.appendChild(highlight);

        if (isCurrent && i === 0) {
          highlight.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    } catch (e) {
      if (DEBUG) {
        console.error(
          "Error creating highlight with Range API:",
          e,
          "Node:",
          textNode,
          "Offsets:",
          startOffsetInNode,
          endOffsetInNode,
        );
      }
    }
  }

  function showTooltip(
    element: HTMLElement,
    data: TooltipData,
    resultIndex: number | string,
    onNavigateToResult?: (index: number) => void,
  ) {
    // Cancel any pending hide operation first
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
      if (TOOLTIP_DEBUG) {
        console.log(`⏰ Cancelled pending hide timeout for ${resultIndex}`);
      }
    }

    // If hovering the same element, just keep the current tooltip - no recreation needed
    if (currentTooltipTarget === element && currentTooltip) {
      if (TOOLTIP_DEBUG) {
        console.log(
          `🎯 Same element hovered, keeping existing tooltip for ${resultIndex} - no recreation`,
        );
      }
      return; // Exit early - no need to recreate anything
    }

    // Only recreate tooltip if it's a DIFFERENT element
    if (TOOLTIP_DEBUG) {
      console.log(
        `🔄 Different element detected, recreating tooltip for ${resultIndex}`,
      );
    }

    // Hide existing tooltip from different element
    if (currentTooltip && currentTooltipTarget !== element) {
      if (TOOLTIP_DEBUG) {
        console.log("🗑️ Removing old tooltip for different element");
      }
      const tooltipWithCleanup = currentTooltip as TooltipElement;
      if (tooltipWithCleanup.__cleanup) {
        tooltipWithCleanup.__cleanup();
      }
      currentTooltip.remove();
      currentTooltip = null;
    }

    // Clean up any orphaned tooltips that might be blocking events
    cleanupOrphanedTooltips();

    // Create new tooltip for the new element
    currentTooltipTarget = element;
    currentTooltip = createTooltipElement(element, data, onNavigateToResult);

    if (TOOLTIP_DEBUG) {
      console.log(`✨ Created new tooltip for ${resultIndex}:`, {
        matchText: `${data.matchText.substring(0, 50)}...`,
        context: `${data.context.substring(0, 50)}...`,
      });
    }
  }

  function hideTooltipIfNotHovered(element: HTMLElement) {
    // Cancel any existing hide timeout to prevent race conditions
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }

    // Longer delay to allow easier interaction with tooltips
    hideTimeoutId = setTimeout(() => {
      // Only hide if we're still dealing with the same target element
      if (currentTooltipTarget === element) {
        // Check if mouse is over the tooltip itself
        if (currentTooltip && isMouseOverElement(currentTooltip)) {
          if (TOOLTIP_DEBUG) {
            console.log("🖱️ Mouse over tooltip, keeping visible");
          }
          return;
        }

        hideTooltip();
      }

      // Clear the timeout ID since it's completed
      hideTimeoutId = null;
    }, 500); // Extended delay for better UX - tooltips stay visible longer

    if (TOOLTIP_DEBUG) {
      console.log("⏰ Scheduled hide timeout for element (500ms)");
    }
  }

  function scheduleDelayedHide() {
    // Cancel any existing hide timeout to prevent race conditions
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }

    // Schedule delayed hide (same logic as elements but without element-specific checks)
    hideTimeoutId = setTimeout(() => {
      // Check if mouse is over the tooltip or target element
      const isOverTooltip =
        currentTooltip && isMouseOverElement(currentTooltip);
      const isOverTarget =
        currentTooltipTarget && isMouseOverElement(currentTooltipTarget);

      if (isOverTooltip || isOverTarget) {
        if (TOOLTIP_DEBUG) {
          console.log("🖱️ Mouse still over tooltip or target, keeping visible");
        }
        return;
      }

      hideTooltip();

      // Clear the timeout ID since it's completed
      hideTimeoutId = null;
    }, 500);

    if (TOOLTIP_DEBUG) {
      console.log("⏰ Scheduled delayed hide from tooltip (500ms)");
    }
  }

  function isMouseOverElement(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const windowWithMouse = window as WindowWithMouse;
    const mouseX = windowWithMouse.lastMouseX || 0;
    const mouseY = windowWithMouse.lastMouseY || 0;

    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    );
  }

  function hideTooltip() {
    // Cancel any pending hide timeout since we're hiding now
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }

    if (currentTooltip) {
      // Clean up Floating UI auto-update
      const tooltipWithCleanup = currentTooltip as TooltipElement;
      if (tooltipWithCleanup.__cleanup) {
        tooltipWithCleanup.__cleanup();
      }

      // Immediately disable pointer events to prevent blocking
      currentTooltip.style.pointerEvents = "none";

      // Smooth fade out
      currentTooltip.style.opacity = "0";
      currentTooltip.style.transform = "scale(0.95)";

      // Remove after animation
      const tooltipToRemove = currentTooltip;
      setTimeout(() => {
        tooltipToRemove?.parentNode?.removeChild(tooltipToRemove);
      }, 150);

      currentTooltip = null;
    }
    currentTooltipTarget = null;
  }

  function createTooltipElement(
    element: HTMLElement,
    data: TooltipData,
    onNavigateToResult?: (index: number) => void,
  ): HTMLElement {
    // Get tooltip type - prioritize data.annotationType, then try to extract from element classes
    let tooltipType = data.annotationType;

    // Try to extract type from element's class or data attributes if not available in data
    if (!tooltipType) {
      // Debug: log element classes
      if (TOOLTIP_DEBUG) {
        console.log("🔍 Element classes:", element.className);
      }

      // Check for annotation-specific classes
      if (element.className.includes("highlight-term")) {
        tooltipType = "TERM";
      } else if (element.className.includes("highlight-fee")) {
        tooltipType = "FEE";
      } else if (element.className.includes("highlight-duty-user")) {
        tooltipType = "DUTY_USER";
      } else if (element.className.includes("highlight-duty-bank")) {
        tooltipType = "DUTY_BANK";
      } else if (element.className.includes("highlight-var")) {
        tooltipType = "VAR";
      } else if (element.className.includes("highlight-risk")) {
        tooltipType = "RISK";
      } else if (element.className.includes("highlight-abuse")) {
        tooltipType = "ABUSE";
      } else {
        // Fallback: try regex pattern
        const classMatch = element.className.match(/highlight-(\w+)/);
        if (classMatch) {
          const typeMap: Record<string, TooltipData["annotationType"]> = {
            term: "TERM",
            fee: "FEE",
            "duty-user": "DUTY_USER",
            "duty-bank": "DUTY_BANK",
            var: "VAR",
            risk: "RISK",
            abuse: "ABUSE",
          };
          tooltipType = typeMap[classMatch[1]] || "TERM";
        }
      }

      if (TOOLTIP_DEBUG) {
        console.log("🎯 Detected annotation type from classes:", tooltipType);
      }
    } else {
      if (TOOLTIP_DEBUG) {
        console.log("✅ Using annotation type from data:", tooltipType);
      }
    }

    const legendItem = legendItems.find(
      (item) => item.type === tooltipType,
    ) || {
      type: "TERM",
      color: "#2563EB",
      label: "Resultado de búsqueda",
      description: "Coincidencia encontrada en el texto",
    };

    const tooltip = document.createElement("div") as TooltipElement;
    tooltip.className =
      "absolute z-50 bg-white text-gray-900 rounded-md shadow-xl border border-gray-200 pointer-events-auto transition-all duration-200 ease-out";
    tooltip.style.width = "18rem"; // w-72 equivalent
    tooltip.style.opacity = "0";
    tooltip.style.transform = "scale(0.95)";

    // Create arrow element
    const arrowElement = document.createElement("div");
    arrowElement.className = "absolute w-2 h-2 bg-white rotate-45";
    arrowElement.style.border = "1px solid rgb(229, 231, 235)"; // border-gray-200
    tooltip.appendChild(arrowElement);

    // Header section with colored border
    const header = document.createElement("div");
    header.className = "p-3 border-b border-gray-200";
    header.style.borderLeft = `4px solid ${legendItem.color}`;

    const headerLabel = document.createElement("p");
    headerLabel.className = "text-xs font-semibold uppercase tracking-wider";
    headerLabel.style.color = legendItem.color;
    headerLabel.textContent = legendItem.label;
    header.appendChild(headerLabel);

    // Main content section
    const content = document.createElement("div");
    content.className = "p-3 space-y-2 relative z-10";

    const contextText = document.createElement("p");
    contextText.className = "text-sm font-medium leading-relaxed text-gray-900";
    contextText.textContent = data.context;
    content.appendChild(contextText);

    // Highlighted text section
    if (data.matchText) {
      const textSection = document.createElement("div");
      textSection.className = "mt-2 pt-2 border-t border-gray-200";

      const textLabel = document.createElement("p");
      textLabel.className = "text-xs text-gray-500";
      textLabel.textContent = "Texto destacado:";
      textSection.appendChild(textLabel);

      const highlightedText = document.createElement("p");
      highlightedText.className = "text-xs italic text-gray-900 break-words";
      highlightedText.textContent = `"${data.matchText}"`;
      textSection.appendChild(highlightedText);

      content.appendChild(textSection);
    }

    tooltip.appendChild(header);
    tooltip.appendChild(content);

    // Add navigation section if applicable
    if (data.resultIndex >= 0 && data.totalResults > 1 && onNavigateToResult) {
      const navSection = document.createElement("div");
      navSection.className = "px-3 pb-3 pt-2 border-t border-gray-200";

      const navInfo = document.createElement("p");
      navInfo.className = "text-xs text-gray-500";
      navInfo.textContent = `Resultado ${data.resultIndex + 1} de ${
        data.totalResults
      } `;

      const navButton = document.createElement("button");
      navButton.className =
        "text-xs underline text-blue-600 hover:text-blue-800 transition-colors";
      navButton.textContent = "Ir al resultado";
      navButton.onclick = (e) => {
        e.stopPropagation();
        onNavigateToResult(data.resultIndex);
        hideTooltip();
      };

      navInfo.appendChild(navButton);
      navSection.appendChild(navInfo);
      tooltip.appendChild(navSection);
    }

    // Add tooltip hover events
    tooltip.addEventListener("mouseenter", () => {
      // Cancel any pending hide when mouse enters tooltip
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
        hideTimeoutId = null;
        if (TOOLTIP_DEBUG) {
          console.log("🖱️ Mouse entered tooltip - cancelled hide timeout");
        }
      }
    });

    tooltip.addEventListener("mouseleave", () => {
      if (TOOLTIP_DEBUG) {
        console.log("🖱️ Mouse left tooltip - scheduling delayed hide");
      }
      // Use the same delayed hiding logic as elements, don't hide immediately
      scheduleDelayedHide();
    });

    document.body.appendChild(tooltip);

    // Use Floating UI for positioning
    const cleanup = autoUpdate(element, tooltip, () => {
      computePosition(element, tooltip, {
        placement: "top",
        middleware: [
          offset(12),
          flip({
            fallbackPlacements: ["bottom", "top", "right", "left"],
          }),
          shift({ padding: 12 }),
          arrow({ element: arrowElement }),
        ],
      }).then(({ x, y, placement, middlewareData }) => {
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;

        // Position arrow
        if (middlewareData.arrow) {
          const { x: arrowX, y: arrowY } = middlewareData.arrow;

          // Reset arrow position
          Object.assign(arrowElement.style, {
            left: "",
            right: "",
            top: "",
            bottom: "",
          });

          const staticSide = {
            top: "bottom",
            right: "left",
            bottom: "top",
            left: "right",
          }[placement.split("-")[0]];

          if (arrowX != null) {
            arrowElement.style.left = `${arrowX}px`;
          }
          if (arrowY != null) {
            arrowElement.style.top = `${arrowY}px`;
          }
          if (staticSide) {
            arrowElement.style.setProperty(staticSide, "-4px");
          }
        }
      });
    });

    // Store cleanup function for later
    tooltip.__cleanup = cleanup;

    // Smooth fade in
    requestAnimationFrame(() => {
      tooltip.style.opacity = "1";
      tooltip.style.transform = "scale(1)";
    });

    return tooltip;
  }

  export function createUnifiedHoverAreas(
    highlightRects: Map<number | string, HighlightRect[]>,
    tooltipContent: Map<string, TooltipData>,
    textLayerRef: HTMLDivElement,
    currentResultIndex: number,
    onTooltipCreate: (
      element: HTMLElement,
      data: TooltipData,
      onNavigateToResult?: (index: number) => void,
    ) => void,
    onTooltipRemove: () => void,
    onNavigateToResult: (index: number) => void,
    onGroupHover: (resultIndex: number | string, isHovering: boolean) => void,
  ) {
    if (DEBUG) console.log("🎯 Creating unified hover areas...");

    // Remove existing hover areas
    const existingAreas = textLayerRef.querySelectorAll(".unified-hover-area");
    for (const el of existingAreas) {
      el.remove();
    }

    // Create unified hover areas for each result
    for (const [resultIndex, rects] of highlightRects) {
      if (TOOLTIP_DEBUG)
        console.log(
          `🎯 HOVER: Processing ${resultIndex} with ${rects.length} rects`,
        );
      if (rects.length === 0) continue;

      // Calculate bounding box for all rects in this result
      const minLeft = Math.min(...rects.map((r) => r.left));
      const minTop = Math.min(...rects.map((r) => r.top));
      const maxRight = Math.max(...rects.map((r) => r.right));
      const maxBottom = Math.max(...rects.map((r) => r.bottom));

      // Create SVG element for complex shape
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", `unified-hover-area group-${resultIndex}`);
      svg.style.position = "absolute";
      svg.style.left = `${minLeft}px`;
      svg.style.top = `${minTop}px`;
      svg.style.width = `${maxRight - minLeft}px`;
      svg.style.height = `${maxBottom - minTop}px`;
      svg.style.pointerEvents = "auto";
      svg.style.zIndex = "10";
      svg.style.cursor = "pointer";

      // Create path for all rectangles
      let pathData = "";
      for (const rect of rects) {
        const x = rect.left - minLeft;
        const y = rect.top - minTop;
        pathData += `M${x},${y} L${x + rect.width},${y} L${x + rect.width},${
          y + rect.height
        } L${x},${y + rect.height} Z `;
      }

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("d", pathData);
      path.setAttribute("fill", "rgba(255, 0, 0, 0.1)");
      path.setAttribute("stroke", "red");
      path.setAttribute("stroke-width", "1");
      path.setAttribute("stroke-opacity", "0.3");
      path.style.transition = "stroke-opacity 0.2s ease";

      svg.appendChild(path);

      // Add hover events
      svg.addEventListener("mouseenter", () => {
        if (TOOLTIP_DEBUG)
          console.log(`🖱️ HOVER: Mouse entered area for ${resultIndex}`);
        path.setAttribute("stroke-opacity", "0.6");
        onGroupHover(resultIndex, true);

        const tooltipData = tooltipContent.get(`result-${resultIndex}`);
        if (TOOLTIP_DEBUG) {
          console.log(
            `🔍 TOOLTIP LOOKUP: Looking for key "result-${resultIndex}"`,
          );
          console.log("📋 ALL KEYS:", Array.from(tooltipContent.keys()));
          console.log("💬 FOUND DATA:", tooltipData ? "YES" : "NO");
        }

        if (tooltipData) {
          if (TOOLTIP_DEBUG)
            console.log(`✅ TOOLTIP: Creating tooltip for ${resultIndex}`);
          showTooltip(
            svg as unknown as HTMLElement,
            tooltipData,
            resultIndex,
            onNavigateToResult,
          );
        } else {
          if (TOOLTIP_DEBUG)
            console.log(`❌ TOOLTIP: No data found for ${resultIndex}`);
        }
      });

      svg.addEventListener("mouseleave", () => {
        path.setAttribute("stroke-opacity", "0");
        onGroupHover(resultIndex, false);
        hideTooltipIfNotHovered(svg as unknown as HTMLElement);
      });

      // Add click to navigate (only for numeric indices)
      svg.addEventListener("click", (e) => {
        e.stopPropagation();
        if (
          typeof resultIndex === "number" &&
          resultIndex !== currentResultIndex
        ) {
          onNavigateToResult(resultIndex);
        }
      });

      textLayerRef.appendChild(svg);
    }

    if (DEBUG) console.log("🎯 Finished creating unified hover areas");
  }

  export function removeExistingHighlights(textLayerRef: HTMLDivElement) {
    const existingHighlights = textLayerRef.querySelectorAll(
      ".search-highlight-overlay",
    );
    for (const el of existingHighlights) {
      el.remove();
    }

    const existingTooltipWrappers = textLayerRef.querySelectorAll(
      "[id^='tooltip-wrapper-']",
    );
    for (const el of existingTooltipWrappers) {
      el.remove();
    }

    // Clean up any hanging tooltips
    hideTooltip();

    // Also remove any orphaned tooltips from the DOM
    cleanupOrphanedTooltips();
  }

  export function cleanupOrphanedTooltips() {
    // Remove any tooltips that might be stuck in the DOM (both old and new styles)
    const orphanedTooltips = document.querySelectorAll(
      ".absolute.z-50.bg-gray-900, .absolute.z-50.bg-white",
    );
    for (const tooltip of orphanedTooltips) {
      // Check if it looks like our tooltip structure (old or new)
      if (
        tooltip.querySelector(".relative.z-10.space-y-2") ||
        tooltip.querySelector("p.text-xs.font-semibold.uppercase")
      ) {
        if (TOOLTIP_DEBUG) {
          console.log("🧹 Removing orphaned tooltip:", tooltip);
        }
        tooltip.remove();
      }
    }
  }
}

// Track mouse position globally for better tooltip positioning (client-side only)
if (typeof document !== "undefined") {
  document.addEventListener("mousemove", (e) => {
    const windowWithMouse = window as WindowWithMouse;
    windowWithMouse.lastMouseX = e.clientX;
    windowWithMouse.lastMouseY = e.clientY;
  });
}

// Clean up any existing orphaned tooltips on module load
if (typeof window !== "undefined") {
  HighlightService.cleanupOrphanedTooltips();
}
