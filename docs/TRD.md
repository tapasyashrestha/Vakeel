# Technical Requirements Document (TRD) — Vakeel

**Document Version:** 1.0.0  
**Date:** June 30, 2026  
**Status:** Approved  
**Author:** AI Technical Lead  

---

## 1. Technological Stack

Vakeel uses a multi-tier, micro-services-inspired architecture designed to support fast RAG search queries, secure OCR ingestion, and role-restricted chamber files.

### Frontend
- **Framework**: Next.js 14+ (App Router, Server Components)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui, Radix UI primitives
- **Icons**: Lucide React
- **Client State**: TanStack Query (React Query) v5

### Backend
- **Framework**: FastAPI (Python 3.11) for fast high-concurrency API routers
- **Task Queue**: Celery for asynchronous background OCR, ingestion, and vector embeddings compilation
- **Message Broker & Cache**: Redis v7
- **Database Driver**: SQLAlchemy + asyncpg for async SQL connections

### AI & Vector Intelligence
- **LLM Provider**: OpenAI API (GPT-4o, GPT-4o-mini)
- **Agent Orchestrator**: LangGraph (for multi-turn citation tracing and multi-agent coordination)
- **Vector Database**: pgvector extension on PostgreSQL
- **Embedding Models**: OpenAI `text-embedding-3-small` (1536 dimensions)
- **RAG Architecture**: Hybrid Retrieval (BM25 keyword + cosine similarity vector embeddings)

### OCR Processing
- **OCR Engine**: PaddleOCR (for offline open-source scanning and tabular alignment)
- **Cloud OCR**: Azure Document Intelligence (used as high-precision fallback for low-confidence scans)

### Database & Storage
- **Primary Database**: PostgreSQL (Supabase Managed instance)
- **Storage Service**: Supabase Storage buckets (private files with authenticated temporary download URL lifespans)

### Authentication & Billing
- **Auth Provider**: Clerk / Auth.js (OAuth, session control, RBAC claims injected into JWT tokens)
- **Payment Gateway**: Razorpay (standard Web Checkout integration for subscription handling)

### Deployment & Infrastructure
- **Frontend Hosting**: Vercel (static rendering, Edge functions caching)
- **Backend & Worker Nodes**: Railway / AWS ECS (Docker containers)
- **DNS, SSL & WAF**: Cloudflare

---

## 2. Environment Configurations & Secret Keys

```env
# Application Core
NEXT_PUBLIC_APP_URL=https://app.vakeel.in
API_BASE_URL=https://api.vakeel.in

# Authentication (Clerk)
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...

# Database Credentials
DATABASE_URL=postgresql+asyncpg://postgres:password@db.supabase.co:5432/postgres

# AI Services
OPENAI_API_KEY=sk-proj-...

# Task Queue (Celery/Redis)
REDIS_URL=redis://:password@redis-cache.railway.internal:6379/0

# Storage Configs
SUPABASE_URL=https://project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=sec_live_...

# Azure OCR Fallback
AZURE_COGNITIVE_KEY=azure-...
AZURE_COGNITIVE_ENDPOINT=https://instance.cognitiveservices.azure.com/
```

---

## 3. Module Execution Architecture

### 3.1. Unified Search Ingestion (Multi-Agent RAG)
1. **Request**: Frontend dispatches search request to `/api/v1/search` with the query string and Tenant ID.
2. **Routing (Planner Agent)**: The request is picked up by the FastAPI Router agent.
3. **Retrieval**:
   - Queries pgvector index via `pgvector` operators (`<=>` cosine distance).
   - Queries BM25 inverted index on metadata columns.
   - Combines results using Reciprocal Rank Fusion (RRF).
4. **Validation (Citation Verification Agent)**:
   - LangGraph runs a validation pass confirming that facts in the GPT-4o output correspond perfectly to paragraph-level references in the retrieved document text.
   - Returns citation verification stats: `passed` | `failed`.

### 3.2. OCR & Ingestion Pipeline
1. **Document Upload**: Admin uploads scanned PDF files to `/api/v1/upload`.
2. **S3/Supabase Storage**: File is stored in `private-documents` bucket.
3. **Celery Worker Ingestion**:
   - Spawns Celery task to download file and invoke PaddleOCR.
   - Converts pages to high-fidelity layouts (True Typing mapping text coordinates).
   - Generates text chunks (size: 512 tokens, overlap: 64 tokens).
   - Computes 1536-dim embeddings via `text-embedding-3-small`.
   - Inserts chunks to PostgreSQL database.

---

## 4. Integration Verification & Compliance
- **Tenant Security**: All SQL statements contain strict `tenant_id = current_tenant()` constraints enforced via RLS policies.
- **Auditing**: Every research query run by an intern is written to the audit log schema.
- **DPDP Act Compliance**: Client files can be completely scrubbed ("Right to be Forgotten") via cascade deletion paths.
