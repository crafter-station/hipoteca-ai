# LLMS.md - Source Directory Overview

## File Structure

```
src/
├── app/                        # Next.js App Router (routes, API endpoints, pages)
│   ├── api/                   # API endpoints
│   │   ├── chat/              # Chat API routes (streaming, message retrieval)
│   │   ├── explain/           # PDF explanation API
│   │   └── uploadthing/       # File upload API integration
│   ├── checkr/               # Main application pages
│   │   ├── [key]/            # Contract analysis page (dynamic route)
│   │   ├── new/              # New contract upload page
│   │   └── layout.tsx        # Layout with chat popup integration
│   ├── providers/            # React context providers
│   ├── sign-in/              # Authentication pages
│   ├── sign-up/
│   ├── layout.tsx            # Root layout with authentication
│   └── page.tsx              # Landing page
├── actions/                   # Next.js Server Actions
│   ├── extract-content-from-pdf.ts    # PDF text extraction
│   ├── generate-object-from-pdf.ts    # PDF object generation
│   ├── get-processed-contract.ts      # Contract retrieval
│   ├── get-user-contracts.ts          # User contract listing
│   └── process-pdf.ts                 # PDF processing trigger
├── clients/                   # External service clients
│   ├── mistral.ts            # Mistral AI client
│   ├── redis.ts              # Redis client configuration
│   └── weaviate.ts           # Weaviate vector database client
├── cmd/                       # Command-line utilities
│   ├── extract-content-from-pdf.ts    # CLI for PDF extraction
│   ├── extract-highlights.ts          # CLI for highlight extraction
│   ├── generate-object-from-pdf.ts    # CLI for PDF object generation
│   └── get-stored-pdf.ts              # CLI for retrieving stored PDFs
├── components/                # React components
│   ├── chat/                 # Chat system components
│   ├── contract-upload/      # Contract upload flow components
│   ├── pdf-viewer/           # Modular PDF viewer system
│   ├── shared/               # Shared components across features
│   ├── ui/                   # shadcn/ui components
│   └── *.tsx                 # Various utility components
├── hooks/                     # React custom hooks
│   ├── use-mobile.ts         # Mobile device detection
│   ├── use-pdf-highlights.ts # PDF highlighting management
│   ├── use-pdf-search.ts     # PDF search functionality
│   └── use-pdf-viewer.ts     # PDF viewer state management
├── lib/                       # Utility libraries
│   ├── auth/                 # Authentication utilities
│   ├── constants/            # Application constants
│   ├── chat-history.ts       # Chat history management
│   ├── chat-utils.ts         # Chat utility functions
│   ├── highlight-service.ts  # PDF highlighting service
│   ├── pdf-utils.ts          # PDF processing utilities
│   ├── text-processing.ts    # Text manipulation utilities
│   └── utils.ts              # General utility functions
├── models/                    # Data models and Redis schemas
│   ├── constants.ts          # Model constants and collection names
│   ├── contract-context.ts   # Contract context model
│   ├── contract.ts           # Contract model with highlights
│   ├── mortgage-knowledge.ts # Mortgage knowledge base model
│   └── user.ts               # User model
├── prompts/                   # AI system prompts
│   ├── chat-system-prompt.ts # Main chat system prompt
│   └── explain-system-prompt.ts # Explanation system prompt
├── redis/                     # Redis operations
│   ├── chat-management.ts    # Chat CRUD operations
│   ├── get-messages.ts       # Message retrieval
│   ├── index.ts              # Redis client exports
│   ├── keys.ts               # Redis key generators
│   └── set-messages.ts       # Message storage
├── tools/                     # AI tools for vector search
│   ├── search-contract-context.ts     # Contract-specific search
│   └── search-mortgage-knowledge.ts   # General mortgage knowledge search
├── triggers/                  # Background processing (Trigger.dev)
│   └── process-pdf/          # PDF processing pipeline
│       ├── extract-content.ts       # Content extraction
│       ├── extract-highlights.ts    # Highlight extraction
│       ├── extract-summary.ts       # Summary generation
│       ├── index.ts                 # Main processing task
│       └── store-contract-context.ts # Vector database storage
├── types/                     # TypeScript type definitions
│   └── pdf-viewer.ts         # PDF viewer types
├── instrumentation.ts         # Application instrumentation
└── middleware.ts              # Next.js middleware
```

## Business Relevance

