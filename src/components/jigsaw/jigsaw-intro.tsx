"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeartMark } from "@/components/ui/heart-mark";
import { relationshipConfig } from "@/config/relationship";

type JigsawIntroProps = {
  onStart: () => void;
};

export function JigsawIntro({ onStart }: JigsawIntroProps) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="relative mx-auto flex min-h-[440px] max-w-xl flex-col items-center justify-center px-4 py-8 text-center sm:py-12"
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              y: 18,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* tiny floating decoration */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[8%] top-[13%] text-xl text-rose/45"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={
          reducedMotion
            ? { opacity: 1 }
            : {
                opacity: [0.35, 0.65, 0.35],
                scale: [0.9, 1.08, 0.9],
                y: [0, -4, 0],
              }
        }
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ♡
      </motion.span>

      <motion.span
        aria-hidden="true"
        className="absolute right-[10%] top-[20%] text-sm text-rose/40"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        ✦
      </motion.span>

      {/* little photo placeholder / puzzle stack */}
      <motion.div
        className="relative mb-8 h-36 w-52"
        initial={
          reducedMotion
            ? false
            : {
                opacity: 0,
                rotate: -5,
                y: 12,
              }
        }
        animate={{
          opacity: 1,
          rotate: -2,
          y: 0,
        }}
        transition={{
          delay: 0.15,
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* back paper */}
        <div className="absolute inset-3 rotate-[6deg] rounded-sm border border-wine/10 bg-cream shadow-[0_8px_20px_rgba(91,51,57,.08)]" />

        {/* main paper */}
        <div className="absolute inset-0 overflow-hidden rounded-sm border border-wine/10 bg-paper shadow-[0_14px_30px_rgba(91,51,57,.12)]">
          <div className="absolute inset-3 border border-dashed border-rose/20" />

          {/* abstract puzzle pieces */}
          <div className="absolute left-7 top-7 size-12 rounded-[35%] border border-rose/20 bg-blush/35" />
          <div className="absolute right-7 top-9 size-10 rounded-[35%] border border-peach/30 bg-peach/30" />
          <div className="absolute bottom-7 left-10 size-9 rounded-[35%] border border-rose/15 bg-rose/10" />
          <div className="absolute bottom-6 right-9 size-12 rounded-[35%] border border-wine/10 bg-cream" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="grid size-11 place-items-center rounded-full bg-paper/80 shadow-sm">
              <HeartMark small />
            </div>
          </div>
        </div>

        {/* tape */}
        <div
          aria-hidden="true"
          className="absolute -top-2 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-2deg] bg-peach/50 shadow-sm"
        />
      </motion.div>

      {/* heading */}
      <motion.p
        className="handwritten mb-3 text-lg text-rose"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.55 }}
      >
        one little memory
      </motion.p>

      <motion.h2
        className="max-w-md font-display text-4xl leading-[0.95] tracking-[-0.035em] text-wine sm:text-5xl"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        One photo, many pieces.
      </motion.h2>

      <motion.p
        className="mt-5 max-w-sm text-sm leading-6 text-ink/55"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52, duration: 0.55 }}
      >
        {relationshipConfig.puzzle.introText}
      </motion.p>

      {/* start button */}
      <motion.button
        type="button"
        data-romantic-interactive
        onClick={onStart}
        className="group relative mt-8 overflow-hidden rounded-full border border-wine/15 bg-wine px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-paper shadow-[0_10px_25px_rgba(91,51,57,.14)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.55 }}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
      >
        <span className="relative z-10">
          put the pieces together ♡
        </span>

        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-rose/20 transition-transform duration-500 group-hover:translate-x-0"
        />
      </motion.button>

      <motion.p
        className="mt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-ink/30"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        16 little pieces · one memory
      </motion.p>
    </motion.div>
  );
}