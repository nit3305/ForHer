"use client";

import { motion, useReducedMotion } from "motion/react";

type HeartMarkProps = { filled?: boolean; pulse?: boolean; small?: boolean };

export function HeartMark({ filled = true, pulse = false, small = false }: HeartMarkProps) {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <motion.span
      aria-hidden="true"
      className={`heart block ${small ? "scale-50" : ""} ${filled ? "bg-rose" : "bg-blush/45"}`}
      animate={pulse && !reducedMotion ? { scale: [1, 1.1, 1] } : undefined}
      transition={pulse && !reducedMotion ? { duration: .72, ease: [0.22, 1, 0.36, 1] } : undefined}
    />
  );
}
