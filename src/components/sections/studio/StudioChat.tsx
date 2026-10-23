"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowSquareOut,
  Camera,
  CaretLeft,
  Checks,
  Microphone,
  Phone,
  Plus,
  Sticker,
  VideoCamera,
} from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";
import { SERVICE_RAYS, STUDIO_PROMPTS } from "@/lib/studio";
import { SERVICE_ICONS } from "./serviceIcons";
import styles from "./Studio.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const REPLY_DELAY_MS = 800;
const TIME = "9:41 AM";
// An iOS glass capsule: light-to-clear fill, bright top rim, faint lower rim, lift shadow.
const GLASS =
  "border border-white/[0.18] bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06))] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(255,255,255,0.1),0_8px_20px_-8px_rgba(0,0,0,0.65)] backdrop-blur-xl backdrop-saturate-150";

// iOS status-bar glyphs, drawn to the system proportions.
function IosSignal() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" opacity="0.35" />
      <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
    </svg>
  );
}

function IosWifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 2.4c2.3 0 4.4.9 6 2.4.2.2.5.2.7 0l.9-.9c.2-.2.2-.5 0-.7A10.6 10.6 0 0 0 8 0C5.1 0 2.4 1.1.4 3.2c-.2.2-.2.5 0 .7l.9.9c.2.2.5.2.7 0 1.6-1.5 3.7-2.4 6-2.4Z" />
      <path d="M8 6c1.3 0 2.4.5 3.3 1.3.2.2.5.2.7 0l.9-.9c.2-.2.2-.5 0-.7A7 7 0 0 0 8 3.6a7 7 0 0 0-4.9 2.1c-.2.2-.2.5 0 .7l.9.9c.2.2.5.2.7 0C5.6 6.5 6.7 6 8 6Z" />
      <path d="M10.2 9.2c.2-.2.2-.5 0-.7A3.2 3.2 0 0 0 8 7.6c-.8 0-1.6.3-2.2.9-.2.2-.2.5 0 .7l1.8 1.8c.2.2.6.2.8 0l1.8-1.8Z" />
    </svg>
  );
}

function IosBattery({ level }: { level: number }) {
  return (
    <span className="flex items-center">
      <span className="relative h-[13px] w-[27px] overflow-hidden rounded-[4px] bg-white/35">
        <span className="absolute inset-y-0 left-0 bg-white" style={{ width: `${level}%` }} />
        <span className="absolute inset-0 grid place-items-center text-[10px] font-bold leading-none text-black">{level}</span>
      </span>
      <span className="ml-[1.5px] h-[4.5px] w-[1.5px] rounded-r-full bg-white/40" />
    </span>
  );
}

/**
 * A WhatsApp chat with Ming Creatives on an iPhone, since that is where real
 * conversations happen. Picking a service sends its sample brief and the
 * reply describes that service. Replies are pre-written and labelled as such.
 */
