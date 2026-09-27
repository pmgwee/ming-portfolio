export interface ProofLink {
  label: string;
  href: string;
  status?: string;
}

export interface EngineeringProject {
  slug: string;
  title: string;
  summary: string;
  role: string;
  problem: string;
  contribution: string;
  architecture: string;
  operation: string;
  outcome: string;
  stack: string[];
  proofLinks: ProofLink[];
}

export const ENGINEERING_PROJECTS: EngineeringProject[] = [
  {
    slug: "career-ops",
    title: "Career Ops",
    summary:
      "An agentic job-search workflow I use to move from role discovery through evaluation, application tailoring, follow-ups, and interview preparation.",
    role: "Contributor and operator, not the original creator",
    problem:
      "A job search spans repeated decisions and handoffs. I wanted a workflow grounded in my profile and CV, while keeping a human review at consequential decision points.",
    contribution:
      "Used the workflow to manage role discovery, evaluation, application tailoring, follow-ups, and interview preparation. Contributed changes for analytics and progress views and assessment-stage follow-up controls, incorporating CodeRabbit and maintainer feedback.",
    architecture:
      "Agentic workflows grounded in profile and CV context, with human review at key gates. My contributions use Go and TypeScript with automated CI and AI-assisted code review.",
    operation:
      "Used in my active job-search workflow. The analytics/progress and assessment follow-up contributions are open pull requests, not merged features.",
    outcome:
      "Self-reported: a 6× gain in job-search efficiency and outcomes while using the workflow.",
    stack: ["Go", "TypeScript", "Agentic workflows", "CodeRabbit", "CI/CD"],
    proofLinks: [
      {
        label: "Public project repository",
        href: "https://github.com/career-ops-hq/career-ops",
      },
      {
        label: "Analytics and progress views · open PR #4310",
        href: "https://github.com/career-ops-hq/career-ops/pull/4310",
        status: "Open",
      },
      {
        label: "Assessment follow-up controls · open PR #4317",
        href: "https://github.com/career-ops-hq/career-ops/pull/4317",
        status: "Open",
      },
    ],
  },
  {
    slug: "personal-ai-agent",
    title: "Personal Always-On AI Agent",
    summary:
      "A governed operations layer around Hermes Agent that coordinates personal workflows while retaining the agent runtime’s native reasoning, memory, and kanban.",
    role: "Architect and operator",
    problem:
      "A general-purpose agent needs personal integrations and operating rules without replacing the underlying agent or granting every workflow the same access.",
    contribution:
      "Architected the Real-Ming control plane and governance layer, enabled autonomous coding workflows from repository study through PR-ready delivery, and integrated calendar, email, and Notion coordination through provider adapters.",
    architecture:
      "Hermes Agent, Real-Ming configuration and governance, MCP tools and agent skills, Telegram, Notion, Google Calendar and Gmail APIs, Obsidian/LLM-Wiki, SQLite, and Node.js/TypeScript.",
    operation:
      "Runs on an always-on Azure VM. Provider adapters coordinate three Google accounts and compose a morning brief and an evening executive report each day.",
    outcome:
      "A continuously operating assistant with two daily reports and coding workflows that can progress from repository study to tested, PR-ready delivery.",
    stack: [
      "Azure VM",
      "Azure Key Vault",
      "Hermes Agent",
      "MCP",
      "TypeScript",
      "SQLite",
    ],
    proofLinks: [
      {
        label: "Public project repository",
        href: "https://github.com/pmgwee/real-ming",
      },
    ],
  },
  {
    slug: "persistent-second-brain",
    title: "Cross-Agent Context Engineering",
    summary:
      "A persistent second brain that carries evidence-cited context between Claude Code and Codex sessions.",
    role: "System designer and builder",
    problem:
      "Coding-agent sessions lose useful context when work moves between tools or restarts. Raw transcript replay is expensive and does not guarantee relevant, verified recall.",
    contribution:
      "Built a transcript-native memory pipeline that consolidates evidence-cited, wikilinked memories into Obsidian, then connects Claude Code and Codex through native lifecycle hooks and a hybrid retrieval system.",
    architecture:
      "Rust, SQLite FTS5, BM25, vector search, graph reciprocal-rank fusion, all-MiniLM-L6-v2, MCP, CodeGraph, Claude Code and Codex hooks, and a Next.js monitoring console.",
    operation:
      "A local-first system integrated into both coding-agent lifecycles. Its console tracks retrieval quality, hook delivery, system condition, and deployment drift.",
    outcome:
      "Reached 96.0% Recall@5 and 0.922 MRR across 246,750 turns, while keeping session-start orientations at or below 1,500 tokens.",
    stack: [
      "Rust",
      "SQLite FTS5",
      "Hybrid retrieval",
      "MCP",
      "Claude Code",
      "Codex",
      "Next.js",
    ],
    proofLinks: [
      {
        label: "Public project repository",
        href: "https://github.com/pmgwee/agent-knowledge-base-codex",
      },
    ],
  },
  {
    slug: "bersamaai",
    title: "BersamaAi Community Agents",
    summary:
      "A deployed Discord community bot and automated content pipeline that filters online sources into topic channels and summarizes videos without captions.",
    role: "Builder and operator",
    problem:
      "A community needs a steady flow of relevant material without relying on someone to manually review every source or transcribe every video.",
    contribution:
      "Built a source-ingestion workflow using an LLM-as-a-Judge for relevance and topic classification, deployed the Discord bot, and added speech recognition for caption-less videos.",
    architecture:
      "Python, GCP Compute Engine, a Discord MCP surface, GLM-5.2, Groq Whisper ASR, yt-dlp, and GitHub Actions.",
    operation:
      "The Discord bot runs on a GCP VM. The topic-routing pipeline posts every three hours, with a separate daily job for caption-less video summaries.",
    outcome:
      "Routes curated items into nine topic channels every three hours and produces summaries for selected videos that have no captions.",
    stack: [
      "Python",
      "GCP Compute Engine",
      "Discord MCP",
      "GLM-5.2",
      "Groq Whisper ASR",
      "GitHub Actions",
    ],
    proofLinks: [
      {
        label: "Public project repository",
        href: "https://github.com/pmgwee/BersamaAi-community",
      },
    ],
  },
  {
    slug: "inti-mba-rag",
    title: "INTI-MBA RAG Chatbot",
    summary:
      "A retrieval-augmented study assistant that answers from course materials with citations and keeps its indexed corpus current through scheduled ingestion.",
    role: "System designer and builder",
    problem:
      "Students need answers grounded in their course documents, while newly added or changed Canvas materials should not require repeated manual uploads.",
    contribution:
      "Engineered a LangGraph RAG agent with multi-query retrieval, document grading, and query-rewriting self-correction. Added daily Canvas ingestion and OCR for scanned or image-based documents.",
    architecture:
      "FastAPI, LangGraph, LangChain, hybrid retrieval, Pinecone, RapidOCR, APScheduler, AWS EC2, and Next.js.",
    operation:
      "Used across four live Canvas LMS courses. Scheduled ingestion keeps the indexed materials current without manual uploads.",
    outcome:
      "Maintains 215+ documents and 3,800+ searchable passages, returning cited answers grounded in source files.",
    stack: [
      "FastAPI",
      "LangGraph",
      "Pinecone",
      "RapidOCR",
      "APScheduler",
      "AWS EC2",
      "Next.js",
    ],
    proofLinks: [],
  },
];
