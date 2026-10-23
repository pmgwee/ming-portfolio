"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowCounterClockwise, ArrowRight } from "@phosphor-icons/react";
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
import { completionFor, nextMoveFor } from "@/lib/career-next-move";
import { CareerOpportunityMap } from "./CareerOpportunityMap";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMPTY: Answer[] = [null, null, null, null, null];
const FONT = "var(--font-figtree), 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

const UI = {
  en: {
    title: "Career Plan",
    tabGoal: "Career Goal",
    tabJob: "Rate Job",
    goalLabel: "In 5–10 years, I want to be…",
    goalPlaceholder: "Type a role, or pick one below",
    pickOne: "Or pick a goal by industry",
    nameLabel: "Your name",
    nameHint: "(optional)",
    namePlaceholder: "e.g. Alex",
    next: "Next: rate a job",
    jobLabel: "A job you're considering",
    jobPlaceholder: "e.g. Junior SWE at an AI startup",
    answered: (n: number) => `${n}/5 answered`,
    yes: "Yes",
    no: "No",
    reportTitle: (name: string) => (name ? `${name}'s career snapshot` : "Your career snapshot"),
    goalHeading: "My goal",
    goalLine: "In 5–10 years, I want to be",
    goalEmpty: "(pick a goal)",
    pathHeading: "One possible route",
    pathEmpty: "Pick a goal and your path appears here.",
    stages: ["Start", "Grow", "Level up", "Goal"],
    skillsHeading: "Skills this goal needs",
    teaser: "Turn this snapshot into a 12-month plan.",
    full: "Build my full plan",
  },
  cn: {
    title: "职业规划表",
    tabGoal: "职业目标",
    tabJob: "评估工作",
    goalLabel: "5–10 年后，我想成为…",
    goalPlaceholder: "输入职位，或从下面选一个",
    pickOne: "或按行业选一个目标",
    nameLabel: "你的名字",
    nameHint: "（选填）",
    namePlaceholder: "例：小明",
    next: "下一步：评估一份工",
    jobLabel: "你在考虑的工作",
    jobPlaceholder: "例：AI 初创 Junior SWE",
    answered: (n: number) => `已回答 ${n}/5`,
    yes: "是",
    no: "否",
    reportTitle: (name: string) => (name ? `${name} 的职业快照` : "你的职业快照"),
    goalHeading: "我的终点",
    goalLine: "5–10 年后，我想成为",
    goalEmpty: "（选一个目标）",
    pathHeading: "一条可能的路线",
    pathEmpty: "选好目标，你的路线就会出现在这里。",
    stages: ["起步", "成长", "进阶", "终点"],
    skillsHeading: "这个目标需要的技能",
    teaser: "把这份快照，变成你的 12 个月行动计划。",
    full: "制定我的完整规划",
  },
} as const;

