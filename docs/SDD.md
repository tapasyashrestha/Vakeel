# System Design Document (SDD) — Vakeel

**Document Version:** 1.0.0  
**Date:** June 30, 2026  
**Status:** Approved  
**Author:** Principal System Architect  

---

## 1. System Architecture Diagram

```
                        +----------------------------------------+
                        |           Next.js Frontend             |
                        |   React Server Components & Next API    |
                        +-------------------+--------------------+
                                            |
                                            v (JSON/REST + Auth Token)
                        +-------------------+--------------------+
                        |           FastAPI Gateway              |
                        |     Routing, Auth & Rate Limiter       |
                        +---------+--------------------+---------+
                                  |                    |
         (Trigger Async Tasks)    |                    | (Direct Query)
         +------------------------+                    +-----------------------+
         |                                                                     |
         v                                                                     v
+--------+---------------+                                           +---------+---------+
|     Celery Workers     |                                           |   LangGraph Agent |
|  PaddleOCR Ingestion   |                                           |    Orchestration  |
+--------+---------------+                                           +---------+---------+
         |                                                                     |
         | (Push Embeddings)                                                   | (Verify)
         +------------------------+                    +-----------------------+
                                  |                    |
                                  v                    v
                        +---------+--------------------+---------+
                        |        PostgreSQL Database (Supabase)  |
                        |    Schemas, pgvector index, RLS        |
                        +----------------------------------------+
```

---

## 2. AI Architecture: Multi-Agent RAG Orchestration

```
[Query Input]
      |
      v
+-----+-----------------------+
|  Router Agent (LangGraph)    | ---> Decides routing target
+-----+-----------------------+
      |
      +---> Public Corpus (Indian Kanoon)
      |
      +---> Private Corpus (Chamber DB)
      |
      v
+-----+-----------------------+
| Vector & Keyword Retrieval  | ---> Hybrid search via Cosine + BM25
+-----+-----------------------+
      |
      v
+-----+-----------------------+
| Context Builder & Filter   | ---> Role checking & chunk trimming
+-----+-----------------------+
      |
      v
+-----+-----------------------+
|   GPT-4o Synthesis Agent    | ---> Generates draft answers with citations
+-----+-----------------------+
      |
      v
+-----+-----------------------+
|  Citation Verifier Agent    | ---> Compares GPT output claims to source chunks
+-----+-----------------------+
      |
      +---> [Passed] ---> Renders Answer & exports Draft
      |
      +---> [Failed] ---> Highlights unverified lines, restricts export
```

---

## 3. OCR & True Typing Ingestion Pipeline

```
[Uploaded Scanned PDF]
           |
           v
+----------+----------+
|  PaddleOCR Engine   | ---> Character recognition and coordinate extraction
+----------+----------+
           |
           v
+----------+----------+
| True Typing Layer   | ---> Recreates text positioning (tabular alignment)
+----------+----------+
           |
           v
+----------+----------+
| Metadata Extraction | ---> Identifies Court, Sections, Parties, and Dates
+----------+----------+
           |
           v
+----------+----------+
| Recursive Chunking  | ---> Splitting text to 512-token chunks
+----------+----------+
           |
           v
+----------+----------+
|  Embeddings Generator| ---> Calculates 1536-dimensional OpenAI vector
+----------+----------+
           |
           v
+----------+----------+
| pgvector database   | ---> Inserts chunk vector to index
+----------+----------+
```

---

## 4. Database Schema & RLS Policies

