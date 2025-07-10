# LLMS.md - Types Directory (TypeScript Type Definitions)

## File Structure

```
src/types/
└── pdf-viewer.ts                   # Definiciones de tipos para PDF viewer
```

## Business Relevance

### Sistema de Tipos para PDF Viewer:

1. **🎯 Types Centrados en el Usuario**
   - Definiciones que reflejan la experiencia del consumidor español
   - Tipos para análisis de contratos hipotecarios
   - Interfaces que soportan B2C language y UX

2. **📋 Contract Analysis Types**
   - **HighlightAnnotation**: Anotaciones de riesgo en contratos
   - **SearchResult**: Resultados de búsqueda en documentos
   - **PDFViewerProps**: Propiedades del visor profesional
   - **Contract Integration**: Integración con modelo de contrato

3. **🔍 Advanced Search Capabilities**
   - Multiple search modes: exact, fuzzy, regex, wholeWord
   - Soporte para análisis semántico de cláusulas
   - Búsqueda específica para terminología hipotecaria española

## Core Type Definitions

### PDF Viewer Core Types

```typescript
interface PDFViewerProps {
  // Support for contract analysis
  contract?: Contract;
  highlights?: HighlightAnnotation[];
  
  // Consumer-focused interactions
  onTextSelectionQuestion?: (question: string, selectedText: string) => Promise<void>;
  
  // Professional PDF navigation
  showMinimap?: boolean;
  isMinimapCompact?: boolean; // For chat integration
}
```

### Search System Types

```typescript
interface SearchResult {
  pageNum: number;          // Página del contrato
  textIndex: number;        // Índice en el texto
  text: string;             // Texto encontrado
  context: string;          // Contexto para consumidor
  position: DOMRect;        // Posición visual
}

type SearchMode = "exact" | "contains" | "regex" | "fuzzy" | "wholeWord";
```

### Highlight & Annotation Types

```typescript
interface HighlightAnnotation {
  sentence: string;         // Cláusula del contrato
  type: HighlightType;      // Tipo de riesgo/beneficio
  tooltip: string;          // Explicación para consumidor
}

interface TemporaryHighlight {
  text: string;             // Texto seleccionado
  range: Range;             // Rango DOM
  id: string;               // Identificador único
}
```

### State Management Types

```typescript
interface PDFViewerState {
  pdf: any | null;          // PDF.js document
  currentPage: number;      // Página actual
  totalPages: number;       // Total de páginas
  scale: number;            // Zoom level
  loading: boolean;         // Estado de carga
  error: string | null;     // Errores para usuario
  isFullscreen: boolean;    // Modo pantalla completa
}
```

## Architecture Decisions

### Type Safety for Spanish Market:

1. **Consumer-Focused Types**
   - Tooltips y contexto en español para consumidores
   - Tipos que reflejan terminología hipotecaria española
   - Interfaces diseñadas para B2C experience

2. **Contract Integration**
   - Integración directa con tipos de `/src/models/contract.ts`
   - Soporte para highlights categorizados por riesgo
   - Types que facilitan análisis de cláusulas abusivas

3. **Professional PDF Experience**
   - Enterprise-grade PDF viewer capabilities
   - Dual highlighting system (search + annotations)
   - Minimap integration para navegación de documentos largos

### Type Composition Pattern:

```typescript
// Importa tipos compartidos
import type { HighlightType } from "@/lib/constants/legend-items";
import type { Contract } from "@/models/contract";

// Re-exporta para consistencia
export type { HighlightType };
```

## Change-Log

### Initial Implementation (June 2025)
- Definiciones de tipos para PDF viewer modular
- Interfaces para análisis de contratos hipotecarios
- Types para sistema de búsqueda avanzada
- Integración con modelos de contrato

### PDF Viewer Enhancement (June 2025)
- Added minimap navigation types
- Enhanced search result positioning
- Text selection interaction types
- Contract integration properties

### Consumer Experience Types (June 2025)
- B2C focused tooltip and context types
- Spanish market specific interfaces
- Consumer-friendly error handling types
- Accessibility-focused type definitions

## Key Features by Type Category

### 🔍 Search & Navigation
- **SearchResult**: Posicionamiento preciso en documento
- **SearchOptions**: Configuración flexible de búsqueda
- **SearchMode**: Modos de búsqueda para diferentes necesidades
- **PDFDocumentData**: Metadatos del documento

### 🎨 UI & Interaction
- **PDFViewerProps**: Configuración completa del visor
- **TooltipData**: Información contextual para usuario
- **TextSelectionData**: Datos de selección de texto
- **HighlightRect**: Posicionamiento de highlights

### 📊 State Management
- **PDFViewerState**: Estado central del visor
- **SearchState**: Estado del sistema de búsqueda
- **TooltipState**: Estado de tooltips y highlights

### 🏷️ Annotations & Highlights
- **HighlightAnnotation**: Anotaciones de análisis IA
- **TemporaryHighlight**: Highlights temporales de usuario
- **HighlightType**: Tipos de clasificación de riesgo

## Development Guidelines

### Type Design Principles:
- **Consumer-First**: Types reflejan experiencia del usuario final
- **Spanish Market**: Terminología y contexto hipotecario español
- **Accessibility**: Soporte para screen readers y navegación por teclado
- **Performance**: Types optimizados para documentos largos

### Error Handling:
- Error messages en español comprensible para consumidores
- Estados de error que faciliten recovery automático
- Feedback claro durante procesamiento de documentos

### Integration Patterns:
- Composición con tipos de modelos existentes
- Re-exportación de tipos compartidos
- Interfaces extensibles para futuras funcionalidades

### Spanish Consumer Context:
- Types diseñados para análisis de hipotecas españolas
- Soporte para detección de cláusulas según normativa española
- Interfaces que facilitan explicación de riesgos en lenguaje B2C