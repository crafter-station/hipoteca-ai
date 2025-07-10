# LLMS.md - Components Directory (React Components)

## File Structure

```
src/components/
├── chat/                          # Chat System Components
│   ├── chat-selector.tsx         # Chat conversation selector
│   ├── chat-toolbar.tsx          # Chat controls and actions
│   ├── index.tsx                 # Main ChatPopup component
│   ├── sources.tsx               # Source citation display
│   ├── use-chat-id.ts            # Chat ID state management
│   ├── use-chat-logic.ts         # Chat business logic
│   └── use-chat-open.ts          # Chat popup open/close state
├── contract-upload/               # Contract Upload Flow
│   ├── features.tsx              # Feature highlights
│   ├── footer.tsx                # Upload flow footer
│   └── hero.tsx                  # Upload hero section
├── icons/                         # Custom SVG Icons
│   ├── whatsapp-icon.tsx         # WhatsApp icon
│   └── x-logo-icon.tsx           # X (Twitter) logo
├── landing/                       # Landing Page Components
│   ├── section-wrapper.tsx       # Section layout wrapper
│   └── smooth-scroll-link.tsx    # Smooth scroll navigation
├── pdf-viewer/                    # Modular PDF Viewer System
│   ├── highlight-legend.tsx      # Annotation type legend
│   ├── index.tsx                 # Main PDFViewer orchestrator
│   ├── pdf-canvas.tsx            # Multi-page PDF rendering
│   ├── pdf-header.tsx            # PDF viewer header/toolbar
│   ├── pdf-minimap.tsx           # PDF navigation minimap
│   ├── README.md                 # PDF viewer documentation
│   ├── search-panel.tsx          # PDF search interface
│   ├── text-selection-popup.tsx  # Text selection tooltip
│   └── toolbar.tsx               # PDF navigation controls
├── shared/                        # Shared Components
│   ├── chat-panel.tsx            # Shared chat interface
│   ├── header.tsx                # App header
│   ├── logo.tsx                  # Hipoteca Findr logo
│   └── summary-generator.tsx     # Contract summary generator
├── ui/                            # shadcn/ui Components
│   ├── accordion.tsx             # Accordion component
│   ├── alert-dialog.tsx          # Alert dialog
│   ├── alert.tsx                 # Alert notifications
│   ├── avatar.tsx                # User avatar
│   ├── badge.tsx                 # Badge/tag component
│   ├── button.tsx                # Button component
│   ├── card.tsx                  # Card layout
│   ├── dialog.tsx                # Modal dialog
│   ├── dropdown-menu.tsx         # Dropdown menu
│   ├── form.tsx                  # Form components
│   ├── input.tsx                 # Input field
│   ├── label.tsx                 # Form label
│   ├── scroll-area.tsx           # Scrollable area
│   ├── sheet.tsx                 # Sheet/sidebar
│   ├── sidebar.tsx               # Sidebar component
│   ├── table.tsx                 # Data table
│   ├── tabs.tsx                  # Tab navigation
│   ├── textarea.tsx              # Textarea input
│   ├── tooltip.tsx               # Tooltip component
│   └── [...other ui components]  # Additional shadcn/ui components
├── app-sidebar-client.tsx         # Client-side sidebar
├── chat-sidebar.tsx               # Chat sidebar (deprecated)
├── summary-panel.tsx              # Contract summary panel
├── TriggerProvider.tsx            # Trigger.dev provider
└── user-button.tsx                # User authentication button
```

## Business Relevance

### Core Component Systems:

1. **🤖 Chat System (`chat/`)**

   - **ChatPopup**: Main chat interface with Spanish mortgage specialization
   - **Sources**: Displays contract page citations and mortgage knowledge references
   - **ChatSelector**: Allows users to switch between chat conversations
   - **ChatToolbar**: Chat controls (new chat, minimize, settings)
   - **Consumer Focus**: B2C language, professional but accessible tone

2. **📄 PDF Viewer System (`pdf-viewer/`)**

   - **Enterprise-grade architecture**: Modular design with separation of concerns
   - **Dual Highlighting**: Search results + contract risk annotations
   - **Minimap Navigation**: Thumbnail overview with highlight indicators
   - **Interactive Legend**: 7 annotation types with color-coded risk levels
   - **Multi-page Rendering**: Continuous scroll with all pages loaded
   - **Search Capabilities**: Multiple search modes (exact, fuzzy, regex)

