"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { motionSprings } from "@/lib/motion";

export function PlaylistKeepsake() {
  const config = relationshipConfig.finale.playlist;
  const [flipped, setFlipped] = useState<string | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="keepsake-section mixtape-page relative mx-auto max-w-5xl px-4 py-16 sm:px-8 sm:py-20" aria-labelledby="playlist-title">
      <p className="handwritten text-lg text-rose">{config.eyebrow}</p>
      <h2 id="playlist-title" className="mt-2 max-w-3xl text-balance font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[.92] tracking-[-.03em] text-wine">{config.heading}</h2>
      <p className="mt-6 max-w-xl text-sm leading-7 text-ink/60 sm:text-base">{config.introduction}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {config.songs.map((song, index) => {
          const isFlipped = flipped === song.id;
          return (
            <motion.article key={song.id} className={`song-sleeve song-sleeve-${index + 1} relative min-h-48 [perspective:900px]`}>
              <button type="button" data-romantic-interactive onClick={() => setFlipped((value) => value === song.id ? null : song.id)} aria-pressed={isFlipped} aria-label={`${song.title} by ${song.artist}. ${isFlipped ? "Show track front" : "Show why this song matters"}`} className="absolute inset-0 w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">
                <motion.span animate={{ rotateY: reducedMotion ? 0 : isFlipped ? 180 : 0 }} transition={motionSprings.photograph} className="absolute inset-0 block [transform-style:preserve-3d]">
                  <span className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-sm border border-wine/10 bg-paper px-6 py-6 shadow-[0_18px_35px_rgba(91,51,57,.11)] [backface-visibility:hidden] ${isFlipped && reducedMotion ? "opacity-0" : ""}`}>
                    <span className="flex items-start justify-between gap-4">
                      <span className="grid size-20 shrink-0 place-items-center rounded-full bg-wine text-paper shadow-inner"><span className="size-5 rounded-full border-[5px] border-blush/70 bg-paper" /></span>
                      <span className="font-display text-4xl text-rose/30">0{index + 1}</span>
                    </span>
                    <span>
                      <strong className="block font-display text-2xl font-normal leading-tight text-wine">{song.title}</strong>
                      <span className="mt-1 block text-xs text-ink/50">{song.artist}</span>
                    </span>
                  </span>
                  <span className={`absolute inset-0 grid place-items-center rounded-sm border border-wine/10 bg-[#fff3f3] p-7 text-center shadow-[0_18px_35px_rgba(91,51,57,.11)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${isFlipped && reducedMotion ? "[transform:none]" : reducedMotion ? "opacity-0" : ""}`}>
                    <span className="font-display text-xl italic leading-8 text-wine">{song.caption}</span>
                  </span>
                </motion.span>
              </button>
              {"url" in song && typeof song.url === "string" && <a href={song.url} target="_blank" rel="noreferrer" className="absolute bottom-4 right-5 z-10 text-[9px] font-bold uppercase tracking-[.16em] text-rose underline decoration-rose/30 underline-offset-4">open song ↗</a>}
            </motion.article>
          );
        })}
      </div>
      <p className="handwritten mt-8 text-center text-sm text-wine/55">{config.interactionHint}</p>
    </section>
  );
}
