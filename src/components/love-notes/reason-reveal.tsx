"use client";

import { type PointerEvent, useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "motion/react";
import type { LoveReason } from "@/config/relationship";
import { relationshipConfig } from "@/config/relationship";
import { motionEasings, motionSprings } from "@/lib/motion";

type Props = { reason: LoveReason; reducedMotion: boolean; opening: boolean; onReveal: () => void };
const copy = relationshipConfig.loveNotes.interactions;

function EnvelopeShell({ children }: { children: React.ReactNode }) {
  return <div className="relative aspect-[5/3] w-full max-w-xl overflow-hidden rounded-xl bg-[#e8cbc5] shadow-[0_26px_65px_rgba(91,51,57,.17)]">{children}<div aria-hidden="true" className="absolute inset-0 z-20 [clip-path:polygon(0_100%,50%_45%,100%_100%)] bg-[#dfbbb7]" /></div>;
}

function PullReveal({ onReveal, reducedMotion }: Pick<Props, "onReveal" | "reducedMotion">) {
  return <div className="mx-auto w-full max-w-xl pt-12 text-center"><EnvelopeShell><motion.button type="button" drag={reducedMotion ? false : "y"} dragConstraints={{ top: -150, bottom: 0 }} dragElastic={.12} dragMomentum={false} onDragEnd={(_, info: PanInfo) => { if (info.offset.y < -65) onReveal(); }} onClick={reducedMotion ? onReveal : undefined} data-romantic-interactive aria-label={`${copy.pullHint}. Press Enter to reveal.`} className="absolute inset-x-[9%] bottom-2 z-10 h-[78%] touch-none rounded-t-sm bg-[#fffaf0] p-5 font-display text-lg italic text-wine shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"><span className="block">{copy.pullHint}</span><span className="mt-4 block text-2xl">↑</span></motion.button></EnvelopeShell><button type="button" onClick={onReveal} className="mt-4 min-h-11 px-4 text-xs font-bold text-wine underline decoration-rose/30 underline-offset-4">Open without dragging</button></div>;
}

function ScratchReveal({ onReveal }: Pick<Props, "onReveal">) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const moves = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    context.fillStyle = "#dcaeb0";
    context.fillRect(0, 0, rect.width, rect.height);
    context.fillStyle = "rgba(127,57,72,.78)";
    context.font = "600 13px Georgia";
    context.textAlign = "center";
    context.fillText(copy.scratchHint, rect.width / 2, rect.height / 2);
  }, []);
  function scratch(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    if (!context) return;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(event.clientX - rect.left, event.clientY - rect.top, 34, 0, Math.PI * 2);
    context.fill();
    moves.current += 1;
    if (moves.current >= 34) onReveal();
  }
  return <div className="mx-auto w-full max-w-xl text-center"><div className="relative min-h-[300px] overflow-hidden rounded-xl bg-[#fffaf0] shadow-[0_24px_65px_rgba(91,51,57,.14)]"><p className="absolute inset-0 grid place-items-center p-10 font-display text-2xl italic text-wine">{copy.scratchUnderlay}</p><canvas ref={canvasRef} data-romantic-interactive onPointerDown={(event) => { drawing.current = true; event.currentTarget.setPointerCapture(event.pointerId); scratch(event); }} onPointerMove={scratch} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} className="absolute inset-0 size-full touch-none" aria-label={copy.scratchHint} /></div><button type="button" onClick={onReveal} className="mt-4 min-h-11 px-4 text-xs font-bold text-wine underline decoration-rose/30 underline-offset-4">{copy.scratchFallback}</button></div>;
}

function PeelReveal({ onReveal, reducedMotion }: Pick<Props, "onReveal" | "reducedMotion">) {
  return <div className="mx-auto grid min-h-[340px] max-w-xl place-items-center rounded-xl bg-[#fffaf0] shadow-[0_24px_65px_rgba(91,51,57,.14)]"><motion.button type="button" drag={reducedMotion ? false : "x"} dragConstraints={{ left: -10, right: 110 }} dragElastic={.08} dragMomentum={false} onDragEnd={(_, info) => { if (info.offset.x > 52) onReveal(); }} onClick={onReveal} data-romantic-interactive className="grid size-36 touch-pan-y place-items-center rounded-[42%_50%_46%_54%] bg-blush font-display text-lg italic text-wine shadow-[0_15px_35px_rgba(91,51,57,.15)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"><span>{copy.peelHint}<br/><span className="text-2xl">→</span></span></motion.button></div>;
}

