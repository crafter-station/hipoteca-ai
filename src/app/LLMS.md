# LLMS.md - App Directory (Next.js Routes & API)

## File Structure

```
src/app/
├── api/                        # API Routes
│   ├── chat/                  # Chat API endpoints
│   │   ├── [id]/             # Individual chat messages retrieval
│   │   │   └── route.ts      # GET chat messages by ID
│   │   └── route.ts          # POST new messages, GET user chats
│   ├── explain/              # PDF explanation API
│   │   └── route.ts          # Explain PDF content endpoint
│   └── uploadthing/          # File upload integration
│       ├── core.ts           # Upload configuration
│       └── route.ts          # Upload handling
├── checkr/                   # Main application routes
│   ├── [key]/               # Contract analysis page (dynamic)
│   │   ├── checkr-analysis-client.tsx  # Client component
│   │   └── page.tsx         # Server component wrapper
│   ├── new/                 # New contract upload
│   │   └── page.tsx         # Upload interface
│   └── layout.tsx           # Layout with chat popup
├── providers/               # React Context Providers
│   ├── client.tsx           # Client-side providers
│   └── index.tsx            # Provider composition
├── sign-in/                 # Authentication routes
│   └── [[...sign-in]]/      # Clerk sign-in pages
│       └── page.tsx
├── sign-up/                 # Authentication routes
│   └── [[...sign-up]]/      # Clerk sign-up pages
│       └── page.tsx
├── globals.css              # Global styles
├── icon.svg                 # App icon
├── layout.tsx               # Root layout
├── loading.tsx              # Global loading component
├── page.tsx                 # Landing page
└── tokens.css               # Design tokens
```

## Business Relevance

### Core Application Routes:

1. **Landing Page (`page.tsx`)**

   - Consumer-facing landing page for Hipoteca Findr
   - Features mortgage analysis benefits
   - Upload interface for new contracts
   - Spanish market focus with B2C language

2. **Contract Analysis (`checkr/[key]/`)**

   - Dynamic route for individual contract analysis
   - Real-time processing status with Trigger.dev integration
   - PDF viewer with highlights and risk classification
   - Contract scoring (0-100) with red flags identification

3. **New Contract Upload (`checkr/new/`)**
   - Secure file upload via UploadThing
   - Authentication required (Clerk integration)
   - Triggers background processing pipeline

### API Architecture:

1. **Chat API (`api/chat/`)**

   - Streaming chat responses using Vercel AI SDK
   - Dual knowledge sources: contract-specific + general mortgage knowledge
   - Mandatory source citation for all responses
   - Spanish mortgage market specialization only

2. **Explanation API (`api/explain/`)**

   - PDF content explanation endpoint
   - Contextual mortgage terminology explanations
   - Consumer-friendly language generation

3. **File Upload API (`api/uploadthing/`)**
   - Secure PDF upload handling
   - User authentication and file association
   - Trigger.dev background processing initiation

## Change-Log

### Recent Major Changes:

**PR #10 (June 2025)** - Chat Popup Integration

- Migrated from dedicated chat routes to popup system
- Added `nuqs` integration for URL-based state management
- Enhanced chat with contract-specific context
- Removed old `/chat` and `/chat/[id]` routes

**PR #8 (June 2025)** - Enhanced Contract Analysis

- Added `CheckrAnalysisClient` component for better UX
- Improved real-time processing feedback
- Enhanced authentication flow
- Added user contract history integration

**PR #6 (June 2025)** - API Standardization

- Improved chat API with consistent user identification
- Enhanced streaming response handling
- Better error handling and validation
- Standardized API response formats

**PR #4 (June 2025)** - Dual Knowledge Integration

- Enhanced chat API with mortgage knowledge base
- Added contract-specific search capabilities
- Improved AI system prompts for Spanish market
- Better source citation system

**PR #2 (June 2025)** - Foundation Setup

- Initial API structure with UploadThing integration
- Trigger.dev background processing setup
- Basic authentication with Clerk
- Core PDF processing pipeline

## Key Architecture Decisions

1. **App Router Architecture**: Full Next.js 15 App Router with server components
2. **API-First Design**: RESTful APIs with streaming support for chat
3. **Authentication**: Clerk integration with route protection
4. **File Processing**: UploadThing for secure PDF uploads
5. **Real-time Updates**: Trigger.dev integration for background processing
6. **Spanish Market Focus**: All content and responses tailored for Spanish consumers
7. **Consumer Language**: B2C language throughout the application [[memory:2522684]]

## API Endpoints

### Chat API (`/api/chat`)

- **POST**: Send message, stream AI response
- **GET**: List user chats
- **Features**: Contract-specific context, mortgage knowledge base, source citation

### Chat Messages API (`/api/chat/[id]`)

- **GET**: Retrieve messages for specific chat
- **Features**: Message history, conversation context

### Explanation API (`/api/explain`)

- **POST**: Explain PDF content or mortgage terms
- **Features**: Consumer-friendly explanations, Spanish market context

### Upload API (`/api/uploadthing`)

- **POST**: Upload PDF contracts
- **Features**: Authentication, file validation, processing trigger

## Development Notes

- **Authentication**: All protected routes use Clerk middleware
- **Language**: Spanish-first with professional but accessible tone
- **Error Handling**: Comprehensive error boundaries and validation
- **Performance**: Server components for initial load, client components for interactivity
- **SEO**: Proper metadata and OpenGraph tags for Spanish market
- **Security**: File upload validation, user authentication, rate limiting
