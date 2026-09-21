"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionDurations, motionEasings } from "@/lib/motion";

type MemoryProgressProps = {
  current: number;
  highestVisited: number;
  total: number;
  onSelect: (index: number) => void;
};

export function MemoryProgress({ current, highestVisited, total, onSelect }: MemoryProgressProps) {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <nav className="flex items-center justify-center gap-4" aria-label="Memory journey progress">
      <span className="min-w-10 text-right text-[9px] font-bold tracking-[.22em] text-ink/40">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, index) => {
          const accessible = index <= highestVisited;
          return (
            <motion.button
              key={index}
              type="button"
              disabled={!accessible}
              onClick={() => onSelect(index)}
              aria-label={accessible ? `Return to memory ${index + 1}` : `Memory ${index + 1}, not yet reached`}
              aria-current={index === current ? "step" : undefined}
              animate={{ scaleX: index === current ? 1 : .43 }}
              transition={{ duration: reducedMotion ? 0 : motionDurations.standard, ease: motionEasings.enter }}
              className={`h-1.5 w-7 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine ${index === current ? "bg-wine" : index < current || index <= highestVisited ? "bg-rose/65" : "bg-rose/20"} disabled:cursor-default`}
            />
          );
        })}
      </div>
    </nav>
  );
}
