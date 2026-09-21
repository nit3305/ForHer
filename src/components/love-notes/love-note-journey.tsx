"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { relationshipConfig, type LoveReason } from "@/config/relationship";
import { LoveNoteCard } from "./love-note-card";
import { LoveNoteProgress } from "./love-note-progress";
import { motionDurations, motionEasings } from "@/lib/motion";

export function LoveNoteJourney({ onComplete }: { onComplete: () => void }) {
  const config = relationshipConfig.loveNotes;
  const reasons = config.reasons;
  const [current, setCurrent] = useState(0);
  const [highestVisited, setHighestVisited] = useState(0);
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [closingVisible, setClosingVisible] = useState(false);
  const [pileSecret, setPileSecret] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const reason: LoveReason = reasons[current];
  const isOpen = opened.has(reason.id);
  const isFinal = current === reasons.length - 1;
  const remaining = reasons.length - opened.size;

  useEffect(() => {
    if (!isFinal || !isOpen) return;
    const timer = window.setTimeout(() => setClosingVisible(true), reducedMotion ? 100 : 1400);
    return () => window.clearTimeout(timer);
  }, [isFinal, isOpen, reducedMotion]);

  function openCurrent() {
    setOpened((value) => new Set(value).add(reason.id));
  }

  function navigate(next: number) {
    if (next < 0 || next >= reasons.length || next > highestVisited + 1 || (!isOpen && next > current)) return;
    setClosingVisible(false);
    setCurrent(next);
    setHighestVisited((value) => Math.max(value, next));
  }

  return (
    <div className="love-note-box relative isolate min-h-[78svh] w-full overflow-hidden rounded-sm border border-wine/10 px-3 py-5 shadow-[0_22px_65px_rgba(91,51,57,.1)] sm:px-7 sm:py-8">
      {reason.image && <div className="pointer-events-none absolute -inset-16 -z-20 opacity-[.07] blur-3xl"><Image src={reason.image.src} alt="" fill sizes="100vw" className="object-cover" /></div>}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.82),rgba(251,245,238,.94)_70%)]" />

      <LoveNoteProgress current={current} highestVisited={highestVisited} total={reasons.length} onSelect={navigate} />
      <p className="mt-3 text-center text-[8px] font-bold uppercase tracking-[.22em] text-ink/30">{config.contentNote}</p>

      <div className="relative mx-auto max-w-5xl py-5 sm:py-8">
        {opened.size > 1 && (
          <div className="absolute bottom-1 left-1/2 -z-10 h-16 w-[min(74%,28rem)] -translate-x-1/2" aria-label={`${opened.size} opened notes kept in a pile`}>
            {[...opened].slice(-4).map((id, index) => <span key={id} aria-hidden="true" style={{ transform: `translateX(-50%) translateY(${index * 4}px) rotate(${(index - 1.5) * 1.5}deg)` }} className="absolute left-1/2 top-0 block h-14 w-44 rounded-sm border border-rose/10 bg-paper shadow-sm" />)}
            <button type="button" data-romantic-interactive onClick={() => setPileSecret(true)} className="absolute left-1/2 top-10 z-10 min-h-11 -translate-x-1/2 px-4 text-[9px] font-bold text-wine/55 underline decoration-rose/25 underline-offset-3 focus-visible:outline-2 focus-visible:outline-wine">{config.interactions.pileSecretLabel}</button>
          </div>
        )}
        {!isOpen && Array.from({ length: Math.min(3, remaining) }, (_, index) => (
          <motion.span key={index} aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 block aspect-[5/3] w-[min(88%,36rem)] rounded-xl bg-blush/20" animate={{ x: "-50%", y: `calc(-48% + ${index * 7}px)`, rotate: (index - 1) * (2 + Math.min(opened.size, 4) * .12), scale: 1 - opened.size * .004 }} transition={{ duration: reducedMotion ? .08 : motionDurations.reveal, ease: motionEasings.cinematic }} />
        ))}
        <AnimatePresence mode="wait">
          <motion.div key={reason.id} initial={{ opacity: 0, x: reducedMotion ? 0 : 16, filter: reducedMotion ? "blur(0px)" : "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: reducedMotion ? 0 : -9, filter: reducedMotion ? "blur(0px)" : "blur(2px)" }} transition={{ duration: reducedMotion ? .1 : motionDurations.standard, ease: motionEasings.enter }}>
            <LoveNoteCard reason={reason} opened={isOpen} reducedMotion={reducedMotion} onOpen={openCurrent} />
          </motion.div>
        </AnimatePresence>
      </div>
      {pileSecret && <p role="status" className="mx-auto -mt-2 max-w-md rounded-full bg-blush/25 px-4 py-2 text-center font-display text-sm italic text-wine/70">{config.interactions.pileSecret}</p>}

      <div className={`relative z-20 mx-auto flex min-h-14 max-w-4xl items-center ${current > 0 ? "justify-between" : "justify-end"}`}>
        {current > 0 && <button type="button" onClick={() => navigate(current - 1)} className="min-h-11 px-3 text-xs font-bold text-ink/45 transition hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine">← Previous note</button>}
        {isOpen && !isFinal && <button type="button" onClick={() => navigate(current + 1)} className="paper-button min-h-11 px-6 text-xs font-bold text-wine focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-wine">Another reason →</button>}
      </div>

      <AnimatePresence>
        {closingVisible && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} className="relative z-20 mx-auto mt-7 max-w-xl pb-5 text-center" aria-live="polite">
            <p className="font-display text-3xl italic text-wine sm:text-4xl">{config.closingFirstLine}</p>
            <p className="mt-3 text-sm leading-7 text-ink/55">{config.closingSecondLine}</p>
            <p className="mt-1 text-sm leading-7 text-ink/55">{config.closingThirdLine}</p>
            <button type="button" onClick={onComplete} className="mt-6 rounded-full bg-wine px-8 py-4 text-sm font-bold text-white shadow-[0_14px_35px_rgba(127,57,72,.22)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">{config.continueButtonLabel} <span className="cinematic-arrow" aria-hidden="true">→</span></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
