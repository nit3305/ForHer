"use client";

import { motion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";

export function FinalLetterEnding({ reducedMotion, onReplay, onRestart }: { reducedMotion: boolean; onReplay: () => void; onRestart: () => void }) {
  const config = relationshipConfig.finalLetter;
  return (
    <motion.footer initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-14 text-center sm:py-18" aria-live="polite">
      <div className="mx-auto h-px w-20 bg-rose/25" />
      <p className="mt-9 font-display text-2xl italic text-wine/70">{config.signature.prefix}</p>
      <p className="mt-2 font-display text-4xl text-wine">{config.signature.name}<span className="ml-2 inline-block text-xl text-rose" aria-hidden="true">♥</span></p>
      <p className="handwritten mx-auto mt-7 max-w-md rotate-[-1deg] text-base leading-7 text-rose/75">{config.postscript}</p>
      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-7">
        <button type="button" onClick={onReplay} className="min-h-11 px-4 text-xs font-bold text-wine/70 underline decoration-rose/30 underline-offset-4 transition hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rose">{config.replayLabel}</button>
        <button type="button" onClick={onRestart} className="min-h-11 px-4 text-xs font-bold text-ink/40 transition hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rose">{config.restartLabel}</button>
      </div>
    </motion.footer>
  );
}