3. **📋 Contract Upload Flow (`contract-upload/`)**

   - **Hero Section**: Consumer-facing benefits and value proposition
   - **Features**: Highlights of AI analysis capabilities
   - **Footer**: Trust indicators and security messaging
   - **Spanish Market Focus**: Tailored for Spanish mortgage consumers

4. **🏠 Landing Page (`landing/`)**

   - **SectionWrapper**: Consistent layout for landing sections
   - **SmoothScrollLink**: Navigation between landing sections
   - **Consumer Language**: B2C messaging throughout [[memory:2522684]]

5. **🎨 UI Components (`ui/`)**
   - **shadcn/ui**: Curated component library
   - **Consistent Design System**: Standardized styling and behavior
   - **Accessibility**: ARIA labels and keyboard navigation
   - **Responsive Design**: Mobile-first approach

## Change-Log

### Recent Major Changes:

**PR #10 (June 2025)** - Chat Popup Integration

- Created new `chat/` directory with modular chat system
- Added `ChatPopup` as main interface replacing dedicated chat pages
- Implemented `nuqs` integration for URL-based state management
- Added `Sources` component for citation display
- Removed deprecated `chat-sidebar.tsx`

**PR #8 (June 2025)** - PDF Viewer Enhancement

- Added `pdf-minimap.tsx` for PDF navigation
- Enhanced `pdf-canvas.tsx` with better rendering performance
- Added `pdf-header.tsx` for unified toolbar
- Improved `app-sidebar-client.tsx` with dynamic contract history
- Enhanced authentication flow components

**PR #6 (June 2025)** - Component Standardization

- Standardized all shadcn/ui components with consistent `data-slot` attributes
- Improved component props and default values
- Enhanced accessibility features
- Better component composition patterns

**PR #5 (June 2025)** - Contract Analysis Features

- Enhanced PDF viewer with highlight extraction display
- Added contract risk classification visualization
- Improved parallel processing indicators
- Better user feedback during analysis

**PR #4 (June 2025)** - Dual Knowledge Integration

- Enhanced chat components with dual source capability
- Added source citation components
- Improved Spanish language support
- Better contract-specific context display

**PR #2 (June 2025)** - Foundation Components

- Initial PDF viewer architecture
- Basic chat interface
- Core UI component library
- Authentication components

## Key Architecture Decisions

1. **Modular Design**: Each component has a single responsibility
2. **Consumer-Focused UI**: B2C language and accessible design patterns
3. **Enterprise PDF Viewer**: Professional-grade PDF handling with advanced features
4. **Dual-Source Chat**: Contract-specific + general mortgage knowledge
5. **Spanish Market Focus**: Components tailored for Spanish mortgage consumers
6. **Accessibility First**: ARIA labels, keyboard navigation, screen reader support
7. **Performance Optimized**: Lazy loading, virtualization, efficient rendering
8. **Mobile-First**: Responsive design for all screen sizes

## Component Patterns

### Chat Components

- **Popup Architecture**: Non-intrusive chat overlay
- **Source Citation**: Mandatory source attribution for AI responses
- **State Management**: URL-based state with `nuqs`
- **Real-time Updates**: Streaming responses with React Query

### PDF Viewer Components

- **Orchestrator Pattern**: Main component coordinates sub-components
- **Dual Highlighting**: Separate systems for search and annotations
- **Custom Hooks**: Encapsulated business logic
- **Service Classes**: Stateless utility services

### Upload Components

- **Progressive Enhancement**: Works without JavaScript
- **Error Boundaries**: Graceful error handling
- **Loading States**: Clear feedback during processing
- **Security**: Client-side validation + server-side verification

## Development Notes

- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, custom hooks for UI state
- **TypeScript**: Full type safety with comprehensive interfaces
- **Performance**: Optimized re-renders, memoization, virtualization
- **Testing**: Component testing with React Testing Library
- **Documentation**: Comprehensive prop documentation and usage examples
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Spanish-first with structured content keys
