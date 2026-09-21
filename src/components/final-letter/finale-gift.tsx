"use client";

import React from "react";
import { relationshipConfig } from "@/config/relationship";
import { StageIndicator } from "@/components/experience/stage-indicator";
import { PlaylistKeepsake } from "./playlist-keepsake";
import { RelationshipTimer } from "./relationship-timer";
import { PhotoBoothStrip } from "./photo-booth-strip";
import { FinalLetterReader } from "./final-letter-reader";

export function FinaleGift({ onRestart }: { onRestart: () => void }) {
  const config = relationshipConfig.finale;
  return (
    <div className="finale-gift mx-auto w-full max-w-6xl">
      <div className="px-3 pb-12"><StageIndicator activeStage={4} /></div>
      <section className="relative mx-auto flex min-h-[40svh] max-w-4xl items-center px-5 py-14 sm:px-10" aria-labelledby="finale-heading">
        <div>
          <p className="handwritten text-xl text-rose">{config.introEyebrow}</p>
          <h2 id="finale-heading" className="mt-3 max-w-3xl text-balance font-display text-[clamp(3rem,8vw,6.5rem)] leading-[.88] tracking-[-.04em] text-wine">{config.introHeading}</h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-ink/60">{config.introCopy}</p>
        </div>
      </section>
      <PlaylistKeepsake />
      <RelationshipTimer />
      <PhotoBoothStrip />
      <section className="letter-gift-zone px-0 pb-10 pt-20 sm:px-5 sm:pt-28" aria-label="The final letter">
        <p className="handwritten mb-8 text-center text-xl text-rose">one last thing, for keeps</p>
        <FinalLetterReader onRestart={onRestart} />
      </section>
    </div>
  );
}
