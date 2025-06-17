# PDF Viewer - Modular Architecture

A highly modular, enterprise-grade PDF viewer built with React, TypeScript, and PDF.js. This architecture follows senior software engineering principles with proper separation of concerns, reusability, and maintainability.

## 🏗️ Architecture Overview

```
├── types/pdf-viewer.ts          # Type definitions
├── lib/
│   ├── pdf-utils.ts            # PDF processing utilities
│   ├── text-processing.ts      # Text manipulation utilities
│   ├── highlight-service.ts    # Highlighting service class with Floating UI
│   └── constants/
│       └── legend-items.ts     # Annotation type configurations
├── hooks/
│   ├── use-pdf-viewer.ts       # PDF viewer state management
│   ├── use-pdf-search.ts       # Search functionality
│   └── use-pdf-highlights.ts   # Highlight & tooltip management
└── components/pdf-viewer/
    ├── pdf-viewer.tsx          # Main orchestrator component
    ├── search-panel.tsx        # Search UI component
    ├── toolbar.tsx             # Navigation & controls
    ├── page-navigation.tsx     # Page navigation component
    ├── pdf-canvas.tsx          # Multi-page canvas rendering & highlighting
    ├── highlight-legend.tsx    # Interactive annotation type legend
    └── index.ts                # Barrel exports
```

## 🎯 Key Features

- **Multi-Page View**: All pages rendered simultaneously in a continuous scrolling layout
- **Dual Highlighting System**: Separate highlighting for search results and annotations
- **Interactive Tooltips**: Rich, color-coded tooltips with Floating UI positioning
- **Color-Coded Annotations**: 7 distinct annotation types with professional styling
- **Modular Design**: Each component has a single responsibility
- **Custom Hooks**: Encapsulated business logic with proper state management
- **Service Classes**: Stateless utility classes for complex operations
- **Type Safety**: Comprehensive TypeScript definitions
- **Performance**: Optimized rendering with ResizeObserver and debouncing
- **Accessibility**: Keyboard shortcuts and proper ARIA labels
- **Multi-Instance**: Support for multiple PDF viewers on the same page
- **Debugging Support**: Built-in debug logging for development
- **Advanced Positioning**: Floating UI integration for collision-aware tooltips

## 🔧 Components

### PDFViewer (Main Component)

The orchestrator component that brings everything together. Handles:

- State coordination between hooks
- Event handling and keyboard shortcuts
- Component composition and layout
- Integration of search and annotation systems

### SearchPanel

Dedicated search interface with:

- Multiple search modes (exact, contains, regex, fuzzy, whole word)
- Real-time search results display
- Navigation controls

### Toolbar

Navigation and control interface:

- Page navigation (scrolls to pages in continuous view)
- Zoom controls
- Fullscreen toggle
- Search toggle

### PDFCanvas

Core rendering component with multi-page support:

- Simultaneous rendering of all PDF pages
- Individual text layers for each page
- Dual highlight overlay system (search + annotations)
- Responsive scaling for all pages
- Smooth scrolling navigation between pages
- Unified algorithm for search and annotation highlighting

### PageNavigation

Jump-to-page navigation component for quick access to specific pages in the continuous view.

### HighlightLegend

Interactive legend component with sophisticated design:

- **7 Annotation Types**: Complete annotation system with color-coded categories
- **Professional Styling**: Modern design with proper spacing and typography
- **Hover Effects**: Interactive states with smooth transitions
- **Type Definitions**: Each type includes color, label, and description
- **Centralized Configuration**: Annotation types defined in `lib/constants/legend-items.ts`

## 🪝 Custom Hooks

### usePDFViewer

Manages PDF document state:

- PDF loading and error handling
- Current page tracking (for navigation/highlighting)
- Zoom controls
- Fullscreen state

### usePDFSearch

Handles search functionality:

- Search term and mode management
- PDF text searching across all pages
- Result navigation with smooth scrolling
- Search state persistence

### usePDFHighlights

Manages highlighting and tooltips:

- Highlight rect storage across all pages
- Tooltip content management with proper ref handling
- Hover state handling
- Cleanup utilities
- **Fixed Reference Management**: Proper ref handling for highlight storage

## 🛠️ Utility Libraries

### pdf-utils.ts

Core PDF processing functions:

- Fuzzy matching algorithm
- Search matcher creation
- Text matching with different modes
- Responsive scale calculation
- PDF.js library loading

### text-processing.ts

Text manipulation utilities:

