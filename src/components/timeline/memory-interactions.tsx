"use client";

import Image from "next/image";
import React, { type PointerEvent, useRef, useState } from "react";
import { motion } from "motion/react";
import type { TimelineMemory } from "@/config/relationship";
import { relationshipConfig } from "@/config/relationship";
import { motionSprings } from "@/lib/motion";

type Photo = NonNullable<TimelineMemory["images"]>[number];

export function DraggableMemoryPhoto({ photo, reducedMotion, interactionCopy = "drag me" }: { photo: Photo; reducedMotion: boolean; interactionCopy?: string }) {
  const bounds = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);
  return (
    <div ref={bounds} className="relative mx-auto min-h-[18rem] max-w-4xl overflow-hidden rounded-[1.5rem] sm:min-h-[28rem]">
      <div className="absolute inset-8 grid place-items-center rounded-xl border border-dashed border-rose/30 bg-blush/20 p-8 text-center">
        <p className="max-w-sm font-display text-xl italic text-wine/75">{relationshipConfig.timeline.hiddenPhotoNote}</p>
      </div>
      <motion.figure
        drag={!reducedMotion}
        dragConstraints={bounds}
        dragElastic={.12}
        dragMomentum={false}
        animate={{ x: moved ? (reducedMotion ? 0 : 88) : 0, rotate: moved && !reducedMotion ? 2 : 0 }}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setMoved((value) => !value); } }}
        whileDrag={{ scale: 1.015, rotate: -1.2 }}
        transition={motionSprings.photograph}
        tabIndex={0}
        data-romantic-interactive
        aria-label={`${photo.alt}. ${interactionCopy}`}
        aria-expanded={moved}
        role="button"
        className="light-catch absolute inset-0 touch-pan-y cursor-grab overflow-hidden rounded-[1.5rem] border-[7px] border-white bg-blush/25 shadow-[0_24px_70px_rgba(91,51,57,.18)] active:cursor-grabbing"
      >
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 92vw, 800px" className="object-cover" draggable={false} />
      </motion.figure>
      <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-paper/90 px-3 py-1 text-[9px] font-bold text-wine shadow-sm">{interactionCopy}</p>
    </div>
  );
}

export function FlippableMemoryPhoto({ photo, backCopy, reducedMotion, className = "" }: { photo: Photo; backCopy: string; reducedMotion: boolean; className?: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button type="button" data-romantic-interactive onClick={() => setFlipped((value) => !value)} aria-pressed={flipped} aria-label={flipped ? relationshipConfig.timeline.photoFrontLabel : relationshipConfig.timeline.photoBackLabel} className={`relative aspect-[4/5] w-full [perspective:900px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine ${className}`}>
      <motion.span animate={{ rotateY: reducedMotion ? 0 : flipped ? 180 : 0 }} transition={motionSprings.photograph} className="absolute inset-0 block [transform-style:preserve-3d]">
        <span className={`absolute inset-0 block overflow-hidden border-[7px] border-white bg-blush/25 shadow-[0_20px_45px_rgba(91,51,57,.2)] [backface-visibility:hidden] ${flipped && reducedMotion ? "opacity-0" : "opacity-100"}`}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 62vw, 360px" className="object-cover" draggable={false} /></span>
        <span className={`absolute inset-0 grid place-items-center border-[7px] border-white bg-[#fffaf0] p-6 font-display text-lg italic leading-7 text-wine shadow-[0_20px_45px_rgba(91,51,57,.2)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${flipped && reducedMotion ? "opacity-100 [transform:none]" : reducedMotion ? "opacity-0" : ""}`}>{backCopy}</span>
      </motion.span>
    </button>
  );
}

type Print = { id: number; x: number; y: number; rotate: number };

export function MemoryPhotoTrail({ photo, reducedMotion }: { photo: Photo; reducedMotion: boolean }) {
  const [prints, setPrints] = useState<Print[]>([]);
  const last = useRef({ x: 0, y: 0 });
  const id = useRef(0);
  function leavePrint(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || (event.pointerType === "touch" && prints.length >= 3)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (Math.hypot(x - last.current.x, y - last.current.y) < 52) return;
    last.current = { x, y };
    setPrints((items) => [...items.slice(-5), { id: id.current++, x, y, rotate: (id.current % 5 - 2) * 3 }]);
  }
  return (
    <div data-romantic-interactive onPointerMove={leavePrint} className="light-catch relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[1.5rem] border-[7px] border-white bg-blush/25 shadow-[0_24px_60px_rgba(91,51,57,.17)] md:aspect-[4/5]">
      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 92vw, 480px" className="object-cover" draggable={false} />
      {prints.map((print) => <motion.span key={print.id} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: .85, scale: 1 }} style={{ left: print.x - 24, top: print.y - 30, rotate: print.rotate }} className="pointer-events-none absolute h-14 w-12 overflow-hidden border-[3px] border-white bg-paper shadow-md"><Image src={photo.src} alt="" fill sizes="48px" className="object-cover" /></motion.span>)}
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-paper/90 px-3 py-1 text-[9px] font-bold text-wine shadow-sm">{relationshipConfig.timeline.trailHint}</span>
    </div>
  );
}

export function MemoryKeepsake({ reducedMotion }: { reducedMotion: boolean }) {
  const [found, setFound] = useState(false);
  return (
    <div className="mt-7 flex items-center gap-4">
      <motion.button type="button" data-romantic-interactive drag={!reducedMotion} dragSnapToOrigin dragElastic={.2} onClick={() => setFound(true)} onDragEnd={() => setFound(true)} whileDrag={{ scale: 1.08, rotate: 8 }} aria-label={relationshipConfig.timeline.memories[3].interactionCopy} className="grid size-14 shrink-0 touch-pan-y place-items-center rounded-full border border-rose/20 bg-blush/30 font-display text-2xl text-rose shadow-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-wine">✿</motion.button>
      <p aria-live="polite" className="font-display text-lg italic text-wine/65">{found ? relationshipConfig.timeline.keepsakeFound : relationshipConfig.timeline.memories[3].interactionCopy}</p>
    </div>
  );
}
