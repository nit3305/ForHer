"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { relationshipConfig, relationshipPin } from "@/config/relationship";
import { HeartMark } from "@/components/ui/heart-mark";
import { motionDurations, motionEasings, motionSprings } from "@/lib/motion";

type HeartKeypadProps = { onUnlock: () => void };
const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "backspace"];

export function HeartKeypad({ onUnlock }: HeartKeypadProps) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "accepted">("idle");
  const reducedMotion = useReducedMotion() ?? false;

  function press(key: string) {
    setStatus("idle");
    if (key === "clear") return setPin("");
    if (key === "backspace") return setPin((current) => current.slice(0, -1));
    setPin((current) => current.length < relationshipPin.length ? current + key : current);
  }

  function unlock() {
    if (pin === relationshipPin) {
      setStatus("accepted");
      window.setTimeout(onUnlock, reducedMotion ? 100 : 620);
      return;
    }
    setStatus("error");
    setTimeout(() => { setPin(""); setStatus("idle"); }, 650);
  }

  return (
    <div className="diary-lock mx-auto w-full max-w-sm rounded-sm bg-paper px-5 py-8 text-center shadow-[0_18px_50px_rgba(91,51,57,.11)] sm:px-9 sm:py-10">
      <p className="handwritten text-lg text-rose">{relationshipConfig.openingWhisper}</p>
      <h1 className="mx-auto mt-2 max-w-xs text-balance font-display text-4xl leading-[.95] text-wine">{relationshipConfig.welcomeTitle}</h1>
      <div className="mx-auto my-7 grid size-12 place-items-center rounded-full bg-blush/30"><HeartMark pulse={!reducedMotion} small /></div>
      <h2 className="mt-3 font-display text-2xl leading-none text-wine sm:text-3xl">{relationshipConfig.pinTitle}</h2>

      <motion.div
        className="mt-8 flex min-h-9 flex-wrap items-center justify-center gap-x-3 gap-y-4"
        animate={status === "error" ? { x: reducedMotion ? 0 : [0, -5, 4, -2, 0] } : status === "accepted" ? { scale: reducedMotion ? 1 : [1, 1.07, 1] } : { x: 0, scale: 1 }}
        transition={status === "accepted" ? { duration: motionDurations.emotional, ease: motionEasings.cinematic } : { duration: .3, ease: motionEasings.move }}
        role="status"
        aria-label={`${pin.length} of ${relationshipPin.length} PIN digits entered`}
      >
        {Array.from({ length: relationshipPin.length }, (_, index) => (
          <motion.span key={index} animate={index === pin.length - 1 && pin.length > 0 ? { scale: reducedMotion ? 1 : [1, 1.14, 1] } : undefined} transition={{ duration: reducedMotion ? 0 : .28, ease: motionEasings.enter }}>
            <HeartMark filled={index < pin.length} small={relationshipPin.length > 6} pulse={status === "accepted" && index === pin.length - 1} />
          </motion.span>
        ))}
      </motion.div>
      <p aria-live="polite" className={`mt-4 min-h-5 text-xs ${status === "error" ? "text-red-700" : "text-ink/40"}`}>
        {status === "error" ? "Not quite the key to this heart. Try again." : status === "accepted" ? relationshipConfig.playfulness.pinSuccess : `${relationshipPin.length} digits hold the key.`}
      </p>

      <div className="mx-auto mt-5 grid max-w-[280px] grid-cols-3 gap-3">
        {keys.map((key) => (
          <motion.button
            type="button"
            key={key}
            onClick={() => press(key)}
            aria-label={key === "backspace" ? "Delete last digit" : key === "clear" ? "Clear PIN" : `Digit ${key}`}
            disabled={status === "accepted"}
            whileTap={reducedMotion ? undefined : { scale: .94 }}
            transition={motionSprings.tactile}
            className="keypad-key grid aspect-square place-items-center rounded-full border border-rose/20 bg-paper text-lg font-semibold text-ink shadow-[0_5px_12px_rgba(91,51,57,.07)] hover:border-rose/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
          >
            {key === "backspace" ? "⌫" : key === "clear" ? <span className="text-[10px] uppercase tracking-wider">clear</span> : key}
          </motion.button>
        ))}
      </div>
      <button
        type="button"
        onClick={unlock}
        disabled={pin.length !== relationshipPin.length || status !== "idle"}
        className="paper-button mt-6 w-full px-6 py-4 text-sm font-bold text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine disabled:cursor-not-allowed disabled:opacity-35"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={status === "accepted" ? "accepted" : "idle"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {status === "accepted" ? "Opening…" : "Open our story"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
