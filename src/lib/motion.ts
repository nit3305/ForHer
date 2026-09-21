import type { Transition, Variants } from "motion/react";

export const motionDurations = {
  micro: 0.16,
  standard: 0.34,
  reveal: 0.62,
  emotional: 0.88,
  cinematic: 1.15,

  // Keepsake-specific timings
  paper: 0.72,
  page: 0.9,
  object: 0.52,
  settle: 0.7,
} as const;

export const motionEasings = {
  enter: [0.22, 1, 0.36, 1],
  move: [0.25, 1, 0.5, 1],
  cinematic: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],

  // Softer curve for paper/card movement.
  paper: [0.16, 1, 0.3, 1],
  soft: [0.22, 0.8, 0.32, 1],
} as const;

export const motionSprings = {
  tactile: {
    type: "spring",
    stiffness: 420,
    damping: 30,
    mass: 0.7,
  },

  settle: {
    type: "spring",
    stiffness: 210,
    damping: 27,
    mass: 0.9,
  },

  photograph: {
    type: "spring",
    stiffness: 115,
    damping: 23,
    mass: 1.05,
  },

  // Small physical objects: notes, tabs, cards.
  paperLift: {
    type: "spring",
    stiffness: 280,
    damping: 24,
    mass: 0.8,
  },

  // Slower, heavier movement for a sheet/page.
  paperSettle: {
    type: "spring",
    stiffness: 150,
    damping: 24,
    mass: 1,
  },

  // Tiny button/card press.
  softPress: {
    type: "spring",
    stiffness: 520,
    damping: 34,
    mass: 0.55,
  },
} satisfies Record<string, Transition>;

export const staggerPresets = {
  quick: 0.055,
  reading: 0.11,
  emotional: 0.18,

  // Used for physical objects appearing one after another.
  keepsake: 0.085,
  intimate: 0.14,
} as const;

export function focusReveal(
  reducedMotion: boolean,
  distance = 14,
): Variants {
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

/**
 * A small physical object appearing on paper.
 *
 * The important difference from a generic fade is that the object
 * arrives slightly lifted, rotates into place, and settles.
 */
export function paperObjectReveal(
  reducedMotion: boolean,
  rotation = 0,
): Variants {
  return {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 16,
      scale: reducedMotion ? 1 : 0.96,
      rotate: reducedMotion ? 0 : rotation - 1.5,
      filter: reducedMotion ? "blur(0px)" : "blur(3px)",
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: rotation,
      filter: "blur(0px)",
      transition: reducedMotion
        ? { duration: 0.12 }
        : {
          duration: motionDurations.paper,
          ease: motionEasings.paper,
        },
    },

    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -8,
      scale: reducedMotion ? 1 : 0.985,
      rotate: reducedMotion ? 0 : rotation + 1,
      transition: reducedMotion
        ? { duration: 0.08 }
        : {
          duration: motionDurations.standard,
          ease: motionEasings.exit,
        },
    },
  };
}

/**
 * Used for stage content itself.
 *
 * Instead of a strong blur/zoom, the new stage feels like another
 * sheet of the keepsake settling onto the desk.
 */
export function stageTransition(reducedMotion: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 24,
      scale: reducedMotion ? 1 : 0.985,
      rotate: reducedMotion ? 0 : -0.35,
      filter: reducedMotion ? "blur(0px)" : "blur(4px)",
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: reducedMotion
        ? { duration: 0.14 }
        : {
          duration: motionDurations.page,
          ease: motionEasings.paper,
        },
    },

    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -10,
      scale: reducedMotion ? 1 : 0.992,
      rotate: reducedMotion ? 0 : 0.25,
      filter: reducedMotion ? "blur(0px)" : "blur(2px)",
      transition: reducedMotion
        ? { duration: 0.08 }
        : {
          duration: motionDurations.standard,
          ease: motionEasings.exit,
        },
    },
  };
}