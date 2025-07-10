# LLMS.md - Lib Directory (Utility Libraries)

## File Structure

```
src/lib/
├── auth/                          # Authentication utilities
│   ├── server.ts                  # Server-side auth helpers
│   └── user-identification.ts     # User ID generation and validation
├── constants/                     # Application constants
│   └── legend-items.ts           # PDF annotation type definitions
├── chat-history.ts                # Chat history management
├── chat-utils.ts                  # Chat utility functions
├── highlight-service.ts           # PDF highlighting service
├── nanoid.ts                      # ID generation utility
├── pdf-utils.ts                   # PDF processing utilities
├── text-processing.ts             # Text manipulation utilities
├── uploadthing.ts                 # File upload utilities
└── utils.ts                       # General utility functions
```

## Business Relevance

### Core Utility Libraries:

**Hipoteca Findr** uses a comprehensive set of utility libraries to support its AI-first mortgage analysis platform. These libraries provide essential functionality for PDF processing, user authentication, chat management, and data processing tailored for Spanish mortgage consumers.

### Key Utility Categories:

1. **🔐 Authentication**: User identification and session management
2. **📄 PDF Processing**: Document analysis and visualization
3. **💬 Chat Management**: Conversation history and source parsing
4. **🎨 Highlighting**: Risk visualization and annotation
5. **🛠️ General Utilities**: Text processing and data manipulation

## File Details

### `auth/` - Authentication Utilities

#### `server.ts` - Server-side Authentication

**Purpose**: Server-side authentication helpers for Clerk integration
**Key Functions**:

- `getUserId()`: Extract authenticated user ID from request
- Session validation and user context management
- Server-side authentication guards

#### `user-identification.ts` - User ID Management

**Purpose**: Generate and validate user identifiers
**Key Functions**:

- `generateUserId()`: Create unique user identifiers
- User ID validation and normalization
- Cross-system user identification

### `constants/` - Application Constants

#### `legend-items.ts` - PDF Annotation Definitions

**Purpose**: Define PDF annotation types and styling
**Key Features**:

- **7 Annotation Types**: Complete risk classification system
- **Color Coding**: Red (high risk), Green (information), Yellow (attention)
- **Professional Styling**: Consistent visual design
- **Spanish Market Context**: Risk categories tailored for Spanish mortgages

**Annotation Types**:

- **Red**: Abusive clauses, financial risks, penalties
- **Green**: Loan details, interest rates, insurance coverage
- **Yellow**: Consult bank, negotiable clauses, future changes

### `chat-history.ts` - Chat History Management

**Purpose**: Chat conversation persistence and retrieval
**Key Functions**:

- Chat history serialization and deserialization
- Conversation context management
- Chat session lifecycle handling

### `chat-utils.ts` - Chat Utility Functions

**Purpose**: Chat message processing and source parsing
**Key Functions**:

- `parseSources()`: Extract source citations from AI responses
- Message content parsing and validation
- Source attribution formatting

### `highlight-service.ts` - PDF Highlighting Service

**Purpose**: Professional PDF highlighting with Floating UI integration
**Key Features**:

- **Dual Highlighting System**: Search results + contract annotations
- **Floating UI Positioning**: Collision-aware tooltip placement
- **Color-Coded Tooltips**: Risk-based highlighting system
- **Performance Optimized**: Efficient DOM manipulation

**Service Capabilities**:

- Multi-page highlight management
- Interactive tooltip system
- Professional styling with smooth animations
- Responsive positioning system

### `nanoid.ts` - ID Generation Utility

**Purpose**: Generate unique identifiers for contracts and entities
**Key Functions**:

- `nanoid()`: Generate URL-safe unique IDs
- Consistent ID generation across the application
- Collision-resistant identifier creation

### `pdf-utils.ts` - PDF Processing Utilities

**Purpose**: PDF manipulation and processing helpers
**Key Functions**:

- PDF parsing and validation
- Page extraction and manipulation
- Text extraction utilities
- PDF metadata processing

