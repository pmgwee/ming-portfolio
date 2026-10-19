"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowCounterClockwise, ArrowRight, Check, FilePdf, Sparkle, X } from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import {
  CAREER_PLAN_URL,
  CAREER_SOURCES,
  GENERIC_ROLE,
  INDUSTRIES,
  JOB_QUESTIONS,
  findRole,
  handOffToFullTool,
  verdictFor,
  type Answer,
  type Lang,
  type Text,
} from "@/lib/career-plan";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMPTY: Answer[] = [null, null, null, null, null];
const FONT = "var(--font-geist-sans), 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

const UI = {
  en: {
    title: "Career Plan",
    tabGoal: "Career Goal",
    tabJob: "Rate Job",
    goalLabel: "In 5–10 years, I want to be…",
    goalPlaceholder: "Type a role, or pick one below",
    pickOne: "Or pick a goal by industry",
    nameLabel: "Your name",
    nameHint: "(optional, printed on your report)",
    namePlaceholder: "e.g. Alex",
    next: "Next: rate a job",
    jobLabel: "A job you're considering",
    jobPlaceholder: "e.g. Junior SWE at an AI startup",
    answered: (n: number) => `${n}/5 answered`,
    yes: "Yes",
    no: "No",
    kicker: "CAREER PLAN · PERSONAL REPORT",
    reportTitle: (name: string) => (name ? `${name}'s Career Plan` : "My Career Plan"),
    goalHeading: "My goal",
    goalLine: "In 5–10 years, I want to be",
    goalEmpty: "(pick a goal)",
    pathHeading: "My path",
    pathEmpty: "Pick a goal and your path appears here.",
    stages: ["Start", "Grow", "Level up", "Goal"],
    skillsHeading: "Skills this goal needs",
    yearsLabel: "Typically reached after",
    sourcesSummary: "How these paths were built",
    sourcesIntro: "Paths, skills and timings are checked against official Malaysian pathways, salary guides, career guides and real LinkedIn career timelines of people in these roles. Timings show only where a source gives one.",
    jobHeading: "Job check",
    jobFallback: "The job you're considering",
    insightsHeading: "What to watch",
    allClear: "Every check passes. This job is building your path.",
    teaserTitle: "The full plan also works out",
    teaser: "Your gaps in skills and network · obstacles and support · a 12-month action plan",
    ready: "Your plan is ready",
    ribbon: "READY",
    quote: "Get the direction right, and the rest follows.",
    pdf: "Download PDF report",
    pdfBusy: "Wrapping it up…",
    full: "Plan my career now (5 min)",
    needGoal: "Add a goal to download your PDF.",
    fileName: (name: string) => `Career-Plan-${name || "me"}.pdf`,
  },
  cn: {
    title: "职业规划表",
    tabGoal: "职业目标",
    tabJob: "评估工作",
    goalLabel: "5–10 年后，我想成为…",
    goalPlaceholder: "输入职位，或从下面选一个",
    pickOne: "或按行业选一个目标",
    nameLabel: "你的名字",
    nameHint: "（选填，会印在报告上）",
    namePlaceholder: "例：小明",
    next: "下一步：评估一份工",
    jobLabel: "你在考虑的工作",
    jobPlaceholder: "例：AI 初创 Junior SWE",
    answered: (n: number) => `已回答 ${n}/5`,
    yes: "是",
    no: "否",
    kicker: "职业规划表 · 个人报告",
    reportTitle: (name: string) => (name ? `${name} 的职业规划报告` : "我的职业规划报告"),
    goalHeading: "我的终点",
    goalLine: "5–10 年后，我想成为",
    goalEmpty: "（选一个目标）",
    pathHeading: "我的路线",
    pathEmpty: "选好目标，你的路线就会出现在这里。",
    stages: ["起步", "成长", "进阶", "终点"],
    skillsHeading: "这个目标需要的技能",
    yearsLabel: "通常需要",
    sourcesSummary: "这些路线的依据",
    sourcesIntro: "路线、技能和年数参考了马来西亚官方路径、薪资指南、职业指南，以及这些职位从业者在 LinkedIn 上的真实经历。只有在有来源时才会显示年数。",
    jobHeading: "这份工，给得了吗？",
    jobFallback: "你在考虑的工作",
    insightsHeading: "要注意的地方",
    allClear: "5 项全过，这份工正在帮你铺路。",
    teaserTitle: "完整版还会帮你算出",
    teaser: "你还差的技能和人脉 · 阻碍和需要的支持 · 12 个月行动计划",
    ready: "你的规划完成了",
    ribbon: "已完成",
    quote: "只要方向对，你就不会差到哪里去。",
    pdf: "生成 PDF 报告",
    pdfBusy: "包装中…",
    full: "立即规划我的职业（5 分钟）",
    needGoal: "先写下你的终点，就能生成 PDF。",
    fileName: (name: string) => `职业规划报告-${name || "我"}.pdf`,
  },
} as const;

