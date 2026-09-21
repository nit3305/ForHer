"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { FinalLetterEnding } from "./final-letter-ending";
import { FinalLetterSection } from "./final-letter-section";
import { PaperTape, PostageMark } from "@/components/ui/scrapbook-decor";
import { motionDurations, motionEasings } from "@/lib/motion";

export function FinalLetterReader({ onRestart }: { onRestart: () => void }) {
  const config = relationshipConfig.finalLetter;
  const [revealedCount, setRevealedCount] = useState(1);
  const [unfolded, setUnfolded] = useState(false);
  const [endingVisible, setEndingVisible] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: readerRef, offset: ["start start", "end end"] });
  const complete = revealedCount === config.sections.length;
  const continuationLabel = config.continueLabel;
  
  useEffect(() => {
    if (!complete) return;
    const timer = window.setTimeout(() => setEndingVisible(true), reducedMotion ? 100 : 1500);
    return () => window.clearTimeout(timer);
  }, [complete, reducedMotion]);

  function continueReading() {
    if (complete) return;
    const nextSection = config.sections[revealedCount];
    setEndingVisible(false);
    setRevealedCount((count) => Math.min(count + 1, config.sections.length));
    window.setTimeout(() => document.getElementById(`letter-${nextSection.id}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }), reducedMotion ? 0 : 80);
  }

  function replay() {
    setEndingVisible(false);
    setRevealedCount(1);
    readerRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div ref={readerRef} className="relative mx-auto w-full max-w-4xl pb-10">
      {!reducedMotion && <motion.div aria-hidden="true" className="sticky top-0 z-30 h-px w-full origin-left bg-blush/55" style={{ scaleX: scrollYProgress }} />}
      <p className="mb-5 text-center text-[8px] font-bold uppercase tracking-[.24em] text-ink/35">{config.contentNote}</p>
      {!unfolded && (
        <div className="grid min-h-[62svh] place-items-center">
          <motion.button type="button" data-romantic-interactive onClick={() => setUnfolded(true)} whileHover={reducedMotion ? undefined : { y: -5, rotate: -.5 }} whileTap={reducedMotion ? undefined : { scale: .985 }} className="relative aspect-[5/3] w-[min(90%,34rem)] rounded-sm border border-wine/10 bg-paper text-wine shadow-[0_24px_60px_rgba(91,51,57,.18)] focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-rose">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 origin-top bg-[#f0ded4] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
            <PostageMark className="absolute bottom-5 right-6 rotate-6" label="with love" />
            <span className="relative z-10 font-display text-2xl italic">{config.interactions.unfoldLabel}</span>
          </motion.button>
        </div>
      )}
      {unfolded && (
        <article aria-label="A letter for you" className="relative overflow-hidden rounded-sm border border-wine/10 bg-paper shadow-[0_26px_75px_rgba(91,51,57,.16)]">
          <PaperTape className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rotate-1" />
          {config.sections.slice(0, revealedCount).map((section) => <FinalLetterSection key={section.id} section={section} reducedMotion={reducedMotion} />)}

          {!complete && (
            <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? .1 : motionDurations.reveal, ease: motionEasings.enter }} className="border-t border-rose/10 px-6 py-9 text-center">
              <button type="button" data-romantic-interactive onClick={continueReading} className={`min-h-11 px-5 font-display text-xl italic text-rose hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose continuation-${continuation ?? "plain"}`}>{continuationLabel} <span aria-hidden="true">↓</span></button>
            </motion.div>
          )}

          <AnimatePresence>
            {endingVisible && <FinalLetterEnding reducedMotion={reducedMotion} onReplay={replay} onRestart={onRestart} />}
          </AnimatePresence>
        </article>
      )}
    </div>
  );
}
