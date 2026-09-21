"use client";

import { type PointerEvent, type ReactNode, useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export function PointerDepth({ children, className = "", amount = 1.25 }: { children: ReactNode; className?: string; amount?: number }) {
  const [enabled, setEnabled] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, { stiffness: 170, damping: 26, mass: .8 });
  const rotateY = useSpring(rawX, { stiffness: 170, damping: 26, mass: .8 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(query.matches && !reducedMotion);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reducedMotion]);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rawX.set(((event.clientX - bounds.left) / bounds.width - .5) * amount);
    rawY.set(((event.clientY - bounds.top) / bounds.height - .5) * -amount);
  }

  function reset() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div onPointerMove={move} onPointerLeave={reset} style={enabled ? { rotateX, rotateY, transformPerspective: 1000 } : undefined} className={className}>
      {children}
    </motion.div>
  );
}
