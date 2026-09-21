"use client";

import { PhotoBoothStrip } from "./photo-booth-strip";
import { RelationshipTimer } from "./relationship-timer";

type FinaleGiftProps = {
  onRestart: () => void;
};

export function FinaleGift({ onRestart }: FinaleGiftProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-16">
      <div className="space-y-12">
        <RelationshipTimer />

        <PhotoBoothStrip />

        <div className="flex justify-center pb-8 pt-2">
          <button
            type="button"
            onClick={onRestart}
            className="handwritten min-h-11 px-5 text-sm text-wine/55 underline decoration-rose/25 underline-offset-4 transition hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
          >
            Start from the beginning ♡
          </button>
        </div>
      </div>
    </section>
  );
}