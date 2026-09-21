"use client";

import {
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, type PanInfo } from "motion/react";
import type { LoveReason } from "@/config/relationship";
import { relationshipConfig } from "@/config/relationship";
import { motionEasings, motionSprings } from "@/lib/motion";

type Props = {
  reason: LoveReason;
  reducedMotion: boolean;
  opening: boolean;
  onReveal: () => void;
};

const copy = relationshipConfig.loveNotes.interactions;

function EnvelopeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative aspect-[5/3] w-full max-w-xl overflow-hidden rounded-xl bg-[#e8cbc5] shadow-[0_26px_65px_rgba(91,51,57,.17)]">
      {children}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 [clip-path:polygon(0_100%,50%_45%,100%_100%)] bg-[#dfbbb7]"
      />
    </div>
  );
}

/* ─────────────────────────────
   REASON 2 — PULL
───────────────────────────── */

function PullReveal({
  onReveal,
  reducedMotion,
}: Pick<Props, "onReveal" | "reducedMotion">) {
  return (
    <div className="mx-auto w-full max-w-xl pt-12 text-center">
      <EnvelopeShell>
        <motion.button
          type="button"
          drag={reducedMotion ? false : "y"}
          dragConstraints={{ top: -180, bottom: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={(_, info: PanInfo) => {
            if (info.offset.y < -65) {
              onReveal();
            }
          }}
          onClick={reducedMotion ? onReveal : undefined}
          data-romantic-interactive
          aria-label={`${copy.pullHint}. Press Enter to reveal.`}
          className="absolute inset-x-[9%] bottom-2 z-10 h-[78%] touch-none rounded-t-sm bg-[#fffaf0] p-5 font-display text-lg italic text-wine shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
        >
          <span className="block">{copy.pullHint}</span>
          <span className="mt-4 block text-2xl">↑</span>
        </motion.button>
      </EnvelopeShell>

      <button
        type="button"
        onClick={onReveal}
        className="mt-4 min-h-11 px-4 text-xs font-bold text-wine underline decoration-rose/30 underline-offset-4"
      >
        {copy.pullFallback}
      </button>
    </div>
  );
}

/* ─────────────────────────────
   REASON 3 — SCRATCH
───────────────────────────── */

function ScratchReveal({
  onReveal,
}: Pick<Props, "onReveal">) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const revealed = useRef(false);
  const scratchCount = useRef(0);

  const [progress, setProgress] = useState(0);

  const BRUSH_SIZE = 58;
  const REQUIRED_PROGRESS = 0.34;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);

      const context = canvas.getContext("2d");

      if (!context) return;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      /* Base scratch coating */
      context.globalCompositeOperation = "source-over";
      context.fillStyle = "#dcaeb0";
      context.fillRect(0, 0, rect.width, rect.height);

      /* Soft scratch-card texture */
      for (let index = 0; index < 240; index += 1) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const size = Math.random() * 3 + 1;

        context.globalAlpha = 0.12;
        context.fillStyle =
          index % 2 === 0 ? "#fff7f2" : "#8f5865";

        context.fillRect(x, y, size, size);
      }

      context.globalAlpha = 1;

      context.fillStyle = "rgba(127,57,72,.82)";
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.font = "600 16px Georgia";
      context.fillText(
        "scratch me ♡",
        rect.width / 2,
        rect.height / 2 - 13,
      );

      context.font = "12px Georgia";
      context.fillText(
        "something is hiding underneath",
        rect.width / 2,
        rect.height / 2 + 15,
      );
    };

    setupCanvas();

    window.addEventListener("resize", setupCanvas);

    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  function calculateProgress() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const image = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    let transparent = 0;
    let samples = 0;

    /*
     * Sample every 32 RGBA bytes.
     * This keeps the interaction smooth even on phones.
     */
    for (
      let index = 3;
      index < image.data.length;
      index += 32
    ) {
      samples += 1;

      if (image.data[index] < 80) {
        transparent += 1;
      }
    }

    if (!samples) return;

    const amount = transparent / samples;
    const percentage = Math.min(
      100,
      Math.round(amount * 100),
    );

    setProgress(percentage);

    if (
      amount >= REQUIRED_PROGRESS &&
      !revealed.current
    ) {
      revealed.current = true;
      drawing.current = false;
      onReveal();
    }
  }

  function scratchAt(
    event: PointerEvent<HTMLCanvasElement>,
  ) {
    if (!drawing.current || revealed.current) return;

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");

    if (!context) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = BRUSH_SIZE;

    const previous = lastPoint.current;

    context.beginPath();

    if (previous) {
      context.moveTo(previous.x, previous.y);
      context.lineTo(x, y);
    } else {
      context.moveTo(x, y);
      context.lineTo(x + 0.1, y + 0.1);
    }

    context.stroke();

    /*
     * Extra circular dab makes the scratch
     * feel much more forgiving.
     */
    context.beginPath();
    context.arc(
      x,
      y,
      BRUSH_SIZE / 2,
      0,
      Math.PI * 2,
    );
    context.fill();

    lastPoint.current = { x, y };

    scratchCount.current += 1;

    if (scratchCount.current % 6 === 0) {
      calculateProgress();
    }
  }

  function startScratch(
    event: PointerEvent<HTMLCanvasElement>,
  ) {
    if (revealed.current) return;

    drawing.current = true;
    lastPoint.current = null;

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    scratchAt(event);
  }

  function stopScratch() {
    if (!drawing.current) return;

    drawing.current = false;
    lastPoint.current = null;

    calculateProgress();
  }

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <div className="relative overflow-hidden rounded-xl bg-[#fffaf0] shadow-[0_24px_65px_rgba(91,51,57,.14)]">
        <div className="relative min-h-[330px]">
          {/* Hidden message */}
          <div className="absolute inset-0 grid place-items-center p-10">
            <div>
              <p className="font-display text-3xl italic text-wine">
                {copy.scratchUnderlay}
              </p>

              <p className="mt-3 text-xs text-ink/45">
                keep scratching until you find it ♡
              </p>
            </div>
          </div>

          {/* Scratch layer */}
          <canvas
            ref={canvasRef}
            data-romantic-interactive
            onPointerDown={startScratch}
            onPointerMove={scratchAt}
            onPointerUp={stopScratch}
            onPointerCancel={stopScratch}
            onPointerLeave={stopScratch}
            className="absolute inset-0 size-full cursor-crosshair touch-none select-none"
            aria-label={copy.scratchHint}
          />

          {/* Progress */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-[72%] -translate-x-1/2">
            <div className="h-1.5 overflow-hidden rounded-full bg-wine/10">
              <motion.div
                className="h-full rounded-full bg-wine/45"
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.12,
                }}
              />
            </div>

            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-wine/45">
              {progress >= 100
                ? "found it ♡"
                : `${progress}% revealed`}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onReveal}
        className="mt-5 min-h-11 px-4 text-xs font-bold text-wine underline decoration-rose/30 underline-offset-4"
      >
        {copy.scratchFallback}
      </button>
    </div>
  );
}

