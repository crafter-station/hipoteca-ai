# LLMS.md - Hooks Directory (React Custom Hooks)

## File Structure

```
src/hooks/
├── use-mobile.ts           # Mobile device detection hook
├── use-pdf-highlights.ts   # PDF highlighting management hook
├── use-pdf-search.ts       # PDF search functionality hook
└── use-pdf-viewer.ts       # PDF viewer state management hook
```

## Business Relevance

### Core Custom Hooks:

**Hipoteca Findr** uses custom React hooks to encapsulate business logic for PDF viewing, search functionality, and user interaction patterns. These hooks provide reusable state management and behavior for the mortgage contract analysis interface.

### Key Hook Categories:

1. **📱 Device Detection**: Mobile-responsive behavior
2. **📄 PDF Management**: Document viewing and interaction
3. **🔍 Search Functionality**: Contract content search
4. **🎨 Visual Enhancements**: Highlighting and annotation

## File Details

### `use-mobile.ts` - Mobile Device Detection

**Purpose**: Detect mobile devices and adapt UI behavior
**Key Features**:

- Responsive breakpoint detection
- Mobile-specific UI adaptations
- Touch interaction optimization
- Consumer-friendly mobile experience

**Use Cases**:

- Mobile-specific component rendering
- Touch-friendly PDF viewer controls
- Responsive chat interface
- Mobile-optimized upload flows

**Return Values**:

- `isMobile`: Boolean indicating mobile device
- Screen size information
- Touch capability detection

### `use-pdf-highlights.ts` - PDF Highlighting Management

**Purpose**: Manage PDF highlighting system with tooltips
**Key Features**:

- **Dual Highlighting**: Search results + contract risk annotations
- **Floating UI Integration**: Collision-aware tooltip positioning
- **Color-Coded System**: Red (risk), Green (info), Yellow (attention)
- **Interactive Tooltips**: Rich content with explanations

**Hook Capabilities**:

- `createTooltip()`: Generate interactive tooltips
- `removeTooltip()`: Clean up tooltip instances
- `highlightManagement`: Coordinate highlight display
- `positioningSystem`: Floating UI positioning

**Risk Color System**:

- **Red**: Abusive clauses, financial risks, penalties
- **Green**: Loan details, interest rates, insurance
- **Yellow**: Consult bank, negotiable terms

### `use-pdf-search.ts` - PDF Search Functionality

**Purpose**: Comprehensive PDF search with multiple modes
**Key Features**:

- **Multiple Search Modes**: Exact, contains, regex, fuzzy, whole word
- **Real-time Search**: Live search results as user types
- **Navigation Controls**: Previous/next result navigation
- **Visual Feedback**: Search progress and result count

**Search Capabilities**:

- `searchTerm`: Current search query
- `searchMode`: Active search mode
- `searchResults`: Array of found matches
- `currentResultIndex`: Currently selected result
- `isSearching`: Search operation status

**Search Modes**:

- **Exact**: Precise text matching
- **Contains**: Substring matching
- **Regex**: Regular expression patterns
- **Fuzzy**: Approximate matching
- **Whole Word**: Complete word matching

### `use-pdf-viewer.ts` - PDF Viewer State Management

**Purpose**: Central state management for PDF viewer functionality
**Key Features**:

- **Multi-page Management**: Handle all PDF pages simultaneously
- **Zoom Controls**: Zoom in/out with smooth transitions
- **Navigation**: Page-to-page navigation
- **Fullscreen**: Fullscreen mode toggle
- **Auto-scroll**: Programmatic scrolling to specific pages

**State Management**:

- `pdf`: PDF document object
- `currentPage`: Active page number
- `scale`: Current zoom level
- `isFullscreen`: Fullscreen mode status
- `shouldAutoScroll`: Auto-scroll control

**Control Functions**:

- `setCurrentPage()`: Navigate to specific page
- `setScale()`: Adjust zoom level
- `toggleFullscreen()`: Toggle fullscreen mode
- `updateCurrentPage()`: Update page tracking

## Change-Log

### Recent Major Changes:

