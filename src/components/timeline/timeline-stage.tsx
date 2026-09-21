"use client";

import React from "react";
import { StageIndicator } from "@/components/experience/stage-indicator";
import { MemoryJourney } from "./memory-journey";

export function TimelineStage({ onComplete }: { onComplete: () => void }) {
  return (
    <section className="w-full" aria-label="Our memories">
      <div className="mb-8"><StageIndicator activeStage={2} /></div>
      <MemoryJourney onComplete={onComplete} />
    </section>
  );
}
