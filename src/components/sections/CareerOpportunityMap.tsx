"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Minus } from "@phosphor-icons/react";
import type { Answer, Lang } from "@/lib/career-plan";
import { OPPORTUNITY_AREAS, OPPORTUNITY_STATES, nextMoveFor, opportunityState, weeklyTime } from "@/lib/career-next-move";

type Props = {
  answers: Answer[];
  lang: Lang;
  selected: number | null;
  onSelect: (index: number) => void;
  hours: number;
  onHours: (hours: number) => void;
  exercise: string;
  reduced: boolean;
  onRateJob: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function CareerOpportunityMap({ answers, lang, selected, onSelect, hours, onHours, exercise, reduced, onRateJob }: Props) {
  const move = nextMoveFor(answers, selected);
  const time = weeklyTime(hours);
  const known = answers.filter((answer) => answer !== null).length;
  const en = lang === "en";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#685500]";
  const steps = [
    { label: en ? "Define" : "定范围", minutes: time.define, detail: en ? "Choose one small deliverable and what a useful result would look like." : "选一项小交付，写清什么结果才有用。" },
    { label: en ? "Make" : "动手做", minutes: time.make, detail: exercise },
    { label: en ? "Review" : "做复盘", minutes: time.review, detail: en ? "Save what you made. Ask for one piece of feedback and choose what to improve next." : "保存成果，收集一条具体反馈，确定下一次改进什么。" },
  ];

  return (
    <div data-report-block className="border-y border-black/15 py-5" aria-labelledby="cp-map-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="cp-map-heading" className="text-lg font-semibold tracking-tight">{en ? "Your opportunity map" : "你的成长机会地图"}</h3>
        <span className="text-xs tabular-nums text-zinc-600">{en ? `${known}/5 answered` : `已答 ${known}/5`}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{en ? "Your answers move the markers. Choose an area to see your next move." : "标记随你的回答移动。选择一个方向，看看下一步怎么做。"}</p>

      <div data-report-block className="mt-5" role="group" aria-label={en ? "Opportunity map" : "机会地图"}>
        <div className="grid grid-cols-[minmax(84px,0.85fr)_minmax(0,1.5fr)] items-center gap-2 px-2 pb-2" aria-hidden="true">
          <span className="text-[11px] text-zinc-600">{en ? "Your answers" : "你的判断"}</span>
          <div className="grid grid-cols-3 text-center text-[11px] font-semibold text-zinc-600">
            {OPPORTUNITY_STATES.map((state) => <span key={state.label.en}>{state.label[lang]}</span>)}
          </div>
        </div>
        {OPPORTUNITY_AREAS.map((area, index) => {
          const state = opportunityState(answers[index]);
          const active = move.index === index;
          return (
            <button key={area.label.en} type="button" onClick={() => onSelect(index)} aria-pressed={active} aria-controls="cp-next-move" aria-label={`${area.label[lang]}: ${OPPORTUNITY_STATES[state].label[lang]}`} className={`grid min-h-12 w-full grid-cols-[minmax(84px,0.85fr)_minmax(0,1.5fr)] items-center gap-2 rounded-lg px-2 text-left transition-colors ${active ? "bg-black/[0.05]" : "hover:bg-black/[0.03]"} ${focus}`}>
              <span className={`text-xs leading-snug ${active ? "font-bold" : "font-medium text-zinc-700"}`}>{area.label[lang]}</span>
              <span className="relative block h-10" aria-hidden="true">
                <span className="absolute inset-x-[16.666%] top-1/2 h-px bg-black/15" />
                <span className="absolute inset-0 grid grid-cols-3 items-center justify-items-center">
                  {[0, 1, 2].map((dot) => <span key={dot} className="size-1.5 rounded-full bg-[#b0aea6]" />)}
                </span>
                <motion.span initial={false} animate={{ x: `${state * 100}%` }} transition={{ duration: reduced ? 0 : 0.38, ease: EASE }} className="absolute inset-y-0 left-0 flex w-1/3 items-center justify-center">
                  <span className={`flex size-7 items-center justify-center rounded-full border-2 ${state === 0 ? "border-[#77756d] bg-[#fbfaf6] text-[#57554e]" : state === 1 ? "border-[#947b00] bg-[#ffd400] text-[#141414]" : "border-[#141414] bg-[#141414] text-white"}`}>
                    {state === 0 ? <span className="text-[13px] font-semibold">?</span> : state === 1 ? <Minus className="size-3.5" weight="bold" /> : <Check className="size-3.5" weight="bold" />}
                  </span>
                </motion.span>
              </span>
            </button>
          );
        })}
      </div>

      <div data-report-block id="cp-next-move" className="mt-5 border-t border-black/15 pt-4" aria-live="polite" aria-atomic="true">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          <h4>{OPPORTUNITY_STATES[move.state].label[lang]} · {move.area.label[lang]}</h4>
        </div>
        <motion.p key={`${move.index}-${move.state}-${lang}`} initial={reduced ? false : { opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="mt-2 text-sm leading-relaxed">{move.action[lang]}</motion.p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-600">{move.area.why[lang]}</p>
      </div>
      {known < 5 ? <button type="button" onClick={onRateJob} className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded px-1 text-xs font-semibold underline decoration-black/30 underline-offset-4 ${focus}`}>
        {en ? (known ? "Continue the job check" : "Answer the five job checks") : (known ? "继续评估这份工作" : "回答五个工作问题")} <ArrowRight aria-hidden="true" className="size-3.5" />
      </button> : null}

      <div className="mt-5 border-t border-black/15 pt-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">{en ? "Make room for your next move" : "为下一步留点时间"}</h4>
          <output htmlFor="cp-weekly-hours" className="shrink-0 text-sm font-semibold tabular-nums">{time.hours}{en ? " h / week" : " 小时 / 周"}</output>
        </div>
        <label htmlFor="cp-weekly-hours" className="mt-2 block text-xs text-zinc-600">{en ? "Time you can set aside this week" : "这周你能投入的时间"}</label>
        <input id="cp-weekly-hours" type="range" min="1" max="8" step="1" value={time.hours} onChange={(event) => onHours(Number(event.target.value))} aria-valuetext={en ? `${time.hours} hours per week` : `每周 ${time.hours} 小时`} className={`mt-1 block h-11 w-full cursor-pointer accent-[#141414] ${focus}`} />
        <div className="flex h-2 overflow-hidden rounded-full" aria-hidden="true">
          {steps.map((step, index) => <span key={step.label} style={{ width: `${step.minutes / time.total * 100}%` }} className={index === 0 ? "bg-[#d0cec5]" : index === 1 ? "bg-[#ffd400]" : "bg-[#141414]"} />)}
        </div>
        <ol className="mt-3 divide-y divide-black/10">
          {steps.map((step) => <li data-report-block key={step.label} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-baseline justify-between gap-3 text-xs font-semibold"><span>{step.label}</span><span className="tabular-nums">{step.minutes} {en ? "min" : "分钟"}</span></div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-700">{step.detail}</p>
          </li>)}
        </ol>
        <p className="mt-3 text-xs text-zinc-600">{en ? "Start small; carry unfinished work into next week." : "从小处开始，未完成的部分下周继续。"}</p>
      </div>
    </div>
  );
}
