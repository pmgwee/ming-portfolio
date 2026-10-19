"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowCounterClockwise, FilePdf } from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import {
  CAREER_PLAN_URL,
  JOB_QUESTIONS,
  ROLE_SUGGESTIONS,
  handOffToFullTool,
  verdictFor,
  type Answer,
} from "@/lib/career-plan";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMPTY: Answer[] = [null, null, null, null, null];
const CJK = "var(--font-geist-sans), 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

type Tab = "goal" | "job";

const VERDICT_STYLE = {
  go: "bg-[#ffd400] text-[#141414]",
  mid: "bg-white text-[#141414] ring-1 ring-[#141414]",
  no: "bg-[#141414] text-white",
  none: "bg-black/5 text-zinc-500",
} as const;

export function CareerPlanDemo() {
  const reduced = useReducedMotion();
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: EASE },
      };

  const [tab, setTab] = useState<Tab>("goal");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [jobName, setJobName] = useState("");
  const [answers, setAnswers] = useState<Answer[]>(EMPTY);
  const [busy, setBusy] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const score = answers.filter((a) => a === true).length;
  const verdict = verdictFor(answers);
  const ready = role.trim().length > 0;
  const today = new Date().toISOString().slice(0, 10);

  function answer(i: number, value: boolean) {
    setAnswers((prev) => prev.map((a, j) => (j === i ? (a === value ? null : value) : a)));
  }

  function reset() {
    setName("");
    setRole("");
    setJobName("");
    setAnswers(EMPTY);
    setTab("goal");
  }

  async function downloadPdf() {
    if (!reportRef.current || busy) return;
    setBusy(true);
    try {
      const [{ toJpeg }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const dataUrl = await toJpeg(reportRef.current, { pixelRatio: 2, quality: 0.92, backgroundColor: "#fbfaf6", cacheBust: true });
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 14;
      const width = 210 - margin * 2;
      pdf.addImage(dataUrl, "JPEG", margin, margin, width, (img.height * width) / img.width);
      pdf.save(`10年倒推报告-${name.trim() || "我"}.pdf`);
      track("career_plan_pdf", { verdict: verdict.tone });
    } finally {
      setBusy(false);
    }
  }

  function openFullTool() {
    handOffToFullTool({ name, role, jobName, answers });
    track("career_plan_full_tool");
  }

  return (
    <section
      id="career-plan"
      aria-labelledby="career-plan-heading"
      className="scroll-mt-28 relative overflow-hidden border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] h-[46vh] w-[80vw] max-w-5xl -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(255,212,0,0.35), rgba(99,102,241,0.25) 55%, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-[1400px]">
        <motion.div className="max-w-3xl" {...reveal}>
          <p className="text-sm font-medium text-indigo-200">Free tool</p>
          <h2
            id="career-plan-heading"
            className="mt-4 text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-zinc-100"
          >
            Plan your career backwards.
          </h2>
          <p className="mt-6 max-w-[64ch] text-base leading-relaxed text-zinc-300 md:text-lg">
            Write down who you want to be in ten years, then check whether a job can get you there.
            Try it below, then download a PDF of your result. The tool is in Chinese.
          </p>
        </motion.div>

        <motion.div className="mt-12" {...reveal}>
          <div className="mb-3 flex items-center justify-between gap-4 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#ffd400]" aria-hidden="true" />
              Interactive demo
            </span>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-zinc-300 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
            >
              <ArrowCounterClockwise aria-hidden="true" className="size-4" /> Reset
            </button>
          </div>

          {/* App window */}
          <div
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#101219] shadow-[0_25px_80px_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,212,0,0.08)]"
            style={{ fontFamily: CJK }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <i className="size-3 rounded-full bg-[#ff5f57]" />
                <i className="size-3 rounded-full bg-[#febc2e]" />
                <i className="size-3 rounded-full bg-[#28c840]" />
              </span>
              <span className="hidden text-sm font-semibold text-zinc-100 sm:inline">10年倒推表</span>
              <div role="tablist" aria-label="Demo steps" className="mx-auto flex rounded-full bg-black/40 p-1 text-sm">
                {(
                  [
                    ["goal", "1 写下终点"],
                    ["job", "2 评估工作"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 ${
                      tab === key ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className="hidden w-[120px] sm:block" aria-hidden="true" />
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              {/* Controls */}
              <div className="border-b border-white/10 p-5 md:p-8 lg:border-b-0 lg:border-r">
                {tab === "goal" ? (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cp-role" className="text-base font-semibold text-zinc-100">
                        10年后，我想成为…
                      </label>
                      <input
                        id="cp-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="职位 / 角色，例：Regional AI Tech Lead"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-[#ffd400] focus:outline-none"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ROLE_SUGGESTIONS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            aria-pressed={role === r}
                            onClick={() => setRole(role === r ? "" : r)}
                            className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 ${
                              role === r
                                ? "border-[#ffd400] bg-[#ffd400] text-[#141414]"
                                : "border-white/15 text-zinc-300 hover:border-white/40"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cp-name" className="text-base font-semibold text-zinc-100">
                        你的名字 <span className="font-normal text-zinc-500">（选填，会印在报告上）</span>
                      </label>
                      <input
                        id="cp-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="例：小明"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-[#ffd400] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setTab("job")}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-100 px-5 text-sm font-semibold text-[#07080c] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                    >
                      下一步：评估一份工 <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="cp-job" className="text-base font-semibold text-zinc-100">
                      你在考虑的工作
                    </label>
                    <input
                      id="cp-job"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      placeholder="例：AI 初创 Junior SWE"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-[#ffd400] focus:outline-none"
                    />
                    <ol className="mt-5 divide-y divide-white/10">
                      {JOB_QUESTIONS.map(({ q, hint }, i) => (
                        <li key={q} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-zinc-100">
                              {i + 1}. {q}
                            </p>
                            <p className="text-xs text-zinc-500">{hint}</p>
                          </div>
                          <div role="group" aria-label={q} className="grid grid-cols-2 gap-2 sm:w-[132px]">
                            {[true, false].map((v) => (
                              <button
                                key={String(v)}
                                type="button"
                                aria-pressed={answers[i] === v}
                                onClick={() => answer(i, v)}
                                className={`min-h-10 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 ${
                                  answers[i] === v
                                    ? v
                                      ? "border-[#ffd400] bg-[#ffd400] text-[#141414]"
                                      : "border-white bg-white text-[#141414]"
                                    : "border-white/15 text-zinc-300 hover:border-white/40"
                                }`}
                              >
                                {v ? "是" : "否"}
                              </button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Live report (light evidence surface) */}
              <div className="bg-[#0c0d12] p-5 md:p-8">
                <div
                  ref={reportRef}
                  className="rounded-xl bg-[#fbfaf6] text-[#141414] shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
                  style={{ fontFamily: CJK }}
                  aria-live="polite"
                >
                  <div className="rounded-t-xl bg-[#141414] px-6 py-5 text-white">
                    <p className="text-xs tracking-widest text-zinc-400">10年倒推表 · 个人报告</p>
                    <p className="mt-1 text-2xl font-black">
                      {name.trim() ? `${name.trim()} 的` : "我的"}
                      <span className="text-[#ffd400]">10年</span>倒推报告
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">{today}</p>
                  </div>

                  <div className="space-y-5 px-6 py-6">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-zinc-500">我的终点</p>
                      <p className="mt-1 text-[22px] font-black leading-snug">
                        10年后，我想成为{" "}
                        <span className={role.trim() ? "bg-[linear-gradient(transparent_58%,#ffd400_58%)] px-1" : "text-zinc-400"}>
                          {role.trim() || "（在左边写下）"}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl border border-black/15 p-4">
                      <div className="flex items-center gap-3">
                        <p className="flex-1 text-base font-black">{jobName.trim() || "你在考虑的工作"}</p>
                        <p className="text-2xl font-black">
                          {score}
                          <span className="text-sm text-zinc-500">/5</span>
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-5 gap-1" aria-hidden="true">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <i key={i} className={`h-2 rounded ${i < score ? "bg-[#141414]" : "bg-black/10"}`} />
                        ))}
                      </div>
                      <p className="mt-3 text-sm">
                        <span className={`mr-2 rounded-md px-2 py-0.5 font-black ${VERDICT_STYLE[verdict.tone]}`}>{verdict.label}</span>
                        <span className="text-zinc-600">{verdict.detail}</span>
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#ffd400] px-4 py-3 text-sm">
                      <p className="font-black">完整版还会帮你算出</p>
                      <p className="mt-0.5">每一站的倒推路线 · 你还差的技能和人脉 · 阻碍和需要的支持 · 12 个月行动计划</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-b-xl bg-[#141414] px-6 py-3 text-xs text-zinc-400">
                    <span className="font-bold text-white">只要方向对，你就不会差到哪里去。</span>
                    <span>mingcreatives.com</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={!ready || busy}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ffd400] px-5 text-sm font-bold text-[#141414] transition-opacity hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                  >
                    <FilePdf aria-hidden="true" weight="bold" className="size-4" />
                    {busy ? "生成中…" : "生成 PDF 报告"}
                  </button>
                  <a
                    href={CAREER_PLAN_URL}
                    onClick={openFullTool}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-zinc-100 hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                  >
                    立即规划我的职业（5 分钟） <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
                  </a>
                </div>
                {!ready && <p className="mt-3 text-xs text-zinc-500">先写下你的终点，就能生成 PDF。</p>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
