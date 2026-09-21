"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";

const positions = [
  { x: 0, y: 0 },
  { x: 8, y: -4 },
  { x: -6, y: 5 },
];

export function EscapingHeart() {
  const [step, setStep] = useState(0);
  const [fine, setFine] = useState(false);
  const [found, setFound] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function react() {
    if (fine && !reduced && step < 2) setStep((value) => value + 1);
    else setFound(true);
  }

  return (
    <div className="absolute right-5 top-5 z-20 flex flex-col items-end gap-2">
      <motion.button
        type="button"
        data-romantic-interactive
        aria-label={relationshipConfig.playfulness.escapingHeart.label}
        onPointerEnter={() => { if (fine && step < 2) react(); }}
        onClick={react}
        animate={{ x: reduced ? 0 : positions[step].x, y: reduced ? 0 : positions[step].y, rotate: found ? 8 : -8 }}
        transition={{ type: "spring", stiffness: 420, damping: 25 }}
        className="grid size-11 place-items-center rounded-full border border-rose/20 bg-paper/85 font-display text-lg text-rose shadow-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-wine"
      >♥</motion.button>
      {found && <p role="status" className="max-w-36 rounded-full bg-paper/90 px-3 py-1 text-[9px] font-bold text-wine shadow-sm">{relationshipConfig.playfulness.escapingHeart.foundCopy}</p>}
    </div>
  );
}
