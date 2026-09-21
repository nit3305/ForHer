"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LoveReason } from "@/config/relationship";
import { motionDurations, motionEasings } from "@/lib/motion";
import { LoveNoteLayout } from "./love-note-layouts";
import { ReasonReveal } from "./reason-reveal";

type Props = {
  reason: LoveReason;
  opened: boolean;
  reducedMotion: boolean;
  onOpen: () => void;
};

export function LoveNoteCard({
  reason,
  opened,
  reducedMotion,
  onOpen,
}: Props) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    return () => {
      setOpening(false);
    };
  }, [reason.id]);

  function beginOpening() {
    if (opening || opened) return;

    setOpening(true);

    window.setTimeout(
      () => {
        onOpen();
        setOpening(false);
      },
      reducedMotion ? 80 : 720,
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div
          key={`sealed-${reason.id}`}
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: reducedMotion ? 0 : -12,
            scale: reducedMotion ? 1 : 0.985,
          }}
          transition={{
            duration: reducedMotion ? 0.08 : motionDurations.standard,
            ease: motionEasings.exit,
          }}
          className="mx-auto flex min-h-[480px] max-w-3xl items-center justify-center px-3"
        >
          <div
            className={`w-full transition-transform ${
              opening && !reducedMotion
                ? "scale-[1.015]"
                : ""
            }`}
          >
            <ReasonReveal
              reason={reason}
              reducedMotion={reducedMotion}
              opening={opening}
              onReveal={beginOpening}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={`opened-${reason.id}`}
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 16,
            filter: reducedMotion ? "blur(0px)" : "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: reducedMotion ? 0.1 : motionDurations.reveal,
            ease: motionEasings.enter,
          }}
          className="w-full"
          aria-live="polite"
        >
          <LoveNoteLayout
            reason={reason}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}