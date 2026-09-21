"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import type { TimelineMemory } from "@/config/relationship";

type InteractionProps = {
  memory: TimelineMemory;
  reducedMotion: boolean;
  onComplete?: () => void;
};

export function DraggableMemoryPhoto({
  memory,
  reducedMotion,
  onComplete,
}: InteractionProps) {
  const [dragged, setDragged] = useState(false);

  const image = memory.images?.[0];

  if (!image) {
    return null;
  }

  function completeDrag() {
    if (dragged) return;

    setDragged(true);
    onComplete?.();
  }

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.75}
        whileDrag={{
          scale: 1.04,
          rotate: 2,
          zIndex: 30,
          cursor: "grabbing",
        }}
        whileHover={{
          rotate: -1,
          scale: 1.015,
        }}
        onDragEnd={completeDrag}
        animate={
          !dragged && !reducedMotion
            ? {
                x: [0, 4, -4, 0],
                rotate: [0, 1, -1, 0],
              }
            : undefined
        }
        transition={{
          duration: 2.8,
          repeat: dragged || reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-[min(72vw,310px)] cursor-grab touch-none select-none rounded-sm bg-[#fffdf8] p-3 pb-10 shadow-[0_18px_35px_rgba(91,51,57,.16)]"
        role="button"
        tabIndex={0}
        aria-label={memory.interactionCopy ?? "Drag the photograph"}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            completeDrag();
          }
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f2e7dc]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 72vw, 310px"
            className="pointer-events-none select-none object-cover"
            draggable={false}
          />

          {!dragged && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
              <span className="rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-wine shadow-sm">
                drag me ♡
              </span>
            </div>
          )}
        </div>

        <p className="handwritten pointer-events-none absolute bottom-2 left-0 right-0 text-center text-base text-ink/60">
          {dragged ? "you found it ♡" : "move me a little"}
        </p>
      </motion.div>

      {!dragged && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none mt-5 flex items-center gap-2 text-xs font-medium text-wine/60"
        >
          <span className="text-base">↔</span>
          <span>{memory.interactionCopy ?? "drag me"}</span>
        </motion.div>
      )}

      {dragged && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-sm font-semibold text-wine"
        >
          found it ♡
        </motion.p>
      )}
    </div>
  );
}

export function FlippableMemoryPhoto({
  memory,
  reducedMotion,
  onComplete,
}: InteractionProps) {
  const [flipped, setFlipped] = useState(false);

  const image = memory.images?.[0];

  if (!image) {
    return null;
  }

  function toggleFlip() {
    setFlipped((value) => {
      const next = !value;

      if (next) {
        onComplete?.();
      }

      return next;
    });
  }

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={toggleFlip}
        className="relative h-[390px] w-[min(72vw,310px)] [perspective:1000px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
        aria-label={
          flipped
            ? memory.photoBackCopy ?? "Turn photograph back"
            : memory.interactionCopy ?? "Flip photograph"
        }
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.55,
            ease: "easeInOut",
          }}
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-sm bg-[#fffdf8] p-3 pb-10 shadow-[0_18px_35px_rgba(91,51,57,.16)] [backface-visibility:hidden]">
            <div className="relative h-full w-full overflow-hidden bg-[#f2e7dc]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 72vw, 310px"
                className="object-cover"
              />
            </div>

            <span className="handwritten absolute bottom-2 left-0 right-0 text-center text-base text-ink/60">
              {memory.interactionCopy ?? "flip me ↻"}
            </span>
          </div>

          <div className="absolute inset-0 flex rotate-y-180 items-center justify-center rounded-sm bg-[#fff7f1] p-8 text-center shadow-[0_18px_35px_rgba(91,51,57,.16)] [backface-visibility:hidden]">
            <div>
              <span className="mb-4 block text-2xl">♡</span>
              <p className="handwritten text-lg leading-7 text-ink/70">
                {memory.photoBackCopy ??
                  "A tiny note waiting behind this photograph."}
              </p>
            </div>
          </div>
        </motion.div>
      </button>

      {!flipped && (
        <p className="mt-5 text-xs font-medium text-wine/60">
          tap the photograph ♡
        </p>
      )}
    </div>
  );
}

export function MemoryPhotoTrail({
  memory,
  onComplete,
}: InteractionProps) {
  const [marked, setMarked] = useState(false);

  const image = memory.images?.[0];

  if (!image) {
    return null;
  }

  function complete() {
    setMarked(true);
    onComplete?.();
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={complete}
        className={`relative w-[min(72vw,310px)] overflow-hidden rounded-sm bg-[#fffdf8] p-3 pb-10 shadow-[0_18px_35px_rgba(91,51,57,.16)] transition-transform ${
          marked ? "rotate-1" : "hover:-rotate-1"
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f2e7dc]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 72vw, 310px"
            className="object-cover"
          />
        </div>

        <p className="handwritten absolute bottom-2 left-0 right-0 text-center text-base text-ink/60">
          {marked ? "a little trail ♡" : memory.interactionCopy ?? "tap me"}
        </p>
      </button>

      {!marked && (
        <p className="mt-5 text-xs text-wine/60">
          leave a little mark here ♡
        </p>
      )}
    </div>
  );
}

export function MemoryKeepsake({
  memory,
  onComplete,
}: InteractionProps) {
  const [found, setFound] = useState(false);

  function findKeepsake() {
    if (found) return;

    setFound(true);
    onComplete?.();
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={findKeepsake}
        className={`group relative rounded-2xl border border-wine/10 bg-[#fffaf4] px-8 py-7 shadow-[0_18px_35px_rgba(91,51,57,.12)] transition ${
          found ? "rotate-1" : "hover:-translate-y-1"
        }`}
      >
        <span className="block text-4xl transition-transform group-hover:scale-110">
          {found ? "♡" : "🎁"}
        </span>

        <span className="mt-3 block text-sm font-semibold text-wine">
          {found ? "kept safe ♡" : memory.interactionCopy ?? "find the keepsake"}
        </span>
      </button>

      {found && (
        <p className="mt-4 text-center text-sm text-ink/60">
          {memory.note ?? "A tiny piece of this memory is yours to keep."}
        </p>
      )}
    </div>
  );
}