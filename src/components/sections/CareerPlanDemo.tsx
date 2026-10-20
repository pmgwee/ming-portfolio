"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowCounterClockwise, ArrowRight, Check, FilePdf, Sparkle, X } from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import {
  CAREER_PLAN_URL,
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
import { CAREER_EVIDENCE, EVIDENCE_REVIEWED } from "@/lib/career-evidence";
import { nextMoveFor, OPPORTUNITY_STATES, weeklyTime } from "@/lib/career-next-move";
import { CareerOpportunityMap } from "./CareerOpportunityMap";

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
    pathHeading: "One possible route",
    pathEmpty: "Pick a goal and your path appears here.",
    stages: ["Start", "Grow", "Level up", "Goal"],
    skillsHeading: "Skills this goal needs",
    jobHeading: "Job check",
    jobFallback: "The job you're considering",
    insightsHeading: "What to watch",
    allClear: "You answered yes to all five. Now verify those assumptions with the employer.",
    teaserTitle: "The full plan also works out",
    teaser: "Your gaps in skills and network · obstacles and support · a 12-month action plan",
    ready: "Your first draft is ready to test",
    ribbon: "DRAFT",
    quote: "A direction to test. A next step to take.",
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
    pathHeading: "一条可能的路线",
    pathEmpty: "选好目标，你的路线就会出现在这里。",
    stages: ["起步", "成长", "进阶", "终点"],
    skillsHeading: "这个目标需要的技能",
    jobHeading: "这份工，给得了吗？",
    jobFallback: "你在考虑的工作",
    insightsHeading: "要注意的地方",
    allClear: "你对五项都回答了是。下一步：向雇主核实这些判断。",
    teaserTitle: "完整版还会帮你算出",
    teaser: "你还差的技能和人脉 · 阻碍和需要的支持 · 12 个月行动计划",
    ready: "你的初稿准备好了，可以开始验证",
    ribbon: "初稿",
    quote: "找到值得验证的方向，迈出具体的一步。",
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
  const [role, setRole] = useState("AI Engineering Lead");
  const [industryId, setIndustryId] = useState("tech");
  const [copied, setCopied] = useState(false);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [weeklyHours, setWeeklyHours] = useState(3);
  const [error, setError] = useState("");
  const [jobName, setJobName] = useState("");
  const [answers, setAnswers] = useState<Answer[]>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [unwrapKey, setUnwrapKey] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const wasComplete = useRef(false);

  const ui = UI[lang];
  const tx = (text: Text) => text[lang];
  const matched = findRole(role);
  const evidence = matched ? CAREER_EVIDENCE[matched.id] : undefined;
  const activeIndustry = INDUSTRIES.find((industry) => industry.id === industryId)!;
  const plan = matched ?? (role.trim() ? GENERIC_ROLE : null);
  const answeredCount = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a === true).length;
  const verdict = verdictFor(answers);
  const misses = JOB_QUESTIONS.filter((_, i) => answers[i] === false);
  const ready = role.trim().length > 0;
  const complete = ready && answeredCount === 5;
  const today = new Date().toISOString().slice(0, 10);
  const goalText = matched ? tx(matched.name) : role.trim();
  const nextMove = nextMoveFor(answers, selectedArea);
  const time = weeklyTime(weeklyHours);
  const weeklyTask = (nextMove.index === 0 || nextMove.index === 4) && evidence
    ? tx(evidence.experiment)
    : tx(nextMove.action);

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
    setSelectedArea(null);
    setCopied(false);
  }

  function pickRole(text: Text) {
    const value = text[lang];
    setRole(role === value ? "" : value);
    // A job's fit is relative to a goal; don't reuse a score for a new goal.
    setAnswers(EMPTY);
    setSelectedArea(null);
    setCopied(false);
  }

  function reset() {
    setName("");
    setRole("");
    setJobName("");
    setAnswers(EMPTY);
    setTab("goal");
    setCopied(false);
    setSelectedArea(null);
    setWeeklyHours(3);
    setError("");
  }

  function rateJob() {
    setTab("job");
    controlsRef.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  }

  async function copyNextStep() {
    if (!ready) return;
    try {
      const budget = lang === "en"
        ? `${time.hours} hours this week: define ${time.define} min / make ${time.make} min / review ${time.review} min.`
        : `这周投入 ${time.hours} 小时：定范围 ${time.define} 分钟 / 动手做 ${time.make} 分钟 / 复盘 ${time.review} 分钟。`;
      await navigator.clipboard.writeText(`${goalText}\n${jobName.trim()}\n\n${tx(OPPORTUNITY_STATES[nextMove.state].label)} · ${tx(nextMove.area.label)}\n${tx(nextMove.action)}\n\n${budget}\n${weeklyTask}`);
      setCopied(true);
      setError("");
    } catch {
      setError(lang === "en" ? "Copy is unavailable. Select the next-step text to copy it, or download the report." : "无法自动复制，请选中下一步文字复制，或下载报告。");
    }
  }

  async function downloadPdf() {
    if (!reportRef.current || busy) return;
    setBusy(true);
    setError("");
    try {
      const [{ toJpeg }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const dataUrl = await toJpeg(reportRef.current, { pixelRatio: 2, quality: 0.92, backgroundColor: "#fbfaf6", cacheBust: true });
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 14;
      const width = 210 - margin * 2;
      // Paginate at section boundaries instead of shrinking a mobile report into
      // illegible text or cutting off the new evidence. Canvas uses capture pixels.
      const report = reportRef.current;
      const bounds = report.getBoundingClientRect();
      const scale = img.height / bounds.height;
      const breaks = [...report.querySelectorAll("[data-report-block]")]
        .map((el) => Math.round((el.getBoundingClientRect().bottom - bounds.top) * scale));
      breaks.push(img.height);
      const pagePixels = Math.floor((297 - margin * 2) * img.width / width);
      let top = 0;
      let lastPageHeight = 0;
      while (top < img.height) {
        const limit = Math.min(top + pagePixels, img.height);
        const candidates = breaks.filter((point) => point > top && point <= limit);
        const bottom = candidates.length ? Math.max(...candidates) : limit;
        const slice = document.createElement("canvas");
        slice.width = img.width;
        slice.height = bottom - top;
        const ctx = slice.getContext("2d");
        if (!ctx) throw new Error("Canvas export unavailable");
        ctx.drawImage(img, 0, top, img.width, slice.height, 0, 0, img.width, slice.height);
        if (top > 0) pdf.addPage();
        lastPageHeight = slice.height * width / img.width;
        pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, width, lastPageHeight);
        top = bottom;
      }
      if (evidence) {
        // Reuse space below a short final slice rather than orphaning the footer.
        let y = margin + lastPageHeight + 14;
        if (y > 110) {
          pdf.addPage();
          y = 24;
        }
        pdf.setFontSize(16);
        pdf.text("Evidence & reading", margin, y);
        y += 10;
        pdf.setFontSize(10);
        pdf.text(`Reviewed ${EVIDENCE_REVIEWED}. Examples, not guaranteed career outcomes.`, margin, y);
        y += 14;
        for (const source of evidence.sources) {
          const lines = pdf.splitTextToSize(source.finding.en, width);
          if (y + 7 + lines.length * 5 > 280) {
            pdf.addPage();
            y = 24;
          }
          pdf.textWithLink(source.title, margin, y, { url: source.url });
          y += 7;
          pdf.text(lines, margin, y);
          y += lines.length * 5 + 12;
        }
      }
      pdf.save(ui.fileName(name.trim()));
      track("career_plan_pdf", { verdict: verdict.tone, lang });
    } catch {
      setError(lang === "en" ? "The PDF could not be created. Please try again; your answers are still here." : "PDF 生成失败。请重试，你填写的内容仍在。 ");
    } finally {
      setBusy(false);
    }
  }

  function openFullTool() {
    handOffToFullTool({ name, role: goalText, jobName, answers, lang });
    track("career_plan_full_tool", { lang });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-zinc-400 focus:border-[#ffd400] focus:outline-none";
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
          <h2
            id="career-plan-heading"
            className="mt-4 text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-zinc-100"
          >
            Will this job get you there?
          </h2>
          <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-zinc-300 md:text-lg">
            Turn a job title into a direction you can test. Explore the work behind it, find the evidence,
            and leave with one useful move for this week. Free, in English or 中文.
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
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 text-zinc-300 hover:bg-white/5 hover:text-white ${focusRing}`}
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
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-3 sm:gap-3 sm:px-4">
              <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
                <i className="size-3 rounded-full bg-[#ff5f57]" />
                <i className="size-3 rounded-full bg-[#febc2e]" />
                <i className="size-3 rounded-full bg-[#28c840]" />
              </span>
              <span className="hidden text-sm font-semibold text-zinc-100 md:inline">{ui.title}</span>
              <div role="group" aria-label="Demo steps" className="mx-auto flex rounded-full bg-black/40 p-1 text-xs sm:text-sm">
                {(["goal", "job"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={tab === key}
                    onClick={() => setTab(key)}
                    className={`whitespace-nowrap rounded-full px-2.5 py-1.5 font-medium transition-colors sm:px-3 ${focusRing} ${
                      tab === key ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {key === "goal" ? ui.tabGoal : ui.tabJob}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Language" className="grid h-10 w-24 shrink-0 grid-cols-2 rounded-full border border-white/15 p-1 text-xs font-semibold sm:w-28">
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
                    onClick={() => { setLang(key); setCopied(false); }}
                    className={`min-w-0 rounded-full px-2 py-1 transition-colors ${focusRing} ${
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
              <div ref={controlsRef} className="scroll-mt-28 border-b border-white/10 p-5 md:p-8 lg:sticky lg:top-28 lg:self-start lg:border-b-0">
                {tab === "goal" ? (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cp-role" className="text-base font-semibold text-zinc-100">{ui.goalLabel}</label>
                      <input id="cp-role" value={role} onChange={(e) => { setRole(e.target.value); setAnswers(EMPTY); setSelectedArea(null); setCopied(false); }} placeholder={ui.goalPlaceholder} className={inputClass} />
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{lang === "en" ? "Start with an example, or write your own. The horizon is your ambition—not a predicted promotion date." : "从示例开始，或写下自己的目标。时间是你的愿景，不是晋升预测。"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{ui.pickOne}</p>
                      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={ui.pickOne}>
                        {INDUSTRIES.map((industry) => (
                          <button key={industry.id} type="button" aria-pressed={industry.id === industryId} onClick={() => setIndustryId(industry.id)} className={`min-h-11 rounded-full border px-3 text-xs font-medium ${focusRing} ${industry.id === industryId ? "border-indigo-200 bg-indigo-200 text-[#101219]" : "border-white/15 text-zinc-300 hover:border-white/40"}`}>
                            {tx(industry.name)}
                          </button>
                        ))}
                      </div>
                            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {activeIndustry.roles.map((option) => {
                                const on = matched?.id === option.id;
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => pickRole(option.name)}
                                    className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${focusRing} ${
                                      on ? "border-[#ffd400] bg-[#ffd400] text-[#141414]" : "border-white/15 text-zinc-300 hover:border-white/40"
                                    }`}
                                  >
                                    {tx(option.name)}
                                    <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                    </div>
                    <div>
                      <label htmlFor="cp-name" className="text-base font-semibold text-zinc-100">
                        {ui.nameLabel} <span className="font-normal text-zinc-400">{ui.nameHint}</span>
                      </label>
                      <input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={ui.namePlaceholder} className={inputClass} />
                    </div>
                    <button
                      type="button"
                      onClick={rateJob}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-100 px-5 text-sm font-semibold text-[#07080c] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                    >
                      {ui.next} <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
                    </button>
                    <button type="button" onClick={() => reportRef.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" })} className={`ml-3 min-h-11 rounded-full px-3 text-sm text-indigo-200 lg:hidden ${focusRing}`}>
                      {lang === "en" ? "View my brief ↓" : "查看我的简报 ↓"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="cp-job" className="text-base font-semibold text-zinc-100">{ui.jobLabel}</label>
                    <input id="cp-job" value={jobName} onChange={(e) => { setJobName(e.target.value); setCopied(false); }} placeholder={ui.jobPlaceholder} className={inputClass} />
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
                            <p className="text-xs text-zinc-400">{tx(hint)}</p>
                          </div>
                          <div role="group" aria-label={tx(q)} className="grid grid-cols-2 gap-2 sm:w-[132px]">
                            {[true, false].map((v) => (
                              <button
                                key={String(v)}
                                type="button"
                                aria-pressed={answers[i] === v}
                                onClick={() => answer(i, v)}
                                className={`min-h-11 rounded-lg border text-sm font-semibold transition-colors ${focusRing} ${
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
                <div className="rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                  <div
                    ref={reportRef}
                    className="relative scroll-mt-28 overflow-hidden rounded-[15px] bg-[#fbfaf6] text-[#141414]"
                    style={{ fontFamily: FONT }}
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

                    <div data-report-block className="bg-[#141414] px-6 py-5 text-white">
                      <p className="text-[11px] tracking-[0.16em] text-zinc-400">{ui.kicker}</p>
                      <p className="mt-1 text-2xl font-black">{ui.reportTitle(name.trim())}</p>
                      <p className="mt-1 text-xs text-zinc-400">{today}</p>
                    </div>

                    <div className="space-y-5 px-6 py-6">
                      {/* Goal */}
                      <div data-report-block>
                        <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.goalHeading.toUpperCase()}</p>
                        <p className="mt-1 text-[22px] font-black leading-snug">
                          {ui.goalLine}{" "}
                          <span className={goalText ? "bg-[linear-gradient(transparent_58%,#ffd400_58%)] px-1" : "text-zinc-400"}>
                            {goalText || ui.goalEmpty}
                          </span>
                        </p>
                      </div>

                      {/* Path ladder */}
                      <div data-report-block>
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
                                  <span className={`block text-[10px] font-bold uppercase tracking-wider ${i === 3 ? "text-[#ffd400]" : "text-zinc-600"}`}>
                                    {ui.stages[i]}
                                  </span>
                                  <span className="mt-0.5 block text-[12px] font-semibold leading-tight">{step ? tx(step) : goalText}</span>
                                </motion.li>
                              ))}
                            </ol>
                            <p className="mt-2 text-xs leading-relaxed text-zinc-600">{evidence ? tx(evidence.caveat) : lang === "en" ? "Custom goal: this is an unresearched planning scaffold. Validate the route and skills with practitioners before using it." : "自定义目标：这是尚未研究的规划模板。使用前请与从业者核实路线和技能。"}</p>
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

                      {ready ? <CareerOpportunityMap answers={answers} lang={lang} selected={selectedArea} onSelect={(index) => { setSelectedArea(index); setCopied(false); }} hours={weeklyHours} onHours={(hours) => { setWeeklyHours(hours); setCopied(false); }} exercise={weeklyTask} reduced={reduced} onRateJob={rateJob} /> : null}

                      {/* Job check */}
                      <div data-report-block className="rounded-xl border border-black/15 p-4">
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
                        <p className="mt-3 text-xs leading-relaxed text-zinc-600">{lang === "en" ? `${score} yes · ${answeredCount}/5 answered. A self-reflection checklist, not a hiring probability or advice to accept or leave a job. Pay, safety, visa and personal needs matter too.` : `${score} 项回答是 · 已答 ${answeredCount}/5。这是自我反思清单，不是录用概率或接受、辞职建议。薪资、安全、签证与个人需要同样重要。`}</p>
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


                      <div data-report-block className="rounded-xl bg-[#ffd400] px-4 py-3 text-sm">
                        <p className="font-black">{ui.teaserTitle}</p>
                        <p className="mt-0.5">{ui.teaser}</p>
                      </div>
                    </div>

                    <div data-report-block className="flex items-center justify-between gap-4 bg-[#141414] px-6 py-3 text-xs text-zinc-400">
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
                  {ready && <button type="button" onClick={copyNextStep} className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-indigo-200 px-5 text-sm font-semibold text-[#101219] hover:bg-indigo-100 ${focusRing}`}>
                    <Check aria-hidden="true" className="size-4" />{copied ? (lang === "en" ? "Next step copied" : "下一步已复制") : (lang === "en" ? "Copy my next step" : "复制我的下一步")}
                  </button>}
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
                <p className="sr-only" role="status">{copied ? (lang === "en" ? "Next step copied" : "下一步已复制") : ""}</p>
                {error && <p role="alert" className="mt-3 text-sm text-amber-200">{error}</p>}
                {!ready && <p className="mt-3 text-xs text-zinc-500">{ui.needGoal}</p>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