**PR #8 (June 2025)** - PDF Viewer Enhancement

- Enhanced `use-pdf-viewer.ts` with minimap support
- Added `shouldAutoScroll` state for programmatic navigation
- Improved `updateCurrentPage()` for precise page tracking
- Better performance optimization with `useCallback`

**PR #6 (June 2025)** - Hook Standardization

- Improved error handling across all hooks
- Better TypeScript typing and interfaces
- Enhanced performance with memoization
- Standardized hook patterns and conventions

**PR #5 (June 2025)** - Highlighting System

- Enhanced `use-pdf-highlights.ts` with dual highlighting
- Added risk-based color coding system
- Improved tooltip positioning and interaction
- Better integration with contract analysis

**PR #4 (June 2025)** - Search Enhancement

- Enhanced `use-pdf-search.ts` with multiple search modes
- Added real-time search capabilities
- Improved search result navigation
- Better Spanish text processing

**PR #2 (June 2025)** - Foundation Hooks

- Created core PDF viewer hooks
- Basic search functionality
- Initial highlighting system
- Mobile detection utilities

## Key Architecture Decisions

1. **Modular Design**: Each hook has a single responsibility
2. **Performance Optimized**: Memoization and efficient re-renders
3. **Type Safety**: Full TypeScript with comprehensive interfaces
4. **Consumer-Focused**: Hooks designed for B2C user experience
5. **Mobile-First**: Responsive design considerations
6. **Accessibility**: Screen reader and keyboard navigation support
7. **Reusable Logic**: Hooks can be composed and reused
8. **Spanish Market Focus**: Optimized for Spanish mortgage documents

## Hook Patterns

### State Management Pattern:

```typescript
const useCustomHook = (initialState) => {
  const [state, setState] = useState(initialState);

  const updateState = useCallback((newState) => {
    setState(newState);
  }, []);

  return { state, updateState };
};
```

### Effect Cleanup Pattern:

```typescript
useEffect(() => {
  const subscription = subscribeToSomething();

  return () => {
    subscription.unsubscribe();
  };
}, [dependency]);
```

### Performance Optimization Pattern:

```typescript
const memoizedValue = useMemo(() => {
  return expensiveComputation(data);
}, [data]);

const memoizedCallback = useCallback(() => {
  return someFunction();
}, [dependencies]);
```

## Development Notes

- **Performance**: Optimized for large PDF documents and real-time interactions
- **Memory Management**: Proper cleanup of event listeners and subscriptions
- **Type Safety**: Full TypeScript with comprehensive interfaces
- **Testing**: Unit tests for all hook logic
- **Documentation**: Clear JSDoc comments for all hooks
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile Support**: Touch-friendly interactions and responsive behavior
- **Error Handling**: Graceful error boundaries and recovery

## Integration Points

### Component Dependencies:

- **PDF Viewer**: Primary consumer of PDF-related hooks
- **Chat Interface**: Mobile detection and responsive behavior
- **Search Components**: PDF search functionality
- **Highlight System**: Visual annotation and tooltip management

### External Dependencies:

- **React**: Core hook functionality
- **PDF.js**: PDF document processing
- **Floating UI**: Tooltip positioning
- **ResizeObserver**: Responsive behavior detection

## Performance Considerations

### Optimization Strategies:

- **Memoization**: Expensive computations cached
- **Debouncing**: Search operations throttled
- **Lazy Loading**: PDF pages loaded on demand
- **Event Delegation**: Efficient event handling

### Memory Management:

- **Cleanup**: Proper cleanup of event listeners
- **Unsubscribe**: Cancel subscriptions on unmount
- **Weak References**: Avoid memory leaks
- **Efficient Re-renders**: Minimize unnecessary updates

## Future Enhancements

### Planned Features:

- **Advanced Search**: Better Spanish language search
- **Enhanced Highlighting**: More sophisticated annotation system
- **Performance Optimization**: Further performance improvements
- **Accessibility**: Enhanced screen reader support
- **Multi-document**: Support for multiple PDF documents
- **Collaboration**: Real-time collaboration features
