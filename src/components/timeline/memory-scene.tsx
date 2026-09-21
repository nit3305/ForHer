"use client";

import { motion } from "motion/react";
import type { TimelineMemory } from "@/config/relationship";
import { MemoryLayout } from "./memory-layouts";
import { motionDurations, motionEasings } from "@/lib/motion";

export function MemoryScene({
  memory,
  direction,
  reducedMotion,
  onInteractionComplete,
}: {
  memory: TimelineMemory;
  direction: number;
  reducedMotion: boolean;
  onInteractionComplete: () => void;
}) {
  const identities = {
    hero: { x: 0, y: 18, scale: 1.012, rotate: 0 },
    polaroid: { x: direction * 18, y: 6, scale: .988, rotate: direction * .35 },
    split: { x: direction * 30, y: 0, scale: .996, rotate: 0 },
    details: { x: 0, y: 22, scale: .992, rotate: 0 },
    note: { x: 0, y: 18, scale: .99, rotate: -.35 },
    final: { x: 0, y: 0, scale: 1.014, rotate: 0 },
  } as const;
  const identity = identities[memory.layout];

  return (
    <motion.section
      aria-labelledby={`memory-${memory.id}`}
      initial={{ opacity: 0, x: reducedMotion ? 0 : identity.x, y: reducedMotion ? 0 : identity.y, scale: reducedMotion ? 1 : identity.scale, rotate: reducedMotion ? 0 : identity.rotate, filter: reducedMotion ? "blur(0px)" : "blur(6px)" }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: reducedMotion ? 0 : direction * -10, scale: reducedMotion ? 1 : .997, filter: reducedMotion ? "blur(0px)" : "blur(3px)" }}
      transition={{ duration: reducedMotion ? .1 : memory.layout === "final" ? motionDurations.emotional : motionDurations.reveal, ease: motionEasings.cinematic }}
      className="relative z-10 w-full"
    >
      <span id={`memory-${memory.id}`} className="sr-only">{memory.title}</span>
      <MemoryLayout
        memory={memory}
        reducedMotion={reducedMotion}
        onInteractionComplete={onInteractionComplete}
      />
    </motion.section>
  );
}
