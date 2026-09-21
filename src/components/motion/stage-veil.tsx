"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionDurations, motionEasings } from "@/lib/motion";

export function StageVeil({ stage }: { stage: number }) {
  const reducedMotion = useReducedMotion() ?? false;
  const directions = {
    1: { x: "-24%", y: "0%", scale: 1 },
    2: { x: "0%", y: "0%", scale: .76 },
    3: { x: "-10%", y: "8%", scale: .94 },
    4: { x: "18%", y: "-4%", scale: .9 },
    5: { x: "0%", y: "0%", scale: 1.08 },
  } as const;
  const start = directions[stage as keyof typeof directions] ?? directions[1];

  return (
    <motion.div
      key={stage}
      aria-hidden="true"
      className={`stage-veil stage-veil-${stage}`}
      initial={{ opacity: 0, x: reducedMotion ? "0%" : start.x, y: reducedMotion ? "0%" : start.y, scale: reducedMotion ? 1 : start.scale }}
      animate={{ opacity: [0, reducedMotion ? 0.1 : stage === 5 ? .46 : 0.28, 0], x: "0%", y: "0%", scale: 1 }}
      transition={{ duration: reducedMotion ? 0.18 : motionDurations.cinematic, ease: motionEasings.cinematic }}
    />
  );
}