### `text-processing.ts` - Text Manipulation Utilities

**Purpose**: Text processing for mortgage document analysis
**Key Functions**:

- Text chunking for vector search
- Spanish text normalization
- Mortgage terminology extraction
- Text similarity and matching

### `uploadthing.ts` - File Upload Utilities

**Purpose**: File upload configuration and handling
**Key Functions**:

- Upload validation and security
- File type and size restrictions
- Upload progress tracking
- Error handling and retry logic

### `utils.ts` - General Utility Functions

**Purpose**: Common utility functions and helpers
**Key Functions**:

- `cn()`: Tailwind class name merging
- `processInParallel()`: Concurrent processing utility
- Data validation and transformation
- Error handling helpers

## Change-Log

### Recent Major Changes:

**PR #6 (June 2025)** - Utility Standardization

- Enhanced `utils.ts` with `processInParallel()` for concurrent operations
- Improved `chat-utils.ts` with better source parsing
- Standardized error handling across utilities
- Better TypeScript typing for all utilities

**PR #5 (June 2025)** - Parallel Processing Enhancement

- Added `processInParallel()` utility for concurrent operations
- Enhanced PDF processing utilities for better performance
- Improved text processing for highlight extraction
- Better error handling in parallel operations

**PR #4 (June 2025)** - Chat and Source Management

- Enhanced `chat-utils.ts` with source citation parsing
- Improved `chat-history.ts` with better persistence
- Added source attribution utilities
- Better Spanish language support

**PR #2 (June 2025)** - Foundation Utilities

- Created core utility libraries
- Basic PDF processing utilities
- Authentication helpers
- File upload utilities

## Key Architecture Decisions

1. **Modular Design**: Each utility has a single responsibility
2. **TypeScript First**: Full type safety across all utilities
3. **Performance Optimized**: Efficient algorithms and data structures
4. **Spanish Market Focus**: Utilities tailored for Spanish mortgage analysis
5. **Error Resilience**: Comprehensive error handling and recovery
6. **Reusable Components**: Utilities designed for cross-component usage
7. **AI-Friendly**: Utilities optimized for AI processing workflows
8. **Consumer-Focused**: B2C language and user experience considerations

## Utility Patterns

### Authentication Pattern:

- Server-side authentication guards
- User context extraction
- Session management
- Cross-system user identification

### PDF Processing Pattern:

- Document validation and parsing
- Multi-page processing
- Text extraction and chunking
- Highlight management and visualization

### Chat Utilities Pattern:

- Message parsing and validation
- Source citation extraction
- History management
- Real-time updates

### Parallel Processing Pattern:

- Concurrent operation orchestration
- Error handling across parallel tasks
- Progress tracking
- Resource optimization

## Development Notes

- **Performance**: Optimized for large PDF documents and concurrent operations
- **Error Handling**: Comprehensive error boundaries and recovery mechanisms
- **TypeScript**: Full type safety with comprehensive interfaces
- **Testing**: Unit tests for all utility functions
- **Documentation**: Clear JSDoc comments for all public functions
- **Security**: Input validation and sanitization
- **Scalability**: Designed for high-volume operations
- **Maintenance**: Easy to extend and modify

## Integration Points

### External Dependencies:

- **Clerk**: Authentication and user management
- **Floating UI**: Tooltip positioning for highlights
- **UploadThing**: File upload handling
- **PDF.js**: PDF processing and rendering

### Internal Dependencies:

- **Components**: PDF viewer, chat interface, upload components
- **Models**: Contract and user data structures
- **Tools**: AI search tools for vector operations
- **Actions**: Server actions for data processing

## Future Enhancements

### Planned Features:

- **Advanced Text Processing**: Better Spanish language support
- **Enhanced PDF Utilities**: More sophisticated document analysis
- **Improved Performance**: Further optimization for large documents
- **Better Error Handling**: More granular error recovery
- **Analytics Integration**: Usage tracking and optimization
- **Accessibility**: Better support for assistive technologies
