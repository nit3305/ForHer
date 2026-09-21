"use client";

import React, { useEffect, useState } from "react";
import { relationshipConfig } from "@/config/relationship";

type Elapsed = { days: number; hours: number; minutes: number; seconds: number };
const emptyElapsed: Elapsed = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateElapsed(value: string): Elapsed | null {
  const since = Date.parse(value);
  if (!Number.isFinite(since)) return null;
  const totalSeconds = Math.max(0, Math.floor((Date.now() - since) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function RelationshipTimer() {
  const config = relationshipConfig.finale.timer;
  const [elapsed, setElapsed] = useState<Elapsed | null>(null);

  useEffect(() => {
    const update = () => setElapsed(calculateElapsed(config.relationshipSince));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [config.relationshipSince]);

  const value = elapsed ?? emptyElapsed;
  const units = [
    ["days", value.days],
    ["hours", value.hours],
    ["minutes", value.minutes],
    ["seconds", value.seconds],
  ] as const;

  return (
    <section className="keepsake-section timer-keepsake relative mx-auto max-w-5xl px-4 py-16 sm:px-8 sm:py-20" aria-labelledby="relationship-timer-title">
      <p className="handwritten text-center text-lg text-rose">a tiny count of all the in-between</p>
      <h2 id="relationship-timer-title" className="mx-auto mt-3 max-w-2xl text-balance text-center font-display text-[clamp(2.5rem,7vw,5rem)] leading-[.95] text-wine">{config.heading}</h2>
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" aria-live="polite">
        {units.map(([label, amount], index) => (
          <div key={label} className={`timer-slip timer-slip-${index + 1} relative px-3 py-6 text-center sm:py-8`}>
            <span className="block font-display text-4xl tabular-nums text-wine sm:text-5xl">{String(amount).padStart(label === "days" ? 3 : 2, "0")}</span>
            <span className="mt-2 block text-[9px] font-bold uppercase tracking-[.24em] text-ink/45">{label}</span>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-9 max-w-lg text-center font-display text-xl italic leading-8 text-ink/65">{config.subtext}</p>
      {elapsed === null && <p className="mx-auto mt-4 max-w-lg text-center text-[10px] leading-5 text-ink/40">{config.placeholderNote}</p>}
    </section>
  );
}
