"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionDurations, motionEasings } from "@/lib/motion";

const stagePositions = {
  1: {
    x: "-34vw",
    y: "-28vh",
    color: "rgba(228, 159, 150, .18)",
  },
  2: {
    x: "20vw",
    y: "-20vh",
    color: "rgba(226, 172, 139, .14)",
  },
  3: {
    x: "-20vw",
    y: "16vh",
    color: "rgba(208, 135, 146, .13)",
  },
  4: {
    x: "24vw",
    y: "20vh",
    color: "rgba(221, 154, 131, .15)",
  },
  5: {
    x: "0vw",
    y: "28vh",
    color: "rgba(216, 137, 148, .1)",
  },
} as const;

export function AmbientAtmosphere({
  stage,
}: {
  stage: 1 | 2 | 3 | 4 | 5;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const position = stagePositions[stage];

  return (
    <div
      className={`ambient-atmosphere ambient-stage-${stage}`}
      aria-hidden="true"
    >
      <motion.span
        className="ambient-bloom ambient-bloom-primary"
        animate={{
          opacity: stage === 5 ? 0.18 : 0.28,
          scale: stage === 3 ? 1.035 : 1,
        }}
        transition={{
          duration: reducedMotion ? 0.12 : motionDurations.cinematic,
          ease: motionEasings.cinematic,
        }}
      />

      <motion.span
        className="traveling-light"
        animate={{
          x: position.x,
          y: position.y,
          backgroundColor: position.color,
          opacity: stage === 5 ? 0.1 : 0.15,
        }}
        transition={{
          duration: reducedMotion ? 0.12 : 1.2,
          ease: motionEasings.cinematic,
        }}
      />
    </div>
  );
}