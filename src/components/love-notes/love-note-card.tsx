"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LoveReason } from "@/config/relationship";
import { motionDurations, motionEasings } from "@/lib/motion";
import { LoveNoteLayout } from "./love-note-layouts";
import { ReasonReveal } from "./reason-reveal";

export function LoveNoteCard({ reason, opened, reducedMotion, onOpen }: { reason: LoveReason; opened: boolean; reducedMotion: boolean; onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  function beginOpening() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, reducedMotion ? 80 : 720);
  }

  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div key="sealed" exit={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : .985 }} transition={{ duration: reducedMotion ? .08 : motionDurations.standard, ease: motionEasings.exit }} className="mx-auto flex min-h-[480px] max-w-3xl items-center justify-center px-3">
          <ReasonReveal reason={reason} reducedMotion={reducedMotion} opening={opening} onReveal={beginOpening} />
        </motion.div>
      ) : (
        <motion.div key="opened" initial={{ opacity: 0, y: reducedMotion ? 0 : 16, filter: reducedMotion ? "blur(0px)" : "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: reducedMotion ? .1 : motionDurations.reveal, ease: motionEasings.enter }} className="w-full" aria-live="polite">
          <LoveNoteLayout reason={reason} reducedMotion={reducedMotion} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
