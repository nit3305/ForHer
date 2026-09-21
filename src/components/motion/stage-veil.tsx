"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  motionDurations,
  motionEasings,
} from "@/lib/motion";

export function StageVeil({ stage }: { stage: number }) {
  const reducedMotion = useReducedMotion() ?? false;

  const directions = {
    1: {
      x: "-18%",
      y: "2%",
      scale: 1,
      rotate: "-1deg",
    },
    2: {
      x: "8%",
      y: "-3%",
      scale: 0.92,
      rotate: "1deg",
    },
    3: {
      x: "-8%",
      y: "6%",
      scale: 0.96,
      rotate: "-0.6deg",
    },
    4: {
      x: "12%",
      y: "-2%",
      scale: 0.94,
      rotate: "0.8deg",
    },
    5: {
      x: "0%",
      y: "3%",
      scale: 1.02,
      rotate: "-0.4deg",
    },
  } as const;

  const start =
    directions[stage as keyof typeof directions] ?? directions[1];

  return (
    <motion.div
      key={stage}
      aria-hidden="true"
      className={`stage-veil stage-veil-${stage}`}
      initial={{
        opacity: 0,
        x: reducedMotion ? "0%" : start.x,
        y: reducedMotion ? "0%" : start.y,
        scale: reducedMotion ? 1 : start.scale,
        rotate: reducedMotion ? 0 : start.rotate,
      }}
      animate={{
        opacity: [
          0,
          reducedMotion ? 0.05 : stage === 5 ? 0.3 : 0.16,
          0,
        ],
        x: "0%",
        y: "0%",
        scale: 1,
        rotate: 0,
      }}
      transition={{
        duration: reducedMotion
          ? 0.18
          : motionDurations.page,
        ease: motionEasings.cinematic,
      }}
    />
  );
}