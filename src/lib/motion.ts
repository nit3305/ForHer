import type { Transition, Variants } from "motion/react";

export const motionDurations = {
  micro: 0.16,
  standard: 0.34,
  reveal: 0.62,
  emotional: 0.88,
  cinematic: 1.15,
} as const;

export const motionEasings = {
  enter: [0.22, 1, 0.36, 1],
  move: [0.25, 1, 0.5, 1],
  cinematic: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const motionSprings = {
  tactile: { type: "spring", stiffness: 420, damping: 30, mass: 0.7 },
  settle: { type: "spring", stiffness: 210, damping: 27, mass: 0.9 },
  photograph: { type: "spring", stiffness: 115, damping: 23, mass: 1.05 },
} satisfies Record<string, Transition>;

export const staggerPresets = {
  quick: 0.055,
  reading: 0.11,
  emotional: 0.18,
} as const;

export function focusReveal(reducedMotion: boolean, distance = 14): Variants {
  return {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : distance,
      filter: reducedMotion ? "blur(0px)" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reducedMotion ? 0.12 : motionDurations.reveal,
        ease: motionEasings.enter,
      },
    },
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -6,
      filter: reducedMotion ? "blur(0px)" : "blur(3px)",
      transition: {
        duration: reducedMotion ? 0.08 : motionDurations.standard,
        ease: motionEasings.exit,
      },
    },
  };
}

export function stageTransition(reducedMotion: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 18,
      scale: reducedMotion ? 1 : 0.992,
      filter: reducedMotion ? "blur(0px)" : "blur(7px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: reducedMotion ? 0.14 : motionDurations.emotional,
        ease: motionEasings.cinematic,
      },
    },
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -6,
      transition: {
        duration: reducedMotion ? 0.08 : motionDurations.micro,
        ease: motionEasings.exit,
      },
    },
  };
}