/* ─────────────────────────────
   REASON 4 — PEEL
───────────────────────────── */

function PeelReveal({
  onReveal,
  reducedMotion,
}: Pick<Props, "onReveal" | "reducedMotion">) {
  return (
    <div className="mx-auto grid min-h-[340px] max-w-xl place-items-center rounded-xl bg-[#fffaf0] shadow-[0_24px_65px_rgba(91,51,57,.14)]">
      <motion.button
        type="button"
        drag={reducedMotion ? false : "x"}
        dragConstraints={{
          left: -10,
          right: 110,
        }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.x > 52) {
            onReveal();
          }
        }}
        onClick={onReveal}
        data-romantic-interactive
        className="grid size-36 touch-pan-y place-items-center rounded-[42%_50%_46%_54%] bg-blush font-display text-lg italic text-wine shadow-[0_15px_35px_rgba(91,51,57,.15)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
      >
        <span>
          {copy.peelHint}
          <br />
          <span className="text-2xl">→</span>
        </span>
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────
   REASON 5 — HOLD
───────────────────────────── */

function HoldReveal({
  onReveal,
}: Pick<Props, "onReveal">) {
  const timer = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);
  const [released, setReleased] = useState(false);

  function start() {
    setReleased(false);
    setHolding(true);

    timer.current = window.setTimeout(() => {
      onReveal();
    }, 1700);
  }

  function stop() {
    if (holding) {
      setReleased(true);
    }

    setHolding(false);

    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  return (
    <div className="mx-auto flex min-h-[340px] max-w-xl flex-col items-center justify-center rounded-xl bg-[#fffaf0] p-8 text-center shadow-[0_24px_65px_rgba(91,51,57,.14)]">
      <motion.button
        type="button"
        data-romantic-interactive
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        animate={{
          scale: holding ? 1.12 : 1,
        }}
        transition={{
          duration: holding ? 1.7 : 0.2,
          ease: motionEasings.cinematic,
        }}
        aria-label={copy.holdHint}
        className="grid size-28 place-items-center rounded-full bg-blush/60 font-display text-5xl text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
      >
        ♥
      </motion.button>

      <p
        aria-live="polite"
        className="mt-6 font-display text-xl italic text-wine"
      >
        {holding
          ? copy.holdActive
          : released
            ? copy.holdReleased
            : copy.holdHint}
      </p>

      <button
        type="button"
        onClick={onReveal}
        className="mt-4 min-h-11 px-4 text-xs font-bold text-wine underline decoration-rose/30 underline-offset-4"
      >
        {copy.holdFallback}
      </button>
    </div>
  );
}

