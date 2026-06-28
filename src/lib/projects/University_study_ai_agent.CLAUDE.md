# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Knowledge Assistant — a RAG-powered Q&A app with a Python/FastAPI backend and Next.js frontend, extended with a **Study-Assistant** that syncs Canvas LMS course materials into per-course Pinecone namespaces.

Users upload documents or connect Canvas LMS courses; materials are chunked, embedded, and stored in Pinecone. A LangGraph RAG agent answers questions using retrieved context, with citations back to source files.

**Current branch (`basic-chatbot-production`)**: RAG is fully wired. The active chat endpoint (`POST /api/chat/`) runs the LangGraph RAG agent (expand → retrieve → grade → generate). A second endpoint (`POST /api/chat/a2a`) runs a supervisor-routed A2A multi-agent.

## Development Commands

### Backend (Python 3.10+, from `backend/`)

```bash
venv\Scripts\activate.bat
uvicorn app.main:app --reload --port 8000

pip install -r requirements.txt
```

### Frontend (from `frontend/`)

```bash
npm install
npm run dev      # dev server on :3000
npm run build
npm run lint
```

The frontend proxies `/api/*` to `http://localhost:8000/api/*` via Next.js rewrites (`next.config.mjs`).

## Architecture

```
backend/app/
├── main.py              # FastAPI app; starts APScheduler + legacy report migration
├── config.py            # Settings (plain class, not Pydantic); all env-var defaults here
├── core/
│   ├── llm.py           # ChatOpenAI → GLM via Z.ai API; `get_llm(temperature, thinking)`
│   ├── embeddings.py    # HuggingFace BAAI/bge-base-en-v1.5 (768-dim, local)
│   ├── vectorstore.py   # Pinecone wrapper (upsert + similarity_search); FAISS fallback
│   ├── chunking.py      # RecursiveCharacterTextSplitter
│   └── metadata_store.py # Conversation/document persistence (JSON | Memory | Cosmos)
├── agents/
│   ├── rag_agent.py     # LangGraph: expand_queries → retrieve → grade_docs → generate
│   └── supervisor_agent.py  # LangGraph A2A: classify_intent → research|summary|direct
├── services/
│   └── document_service.py  # File loading, chunking, Pinecone upsert
├── study/               # Study-Assistant subsystem (Canvas LMS + daily scheduler)
│   ├── courses.py       # Course registry (4 MBA courses; course.code = Pinecone namespace)
│   ├── canvas_client.py # Async Canvas REST API (token + session cookie auth)
│   ├── orchestrator.py  # initialize_memory / run_maintenance / verify_sync
│   ├── tools.py         # read_course_materials / inject_course_materials
│   ├── manifest.py      # storage/course_manifest.json — per-course source inventory
│   ├── blocklist.py     # Prevents re-ingestion of manually deleted sources
│   ├── extractors.py    # PDF / DOCX / HTML → LangChain Documents
│   ├── ocr.py           # RapidOCR + PyMuPDF for scanned/image PDF pages
│   ├── course_files.py  # Binary file storage: storage/course_files/{course}/{source_id}.*
│   ├── reporter.py      # Per-day system reports: storage/system_reports/YYYY-MM-DD.md
│   ├── scheduler.py     # APScheduler: daily maintenance at SCHEDULER_HOUR:SCHEDULER_MINUTE
│   └── eval.py          # @with_eval decorator — writes storage/evaluation_report.md
└── api/routes/
    ├── chat.py          # /api/chat/ (RAG agent) + /api/chat/a2a + conversation CRUD
    ├── documents.py     # /api/documents/upload + /api/documents/
    └── study.py         # /api/study/* — courses, Canvas, memory init/maintenance, reports

frontend/src/
├── app/page.tsx         # Single-page layout (course selector + chat + panels)
├── components/
│   ├── ChatWindow.tsx   # Message rendering, input bar
│   ├── MessageBubble.tsx # Renders markdown + [n] citation chips
│   ├── CitationPanel.tsx # Inline PDF viewer + source details panel
│   ├── MemoryPanel.tsx  # Per-course document list (init/delete/upload)
│   ├── ChatHistoryList.tsx # Sidebar conversation history
│   └── Sidebar.tsx      # Course selector + navigation
├── hooks/useChat.ts     # Chat state: messages, loading, send, history, course
└── lib/api.ts           # Typed fetch helpers for all backend endpoints
```

## Key Design Decisions

