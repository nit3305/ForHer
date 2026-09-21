"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { PaperTape } from "@/components/ui/scrapbook-decor";
import { motionSprings } from "@/lib/motion";

export function PhotoBoothStrip() {
  const config = relationshipConfig.finale.photoBooth;
  const [countdown, setCountdown] = useState<number | "heart" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (countdown === null || revealed) return;
    const timer = window.setTimeout(() => {
      if (countdown === 3) setCountdown(2);
      else if (countdown === 2) setCountdown(1);
      else if (countdown === 1) setCountdown("heart");
      else setRevealed(true);
    }, countdown === "heart" ? 450 : 520);
    return () => window.clearTimeout(timer);
  }, [countdown, reducedMotion, revealed]);

  if (!config.enabled) return null;

  return (
    <section className="keepsake-section photo-booth-page relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-8 sm:py-20" aria-labelledby="photo-booth-title">
      <p className="handwritten text-lg text-rose">{config.eyebrow}</p>
      <h2 id="photo-booth-title" className="mt-2 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-none text-wine">{config.heading}</h2>
      <div className="mt-8 grid min-h-[28rem] place-items-center">
        {!revealed && countdown === null && <button type="button" onClick={() => reducedMotion ? setRevealed(true) : setCountdown(3)} className="paper-button min-h-12 px-7 py-3 font-display text-lg italic text-wine">{config.buttonLabel}</button>}
        {!revealed && countdown !== null && <AnimatePresence mode="wait"><motion.span key={countdown} initial={{ opacity: 0, scale: reducedMotion ? 1 : .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.08 }} className="font-display text-8xl text-rose">{countdown === "heart" ? "♡" : countdown}</motion.span></AnimatePresence>}
        {revealed && (
          <motion.figure initial={{ opacity: 0, y: reducedMotion ? 0 : -45 }} animate={{ opacity: 1, y: 0, rotate: -1 }} transition={motionSprings.photograph} className="photo-booth-strip relative w-[min(78vw,17rem)] bg-paper p-3 pb-8 shadow-[0_20px_45px_rgba(91,51,57,.14)]">
            <PaperTape className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rotate-2" />
            <div className="space-y-2">
              {config.images.map((image) => <div key={image.alt} className="relative aspect-[4/3] overflow-hidden bg-blush/30"><Image src={image.src} alt={image.alt} fill sizes="272px" className="object-cover" /></div>)}
            </div>
            <figcaption className="handwritten mt-5 text-sm text-wine/70">{config.caption}</figcaption>
          </motion.figure>
        )}
      </div>
      {countdown !== null && !revealed && <p className="mt-3 text-xs text-ink/40">{config.developingLabel}</p>}
    </section>
  );
}
