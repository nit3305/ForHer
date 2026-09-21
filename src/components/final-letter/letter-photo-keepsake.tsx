"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { LetterSection } from "@/config/relationship";
import { relationshipConfig } from "@/config/relationship";
import { motionSprings } from "@/lib/motion";

type Photo = NonNullable<LetterSection["image"]>;

export function LetterPhotoKeepsake({ photo, reducedMotion }: { photo: Photo; reducedMotion: boolean }) {
  const bounds = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const copy = relationshipConfig.finalLetter.interactions;
  return (
    <div ref={bounds} className="relative mx-auto mb-10 grid min-h-[24rem] max-w-3xl place-items-center overflow-hidden rounded-xl bg-blush/10 p-5 sm:min-h-[34rem]">
      <div className="absolute inset-x-8 bottom-5 h-3/5 rounded-t-xl bg-[#ead3cb] shadow-inner" aria-hidden="true" />
      <motion.button
        type="button"
        drag={reducedMotion ? false : true}
        dragConstraints={bounds}
        dragElastic={.1}
        dragMomentum={false}
        onClick={() => setFlipped((value) => !value)}
        data-romantic-interactive
        aria-pressed={flipped}
        aria-label={flipped ? copy.photoFrontLabel : copy.photoHint}
        whileDrag={{ scale: 1.015, rotate: -1 }}
        animate={{ rotateY: reducedMotion ? 0 : flipped ? 180 : 0, y: reducedMotion ? 0 : -28 }}
        transition={motionSprings.photograph}
        className="relative z-10 aspect-[4/5] w-[min(76%,24rem)] touch-none [perspective:900px] [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
      >
        <span className={`light-catch absolute inset-0 block overflow-hidden border-[7px] border-white bg-paper shadow-[0_22px_55px_rgba(91,51,57,.18)] [backface-visibility:hidden] ${flipped && reducedMotion ? "opacity-0" : ""}`}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 68vw, 384px" className="object-cover" draggable={false} /></span>
        <span className={`absolute inset-0 grid place-items-center border-[7px] border-white bg-[#fffaf0] p-7 font-display text-xl italic leading-8 text-wine shadow-[0_22px_55px_rgba(91,51,57,.18)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${flipped && reducedMotion ? "[transform:none]" : reducedMotion ? "opacity-0" : ""}`}>{copy.photoBackCopy}</span>
      </motion.button>
      <p className="absolute bottom-2 z-20 rounded-full bg-paper/90 px-3 py-1 text-[9px] font-bold text-wine shadow-sm">{copy.photoHint}</p>
    </div>
  );
}
