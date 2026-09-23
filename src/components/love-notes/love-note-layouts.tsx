"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { LoveReason } from "@/config/relationship";
import { motionDurations, motionEasings } from "@/lib/motion";

function ReasonCopy({
  reason,
  centered = true,
  light = false,
  delay = 0.22,
}: {
  reason: LoveReason;
  centered?: boolean;
  light?: boolean;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 10,
        filter: reducedMotion ? "blur(0px)" : "blur(4px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        delay: reducedMotion ? 0 : delay,
        duration: reducedMotion ? 0.1 : motionDurations.reveal,
        ease: motionEasings.enter,
      }}
      className={`${
        centered ? "mx-auto text-center" : "text-left"
      } max-w-2xl`}
    >
      {reason.eyebrow && (
        <p
          className={`text-[9px] font-bold uppercase tracking-[.28em] ${
            light ? "text-blush" : "text-rose"
          }`}
        >
          {reason.eyebrow}
        </p>
      )}

      {reason.title && (
        <h2
          className={`mt-3 font-display text-3xl leading-none sm:text-4xl ${
            light ? "text-white" : "text-wine"
          }`}
        >
          {reason.title}
        </h2>
      )}

      {/* Main reason text */}
      <p
        className={`mt-5 font-display text-base leading-7 sm:text-lg sm:leading-8 ${
          light ? "text-white/90" : "text-ink/85"
        }`}
      >
        {reason.message}
      </p>

      {reason.tinyCaption && (
        <p
          className={`mt-5 font-display text-base italic sm:text-lg ${
            light ? "text-blush/80" : "text-rose/70"
          }`}
        >
          {reason.tinyCaption}
        </p>
      )}
    </motion.div>
  );
}

export function LoveNoteLayout({
  reason,
  reducedMotion,
}: {
  reason: LoveReason;
  reducedMotion: boolean;
}) {
  switch (reason.layout) {
    case "minimal":
      return (
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto flex min-h-[430px] max-w-3xl items-center rounded-[1.5rem] bg-paper/95 px-7 py-12 shadow-[0_24px_70px_rgba(91,51,57,.13)] sm:px-14"
        >
          <ReasonCopy reason={reason} delay={0.12} />
        </motion.div>
      );

    case "envelope":
      return (
        <div className="relative mx-auto max-w-3xl pt-14">
          <div
            aria-hidden="true"
            className="absolute inset-x-[8%] top-4 h-48 origin-bottom -skew-y-3 rounded-t-2xl bg-[#e8c7c4] opacity-70"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 38,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.55,
            }}
            className="relative min-h-[410px] rounded-md bg-[#fffaf0] px-7 py-12 shadow-[0_26px_70px_rgba(91,51,57,.17)] sm:px-14"
          >
            <ReasonCopy reason={reason} delay={0.32} />
          </motion.div>
        </div>
      );

    case "photo-note":
      return (
        <div className="mx-auto grid max-w-4xl items-center gap-7 rounded-[1.5rem] bg-paper/95 p-6 shadow-[0_24px_70px_rgba(91,51,57,.14)] sm:p-9 md:grid-cols-[.9fr_1.1fr] md:gap-10">
          {reason.image && (
            <motion.figure
              initial={{
                opacity: 0,
                rotate: -4,
              }}
              animate={{
                opacity: 1,
                rotate: -2,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
              }}
              className="relative mx-auto aspect-[4/5] w-[72%] overflow-hidden border-[7px] border-white shadow-[0_18px_40px_rgba(91,51,57,.18)] md:w-full"
            >
              <Image
                src={reason.image.src}
                alt={reason.image.alt}
                fill
                sizes="(max-width: 768px) 70vw, 380px"
                className="object-cover"
              />
            </motion.figure>
          )}

          <ReasonCopy
            reason={reason}
            centered={false}
            delay={0.28}
          />
        </div>
      );

    case "letter":
      return (
        <motion.div
          initial={{
            opacity: 0,
            scale: reducedMotion ? 1 : 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative mx-auto min-h-[460px] max-w-3xl overflow-hidden rounded-sm bg-[#fffaf0] px-7 py-12 shadow-[0_26px_75px_rgba(91,51,57,.14)] sm:px-16"
        >
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-9 top-0 w-px bg-rose/15"
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-24 h-px bg-rose/10 shadow-[0_32px_0_rgba(189,110,124,.1),0_64px_0_rgba(189,110,124,.1),0_96px_0_rgba(189,110,124,.1)]"
          />

          <div className="relative flex min-h-[350px] items-center">
            <ReasonCopy
              reason={reason}
              centered={false}
              delay={0.26}
            />
          </div>
        </motion.div>
      );

    case "playful":
      return (
        <div className="relative mx-auto max-w-3xl px-3 py-7">
          <div
            aria-hidden="true"
            className="absolute inset-8 rotate-3 rounded-xl bg-blush/45"
          />

          <motion.div
            initial={{
              opacity: 0,
              rotate: -3,
              y: reducedMotion ? 0 : 18,
            }}
            animate={{
              opacity: 1,
              rotate: -1,
              y: 0,
            }}
            className="relative flex min-h-[420px] items-center rounded-xl bg-paper px-7 py-12 shadow-[0_24px_65px_rgba(91,51,57,.14)] sm:px-14"
          >
            <ReasonCopy reason={reason} delay={0.18} />
          </motion.div>
        </div>
      );

    case "deep":
      return (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.8,
          }}
          className="mx-auto flex min-h-[58svh] max-w-4xl items-center rounded-sm border border-wine/10 bg-baby-pink px-7 py-14 shadow-[0_24px_65px_rgba(91,51,57,.16)] sm:px-16"
        >
          <ReasonCopy reason={reason} delay={0.55} />
        </motion.div>
      );
  }
}