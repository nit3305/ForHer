"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { motionDurations, motionEasings } from "@/lib/motion";

export function JigsawIntro({ onStart }: { onStart: () => void }) {
  const puzzle = relationshipConfig.puzzle;
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="flex min-h-[330px] flex-col items-center justify-center text-center"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 18, filter: reducedMotion ? "blur(0px)" : "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -10, scale: reducedMotion ? 1 : 1.02 }}
      transition={{ duration: reducedMotion ? 0.1 : motionDurations.reveal, ease: motionEasings.cinematic }}
    >
      <motion.div
        layoutId="memory-photo"
        initial={{ rotate: reducedMotion ? 0 : -7, scale: reducedMotion ? 1 : 0.9 }}
        animate={{ rotate: reducedMotion ? 0 : -4, scale: 1 }}
        transition={{ duration: reducedMotion ? 0.1 : motionDurations.emotional, ease: motionEasings.cinematic }}
        className="light-catch relative mb-7 size-28 overflow-hidden rounded-2xl border-4 border-white shadow-[0_18px_35px_rgba(91,51,57,.18)]"
      >
        <Image src={puzzle.imageSrc} alt="" fill sizes="112px" className="object-cover" />
      </motion.div>
      <p className="text-[10px] font-bold uppercase tracking-[.28em] text-rose">{puzzle.introEyebrow}</p>
      <h2 className="mt-4 max-w-md font-display text-4xl leading-none text-wine sm:text-5xl">{puzzle.introHeading}</h2>
      <p className="mt-5 max-w-sm text-sm leading-6 text-ink/55">{puzzle.introText}</p>
      <p className="mt-3 text-[9px] font-bold uppercase tracking-[.2em] text-rose/70">25 easy pieces · hints included</p>
      <button type="button" onClick={onStart} className="mt-8 rounded-full bg-wine px-8 py-4 text-sm font-bold text-white shadow-[0_14px_35px_rgba(127,57,72,.22)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">
        {puzzle.startButtonLabel} <span className="cinematic-arrow" aria-hidden="true">→</span>
      </button>
    </motion.div>
  );
}