type Tab = "goal" | "job";

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
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [jobName, setJobName] = useState("");
  const [answers, setAnswers] = useState<Answer[]>(EMPTY);
  const previewRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const wasComplete = useRef(false);

  const ui = UI[lang];
  const tx = (text: Text) => text[lang];
  const matched = findRole(role);
  const activeIndustry = INDUSTRIES.find((industry) => industry.id === industryId)!;
  const plan = matched ?? (role.trim() ? GENERIC_ROLE : null);
  const answeredCount = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a === true).length;
  const verdict = verdictFor(answers);
  const ready = role.trim().length > 0;
  const completion = completionFor(role, answers);
  const complete = completion !== null;
  const goalText = matched ? tx(matched.name) : role.trim();
  const nextMove = nextMoveFor(answers, selectedArea);
  // Track completion once per completed set of answers.
  useEffect(() => {
    if (complete && !wasComplete.current) {
      track("career_plan_complete", { lang, verdict: verdict.tone });
      previewRef.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    }
    wasComplete.current = complete;
  }, [complete, lang, verdict.tone, reduced]);

  function answer(i: number, value: boolean) {
    setAnswers((prev) => prev.map((a, j) => (j === i ? (a === value ? null : value) : a)));
    setSelectedArea(null);
  }

  function pickRole(text: Text) {
    const value = text[lang];
    setRole(role === value ? "" : value);
    // A job's fit is relative to a goal; don't reuse a score for a new goal.
    setAnswers(EMPTY);
    setSelectedArea(null);
  }

  function reset() {
    setName("");
    setRole("");
    setJobName("");
    setAnswers(EMPTY);
    setTab("goal");
    setSelectedArea(null);
  }

  function rateJob() {
    setTab("job");
    controlsRef.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  }

  function openFullTool() {
    handOffToFullTool({ name, role: goalText, jobName, answers, lang });
    track("career_plan_full_tool", { lang });
  }

  const inputClass =
    "mt-2 w-full rounded-md border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-zinc-400 focus:border-[#ffd400] focus:outline-none";
  const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300";

  return (
    <section
      id="career-plan"
      aria-labelledby="career-plan-heading"
      className="scroll-mt-28 relative overflow-hidden border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] h-[46vh] w-[80vw] max-w-5xl -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(255,212,0,0.35), rgba(87,123,244,0.25) 55%, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-[1400px]">
        <motion.div className="max-w-3xl" {...reveal}>
          <h2
            id="career-plan-heading"
            className="mt-4 text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[1.04] tracking-[-0.03em] text-zinc-100"
          >
            Will this job get you there?
          </h2>
          <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-zinc-300 md:text-lg">
            Pick a goal. Try five quick checks. See a glimpse of your next move—in English or 中文.
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
            className="overflow-hidden rounded-md border border-white/10 bg-[#101219] shadow-[0_25px_80px_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,212,0,0.08)]"
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
                    onClick={() => { setLang(key); }}
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
                      <input id="cp-role" value={role} onChange={(e) => { setRole(e.target.value); setAnswers(EMPTY); setSelectedArea(null); }} placeholder={ui.goalPlaceholder} className={inputClass} />
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{lang === "en" ? "Choose a role to preview your path." : "选一个职位，预览你的方向。"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{ui.pickOne}</p>
                      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={ui.pickOne}>
                        {INDUSTRIES.map((industry) => (
                          <button key={industry.id} type="button" aria-pressed={industry.id === industryId} onClick={() => setIndustryId(industry.id)} className={`min-h-11 rounded-full border px-3 text-xs font-medium ${focusRing} ${industry.id === industryId ? "border-brand-200 bg-brand-200 text-[#101219]" : "border-white/15 text-zinc-300 hover:border-white/40"}`}>
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
                                    className={`flex min-h-14 items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors ${focusRing} ${
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
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-100 px-5 text-sm font-semibold text-[#07080c] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                    >
                      {ui.next} <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
                    </button>
                    <button type="button" onClick={() => previewRef.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" })} className={`ml-3 min-h-11 rounded-full px-3 text-sm text-brand-200 lg:hidden ${focusRing}`}>
                      {lang === "en" ? "View my brief ↓" : "查看我的简报 ↓"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="cp-job" className="text-base font-semibold text-zinc-100">{ui.jobLabel}</label>
                    <input id="cp-job" value={jobName} onChange={(e) => { setJobName(e.target.value); }} placeholder={ui.jobPlaceholder} className={inputClass} />
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
                                className={`min-h-11 rounded-md border text-sm font-semibold transition-colors ${focusRing} ${
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

              {/* A compact preview that leads into the full plan. */}
              <div className="bg-[#0c0d12] p-5 md:p-8">
                <div className="rounded-md shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                  <div
                    ref={previewRef}
                    className="relative scroll-mt-28 overflow-hidden rounded-[5px] bg-[#fbfaf6] text-[#141414]"
                    style={{ fontFamily: FONT }}
                  >
                    {complete ? <motion.span
                      role="status"
                      className="pointer-events-none absolute right-[-42px] top-[18px] z-10 w-[160px] rotate-45 bg-[#ffd400] py-1.5 text-center text-[11px] font-bold tracking-[0.12em] text-[#141414]"
                      initial={reduced ? false : { opacity: 0, x: 14, y: -14 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                    >{lang === "en" ? "READY" : "已就绪"}</motion.span> : null}
                    <div className={`bg-[#141414] px-6 py-4 text-white ${complete ? "pr-24" : ""}`}>
                      <p className="text-xl font-semibold">{ui.reportTitle(name.trim())}</p>
                    </div>

                    <div className="space-y-5 px-6 py-6">
                      {/* Completion earns the focal reveal; the first look stays quiet. */}
                      {completion ? <motion.div
                        key={`${goalText}-${completion.tone}-${lang}`}
                        initial={reduced ? false : { opacity: 0, y: 12, clipPath: "inset(0 0 12% 0)" }}
                        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                        transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
                      >
                        <h3 id="cp-completion-headline" className="max-w-[16ch] text-balance text-[clamp(2.25rem,4.1vw,3.75rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]">
                          <span className="block">{tx(completion.first)}</span>
                          <span className="mt-1 block">{tx(completion.second)}</span>
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-zinc-700">{lang === "en" ? <><span className="font-semibold">{score}/5 checks align</span> with your goal of <span className="font-semibold">{goalText}</span>.</> : <>你的回答中，<span className="font-semibold">{score}/5 项</span>与你的<span className="font-semibold">「{goalText}」</span>目标匹配。</>}</p>
                      </motion.div> : <div>
                        <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.goalHeading.toUpperCase()}</p>
                        <p className="mt-1 text-[22px] font-black leading-snug">
                          {ui.goalLine}{" "}
                          <span className={goalText ? "bg-[linear-gradient(transparent_58%,#ffd400_58%)] px-1" : "text-zinc-400"}>
                            {goalText || ui.goalEmpty}
                          </span>
                        </p>
                      </div>}

                      {/* Path ladder */}
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.pathHeading.toUpperCase()}</p>
                        {plan ? (
                          <>
                            <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" key={`${matched?.id ?? "generic"}-${lang}`}>
                              {[...plan.path, null].map((step, i) => (
                                <motion.li
                                  key={i}
                                  className={`relative rounded-md border px-2.5 py-2 ${i === 3 ? "border-[#141414] bg-[#141414] text-white" : "border-black/10 bg-white"}`}
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
                            <p className="mt-2 text-xs leading-relaxed text-zinc-600">{lang === "en" ? "Example route; requirements vary." : "示例路线，具体要求因岗位而异。"}</p>
                            <p className="mt-3 text-[11px] font-bold tracking-[0.16em] text-zinc-500">{ui.skillsHeading.toUpperCase()}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {plan.skills.map((skill) => (
                                <span key={skill.en} className="rounded-full bg-[#141414] px-2.5 py-0.5 text-[12px] text-white">{tx(skill)}</span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="mt-2 rounded-md border border-dashed border-black/15 px-3 py-3 text-sm text-zinc-500">{ui.pathEmpty}</p>
                        )}
                      </div>

                      {ready ? <CareerOpportunityMap answers={answers} lang={lang} selected={selectedArea} onSelect={setSelectedArea} reduced={reduced} /> : null}

                      <div id="cp-next-move" className="space-y-2" aria-live="polite" aria-atomic="true">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-base font-semibold">{tx(verdict.label)}</h3>
                          <span className="text-xs tabular-nums text-zinc-600">{answeredCount ? (lang === "en" ? `${score}/${answeredCount} aligned · your answers` : `${score}/${answeredCount} 项匹配 · 依你的回答`) : lang === "en" ? "5 quick checks" : "5 项快速检查"}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-700">
                          {answeredCount > 0 || selectedArea !== null ? <><span className="font-semibold">{tx(nextMove.area.label)}{lang === "en" ? ". " : "："}</span>{tx(nextMove.action)}</> : lang === "en" ? "Five quick checks. One clearer direction." : "五个简单问题，找到更清晰的方向。"}
                        </p>
                      </div>

                      <a href={CAREER_PLAN_URL} onClick={openFullTool} className="group flex min-h-20 items-center justify-between gap-4 rounded-md bg-[#ffd400] px-4 py-4 text-[#141414] transition-colors hover:bg-[#ffe34d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#685500]">
                        <span><span className="block text-base font-semibold">{ui.full}</span><span className="mt-1 block text-xs leading-relaxed">{ui.teaser}</span></span>
                        <ArrowRight aria-hidden="true" weight="bold" className="size-5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