- Text map building from DOM spans
- Match-to-span mapping
- Search term normalization

### highlight-service.ts

Advanced highlighting service with Floating UI integration:

- **Floating UI Positioning**: Collision-aware tooltip positioning with `computePosition`, `autoUpdate`, `offset`, `flip`, `shift`, and `arrow`
- **Color-Coded Tooltips**: Sophisticated tooltip design with annotation type-specific styling
- **Immediate Switching**: Rapid tooltip transitions between different elements (25ms delay)
- **Memory Management**: Proper cleanup of Floating UI's `autoUpdate` and DOM elements
- **Multi-Page Support**: Highlight overlay creation across multiple pages
- **Unified Algorithm**: Consistent highlighting for both search and annotations
- **Debug Integration**: Comprehensive logging for development and troubleshooting

## 📝 Usage

```tsx
import { PDFViewer } from "@/components/pdf-viewer";

// Example with search and annotations
export default function MyPage() {
  const highlights = [
    {
      sentence: "Important clause text",
      tooltip: "This is a critical term that affects...",
      type: "TERM",
    },
    // ... more annotations
  ];

  return (
    <div className="h-screen">
      <PDFViewer
        pdfUrl="/path/to/document.pdf"
        instanceId="my-viewer"
        highlights={highlights}
        className="h-full"
      />
    </div>
  );
}
```

## 🎨 Styling

The component uses Tailwind CSS with shadcn/ui design tokens:

- `bg-card`, `text-muted-foreground` for consistent theming
- CSS custom properties for dynamic styling
- Responsive design with proper breakpoints
- Continuous scrolling layout with page indicators
- **Annotation Styling**: Distinct CSS classes for 7 annotation types:
  - `highlight-term` - Terms and definitions (Blue #2563EB)
  - `highlight-fee` - Fee-related content (Orange #EA580C)
  - `highlight-duty-user` - User obligations (Green #16A34A)
  - `highlight-duty-bank` - Bank obligations (Turquoise #0D9488)
  - `highlight-var` - Variable content (Purple #7C3AED)
  - `highlight-risk` - Risk disclosures (Yellow #EAB308)
  - `highlight-abuse` - Abuse prevention measures (Red #DC2626)
- **Sophisticated Tooltips**: Professional white design with colored headers, shadows, and proper typography

## 🔍 Search Features

- **Exact Match**: Precise text matching
- **Contains**: Case-insensitive substring search
- **Whole Word**: Word boundary matching
- **Regex**: Regular expression support
- **Fuzzy**: Approximate string matching with configurable threshold
- **Cross-Page Search**: Search results highlighted across all visible pages
- **Interactive Tooltips**: Context-aware tooltips with result navigation

## 🎯 Highlights & Tooltips

- **Dual System**: Separate highlighting for search results and annotations
- **Multi-Page Support**: Highlights work across all rendered pages
- **Multi-line Support**: Handles text spanning multiple lines
- **Unified Algorithm**: Both search and annotations use the same highlighting logic
- **Rich Tooltips**: Color-coded tooltips with professional design and Floating UI positioning
- **Immediate Switching**: Rapid tooltip transitions between elements (300ms extended visibility)
- **Visual Feedback**: Smooth animations and hover effects
- **Page-Specific Highlighting**: Efficient highlighting per page
- **Advanced Event Handling**: Robust tooltip management with pointer-events control
- **Type Detection**: Automatic annotation type detection with fallback mechanisms

### Annotation System

The annotation system provides:

- **7 Annotation Types**: Complete categorization system (TERM, FEE, DUTY_USER, DUTY_BANK, VAR, RISK, ABUSE)
- **Color-Coded Design**: Each type has distinct colors and professional styling
- **Sophisticated Tooltips**: White background with colored headers, shadows, and proper typography hierarchy
- **Type Detection**: Automatic annotation type detection from data or CSS classes
- **Legend Integration**: Interactive legend component with centralized type definitions
- **Consistent Highlighting**: Uses the same algorithm as search for reliability
- **Professional UX**: Extended visibility (300ms) for comfortable reading

## 🚀 Performance Optimizations

- **Lazy Loading**: PDF.js loaded on demand
- **Debounced Rendering**: Prevents excessive re-renders
- **Memory Management**: Proper cleanup of event listeners and timeouts
- **Responsive Scaling**: Automatic scale adjustment based on container size
- **Efficient Page Management**: Smart rendering of multiple pages
- **Smooth Scrolling**: Optimized navigation between pages
- **Optimized Tooltip Storage**: Efficient Map-based storage with proper reference handling

## 📱 Multi-Page Layout

The architecture renders all pages simultaneously:

- **Continuous View**: All pages displayed in a single scrolling container
- **Page Indicators**: Clear visual indicators for each page
- **Smart Navigation**: Smooth scrolling to specific pages
- **Unified Search**: Search and highlighting across all visible pages
- **Unified Annotations**: Annotation highlighting across all pages
- **Responsive Layout**: Pages adapt to container width while maintaining aspect ratio

## 🐛 Debugging & Development

The PDF viewer includes comprehensive debugging support:

- **Debug Flags**: Configurable logging levels (DEBUG, ANNOTATION_DEBUG, TOOLTIP_DEBUG)
- **Targeted Logging**: Specific debug output for different systems
- **Performance Monitoring**: Timing and performance metrics
- **State Inspection**: Detailed logging of highlight storage and tooltip management
- **Error Handling**: Graceful error handling with informative messages

### Debug Configuration

```typescript
// In pdf-canvas.tsx
const DEBUG = false; // General debugging
const ANNOTATION_DEBUG = false; // Annotation-specific debugging
const TOOLTIP_DEBUG = true; // Tooltip-specific debugging
```

## 🧪 Testing Considerations

Each module can be tested independently:

- **Hooks**: Test state management and side effects
- **Utils**: Test pure functions with various inputs
- **Components**: Test UI interactions and prop handling
- **Services**: Test business logic and DOM manipulation
- **Multi-Page Logic**: Test page rendering and navigation
- **Tooltip System**: Test tooltip generation and interaction
- **Annotation System**: Test annotation highlighting and tooltips

## 🔧 Extensibility

The modular architecture makes it easy to:

- Add new search modes
- Implement custom highlighting styles
- Add new annotation types
- Integrate with external APIs
- Create custom toolbar actions
- Implement page thumbnails or minimap
- Add custom tooltip formats
- Integrate with document analysis services

## 🚨 Known Issues & Solutions

### Tooltip Reference Management

- **Issue**: Tooltip system requires proper ref handling for highlight storage
- **Solution**: Ensure `usePDFHighlights` returns refs properly, not their `.current` values

### Annotation Key Consistency

- **Issue**: Annotations and search results need consistent key formatting
- **Solution**: Use unified key generation (`result-${annotationKey}`) for both systems

### Performance with Large Documents

- **Issue**: Memory usage can grow with very large documents
- **Solution**: Implement pagination or virtual scrolling for documents >100 pages

## 📦 Dependencies

- React 18+
- TypeScript 5+
- PDF.js 3.11+
- **@floating-ui/dom** - Advanced tooltip positioning with collision detection
- Tailwind CSS
- shadcn/ui components
- Lucide React (icons)

## 🔄 Recent Updates

### v2.3.0 - Color-Coded Tooltip System

- **Added**: Sophisticated color-coded tooltip system with 7 annotation types
- **Added**: Floating UI integration for collision-aware tooltip positioning
- **Added**: Professional tooltip design with colored headers and shadows
- **Added**: Centralized annotation type configuration in `lib/constants/legend-items.ts`
- **Improved**: Immediate tooltip switching with 300ms extended visibility
- **Enhanced**: Annotation type detection with fallback mechanisms
- **Fixed**: Tooltip positioning and memory management

### v2.2.0 - Advanced Tooltip UX

- **Added**: Floating UI positioning system
- **Improved**: Tooltip transition timing (25ms switching, 300ms visibility)
- **Enhanced**: Memory management and DOM cleanup
- **Fixed**: Invisible tooltip blocking hover events

### v2.1.0 - Annotation Tooltip Fixes

- **Fixed**: Annotation tooltips now display properly
- **Fixed**: Reference mismatch in highlight service
- **Added**: Comprehensive debug logging system
- **Improved**: Unified highlighting algorithm for search and annotations
- **Enhanced**: Error handling and null safety checks

### v2.0.0 - Multi-Page Architecture

- **Added**: Continuous scrolling multi-page view
- **Added**: Unified search and annotation highlighting
- **Added**: Interactive tooltip system
- **Added**: Annotation legend component
- **Improved**: Performance optimizations
- **Enhanced**: Responsive design and scaling

This architecture provides a robust foundation for building complex PDF viewing applications while maintaining code quality and developer experience. The dual highlighting system enables rich document analysis and interaction capabilities suitable for enterprise applications.