```
   +---------------+             +-----------------+             +-----------------+
   |   Tenants     |             |     Users       |             |     Cases       |
   +---------------+             +-----------------+             +-----------------+
   | id (PK)       |<----------- | id (PK)         |<----------- | id (PK)         |
   | name          |             | tenant_id (FK)  |             | tenant_id (FK)  |
   | plan          |             | name            |             | case_number     |
   | billing_cycle |             | email           |             | court           |
   +---------------+             | role (enum)     |             | status          |
           ^                     +-----------------+             +-----------------+
           |                              ^                               ^
           |                              |                               |
           |                              +---------------+               |
           |                                              |               |
           +----------------------+                       |               |
                                  |                       |               |
                           +------+--------+              |               |
                           |   Documents   |              |               |
                           +---------------+              |               |
                           | id (PK)       |              |               |
                           | tenant_id (FK)|              |               |
                           | case_id (FK)  |--------------+---------------+
                           | uploader_id   |--------------+
                           | filename      |
                           | raw_text      |
                           | is_private    |
                           +---------------+
                                  ^
                                  | (1 to Many)
                           +------+--------+
                           |   Chunks      |
                           +---------------+
                           | id (PK)       |
                           | document_id   |
                           | content       |
                           | embedding     |
                           +---------------+
```

### Table Schemas & Row Level Security (RLS)

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Senior', 'Associate', 'Intern', 'Admin')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Select policy
CREATE POLICY user_tenant_isolation ON users
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
```

#### Documents Table
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Read policy enforcing Tenant isolation & Intern visibility checks
CREATE POLICY doc_tenant_isolation ON documents
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
        AND (
            (SELECT role FROM users WHERE id = auth.uid()) != 'Intern'
            OR is_private = FALSE
        )
    );
```

#### Chunks Table
```sql
CREATE TABLE chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(1536)
);

CREATE INDEX chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops);
```

---

## 5. API Design & Security

### 5.1. Research Search Endpoint
- **URL**: `POST /api/v1/search`
- **Authentication**: JWT Bearer token in headers.
- **Request Payload**:
  ```json
  {
    "query": "GST Input Tax Credit mismatch Zenith Tech",
    "filter_private": true,
    "limit": 5
  }
  ```
- **Response Payload**:
  ```json
  {
    "query": "GST Input Tax Credit mismatch Zenith Tech",
    "routing": "both",
    "confidence": 0.95,
    "synthesized_answer": "Based on case law [Diya Agencies Para 14]...",
    "verification_status": "passed",
    "citations": [
      {
        "id": "pub_chk_1",
        "source": "public",
        "title": "Diya Agencies vs State Tax Officer",
        "court": "Kerala High Court",
        "citation": "Para 14",
        "verified": true
      }
    ]
  }
  ```
- **Rate Limits**: 30 requests per minute per IP address.

### 5.2. Document Ingestion Endpoint
- **URL**: `POST /api/v1/upload`
- **Authentication**: JWT Bearer token (restricted to `Admin` and `Associate` roles).
- **Request Payload**: Multipart Form Data containing `file: File` and `case_id: UUID`.
- **Response Payload**:
  ```json
  {
    "document_id": "890afb20-1a89-4bcf-a201-382a8de84021",
    "filename": "GST_SCN_Apex.pdf",
    "status": "queued",
    "task_id": "celery-task-9028ab-41d9"
  }
  ```

---

## 6. Security, Scalability, and DPDP Considerations

### Security & Access Control
- **JWT Tokens**: Authentication managed by Clerk, issuing JWTs with short expirations (15 mins) and tenant ID claims.
- **RBAC**: FastAPI middleware enforces role verification (e.g. Interns cannot invoke `/api/v1/admin/*` paths).
- **Data Encryption**: Transparent Data Encryption (TDE) active on PostgreSQL; Supabase storage uses AWS KMS keys.

### DPDP Act & Data Sovereignty
- **Data Storage**: Localized instances within India (AWS ap-south-1 Mumbai) to satisfy data residency.
- **Right to Erasure**: Hard deletes on `tenants` and `documents` tables immediately purge raw texts and vector vectors from disk.

### Scalability Design
- **Caching**: Redis caches the top-1000 public Indian Kanoon citations to reduce vector retrieval calls.
- **Async Workers**: Celery workers split e-way bills and multi-page PDFs to prevent long-running tasks from stalling HTTP request loops.
