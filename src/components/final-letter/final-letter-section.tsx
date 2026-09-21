"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { LetterSection } from "@/config/relationship";
import { motionDurations, motionEasings } from "@/lib/motion";
import { LetterPhotoKeepsake } from "./letter-photo-keepsake";

function LetterCopy({ section, light = false, centered = false }: { section: LetterSection; light?: boolean; centered?: boolean }) {
  const reducedMotion = useReducedMotion() ?? false;
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 8, filter: reducedMotion ? "blur(0px)" : "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { delay: reducedMotion ? 0 : delay, duration: reducedMotion ? .1 : motionDurations.reveal, ease: motionEasings.enter },
  });
  return (
    <div className={`${centered ? "mx-auto text-center" : "text-left"} max-w-2xl`}>
      {section.eyebrow && <motion.p {...reveal(.06)} className={`text-[9px] font-bold uppercase tracking-[.3em] ${light ? "text-blush" : "text-rose"}`}>{section.eyebrow}</motion.p>}
      {section.heading && <motion.h2 {...reveal(.13)} className={`mt-4 font-display text-4xl leading-[.95] sm:text-5xl ${light ? "text-white" : "text-wine"}`}>{section.heading}</motion.h2>}
      <motion.p {...reveal(.22)} className={`mt-6 text-base leading-8 sm:text-lg sm:leading-9 ${light ? "text-white/78" : "text-ink/70"}`}>{section.body}</motion.p>
      {section.emphasis && <motion.p {...reveal(.34)} className={`mt-7 font-display text-2xl italic leading-8 sm:text-3xl ${light ? "text-blush" : "text-rose/80"}`}>{section.emphasis}</motion.p>}
      {section.annotation && <motion.p {...reveal(.42)} className={`handwritten mt-6 rotate-[-1deg] text-sm ${light ? "text-blush/75" : "text-rose/65"}`}>{section.annotation}</motion.p>}
    </div>
  );
}

export function FinalLetterSection({ section, reducedMotion }: { section: LetterSection; reducedMotion: boolean }) {
  const movement = reducedMotion ? 0 : 20;

  if (section.layout === "photo") {
    return (
      <motion.section id={`letter-${section.id}`} initial={{ opacity: 0, y: movement }} animate={{ opacity: 1, y: 0 }} className="px-6 py-10 sm:px-12 sm:py-16" aria-labelledby={`heading-${section.id}`}>
        {section.image && <motion.div initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.018, filter: reducedMotion ? "blur(0px)" : "blur(5px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: reducedMotion ? .1 : motionDurations.emotional, ease: motionEasings.cinematic }}><LetterPhotoKeepsake photo={section.image} reducedMotion={reducedMotion} /></motion.div>}
        <div id={`heading-${section.id}`}><LetterCopy section={section} centered /></div>
      </motion.section>
    );
  }

  if (section.layout === "split") {
    return (
      <motion.section id={`letter-${section.id}`} initial={{ opacity: 0, y: movement }} animate={{ opacity: 1, y: 0 }} className="grid items-center gap-9 border-t border-rose/10 px-6 py-12 sm:px-12 sm:py-16 md:grid-cols-[.85fr_1.15fr]" aria-labelledby={`heading-${section.id}`}>
        {section.image && <motion.figure initial={{ opacity: 0, x: reducedMotion ? 0 : -16, rotate: reducedMotion ? 0 : -1 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: reducedMotion ? .1 : motionDurations.reveal, ease: motionEasings.cinematic }} className="light-catch relative mx-auto aspect-[4/5] w-[78%] overflow-hidden border-[7px] border-white shadow-[0_20px_48px_rgba(91,51,57,.16)] md:w-full"><Image src={section.image.src} alt={section.image.alt} fill sizes="(max-width: 768px) 72vw, 330px" className="object-cover" /></motion.figure>}
        <div id={`heading-${section.id}`}><LetterCopy section={section} /></div>
      </motion.section>
    );
  }

  if (section.layout === "minimal") {
    return (
      <motion.section id={`letter-${section.id}`} initial={{ opacity: 0, y: movement }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[55svh] items-center border-t border-rose/10 px-7 py-16 sm:px-16" aria-labelledby={`heading-${section.id}`}>
        <div id={`heading-${section.id}`} className="mx-auto"><LetterCopy section={section} centered /></div>
      </motion.section>
    );
  }

  if (section.layout === "final") {
    return (
      <motion.section id={`letter-${section.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .9 }} className="relative flex min-h-[70svh] items-end overflow-hidden bg-blush px-7 py-14 sm:px-14 sm:py-18" aria-labelledby={`heading-${section.id}`}>
        {section.image && <Image src={section.image.src} alt={section.image.alt} fill sizes="(max-width: 768px) 100vw, 900px" className="object-cover opacity-35" />}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,248,239,.98),rgba(255,248,239,.18))]" />
        <div id={`heading-${section.id}`} className="relative mx-auto w-full"><LetterCopy section={section} centered /></div>
      </motion.section>
    );
  }

  return (
    <motion.section id={`letter-${section.id}`} initial={{ opacity: 0, y: movement }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[50svh] items-center border-t border-rose/10 px-7 py-14 sm:px-16" aria-labelledby={`heading-${section.id}`}>
      <div id={`heading-${section.id}`} className="mx-auto w-full"><LetterCopy section={section} /></div>
    </motion.section>
  );
}