- **LLM**: GLM models via Z.ai's OpenAI-compatible API (`langchain_openai.ChatOpenAI` with custom `base_url`). `get_llm(thinking=False)` disables reasoning tokens for latency-sensitive nodes (grading, query expansion).
- **Embeddings**: Local `BAAI/bge-base-en-v1.5` via `langchain_huggingface` — **768 dimensions**. Changing model requires a fresh Pinecone index (dimension-locked). Current index: `knowledge-assistant-v2`.
- **Vector DB**: Pinecone Serverless (cosine similarity). Each course lives in its own namespace (`course.code`). FAISS is available as a local fallback (`VECTORSTORE_TYPE=faiss`).
- **RAG agent flow**: `expand_queries` generates 3 query variants → `retrieve` unions + dedupes across all variants → `grade_documents` LLM-filters with a lenient floor (always keeps top `MIN_KEEP=3` chunks) → `generate` with numbered citation blocks.
- **Study-assistant maintenance**: Canvas LMS sync runs daily via APScheduler. Removal is report-only — files are never auto-deleted (a partial Canvas listing would otherwise wipe memory). Manual delete via `DELETE /api/study/{course}/memory/{source_id}` writes to the blocklist.
- **Conversation persistence**: `metadata_store.py` Protocol with three backends. JSON file (`storage/conversations.json`) is the default — durable, survives restarts, atomic flush via temp + `os.replace`.
- **Manifest**: `storage/course_manifest.json` is the source-of-truth for what's in memory per course. Vector IDs are deterministic (`{course}:{source_id}:{i}`), enabling delete-by-reconstruction (Pinecone Serverless has no delete-by-filter).
- **OCR**: RapidOCR + PyMuPDF. PDF pages with fewer than `OCR_MIN_TEXT_CHARS` chars are rasterized at `OCR_DPI` and OCR'd. First call downloads ~100 MB ONNX model. Controlled by `OCR_ENABLED`.
- **Config**: `Settings` is a plain class (not Pydantic BaseModel) with `os.getenv` defaults. All tunable params are in `.env`.

## API Contract

```
POST /api/chat/             { question, conversation_id?, history?, course? }
                            → { answer, citations[], conversation_id, agent }
POST /api/chat/a2a          same request → same response shape
GET  /api/chat/conversations          → { conversations[] }
GET  /api/chat/conversations/{id}     → { conversation_id, messages[], title, course }
DELETE /api/chat/conversations/{id}   → { deleted, conversation_id }

POST /api/documents/upload  multipart → { filename, total_chunks, status, document_id }
GET  /api/documents/        → { documents: [] }

GET  /api/study/courses
GET  /api/study/canvas/health
POST /api/study/initialize          # first-run: pull all Canvas materials into Pinecone
POST /api/study/maintenance         # daily: inject only new/changed
POST /api/study/backfill-files      # download binaries for already-embedded sources
POST /api/study/backfill-metadata   # fill size/modified_at without re-embedding
GET  /api/study/sync-check          # read-only Canvas-vs-manifest diff
GET  /api/study/scheduler/status
GET  /api/study/reports/system?date=YYYY-MM-DD
GET  /api/study/reports/evaluation
GET  /api/study/manifest
GET  /api/study/sources/{course}/{source_id}/file?download=bool
GET  /api/study/{course}/memory
DELETE /api/study/{course}/memory/{source_id}
POST /api/study/{course}/memory/upload

GET  /health
```

## Environment Setup

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Purpose |
|---|---|
| `ZAI_API_KEY` | Required for LLM |
| `PINECONE_API_KEY` | Required for vector search / document upload |
| `CANVAS_API_TOKEN` | Study-assistant Canvas sync (or use `CANVAS_SESSION_COOKIE`) |
| `COSMOS_ENDPOINT` / `COSMOS_KEY` | Optional; production conversation store |

Key tunables with production-ready defaults already in `config.py`:
- `GLM_MODEL=glm-5.1`, `EMBEDDING_MODEL=BAAI/bge-base-en-v1.5`, `EMBEDDING_DIMENSION=768`
- `PINECONE_INDEX_NAME=knowledge-assistant-v2`
- `CHUNK_SIZE=1500`, `CHUNK_OVERLAP=200`, `TOP_K_RESULTS=10`
- `VECTORSTORE_TYPE=pinecone`, `METADATA_STORE_TYPE=json`
- `SCHEDULER_ENABLED=true`, `SCHEDULER_HOUR=0`, `SCHEDULER_MINUTE=3`, `SCHEDULER_TIMEZONE=Asia/Kuala_Lumpur`

## Storage Layout

```
backend/storage/
├── conversations.json        # Chat history (JsonMetadataStore)
├── course_manifest.json      # Per-course ingestion inventory
├── scheduler_state.json      # Last/next scheduler run times
├── system_reports/           # Per-day maintenance reports (YYYY-MM-DD.md)
├── evaluation_report.md      # @with_eval decorator output
└── course_files/             # Original binaries: {course}/{source_id}.{ext}
```

## Learning Roadmap

- **SETUP** (done): Embeddings + Pinecone
- **PHASE 1** (done): Basic Chatbot (LLM only)
- **PHASE 2** (done): RAG Pipeline with FAISS
- **PHASE 3** (done): Chunking Strategies
- **PHASE 4** (done): LangGraph Agent (grade, rewrite, memory)
- **PHASE 5** (done): MCP + A2A Tools
- **PHASE 6** (done): Production — Pinecone, Cosmos DB, conversation persistence, Study-Assistant
- **PHASE 7**: Microsoft AI Foundry + OpenClaw — model deployment, monitoring
- **PHASE 8**: Interview Prep — system design walkthrough, Q&A, demo
- **PHASE 9**: Post-Interview — refactor, blog, share
- Extra: n8n, multiagent, RAG + prompt optimization
