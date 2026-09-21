"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionDurations, motionEasings } from "@/lib/motion";

const stagePositions = {
  1: { x: "-38vw", y: "-32vh", color: "rgba(228, 159, 150, .34)" },
  2: { x: "22vw", y: "-23vh", color: "rgba(226, 172, 139, .25)" },
  3: { x: "-22vw", y: "18vh", color: "rgba(208, 135, 146, .22)" },
  4: { x: "27vw", y: "22vh", color: "rgba(221, 154, 131, .24)" },
  5: { x: "2vw", y: "34vh", color: "rgba(216, 137, 148, .17)" },
} as const;

export function AmbientAtmosphere({ stage }: { stage: 1 | 2 | 3 | 4 | 5 }) {
  const reducedMotion = useReducedMotion() ?? false;
  const position = stagePositions[stage];

  return (
    <div className={`ambient-atmosphere ambient-stage-${stage}`} aria-hidden="true">
      <motion.span
        className="ambient-bloom ambient-bloom-primary"
        animate={{ opacity: stage === 5 ? 0.3 : 0.48, scale: stage === 3 ? 1.08 : 1 }}
        transition={{ duration: reducedMotion ? 0.12 : motionDurations.cinematic, ease: motionEasings.cinematic }}
      />
      <motion.span className="traveling-light" animate={{ x: position.x, y: position.y, backgroundColor: position.color, opacity: stage === 5 ? 0.18 : 0.28 }} transition={{ duration: reducedMotion ? 0.12 : .7, ease: motionEasings.cinematic }} />
    </div>
  );
}
