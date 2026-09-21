"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { HeartMark } from "@/components/ui/heart-mark";
import { StageIndicator } from "./stage-indicator";
import { HeartKeypad } from "./heart-keypad";
import { JigsawIntro } from "@/components/jigsaw/jigsaw-intro";
import { JigsawPuzzle } from "@/components/jigsaw/jigsaw-puzzle";
import { DevelopmentStage, StageBypass } from "@/components/development/stage-bypass";
import { TimelineStage } from "@/components/timeline/timeline-stage";
import { LoveNotesStage } from "@/components/love-notes/love-notes-stage";
import { FinalLetterStage } from "@/components/final-letter/final-letter-stage";
import { AmbientAtmosphere } from "@/components/motion/ambient-atmosphere";
import { StageVeil } from "@/components/motion/stage-veil";
import { motionEasings, stageTransition } from "@/lib/motion";
import { RomanticCursor } from "@/components/interactions/romantic-cursor";
import { PaperTape } from "@/components/ui/scrapbook-decor";

type View = "pin" | "complete" | "puzzleIntro" | "puzzle" | "stage3" | "stage4" | "stage5";

export function RelationshipExperience() {
  const [view, setView] = useState<View>("pin");
  const reducedMotion = useReducedMotion() ?? false;
  const isPuzzleStage = view === "puzzleIntro" || view === "puzzle";
  const isTimelineStage = view === "stage3";
  const isLoveNotesStage = view === "stage4";
  const isFinalLetterStage = view === "stage5";
  const isImmersiveStage = isTimelineStage || isLoveNotesStage || isFinalLetterStage;
  const activeStage = isPuzzleStage ? 1 : view === "stage3" ? 2 : view === "stage4" ? 3 : view === "stage5" ? 4 : 0;
  const developmentStage: DevelopmentStage = activeStage + 1 as DevelopmentStage;
  const stage = developmentStage;
  const viewVariants = stageTransition(reducedMotion);
  const isGate = view === "pin" || view === "complete";
  const shellHeading = isPuzzleStage ? ["One photo,", "many pieces."] : ["A little gift,", "made for you."];
  const shellCopy = isPuzzleStage ? relationshipConfig.puzzle.introText : relationshipConfig.welcomeCopy;

  function goTo(nextView: View) {
    setView(nextView);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  }

  function jumpToDevelopmentStage(stage: DevelopmentStage) {
    if (process.env.NODE_ENV !== "development") return;
    const stageViews: Record<DevelopmentStage, View> = {
      1: "pin",
      2: "puzzleIntro",
      3: "stage3",
      4: "stage4",
      5: "stage5",
    };
    goTo(stageViews[stage]);
  }

  function unlockGift() {
    goTo("complete");
    window.setTimeout(() => goTo("puzzleIntro"), reducedMotion ? 180 : 900);
  }

  if (isGate) {
    return (
      <main className="paper-grain relative grid min-h-svh place-items-center overflow-x-clip bg-cream px-4 py-10">
        <RomanticCursor />
        <section className="relative z-10 w-full max-w-md" aria-label="Private gift entrance">
          {view === "pin" ? (
            <HeartKeypad onUnlock={unlockGift} />
          ) : (
            <motion.div className="flex min-h-[24rem] flex-col items-center justify-center text-center" initial={{ opacity: 0, scale: reducedMotion ? 1 : .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? .08 : .28, ease: motionEasings.enter }} aria-live="polite">
              <HeartMark pulse={!reducedMotion} />
              <h1 className="mt-8 text-balance font-display text-4xl leading-none text-wine sm:text-5xl">{relationshipConfig.successTitle}</h1>
              <p className="mt-4 max-w-xs text-sm leading-6 text-ink/55">{relationshipConfig.successCopy}</p>
            </motion.div>
          )}
        </section>
        {process.env.NODE_ENV === "development" && <StageBypass currentStage={1} onJump={jumpToDevelopmentStage} />}
      </main>
    );
  }

  return (
    <main className={`paper-grain experience-shell relative min-h-svh overflow-x-clip px-3 py-4 sm:px-8 sm:py-8 stage-${stage}`}>
      <RomanticCursor />
      <AmbientAtmosphere stage={stage} />
      <StageVeil stage={stage} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3rem)] max-w-6xl flex-col sm:min-h-[calc(100svh-4rem)]">
        <header className="gift-header flex items-center justify-between border-b border-dashed border-rose/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center"><HeartMark small /></div>
            <span className="handwritten text-lg text-wine">for you, always</span>
          </div>
          <span className="hidden text-[8px] font-bold uppercase tracking-[.22em] text-ink/40 sm:inline">{relationshipConfig.scrapbook.collectionLabel}</span>
        </header>

        <section className={`${isImmersiveStage ? "block" : "grid items-center lg:grid-cols-[.9fr_1.1fr] lg:gap-20"} flex-1 gap-10 py-10`}>
          <div className={`${isImmersiveStage ? "hidden" : "relative block"} max-w-xl`}>
            <p className="handwritten mb-4 text-lg text-rose">{relationshipConfig.openingWhisper}</p>
            <h1 className="font-display text-[clamp(3.25rem,7vw,6.2rem)] leading-[.86] font-medium tracking-[-.04em] text-wine">
              <span className="block">{shellHeading[0]}</span><span className="block italic text-rose">{shellHeading[1]}</span>
            </h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-ink/58 sm:text-base">{shellCopy}</p>
            <p className="handwritten mt-4 rotate-[-2deg] text-sm text-rose/70">{relationshipConfig.scrapbook.handwrittenArrow} ↗</p>
            <div className="mt-9 hidden lg:block"><StageIndicator activeStage={activeStage} /></div>
          </div>

          <div className={`relative mx-auto w-full ${isImmersiveStage ? "max-w-5xl" : "max-w-xl"}`}>
            {!isImmersiveStage && <div aria-hidden="true" className="absolute -inset-2 rotate-1 rounded-sm bg-peach/30 shadow-sm" />}
            <motion.div layout className={isImmersiveStage ? "relative" : `gift-card relative min-h-[440px] rounded-sm border border-wine/10 bg-paper shadow-[0_24px_60px_rgba(91,51,57,.13)] ${isPuzzleStage ? "puzzle-worktable p-4 sm:p-7" : "p-7 sm:p-10"}`}>
              {!isImmersiveStage && <PaperTape className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rotate-1" />}
              <div className="relative">
                {view === "puzzleIntro" && <JigsawIntro key="jigsaw-intro" onStart={() => goTo("puzzle")} />}
                {view === "puzzle" && <motion.div key="jigsaw" variants={viewVariants} initial="hidden" animate="visible" exit="exit"><JigsawPuzzle onContinue={() => goTo("stage3")} /></motion.div>}
                {view === "stage3" && (
                  <motion.div key="stage3" variants={viewVariants} initial="hidden" animate="visible" exit="exit">
                    <TimelineStage onComplete={() => goTo("stage4")} />
                  </motion.div>
                )}
                {view === "stage4" && (
                  <motion.div key="stage4" variants={viewVariants} initial="hidden" animate="visible" exit="exit">
                    <LoveNotesStage onComplete={() => goTo("stage5")} />
                  </motion.div>
                )}
                {view === "stage5" && (
                  <motion.div key="stage5" variants={viewVariants} initial="hidden" animate="visible" exit="exit">
                    <FinalLetterStage onRestart={() => goTo("pin")} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
          {!isImmersiveStage && <div className="lg:hidden"><StageIndicator activeStage={activeStage} /></div>}
        </section>
        <footer className="flex items-center justify-between gap-5 border-t border-rose/15 pt-5 text-[7px] font-bold uppercase tracking-[.15em] text-ink/35 sm:text-[9px] sm:tracking-[.22em]">
          <span>{relationshipConfig.scrapbook.footerLeft}</span><span>{relationshipConfig.scrapbook.footerRight}</span>
        </footer>
      </div>
      {process.env.NODE_ENV === "development" && (
        <StageBypass currentStage={developmentStage} onJump={jumpToDevelopmentStage} />
      )}
    </main>
  );
}