**Hipoteca Findr** es un framework de análisis de contratos hipotecarios que democratiza el acceso a análisis profesional de hipotecas para consumidores españoles. La aplicación sigue una arquitectura AI-First con estas capacidades centrales:

### Core Business Functions:

1. **🤖 Asistente Conversacional (Hipoteca Findr)**

   - Chatbot especializado exclusivamente en hipotecas
   - Rechaza consultas sobre otros temas
   - Fuentes duales: contrato específico del usuario + base de conocimiento hipotecario
   - Obligatorio citar fuentes de información
   - Tono profesional pero accesible para consumidores

2. **📊 Sistema de Análisis y Clasificación**

   - Extracción automática de datos financieros (TAE, cuota, comisiones)
   - Puntuación 0-100 con etiquetas comprensibles:
     - 0-19: Excelente (muy favorable)
     - 20-39: Bueno (favorable, riesgos mínimos)
     - 40-69: Precaución (estándar con puntos de atención)
     - 70-100: Riesgoso (elementos problemáticos significativos)
   - Red Flags: Identifica hasta 4 elementos más problemáticos

3. **⚖️ Criterios de Evaluación de Riesgo**

   - Competitividad financiera vs. mercado español
   - Flexibilidad del contrato (reembolso anticipado, renegociación)
   - Transparencia y claridad en condiciones
   - Protección del consumidor según normativa española

4. **🔍 Pipeline de Procesamiento**
   - Carga asíncrona de PDFs via Trigger.dev
   - Extracción de contenido con Mistral OCR
   - Generación de highlights y clasificación IA
   - Almacenamiento en bases de datos vectoriales (Weaviate)

### Target Market:

- Consumidores españoles que necesitan entender contratos hipotecarios complejos
- Democratización del análisis profesional hipotecario
- Enfoque B2C con lenguaje no técnico y comprensible

## Change-Log

### Recent Major Changes (Based on PR History):

**PR #10 (June 2025)** - Chat Popup Integration

- Migrated from dedicated chat pages to integrated popup system
- Added `nuqs` for URL-based state management
- Enhanced chat to access contract-specific context
- Improved user experience with persistent chat across pages

**PR #8 (June 2025)** - PDF Viewer Enhancement

- Added PDF minimap feature for better navigation
- Refactored PDF viewer architecture for better performance
- Improved sidebar with dynamic contract history
- Enhanced authentication flow

**PR #6 (June 2025)** - Code Standardization

- Implemented consistent code formatting with Biome
- Standardized shadcn/ui components
- Improved parallel processing utilities
- Enhanced chat functionality

**PR #5 (June 2025)** - Contract Highlights System

- Added parallel processing utilities for better performance
- Implemented contract highlight extraction and classification
- Enhanced contract model with chunks and highlights
- Added AI-powered highlight explanations with risk categorization

**PR #4 (June 2025)** - Mortgage Knowledge Integration

- Integrated general mortgage knowledge base (Guía Hipotecaria del Banco de España)
- Added dual-search capability (contract-specific + general knowledge)
- Enhanced AI system prompts for better source citation
- Improved Spanish language support

**PR #2 (June 2025)** - PDF Processing Foundation

- Integrated Trigger.dev for background processing
- Added UploadThing for file handling
- Implemented Weaviate vector database
- Created core PDF processing pipeline

## Key Architecture Decisions

1. **AI-First Design**: Every component is designed to work with AI, from data models to UI components
2. **Spanish Market Focus**: Specific to Spanish mortgage market regulations and standards
3. **Modular PDF Viewer**: Enterprise-grade PDF viewer with dual highlighting system
4. **Dual Vector Search**: Contract-specific + general mortgage knowledge search capabilities
5. **Consumer-Focused Language**: All UI text uses B2C language, not technical jargon [[memory:2522684]]
6. **Background Processing**: Heavy AI processing happens asynchronously via Trigger.dev
7. **Risk Classification**: 0-100 scoring system with comprehensive red flags detection
8. **Source Citation**: Mandatory source attribution for all AI responses

## Development Notes

- **Tech Stack**: Next.js 15, TypeScript, Redis, Weaviate, Trigger.dev
- **AI Models**: Mistral for OCR/extraction, OpenAI for chat/analysis
- **State Management**: React Query for server state, custom hooks for UI state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Clerk for user management
- **File Processing**: UploadThing for uploads, PDF.js for rendering
- **Market Focus**: Spanish mortgage market regulations and standards
- **Language**: Spanish-first with professional but accessible tone
