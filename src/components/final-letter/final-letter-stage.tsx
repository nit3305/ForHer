"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { FinalLetterReader } from "./final-letter-reader";
import { FinaleGift } from "./finale-gift";
import { motionDurations, motionEasings } from "@/lib/motion";

type Stage5Step = "keepsakes" | "letter";

export function FinalLetterStage({
  onRestart,
}: {
  onRestart: () => void;
}) {
  const [begun, setBegun] = useState(false);
  const [step, setStep] = useState<Stage5Step>("keepsakes");
  const reducedMotion = useReducedMotion() ?? false;
  const config = relationshipConfig.finalLetter;

  return (
    <section className="final-letter-stage relative isolate min-h-[78svh] w-full overflow-hidden rounded-[1.2rem] border border-wine/10 bg-cream px-3 py-7 text-ink shadow-[0_24px_70px_rgba(91,51,57,.12)] sm:px-8 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(184,95,114,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(184,95,114,.055)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <AnimatePresence mode="wait">
        {!begun ? (
          <motion.div
            key="letter-intro"
            className="flex min-h-[70svh] flex-col items-center justify-center px-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              filter: reducedMotion ? "blur(0px)" : "blur(3px)",
            }}
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 1 }}
              className="mb-10 h-px w-24 bg-rose/35"
            />

            <motion.p
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 10,
                filter: reducedMotion ? "blur(0px)" : "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                delay: reducedMotion ? 0 : 0.3,
                duration: reducedMotion ? 0.1 : motionDurations.reveal,
                ease: motionEasings.cinematic,
              }}
              className="font-display text-4xl leading-tight text-wine sm:text-5xl"
            >
              {config.intro.lineOne}
            </motion.p>

            <motion.p
              initial={{
                opacity: 0,
                filter: reducedMotion ? "blur(0px)" : "blur(5px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                delay: reducedMotion ? 0 : 1.05,
                duration: reducedMotion ? 0.1 : motionDurations.emotional,
                ease: motionEasings.cinematic,
              }}
              className="mt-5 max-w-xl font-display text-2xl italic leading-9 text-rose sm:text-3xl"
            >
              {config.intro.lineTwo}
            </motion.p>

            <motion.button
              type="button"
              onClick={() => setBegun(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 1.7 }}
              className="paper-button mt-10 min-h-12 px-7 font-display text-xl italic text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
            >
              {config.intro.beginLabel}{" "}
              <span className="cinematic-arrow" aria-hidden="true">
                →
              </span>
            </motion.button>
          </motion.div>
        ) : step === "keepsakes" ? (
          <motion.div
            key="keepsakes"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.1 : 0.65,
              ease: motionEasings.enter,
            }}
            className="space-y-8"
          >
            <div className="text-center">
              <p className="handwritten text-lg text-rose">
                the last little box
              </p>

              <h2 className="mt-2 font-display text-4xl text-wine sm:text-5xl">
                A few more things I saved for you.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/55">
                Some photographs, some time together, and then one final
                letter.
              </p>
            </div>

            <FinaleGift />

            <div className="flex justify-center pb-6">
              <button
                type="button"
                onClick={() => setStep("letter")}
                className="paper-button min-h-12 px-7 font-display text-lg italic text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
              >
                Read my letter →
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.1 : 0.7,
              ease: motionEasings.enter,
            }}
          >
            <FinalLetterReader onRestart={onRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}