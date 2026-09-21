"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionDurations, motionEasings } from "@/lib/motion";

export function LoveNoteProgress({ current, highestVisited, total, onSelect }: { current: number; highestVisited: number; total: number; onSelect: (index: number) => void }) {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <nav className="flex items-center justify-center gap-4" aria-label="Love-note progress">
      <span className="text-[9px] font-bold tracking-[.22em] text-ink/40">{String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, index) => {
          const available = index <= highestVisited;
          return (
            <motion.button
              type="button"
              key={index}
              disabled={!available}
              onClick={() => onSelect(index)}
              aria-label={available ? `Return to note ${index + 1}` : `Note ${index + 1}, not yet opened`}
              aria-current={index === current ? "step" : undefined}
              animate={{ scale: index === current ? 1 : .6 }}
              transition={{ duration: reducedMotion ? 0 : motionDurations.standard, ease: motionEasings.enter }}
              className={`size-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine ${index === current ? "bg-wine" : index <= highestVisited ? "bg-rose/70" : "bg-rose/20"} disabled:cursor-default`}
            />
          );
        })}
      </div>
    </nav>
  );
}
