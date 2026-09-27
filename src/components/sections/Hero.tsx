"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarBlank,
  EnvelopeSimple,
  Notepad,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";

type View = "brief" | "sources" | "routing";

const VIEWS: { id: View; label: string }[] = [
  { id: "brief", label: "The brief" },
  { id: "sources", label: "Source notes" },
  { id: "routing", label: "How it works" },
];

const SAMPLE_SOURCES = [
  {
    label: "Calendar",
    detail: "09:30 · Product review / 14:00 · Build time",
    icon: CalendarBlank,
  },
  {
    label: "Gmail",
    detail: "Design review notes need a reply",
    icon: EnvelopeSimple,
  },
  {
    label: "Notion",
    detail: "Prepare the demo handoff checklist",
    icon: Notepad,
  },
] as const;

export function Hero() {
  const [view, setView] = useState<View>("brief");

  const changeWithArrow = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + VIEWS.length) % VIEWS.length;
    setView(VIEWS[next].id);
    document.getElementById(`brief-tab-${VIEWS[next].id}`)?.focus();
  };

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/10 bg-[#07080c] px-6 pb-20 pt-32 md:px-10 md:pb-24 md:pt-36"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 h-[42rem] w-[42rem] rounded-full bg-indigo-500/[0.055] blur-[110px]" />
      <div className="relative mx-auto grid w-full max-w-[1400px] items-start gap-12 lg:min-h-[calc(100svh-15rem)] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12 xl:gap-20">
        <div className="max-w-xl lg:pt-6">
          <h1 id="hero-heading" className="text-balance text-[clamp(3.25rem,6.2vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
            Gwee<br />Per Ming<span className="text-indigo-200">.</span>
          </h1>
          <p className="mt-8 max-w-[17ch] text-[clamp(1.4rem,2.1vw,2rem)] font-medium leading-[1.18] tracking-[-0.025em] text-zinc-100">
            AI systems built to keep working after launch.
          </p>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-zinc-300">
            I&apos;m a Computer Science graduate who builds and operates AI agents and software. I also bring the visual instincts of a creative technologist to the work.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="#ai-systems" showArrow>Explore AI products</Button>
            <Button href="#showcase" variant="secondary">Creative collections</Button>
          </div>
          <p className="mt-9 text-sm text-zinc-400">Gwee Per Ming · Ming · Malaysia</p>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-100">A day begins with a decision.</h2>
            <span className="text-xs text-zinc-400">Personal Always-On AI Agent</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#101219] shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-md bg-indigo-200 text-xs font-bold text-[#111522]">M</span>
                <span className="text-sm font-semibold text-zinc-100">Morning brief</span>
              </div>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">Interactive example · sample data</span>
            </div>

            <div className="grid min-h-[30rem] lg:grid-cols-[minmax(12rem,0.36fr)_minmax(0,0.64fr)]">
              <div className="hidden border-r border-white/10 p-6 lg:block">
                <p className="text-sm font-semibold text-zinc-100">Real workflow, sample inputs</p>
                <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-zinc-400">
                  The operating agent coordinates calendar, mail, and tasks across accounts. This walkthrough uses fictional entries.
                </p>
                <div className="mt-7 space-y-3">
                  {SAMPLE_SOURCES.map(({ label, detail, icon: Icon }) => (
                    <div key={label} className="flex gap-3 border-t border-white/10 pt-3">
                      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-indigo-200" weight="regular" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-200">{label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex min-w-0 flex-col">
                <div role="tablist" aria-label="Explore the morning brief" className="flex gap-1 overflow-x-auto border-b border-white/10 px-4 pt-4 sm:px-5">
                  {VIEWS.map((item, index) => (
                    <button
                      key={item.id}
                      id={`brief-tab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={view === item.id}
                      aria-controls="brief-panel"
                      tabIndex={view === item.id ? 0 : -1}
                      onClick={() => setView(item.id)}
                      onKeyDown={(event) => changeWithArrow(event, index)}
                      className={`min-h-11 shrink-0 border-b-2 px-3 pb-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-200 ${view === item.id ? "border-indigo-200 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div id="brief-panel" role="tabpanel" aria-labelledby={`brief-tab-${view}`} className="flex-1 px-5 py-6 sm:px-7 sm:py-7">
                  {view === "brief" && <BriefView />}
                  {view === "sources" && <SourcesView />}
                  {view === "routing" && <RoutingView />}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-7">
                  <p className="text-xs text-zinc-400">Illustrative walkthrough · no accounts connected</p>
                  <button
                    type="button"
                    onClick={() => setView(view === "brief" ? "sources" : view === "sources" ? "routing" : "brief")}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
                  >
                    {view === "routing" ? "Back to the brief" : "Explore next step"}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/work/personal-ai-agent"
            className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-200 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
          >
            See what I built and operate
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BriefView() {
  return (
    <div className="h-full rounded-xl bg-[#e7ebec] px-5 py-5 text-[#141a20] shadow-[0_12px_36px_rgba(0,0,0,0.14)] sm:px-7 sm:py-7">
      <div className="flex items-start justify-between gap-4 border-b border-[#bcc6c9] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#46545b]">Sample dispatch</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Good morning, Ming.</h3>
        </div>
        <span className="shrink-0 text-xs font-medium text-[#46545b]">Monday · 09:00</span>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-[#334149]">Your day has one scheduled review, one message needing attention, and protected build time.</p>
      <ol className="mt-6 space-y-4">
        <li className="grid grid-cols-[1.5rem_1fr] gap-3 border-t border-[#c4cdd0] pt-4">
          <span className="text-xs font-bold tabular-nums text-[#52616b]">01</span>
          <div><p className="text-sm font-semibold">Prepare for the 09:30 product review</p><p className="mt-1 text-sm text-[#46545b]">Use the handoff checklist as the starting point.</p></div>
        </li>
        <li className="grid grid-cols-[1.5rem_1fr] gap-3 border-t border-[#c4cdd0] pt-4">
          <span className="text-xs font-bold tabular-nums text-[#52616b]">02</span>
          <div><p className="text-sm font-semibold">Reply to the design review notes</p><p className="mt-1 text-sm text-[#46545b]">Follow up before the afternoon build block.</p></div>
        </li>
        <li className="grid grid-cols-[1.5rem_1fr] gap-3 border-t border-[#c4cdd0] pt-4">
          <span className="text-xs font-bold tabular-nums text-[#52616b]">03</span>
          <div><p className="text-sm font-semibold">Keep 14:00 free for building</p><p className="mt-1 text-sm text-[#46545b]">No conflicting sample calendar events.</p></div>
        </li>
      </ol>
    </div>
  );
}

function SourcesView() {
  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-[-0.025em] text-white">Three sources. One useful brief.</h3>
      <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-zinc-300">The real system uses provider adapters and explicit account routing. These entries are fictional and show the kind of information the agent coordinates.</p>
      <div className="mt-7 space-y-3">
        {SAMPLE_SOURCES.map(({ label, detail, icon: Icon }) => (
          <div key={label} className="flex items-start gap-4 rounded-xl bg-white/[0.05] p-4">
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-indigo-200" />
            <div><p className="text-sm font-semibold text-white">{label}</p><p className="mt-1 text-sm text-zinc-300">{detail}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutingView() {
  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-[-0.025em] text-white">A governed layer around the agent.</h3>
      <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-zinc-300">I built the Real-Ming control and governance layer around Hermes Agent, preserving its native reasoning, memory, and workspaces.</p>
      <div className="mt-8 space-y-0">
        {[
          ["01", "Route", "Provider adapters select the right connected account."],
          ["02", "Compose", "Calendar, mail, and tasks become a morning brief."],
          ["03", "Operate", "The assistant runs on an always-on Azure VM and also prepares an evening report."],
        ].map(([number, title, detail]) => (
          <div key={number} className="grid grid-cols-[2rem_5rem_1fr] gap-3 border-t border-white/15 py-4 text-sm sm:grid-cols-[2rem_6rem_1fr]">
            <span className="font-mono text-xs text-indigo-200">{number}</span>
            <span className="font-semibold text-white">{title}</span>
            <span className="text-zinc-300">{detail}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-zinc-400">Architecture and operating status are documented in the case study.</p>
    </div>
  );
}