const VERDICT_STYLE = {
  go: "bg-[#ffd400] text-[#141414]",
  mid: "bg-white text-[#141414] ring-1 ring-[#141414]",
  no: "bg-[#141414] text-white",
  none: "bg-black/5 text-zinc-500",
} as const;

type Tab = "goal" | "job";

function ScoreRing({ score, reduced }: { score: number; reduced: boolean }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="size-16 shrink-0" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="6" />
      <motion.circle
        cx="32" cy="32" r={r} fill="none" stroke="#141414" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} transform="rotate(-90 32 32)"
        initial={false}
        animate={{ strokeDashoffset: c * (1 - score / 5) }}
        transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      />
      <text x="32" y="37" textAnchor="middle" className="fill-[#141414] text-[17px] font-black">{score}</text>
    </svg>
  );
}

export function CareerPlanDemo() {
  const reduced = !!useReducedMotion();
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: EASE },
      };

  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<Tab>("goal");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [jobName, setJobName] = useState("");
  const [answers, setAnswers] = useState<Answer[]>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [unwrapKey, setUnwrapKey] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);
  const wasComplete = useRef(false);

  const ui = UI[lang];
  const tx = (text: Text) => text[lang];
  const matched = findRole(role);
  const plan = matched ?? (role.trim() ? GENERIC_ROLE : null);
  const answeredCount = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a === true).length;
  const verdict = verdictFor(answers);
  const misses = JOB_QUESTIONS.filter((_, i) => answers[i] === false);
  const ready = role.trim().length > 0;
  const complete = ready && answeredCount === 5;
  const today = new Date().toISOString().slice(0, 10);
  const goalText = matched ? tx(matched.name) : role.trim();

  // The "unwrap" moment: once, when the plan becomes complete.
  useEffect(() => {
    if (complete && !wasComplete.current) {
      setUnwrapKey((k) => k + 1);
      track("career_plan_complete", { lang, verdict: verdict.tone });
    }
    wasComplete.current = complete;
  }, [complete, lang, verdict.tone]);

  function answer(i: number, value: boolean) {
    setAnswers((prev) => prev.map((a, j) => (j === i ? (a === value ? null : value) : a)));
  }

  function pickRole(text: Text) {
    const value = text[lang];
    setRole(role === value ? "" : value);
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
      pdf.save(ui.fileName(name.trim()));
      track("career_plan_pdf", { verdict: verdict.tone, lang });
    } finally {
      setBusy(false);
    }
  }

  function openFullTool() {
    handOffToFullTool({ name, role: goalText, jobName, answers, lang });
    track("career_plan_full_tool", { lang });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-[#ffd400] focus:outline-none";
  const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300";

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
            Will this job get you there?
          </h2>
          <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-zinc-300 md:text-lg">
            Pick where you want to be in 5–10 years, rate any job in 5 questions, and get a career plan you can
            download. Free, in English or 中文.
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
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-zinc-300 hover:bg-white/5 hover:text-white ${focusRing}`}
            >
              <ArrowCounterClockwise aria-hidden="true" className="size-4" /> Reset
            </button>
          </div>

          {/* App window */}
          <div
            lang={lang === "cn" ? "zh-Hans" : "en"}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#101219] shadow-[0_25px_80px_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,212,0,0.08)]"
            style={{ fontFamily: FONT }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
                <i className="size-3 rounded-full bg-[#ff5f57]" />
                <i className="size-3 rounded-full bg-[#febc2e]" />
                <i className="size-3 rounded-full bg-[#28c840]" />
              </span>
              <span className="hidden text-sm font-semibold text-zinc-100 md:inline">{ui.title}</span>
              <div role="tablist" aria-label="Demo steps" className="mx-auto flex rounded-full bg-black/40 p-1 text-sm">
                {(["goal", "job"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition-colors ${focusRing} ${
                      tab === key ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {key === "goal" ? ui.tabGoal : ui.tabJob}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Language" className="flex shrink-0 rounded-full border border-white/15 p-0.5 text-xs font-semibold">
                {(
                  [
                    ["en", "EN"],
                    ["cn", "中文"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={lang === key}
                    onClick={() => setLang(key)}
                    className={`rounded-full px-2.5 py-1 transition-colors ${focusRing} ${
                      lang === key ? "bg-[#ffd400] text-[#141414]" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              {/* Controls */}
              <div className="border-b border-white/10 p-5 md:p-8 lg:border-b-0 lg:border-r">
                {tab === "goal" ? (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cp-role" className="text-base font-semibold text-zinc-100">{ui.goalLabel}</label>
                      <input id="cp-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder={ui.goalPlaceholder} className={inputClass} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{ui.pickOne}</p>
                      <div className="mt-3 space-y-3">
                        {INDUSTRIES.map((industry) => (
                          <div key={industry.id} className="grid gap-2 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-start">
                            <p className="pt-1.5 text-xs font-medium text-zinc-400">{tx(industry.name)}</p>
                            <div className="flex flex-wrap gap-2">
                              {industry.roles.map((option) => {
                                const on = matched?.id === option.id;
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => pickRole(option.name)}
                                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${focusRing} ${
                                      on ? "border-[#ffd400] bg-[#ffd400] text-[#141414]" : "border-white/15 text-zinc-300 hover:border-white/40"
                                    }`}
                                  >
                                    {tx(option.name)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <details className="group mt-4 text-xs text-zinc-400">
                        <summary className={`inline-flex cursor-pointer list-none items-center gap-1.5 rounded text-zinc-400 hover:text-zinc-200 ${focusRing}`}>
                          <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span> {ui.sourcesSummary}
                        </summary>
                        <p className="mt-2 max-w-[60ch] leading-relaxed text-zinc-500">{ui.sourcesIntro}</p>
                        <ul className="mt-2 space-y-1">
                          {CAREER_SOURCES.map((source) => (
                            <li key={source.url}>
                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-zinc-200">
                                {source.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                    <div>
                      <label htmlFor="cp-name" className="text-base font-semibold text-zinc-100">
                        {ui.nameLabel} <span className="font-normal text-zinc-500">{ui.nameHint}</span>
                      </label>
                      <input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={ui.namePlaceholder} className={inputClass} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setTab("job")}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-100 px-5 text-sm font-semibold text-[#07080c] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                    >
                      {ui.next} <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="cp-job" className="text-base font-semibold text-zinc-100">{ui.jobLabel}</label>
                    <input id="cp-job" value={jobName} onChange={(e) => setJobName(e.target.value)} placeholder={ui.jobPlaceholder} className={inputClass} />
                    <div className="mt-5 flex items-center gap-3 text-xs text-zinc-400">
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                        <motion.i
                          className="block h-full rounded-full bg-[#ffd400]"
                          initial={false}
                          animate={{ width: `${(answeredCount / 5) * 100}%` }}
                          transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                        />
                      </span>
                      {ui.answered(answeredCount)}
                    </div>
                    <ol className="mt-2 divide-y divide-white/10">
                      {JOB_QUESTIONS.map(({ q, hint }, i) => (
                        <li key={q.en} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-zinc-100">{i + 1}. {tx(q)}</p>
                            <p className="text-xs text-zinc-500">{tx(hint)}</p>
                          </div>
                          <div role="group" aria-label={tx(q)} className="grid grid-cols-2 gap-2 sm:w-[132px]">
                            {[true, false].map((v) => (
                              <button
                                key={String(v)}
                                type="button"
                                aria-pressed={answers[i] === v}
                                onClick={() => answer(i, v)}
                                className={`min-h-10 rounded-lg border text-sm font-semibold transition-colors ${focusRing} ${
                                  answers[i] === v
                                    ? v
                                      ? "border-[#ffd400] bg-[#ffd400] text-[#141414]"
                                      : "border-white bg-white text-[#141414]"
                                    : "border-white/15 text-zinc-300 hover:border-white/40"
                                }`}
                              >
                                {v ? ui.yes : ui.no}
                              </button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Live report: gift-wrapped evidence surface */}
              <div className="bg-[#0c0d12] p-5 md:p-8">
                <div className="rounded-2xl bg-gradient-to-br from-[#ffd400] via-white/40 to-indigo-400 p-[1.5px] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                  <div
                    ref={reportRef}
                    className="relative overflow-hidden rounded-[15px] bg-[#fbfaf6] text-[#141414]"
                    style={{ fontFamily: FONT }}
                    aria-live="polite"
                  >
                    {/* Unwrap: a light sweep and a ribbon when the plan is complete */}
                    <AnimatePresence>
                      {complete && !reduced ? (
                        <motion.span
                          key={`shine-${unwrapKey}`}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                          initial={{ left: "-40%" }}
                          animate={{ left: "140%" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.1, ease: "easeInOut" }}
                        />
                      ) : null}
                    </AnimatePresence>
                    <AnimatePresence>
                      {complete ? (
                        <motion.span
                          key="ribbon"
                          className="absolute right-[-38px] top-[18px] z-10 w-[150px] rotate-45 bg-[#ffd400] py-1 text-center text-[11px] font-black tracking-[0.18em] text-[#141414] shadow"
                          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18, delay: reduced ? 0 : 0.5 }}
                        >
                          {ui.ribbon}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>

                    <div className="bg-[#141414] px-6 py-5 text-white">
                      <p className="text-[11px] tracking-[0.16em] text-zinc-400">{ui.kicker}</p>
                      <p className="mt-1 text-2xl font-black">{ui.reportTitle(name.trim())}</p>
                      <p className="mt-1 text-xs text-zinc-400">{today}</p>
                    </div>

                    <div className="space-y-5 px-6 py-6">
                      {/* Goal */}
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.goalHeading.toUpperCase()}</p>
                        <p className="mt-1 text-[22px] font-black leading-snug">
                          {ui.goalLine}{" "}
                          <span className={goalText ? "bg-[linear-gradient(transparent_58%,#ffd400_58%)] px-1" : "text-zinc-400"}>
                            {goalText || ui.goalEmpty}
                          </span>
                        </p>
                      </div>

                      {/* Path ladder */}
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.pathHeading.toUpperCase()}</p>
                        {plan ? (
                          <>
                            <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" key={`${matched?.id ?? "generic"}-${lang}`}>
                              {[...plan.path, null].map((step, i) => (
                                <motion.li
                                  key={i}
                                  className={`relative rounded-lg border px-2.5 py-2 ${i === 3 ? "border-[#141414] bg-[#141414] text-white" : "border-black/10 bg-white"}`}
                                  initial={reduced ? false : { opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: reduced ? 0 : i * 0.08, duration: 0.4, ease: EASE }}
                                >
                                  <span className={`block text-[10px] font-bold uppercase tracking-wider ${i === 3 ? "text-[#ffd400]" : "text-zinc-400"}`}>
                                    {ui.stages[i]}
                                  </span>
                                  <span className="mt-0.5 block text-[12px] font-semibold leading-tight">{step ? tx(step) : goalText}</span>
                                </motion.li>
                              ))}
                            </ol>
                            {matched?.years ? (
                              <p className="mt-2 text-[12px] text-zinc-600">
                                {ui.yearsLabel} <span className="font-bold text-[#141414]">{tx(matched.years)}</span>
                              </p>
                            ) : null}
                            <p className="mt-3 text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.skillsHeading.toUpperCase()}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {plan.skills.map((skill) => (
                                <span key={skill.en} className="rounded-full bg-[#141414] px-2.5 py-0.5 text-[12px] text-white">{tx(skill)}</span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="mt-2 rounded-lg border border-dashed border-black/15 px-3 py-3 text-sm text-zinc-500">{ui.pathEmpty}</p>
                        )}
                      </div>

                      {/* Job check */}
                      <div className="rounded-xl border border-black/15 p-4">
                        <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.jobHeading.toUpperCase()}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <ScoreRing score={score} reduced={reduced} />
                          <div className="min-w-0">
                            <p className="truncate text-base font-black">{jobName.trim() || ui.jobFallback}</p>
                            <p className="mt-1 text-sm">
                              <span className={`mr-2 rounded-md px-2 py-0.5 font-black ${VERDICT_STYLE[verdict.tone]}`}>{tx(verdict.label)}</span>
                              <span className="text-zinc-600">{tx(verdict.detail)}</span>
                            </p>
                          </div>
                        </div>
                        {misses.length ? (
                          <div className="mt-3 border-t border-black/10 pt-3">
                            <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.insightsHeading.toUpperCase()}</p>
                            <ul className="mt-2 space-y-1.5">
                              {misses.slice(0, 3).map((item) => (
                                <li key={item.q.en} className="flex gap-2 text-[13px] leading-snug">
                                  <X aria-hidden="true" weight="bold" className="mt-0.5 size-3.5 shrink-0 text-zinc-500" />
                                  {tx(item.insight)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : answeredCount === 5 ? (
                          <p className="mt-3 flex gap-2 border-t border-black/10 pt-3 text-[13px] font-semibold">
                            <Check aria-hidden="true" weight="bold" className="mt-0.5 size-3.5 shrink-0" />
                            {ui.allClear}
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-xl bg-[#ffd400] px-4 py-3 text-sm">
                        <p className="font-black">{ui.teaserTitle}</p>
                        <p className="mt-0.5">{ui.teaser}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 bg-[#141414] px-6 py-3 text-xs text-zinc-400">
                      <span className="font-bold text-white">{ui.quote}</span>
                      <span className="shrink-0">mingcreatives.com</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {complete ? (
                    <motion.p
                      key="ready"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#ffd400]"
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: reduced ? 0 : 0.6, duration: 0.4, ease: EASE }}
                    >
                      <Sparkle aria-hidden="true" weight="fill" className="size-4" /> {ui.ready}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={!ready || busy}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ffd400] px-5 text-sm font-bold text-[#141414] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${
                      complete && !busy && !reduced ? "shadow-[0_0_0_6px_rgba(255,212,0,0.18)]" : ""
                    }`}
                  >
                    <FilePdf aria-hidden="true" weight="bold" className="size-4" />
                    {busy ? ui.pdfBusy : ui.pdf}
                  </button>
                  <a
                    href={CAREER_PLAN_URL}
                    onClick={openFullTool}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-zinc-100 hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                  >
                    {ui.full} <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
                  </a>
                </div>
                {!ready && <p className="mt-3 text-xs text-zinc-500">{ui.needGoal}</p>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
