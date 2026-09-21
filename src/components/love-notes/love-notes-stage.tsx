"use client";

import React from "react";
import { StageIndicator } from "@/components/experience/stage-indicator";
import { LoveNoteJourney } from "./love-note-journey";

export function LoveNotesStage({ onComplete }: { onComplete: () => void }) {
  return (
    <section className="w-full" aria-label="Reasons I love you">
      <div className="mb-8"><StageIndicator activeStage={3} /></div>
      <LoveNoteJourney onComplete={onComplete} />
    </section>
  );
}
