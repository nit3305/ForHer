"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { MemoryProgress } from "./memory-progress";
import { MemoryScene } from "./memory-scene";

export function MemoryJourney({ onComplete }: { onComplete: () => void }) {
  const config = relationshipConfig.timeline;
  const memories = config.memories;

  const [current, setCurrent] = useState(0);
  const [highestVisited, setHighestVisited] = useState(0);
  const [direction, setDirection] = useState(1);
  const [finalCopyVisible, setFinalCopyVisible] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);

  const reducedMotion = useReducedMotion() ?? false;
  const memory = memories[current];
  const isFinal = current === memories.length - 1;
  const atmosphereImage = memory.images?.[0];

  useEffect(() => {
    if (!isFinal) {
      setFinalCopyVisible(false);
      return;
    }

    const timer = window.setTimeout(
      () => setFinalCopyVisible(true),
      reducedMotion ? 100 : 1300,
    );

    return () => window.clearTimeout(timer);
  }, [isFinal, reducedMotion]);

  function navigate(next: number) {
    if (
      next < 0 ||
      next >= memories.length ||
      next > highestVisited + 1
    ) {
      return;
    }

    setDirection(next >= current ? 1 : -1);
    setFinalCopyVisible(false);
    setInteractionComplete(false);
    setCurrent(next);
    setHighestVisited((value) => Math.max(value, next));
  }

  return (
    <div className="memory-book relative isolate min-h-[78svh] w-full overflow-hidden rounded-sm border border-wine/10 px-3 py-5 shadow-[0_22px_65px_rgba(91,51,57,.1)] sm:px-7 sm:py-8">
      <AnimatePresence mode="wait">
        {atmosphereImage && (
          <motion.div
            key={atmosphereImage.src + memory.id}
            className="pointer-events-none absolute -inset-16 -z-20 opacity-[.09] blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.09 }}
            exit={{ opacity: 0 }}
          >
            <Image
              src={atmosphereImage.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.74),rgba(251,245,238,.9)_68%)]" />

      <MemoryProgress
        current={current}
        highestVisited={highestVisited}
        total={memories.length}
        onSelect={navigate}
      />

      <p className="mt-3 text-center text-[8px] font-bold uppercase tracking-[.22em] text-ink/30">
        {config.contentNote}
      </p>

      <div className="mx-auto flex min-h-[58svh] max-w-6xl items-center py-7 sm:py-10">
        <AnimatePresence mode="wait" custom={direction}>
          <MemoryScene
            key={memory.id}
            memory={memory}
            direction={direction}
            reducedMotion={reducedMotion}
            onInteractionComplete={() => setInteractionComplete(true)}
          />
        </AnimatePresence>
      </div>

      <div
        className={`relative z-20 mx-auto flex min-h-14 max-w-5xl items-center ${
          current > 0 ? "justify-between" : "justify-end"
        }`}
      >
        {current > 0 && (
          <button
            type="button"
            onClick={() => navigate(current - 1)}
            className="handwritten min-h-11 px-3 text-sm text-ink/55 transition hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
          >
            {config.previousLabel}
          </button>
        )}

        {!isFinal && (
          <button
            type="button"
            onClick={() => navigate(current + 1)}
            disabled={!interactionComplete}
            className={`paper-button min-h-11 px-6 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-wine ${
              interactionComplete
                ? "text-wine"
                : "cursor-not-allowed text-wine/30 opacity-50"
            }`}
          >
            {interactionComplete
              ? config.nextLabel
              : "interact first ♡"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFinal && finalCopyVisible && (
          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative z-20 mx-auto mt-6 max-w-xl pb-4 text-center"
            aria-live="polite"
          >
            <p className="font-display text-3xl italic text-wine sm:text-4xl">
              {config.completionFirstLine}
            </p>

            <p className="mt-3 text-sm leading-7 text-ink/55">
              {config.completionSecondLine}
            </p>

            <button
              type="button"
              onClick={onComplete}
              className="mt-6 rounded-full bg-wine px-8 py-4 text-sm font-bold text-white shadow-[0_14px_35px_rgba(127,57,72,.22)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
            >
              {config.continueButtonLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}