export function StudioChat({ reduced }: { reduced: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [replying, setReplying] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const exchangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (picked === null || reduced) return;
    setReplying(true);
    const timer = window.setTimeout(() => setReplying(false), REPLY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [picked, reduced]);

  // Keep the newest message in full view. The reply mounts only after the
  // typing dots finish leaving, so follow the conversation's size rather than state.
  useEffect(() => {
    const thread = threadRef.current;
    const exchange = exchangeRef.current;
    if (!thread || !exchange) return;
    const follow = () => thread.scrollTo({ top: thread.scrollHeight, behavior: reduced ? "instant" : "smooth" });
    const observer = new ResizeObserver(follow);
    observer.observe(exchange);
    return () => observer.disconnect();
  }, [picked, reduced]);

  const service = picked === null ? null : SITE.services[picked];
  const fade = reduced
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: EASE } };
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.7, ease: EASE },
      };
  const stamp = <span className="float-right ml-2 mt-1.5 text-[10px] leading-none text-white/45">{TIME}</span>;

  return (
    <div className="relative mx-auto mt-24 flex w-full justify-center px-6 text-white md:mt-32">
      <motion.figure {...reveal} aria-label="WhatsApp chat tour of Ming's services" className="w-full max-w-[380px]">
        <div className="rounded-[58px] border border-white/15 bg-[#1b1c20] p-[9px] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="relative flex h-[680px] flex-col overflow-hidden rounded-[49px] bg-[#0b0b0c]">
            {/* Plain dark wallpaper with a faint dot weave. */}
            <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1.6px)] bg-[length:16px_16px]" />

            {/* Liquid glass: a thick frosted layer whose blur fades out downward,
                with the capsules floating on it as separate pieces of glass. */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 z-20 h-[136px] bg-[linear-gradient(180deg,rgba(64,64,70,0.5)_0%,rgba(44,44,48,0.32)_60%,rgba(30,30,32,0)_100%)] backdrop-blur-2xl backdrop-saturate-150 [mask-image:linear-gradient(180deg,#000_55%,transparent)]" />
            <div className="absolute inset-x-0 top-0 z-20">
              <div aria-hidden="true" className="relative flex h-[52px] items-center justify-between pl-9 pr-7 pt-1.5">
                <span className="text-[16px] font-semibold tracking-[-0.01em]">9:41</span>
                {/* Dynamic Island with a live activity: artwork left, sound wave right. */}
                <span className="absolute left-1/2 top-[10px] flex h-[33px] w-[128px] -translate-x-1/2 items-center justify-between rounded-full bg-black pl-[6px] pr-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                  <Image src={SITE.logo} alt="" width={22} height={22} className="size-[22px] rounded-[6px] object-cover" />
                  <span className="flex h-3.5 items-center gap-[2.5px]">
                    {[0.45, 0.8, 1, 0.65, 0.9, 0.5].map((h, i) => (
                      <i
                        key={i}
                        className={`block w-[2.5px] origin-center rounded-full bg-[#8fb4f0] ${reduced ? "" : styles.wave}`}
                        style={{ height: `${h * 100}%`, animationDelay: `${i * 0.13}s` }}
                      />
                    ))}
                  </span>
                </span>
                <span className="flex items-center gap-[6px]">
                  <IosSignal />
                  <IosWifi />
                  <IosBattery level={59} />
                </span>
              </div>
              <div className="flex items-center gap-2 px-2.5 pt-1 sm:px-3">
                <span aria-hidden="true" className={`flex h-11 shrink-0 items-center gap-0.5 rounded-full pl-2 pr-3.5 text-[17px] ${GLASS}`}>
                  <CaretLeft size={20} weight="bold" />
                  12
                </span>
                <Image src={SITE.logo} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />
                <p className="min-w-0 flex-1 truncate text-[16px] font-semibold">Ming Creatives</p>
                <span aria-hidden="true" className={`flex h-11 shrink-0 items-center gap-6 rounded-full px-4 ${GLASS}`}>
                  <VideoCamera size={22} />
                  <Phone size={20} />
                </span>
              </div>
            </div>

            <div ref={threadRef} aria-live="polite" data-lenis-prevent className="relative flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 pb-24 pt-[124px] text-[14px] leading-[1.4] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <p className="mx-auto mb-1.5 rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-white/60">Today</p>
              <p className="max-w-[80%] self-start rounded-[16px] rounded-tl-[5px] bg-[#262628] px-3 py-1.5">
                Hi, I&apos;m Ming. What would you like to create?{stamp}
              </p>
              <p className="max-w-[80%] self-start rounded-[16px] rounded-tl-[5px] bg-[#262628] px-3 py-1.5">
                Pick a service below and I&apos;ll show you how I&apos;d approach it.{stamp}
              </p>

              {/* The suggestion rows from the desktop demo: quiet until hovered or picked. */}
              <ul aria-label="Pick a service" className="mt-1 space-y-1">
                {STUDIO_PROMPTS.map((prompt, i) => {
                  const Icon = SERVICE_ICONS[i];
                  return (
                    <li key={prompt}>
                      <button
                        type="button"
                        aria-pressed={picked === i}
                        onClick={() => setPicked(i)}
                        className={`flex min-h-11 w-full items-center gap-3 rounded-md px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200 ${
                          picked === i ? "bg-white/[0.07] text-white" : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-md bg-white/[0.06] text-brand-300">
                          <Icon size={16} weight="fill" />
                        </span>
                        <span className="flex-1">{prompt}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {service !== null && picked !== null ? (
                <div key={picked} ref={exchangeRef} className="mt-2 flex flex-col gap-1.5">
                  <motion.p {...fade} className="max-w-[80%] self-end rounded-[16px] rounded-tr-[5px] bg-[#144d37] px-3 py-1.5">
                    {STUDIO_PROMPTS[picked]}
                    <span className="float-right ml-2 mt-1.5 flex items-center gap-0.5 text-[10px] leading-none text-white/55">
                      {TIME} <Checks aria-label="Read" size={13} weight="bold" className="text-[#53bdeb]" />
                    </span>
                  </motion.p>
                  <AnimatePresence mode="wait" initial={false}>
                    {replying ? (
                      <motion.span key="typing" aria-label="Ming Creatives is typing" exit={{ opacity: 0 }} className="flex h-9 w-16 items-center justify-center gap-1 self-start rounded-[16px] rounded-tl-[5px] bg-[#262628]">
                        {[0, 1, 2].map((dot) => (
                          <i key={dot} className="size-1.5 animate-pulse rounded-full bg-white/55" style={{ animationDelay: `${dot * 160}ms` }} />
                        ))}
                      </motion.span>
                    ) : (
                      <motion.div key="reply" {...fade} className="max-w-[86%] self-start overflow-hidden rounded-[16px] rounded-tl-[5px] bg-[#262628]">
                        <div className="px-3 pb-1.5 pt-2">
                          <p className="font-semibold">{service.name}</p>
                          <p className="mt-1 text-white/80">{service.description}</p>
                          <p className="mt-2 text-[12px] font-medium" style={{ color: SERVICE_RAYS[picked].color }}>
                            {service.outcome}
                            {stamp}
                          </p>
                        </div>
                        <a
                          href={SITE.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-11 items-center justify-center gap-1.5 border-t border-white/10 text-[14px] font-medium text-[#21c063] transition-colors hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-200"
                        >
                          <ArrowSquareOut aria-hidden="true" size={16} /> Continue on WhatsApp
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}
            </div>

            {/* Floating input bar over the chat, fading up into it. */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-[linear-gradient(0deg,rgba(28,28,30,0.95)_0%,rgba(28,28,30,0.85)_72%,rgba(28,28,30,0)_100%)] px-3 pb-8 pt-5 backdrop-blur-md">
              <Plus aria-hidden="true" size={26} />
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.12] pl-3.5 pr-2 text-[13px] text-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors hover:text-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200"
              >
                <span className="flex-1 truncate">Message Ming on WhatsApp</span>
                <Sticker aria-hidden="true" size={20} className="text-white/70" />
              </a>
              <Camera aria-hidden="true" size={24} />
              <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#21c063] text-[#0b0b0c]">
                <Microphone size={18} weight="fill" />
              </span>
              <span aria-hidden="true" className="absolute bottom-2 left-1/2 h-[5px] w-32 -translate-x-1/2 rounded-full bg-white/80" />
            </div>
          </div>
        </div>
        <figcaption className="mt-4 text-center text-xs leading-5 text-white/50">
          A quick tour of the services. Replies here are pre-written; real conversations happen on WhatsApp.
        </figcaption>
      </motion.figure>
    </div>
  );
}
