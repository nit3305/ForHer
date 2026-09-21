"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { TimelineMemory } from "@/config/relationship";
import { PointerDepth } from "@/components/motion/pointer-depth";
import { motionDurations, motionEasings, staggerPresets } from "@/lib/motion";
import { DraggableMemoryPhoto, FlippableMemoryPhoto, MemoryKeepsake, MemoryPhotoTrail } from "./memory-interactions";
import { PaperTape, PostageMark, PressedFlower } from "@/components/ui/scrapbook-decor";

type LayoutProps = { memory: TimelineMemory; reducedMotion: boolean };

function Photo({ src, alt, className = "", sizes = "(max-width: 768px) 92vw, 700px" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden bg-blush/25 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

function Copy({ memory, reducedMotion, align = "left", quiet = false, delay = 0 }: { memory: TimelineMemory; reducedMotion: boolean; align?: "left" | "center"; quiet?: boolean; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 12, filter: reducedMotion ? "blur(0px)" : "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: reducedMotion ? 0 : delay, duration: reducedMotion ? .1 : motionDurations.reveal, ease: motionEasings.enter }} className={`${align === "center" ? "mx-auto text-center" : "text-left"} max-w-xl`}>
      <p className="text-[9px] font-bold uppercase tracking-[.28em] text-rose">{memory.date}</p>
      {memory.eyebrow && <p className="mt-3 font-display text-lg italic text-rose/80">{memory.eyebrow}</p>}
      <h2 className={`${quiet ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl"} mt-2 font-display leading-[.9] tracking-[-.025em] text-wine`}>{memory.title}</h2>
      <p className="mt-5 text-sm leading-7 text-ink/65 sm:text-base">{memory.message}</p>
      {memory.note && <p className="mt-5 font-display text-xl italic leading-8 text-wine/75">{memory.note}</p>}
    </motion.div>
  );
}

export function MemoryLayout({ memory, reducedMotion }: LayoutProps) {
  const first = memory.images?.[0];
  const second = memory.images?.[1];

  switch (memory.layout) {
    case "hero":
      return (
        <div className="mx-auto max-w-4xl">
          {first && (
            <motion.div initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.015 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? 0 : .55 }}><Photo {...first} className="aspect-[4/3] rounded-sm border-[7px] border-white shadow-[0_20px_50px_rgba(91,51,57,.15)]" /></motion.div>
          )}
          <div className="mx-auto mt-8 max-w-2xl"><Copy memory={memory} reducedMotion={reducedMotion} align="center" delay={.32} /></div>
        </div>
      );

    case "polaroid":
      return (
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-14">
          <PaperTape className="left-[18%] top-1 rotate-[-5deg]" />
          <PointerDepth className="relative mx-auto w-full max-w-xl" amount={.65}>
            {first && memory.interaction === "drag" && <motion.div initial={{ opacity: 0, rotate: reducedMotion ? 0 : -2 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: reducedMotion ? 0 : .4 }}><DraggableMemoryPhoto photo={first} reducedMotion={reducedMotion} interactionCopy={memory.interactionCopy} /></motion.div>}
            {first && memory.interaction === "flip" && <motion.div initial={{ opacity: 0, rotate: reducedMotion ? 0 : -2 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: reducedMotion ? 0 : .4 }} className="mx-auto w-[min(78vw,21rem)]"><FlippableMemoryPhoto photo={first} backCopy={memory.photoBackCopy ?? ""} reducedMotion={reducedMotion} /></motion.div>}
          </PointerDepth>
          <Copy memory={memory} reducedMotion={reducedMotion} quiet delay={.22} />
        </div>
      );

    case "split":
      return (
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-14">
          <PostageMark className="absolute right-2 top-0 rotate-6" label="wish you were here" />
          {first && <motion.div initial={{ opacity: 0, x: reducedMotion ? 0 : -22, clipPath: reducedMotion ? "inset(0 0 0 0)" : "inset(0 18% 0 0)" }} animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0)" }} transition={{ duration: reducedMotion ? .1 : motionDurations.emotional, ease: motionEasings.cinematic }}><MemoryPhotoTrail photo={first} reducedMotion={reducedMotion} /></motion.div>}
          <Copy memory={memory} reducedMotion={reducedMotion} delay={.18} />
        </div>
      );

    case "details":
      return (
        <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-14">
          <PressedFlower className="absolute bottom-3 right-1 hidden h-24 w-16 rotate-12 text-rose/30 sm:block" />
          {first && <motion.div whileHover={reducedMotion ? undefined : { rotate: -2, y: -4 }} className="mx-auto w-[75%] md:w-full"><Photo {...first} className="aspect-square rotate-2 rounded-lg border-[7px] border-white shadow-[0_20px_45px_rgba(91,51,57,.18)]" sizes="(max-width: 768px) 70vw, 360px" /></motion.div>}
          <div>
            <Copy memory={memory} reducedMotion={reducedMotion} quiet />
            {memory.details && (
              <ul className="mt-7 space-y-3">
                {memory.details.map((detail, index) => <motion.li key={detail} initial={{ opacity: 0, x: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reducedMotion ? 0 : .3 + index * staggerPresets.reading, duration: motionDurations.standard, ease: motionEasings.enter }} className="flex items-center gap-3 text-xs leading-5 text-ink/60"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-blush/40 font-display text-rose">{index + 1}</span>{detail}</motion.li>)}
              </ul>
            )}
            <MemoryKeepsake reducedMotion={reducedMotion} />
          </div>
        </div>
      );

    case "note":
      return (
        <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 18, rotate: reducedMotion ? 0 : -.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: reducedMotion ? .1 : motionDurations.emotional, ease: motionEasings.cinematic }} className="relative mx-auto max-w-3xl rounded-sm bg-[#fffaf0]/95 px-7 py-10 shadow-[0_26px_70px_rgba(91,51,57,.14)] sm:px-14 sm:py-14">
          <PaperTape className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rotate-1" />
          <div aria-hidden="true" className="absolute left-0 top-9 h-px w-14 bg-rose/25" />
          <Copy memory={memory} reducedMotion={reducedMotion} align="center" quiet delay={.22} />
          {first && <div className="mx-auto mt-8 w-28 rotate-2"><Photo {...first} className="aspect-square border-[5px] border-white shadow-lg" sizes="112px" /></div>}
          <p className="mt-8 text-center font-display text-2xl text-rose/55" aria-hidden="true">always, in all ways</p>
        </motion.div>
      );

    case "final":
      return (
        <div className="relative mx-auto min-h-[62svh] max-w-5xl overflow-hidden rounded-sm border-[9px] border-paper bg-blush shadow-[0_24px_65px_rgba(91,51,57,.18)]">
          {first && <Photo {...first} className="absolute inset-0 size-full" sizes="(max-width: 768px) 100vw, 1000px" />}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(75,48,49,.88),rgba(75,48,49,.04)_72%)]" />
          {second && <motion.div initial={{ opacity: 0, rotate: 4, y: 15 }} animate={{ opacity: 1, rotate: 2, y: 0 }} transition={{ delay: reducedMotion ? 0 : .4 }} className="absolute right-5 top-5 hidden w-40 sm:block"><Photo {...second} className="aspect-[4/5] border-[6px] border-white shadow-2xl" sizes="160px" /></motion.div>}
          <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-12">
            <p className="text-[9px] font-bold uppercase tracking-[.3em] text-blush">{memory.date}</p>
            <h2 className="mt-3 max-w-2xl font-display text-5xl leading-[.88] tracking-[-.025em] sm:text-7xl">{memory.title}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">{memory.message}</p>
            {memory.note && <p className="mt-4 max-w-xl font-display text-xl italic text-blush">{memory.note}</p>}
          </div>
        </div>
      );
  }
}
