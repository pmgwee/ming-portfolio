"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "@phosphor-icons/react";
import type { Answer, Lang } from "@/lib/career-plan";
import { OPPORTUNITY_AREAS, OPPORTUNITY_STATES, nextMoveFor, opportunityState } from "@/lib/career-next-move";

type Props = {
  answers: Answer[];
  lang: Lang;
  selected: number | null;
  onSelect: (index: number) => void;
  reduced: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function CareerOpportunityMap({ answers, lang, selected, onSelect, reduced }: Props) {
  const move = nextMoveFor(answers, selected);
  const en = lang === "en";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#685500]";

  return (
    <div className="border-y border-black/15 py-4" aria-labelledby="cp-map-heading">
      <h3 id="cp-map-heading" className="text-base font-semibold tracking-tight">{en ? "Your fit, at a glance" : "你的匹配概览"}</h3>

      <div className="mt-3" role="group" aria-label={en ? "Opportunity map" : "机会地图"}>
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
            <button key={area.label.en} type="button" onClick={() => onSelect(index)} aria-pressed={active} aria-controls="cp-next-move" aria-label={`${area.label[lang]}: ${OPPORTUNITY_STATES[state].label[lang]}`} className={`grid min-h-11 w-full grid-cols-[minmax(84px,0.85fr)_minmax(0,1.5fr)] items-center gap-2 rounded-md px-2 text-left transition-colors ${active ? "bg-black/[0.05]" : "hover:bg-black/[0.03]"} ${focus}`}>
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

    </div>
  );
}