function HoldReveal({ onReveal }: Pick<Props, "onReveal">) {
  const timer = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);
  const [released, setReleased] = useState(false);
  function start() { setReleased(false); setHolding(true); timer.current = window.setTimeout(onReveal, 1700); }
  function stop() { if (holding) setReleased(true); setHolding(false); if (timer.current) window.clearTimeout(timer.current); }
  return <div className="mx-auto flex min-h-[340px] max-w-xl flex-col items-center justify-center rounded-xl bg-[#fffaf0] p-8 text-center shadow-[0_24px_65px_rgba(91,51,57,.14)]"><motion.button type="button" data-romantic-interactive onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} animate={{ scale: holding ? 1.12 : 1 }} transition={{ duration: holding ? 1.7 : .2, ease: motionEasings.cinematic }} aria-label={copy.holdHint} className="grid size-28 place-items-center rounded-full bg-blush/60 font-display text-5xl text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">♥</motion.button><p aria-live="polite" className="mt-6 font-display text-xl italic text-wine">{holding ? copy.holdActive : released ? copy.holdReleased : copy.holdHint}</p><button type="button" onClick={onReveal} className="mt-4 min-h-11 px-4 text-xs font-bold text-wine underline decoration-rose/30 underline-offset-4">{copy.holdFallback}</button></div>;
}

function FlipReveal({ onReveal, reducedMotion }: Pick<Props, "onReveal" | "reducedMotion">) {
  return <button type="button" data-romantic-interactive onClick={onReveal} aria-label={copy.flipHint} className="mx-auto block min-h-[340px] w-full max-w-xl [perspective:900px] focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-wine"><motion.span whileHover={reducedMotion ? undefined : { rotateY: 8, rotate: -.5 }} whileTap={reducedMotion ? undefined : { rotateY: 24 }} transition={motionSprings.photograph} className="grid min-h-[340px] place-items-center rounded-sm bg-[#fffaf0] p-8 font-display text-2xl italic text-wine shadow-[0_24px_65px_rgba(91,51,57,.14)] [transform-style:preserve-3d]">{copy.flipHint}<span className="mt-3 block text-3xl">↻</span></motion.span></button>;
}

export function ReasonReveal({ reason, reducedMotion, opening, onReveal }: Props) {
  if (reason.reveal === "pull") return <PullReveal onReveal={onReveal} reducedMotion={reducedMotion} />;
  if (reason.reveal === "scratch") return <ScratchReveal onReveal={onReveal} />;
  if (reason.reveal === "peel") return <PeelReveal onReveal={onReveal} reducedMotion={reducedMotion} />;
  if (reason.reveal === "hold") return <HoldReveal onReveal={onReveal} />;
  if (reason.reveal === "flip") return <FlipReveal onReveal={onReveal} reducedMotion={reducedMotion} />;
  return <motion.button type="button" onClick={onReveal} disabled={opening} data-romantic-interactive whileHover={reducedMotion || opening ? undefined : { y: -4, rotate: -.25 }} whileTap={reducedMotion || opening ? undefined : { scale: .985 }} transition={motionSprings.tactile} className="group relative mx-auto block w-full max-w-xl rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-wine"><EnvelopeShell><div className="absolute inset-x-[9%] bottom-3 h-[72%] rounded-t-sm bg-[#fffaf0] shadow-md"/><div className="absolute inset-x-0 top-0 z-30 h-[58%] origin-top bg-[#f1d9d3] [clip-path:polygon(0_0,100%_0,50%_100%)]"/><span className="absolute left-1/2 top-[47%] z-40 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#e8cbc5] bg-wine font-display text-lg text-white shadow-md">&</span><span className="absolute inset-x-0 bottom-7 z-40 text-center text-[9px] font-bold uppercase tracking-[.28em] text-wine/65">Tap to open</span></EnvelopeShell></motion.button>;
}