/* ─────────────────────────────
   REASON 6 — FLIP
───────────────────────────── */

function FlipReveal({
  onReveal,
  reducedMotion,
}: Pick<Props, "onReveal" | "reducedMotion">) {
  return (
    <button
      type="button"
      data-romantic-interactive
      onClick={onReveal}
      aria-label={copy.flipHint}
      className="mx-auto block min-h-[340px] w-full max-w-xl [perspective:900px] focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-wine"
    >
      <motion.span
        whileHover={
          reducedMotion
            ? undefined
            : {
                rotateY: 8,
                rotate: -0.5,
              }
        }
        whileTap={
          reducedMotion
            ? undefined
            : {
                rotateY: 24,
              }
        }
        transition={motionSprings.photograph}
        className="grid min-h-[340px] place-items-center rounded-sm bg-[#fffaf0] p-8 font-display text-2xl italic text-wine shadow-[0_24px_65px_rgba(91,51,57,.14)] [transform-style:preserve-3d]"
      >
        <span>
          {copy.flipHint}
          <span className="mt-3 block text-3xl">
            ↻
          </span>
        </span>
      </motion.span>
    </button>
  );
}

/* ─────────────────────────────
   MAIN EXPORT
───────────────────────────── */

export function ReasonReveal({
  reason,
  reducedMotion,
  opening,
  onReveal,
}: Props) {
  if (reason.reveal === "pull") {
    return (
      <PullReveal
        onReveal={onReveal}
        reducedMotion={reducedMotion}
      />
    );
  }

  if (reason.reveal === "scratch") {
    return (
      <ScratchReveal
        onReveal={onReveal}
      />
    );
  }

  if (reason.reveal === "peel") {
    return (
      <PeelReveal
        onReveal={onReveal}
        reducedMotion={reducedMotion}
      />
    );
  }

  if (reason.reveal === "hold") {
    return (
      <HoldReveal
        onReveal={onReveal}
      />
    );
  }

  if (reason.reveal === "flip") {
    return (
      <FlipReveal
        onReveal={onReveal}
        reducedMotion={reducedMotion}
      />
    );
  }

  /*
   * Default = envelope.
   * This is Reason 1 and Reason 6.
   */
  return (
    <motion.button
      type="button"
      onClick={onReveal}
      disabled={opening}
      data-romantic-interactive
      whileHover={
        reducedMotion || opening
          ? undefined
          : {
              y: -4,
              rotate: -0.25,
            }
      }
      whileTap={
        reducedMotion || opening
          ? undefined
          : {
              scale: 0.985,
            }
      }
      transition={motionSprings.tactile}
      className="group relative mx-auto block w-full max-w-xl rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-wine"
    >
      <EnvelopeShell>
        <div className="absolute inset-x-[9%] bottom-3 h-[72%] rounded-t-sm bg-[#fffaf0] shadow-md" />

        <div className="absolute inset-x-0 top-0 z-30 h-[58%] origin-top bg-[#f1d9d3] [clip-path:polygon(0_0,100%_0,50%_100%)]" />

        <span className="absolute left-1/2 top-[47%] z-40 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#e8cbc5] bg-wine font-display text-lg text-white shadow-md">
          ♡
        </span>

        <span className="absolute inset-x-0 bottom-7 z-40 text-center text-[9px] font-bold uppercase tracking-[.28em] text-wine/65">
          {opening ? "opening…" : "Tap to open"}
        </span>
      </EnvelopeShell>
    </motion.button>
  );
}