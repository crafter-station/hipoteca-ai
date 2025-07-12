# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL: AI-First Development Workflow

**BEFORE making ANY changes, you MUST:**

1. **Read LLMS.md files first** - These contain pre-computed context to avoid codebase exploration:
   - `/src/LLMS.md` - Overall architecture, business context, change history
   - `/src/app/LLMS.md` - Next.js routes and API structure  
   - `/src/components/LLMS.md` - Component patterns and UI architecture

2. **Follow the AI-First Manifesto** - Check `.cursor/rules/ai-first-manifesto.mdc` for detailed rules

3. **Update documentation** - After every change, update the relevant LLMS.md file with a change-log entry

## Development Commands

```bash
# Development server with Turbopack (using Bun)
bun run dev

# Build the application
bun run build

# Start production server
bun run start

# Install dependencies
bun install

# Run linting and formatting
bun run lint
bun run biome:check

# Deploy Trigger.dev tasks
bunx trigger.dev@latest deploy
```

## Project Architecture

### Tech Stack
- **Bun**: JavaScript runtime and package manager
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Clerk**: Authentication and user management
- **Biome**: Linting and code formatting
- **Tailwind CSS 4**: Styling framework with CSS variables integration
- **PostHog**: Analytics and feature flags
- **Trigger.dev**: Background job processing
- **Upstash Redis**: Data caching and storage
- **Weaviate**: Vector database for semantic search
- **UploadThing**: File upload handling

### Core Application Flow
**Hipoteca Findr** - Spanish mortgage contract analysis tool that democratizes professional mortgage analysis for consumers through an AI-powered pipeline:

1. **PDF Upload**: Users upload mortgage contracts via UploadThing
2. **Background Processing**: Trigger.dev jobs extract content, highlights, and summaries
3. **Vector Storage**: Contract chunks are stored in Weaviate for semantic search
4. **Contract Storage**: Full contracts stored in Redis with metadata
5. **Analysis Interface**: Users can view highlighted contracts with AI-generated insights

### Key Architecture Components

**Data Models** (src/models/):
- `Contract`: Core contract entity with highlights, chunks, and summaries
- `ContractHighlight`: Categorized contract annotations (abusive clauses, financial risks, etc.)
- `ContractContext`: Chunked contract content for vector search

**Background Jobs** (src/triggers/):
- `process-pdf`: Main workflow for PDF processing
- Extracts content, highlights, summaries, and stores in vector DB
- Uses metadata.set() for progress tracking

**Data Storage**:
- Redis: Contract metadata, user mappings, chat history
- Weaviate: Vector embeddings for semantic search
- Key-based contract access pattern using UploadThing file keys

**Authentication**:
- Clerk integration with user identification utilities
- User-scoped contract access and storage

### Critical Development Notes

**AI-First Manifesto Compliance**: This project follows Crafter Station's AI-First Manifesto principles:
- Documentation is as crucial as coding - always update LLMS.md files
- Intention matters - rules bound the LLM operation space  
- UI development as commodity - focus on taste, UX, and examples
- Spanish market specialization - B2C language, mortgage regulations

**Language & Market Focus**:
- **Spanish mortgage market only** - reject non-Spanish mortgage queries
- **B2C language** - professional but accessible, no technical jargon
- **Risk scoring**: 0-100 with clear labels (Excelente, Bueno, Precaución, Riesgoso)
- **Consumer protection** - Spanish mortgage regulations compliance

**Component Architecture**:
- **Modular PDF viewer** - enterprise-grade with dual highlighting system
- **Chat popup system** - non-intrusive overlay with source citation
- **shadcn/ui components** - curated design system with consistent styling
- **Mobile-first design** - responsive for all screen sizes
- **Tailwind 4 Design System** - semantic utility classes with CSS variables

**Data Architecture**:
- **Dual knowledge sources** - contract-specific + general mortgage knowledge
- **Mandatory source citation** - all AI responses must cite sources
- **User-scoped operations** - all data access is user-authenticated
- **Key-based access** - contracts accessed via UploadThing keys

**Environment Variables**: Check README.md for required variables including Clerk, Mistral, OpenAI, Redis, Weaviate, UploadThing, and Trigger.dev keys.

**Biome Configuration**: Several PDF-related files are ignored in biome.json due to complex canvas manipulation code.

**PostHog Integration**: Follow `.cursor/rules/posthog-integration.mdc` for analytics patterns.

**File Structure**:
- `/checkr/new`: Contract upload interface
- `/checkr/[key]`: Contract analysis view with PDF viewer and chat
- API routes handle chat, explanations, and UploadThing integration

**Testing**: No specific test framework identified - verify testing approach before implementing tests.

## Workflow Reminder

**Before ANY development work:**
1. Read the relevant LLMS.md files completely
2. Understand the Spanish mortgage market context
3. Follow AI-First principles from the manifesto
4. Use Bun for all package management and script execution

**After ANY changes:**
1. Update relevant LLMS.md files with change-log entries
2. Run `bun run lint` and `bun run biome:check`
3. Test from Spanish consumer perspective
4. Verify B2C language consistency
5. Ensure Tailwind 4 utility classes use tokens.css variables (e.g., `bg-primary-base`, `text-subtle`)