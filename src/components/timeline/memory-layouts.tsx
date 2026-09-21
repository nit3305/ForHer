"use client";

import type { TimelineMemory } from "@/config/relationship";
import {
  DraggableMemoryPhoto,
  FlippableMemoryPhoto,
  MemoryKeepsake,
  MemoryPhotoTrail,
} from "./memory-interactions";

type LayoutProps = {
  memory: TimelineMemory;
  reducedMotion: boolean;
  onInteractionComplete?: () => void;
};

export function MemoryLayout({
  memory,
  reducedMotion,
  onInteractionComplete,
}: LayoutProps) {
  switch (memory.layout) {
    case "hero":
      return (
        <HeroLayout
          memory={memory}
          reducedMotion={reducedMotion}
        />
      );

    case "polaroid":
      return (
        <PolaroidLayout
          memory={memory}
          reducedMotion={reducedMotion}
          onInteractionComplete={onInteractionComplete}
        />
      );

    case "split":
      return (
        <SplitLayout
          memory={memory}
          reducedMotion={reducedMotion}
          onInteractionComplete={onInteractionComplete}
        />
      );

    case "details":
      return (
        <DetailsLayout
          memory={memory}
          reducedMotion={reducedMotion}
          onInteractionComplete={onInteractionComplete}
        />
      );

    case "note":
      return (
        <NoteLayout
          memory={memory}
          reducedMotion={reducedMotion}
          onInteractionComplete={onInteractionComplete}
        />
      );

    case "final":
      return (
        <FinalLayout
          memory={memory}
          reducedMotion={reducedMotion}
        />
      );

    default:
      return null;
  }
}

function HeroLayout({
  memory,
  reducedMotion,
}: {
  memory: TimelineMemory;
  reducedMotion: boolean;
}) {
  const image = memory.images?.[0];

  return (
    <div className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1fr_1.1fr]">
      <div className="text-center md:text-left">
        {memory.eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-wine/50">
            {memory.eyebrow}
          </p>
        )}

        <h2 className="mt-3 font-display text-4xl italic text-wine sm:text-5xl">
          {memory.title}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ink/65 md:mx-0">
          {memory.message}
        </p>

        {memory.note && (
          <p className="handwritten mx-auto mt-5 max-w-md text-lg text-ink/55 md:mx-0">
            {memory.note}
          </p>
        )}
      </div>

      {image && (
        <div className="relative mx-auto w-full max-w-md">
          <div
            className={`relative aspect-[4/5] rotate-1 overflow-hidden rounded-sm bg-[#fffdf8] p-3 pb-12 shadow-[0_20px_45px_rgba(91,51,57,.14)] ${
              reducedMotion ? "" : "transition-transform hover:-rotate-1"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />

            <p className="handwritten absolute bottom-3 left-0 right-0 text-center text-base text-ink/55">
              {memory.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PolaroidLayout({
  memory,
  reducedMotion,
  onInteractionComplete,
}: LayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-[.85fr_1fr]">
      <div className="order-2 text-center md:order-1 md:text-left">
        {memory.date && (
          <p className="handwritten text-lg text-wine/60">
            {memory.date}
          </p>
        )}

        {memory.eyebrow && (
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-wine/45">
            {memory.eyebrow}
          </p>
        )}

        <h2 className="mt-3 font-display text-4xl italic text-wine sm:text-5xl">
          {memory.title}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ink/65 md:mx-0">
          {memory.message}
        </p>

        {memory.note && (
          <p className="handwritten mx-auto mt-5 max-w-md text-lg leading-7 text-ink/55 md:mx-0">
            {memory.note}
          </p>
        )}
      </div>

      <div className="order-1 flex justify-center md:order-2">
        {memory.interaction === "drag" && (
          <DraggableMemoryPhoto
            memory={memory}
            reducedMotion={reducedMotion}
            onComplete={onInteractionComplete}
          />
        )}

        {memory.interaction === "flip" && (
          <FlippableMemoryPhoto
            memory={memory}
            reducedMotion={reducedMotion}
            onComplete={onInteractionComplete}
          />
        )}

        {memory.interaction === "trail" && (
          <MemoryPhotoTrail
            memory={memory}
            reducedMotion={reducedMotion}
            onComplete={onInteractionComplete}
          />
        )}

        {memory.interaction === "keepsake" && (
          <MemoryKeepsake
            memory={memory}
            reducedMotion={reducedMotion}
            onComplete={onInteractionComplete}
          />
        )}

        {!memory.interaction && (
          <HeroPlaceholder memory={memory} />
        )}
      </div>
    </div>
  );
}

function SplitLayout({
  memory,
  reducedMotion,
  onInteractionComplete,
}: LayoutProps) {
  const image = memory.images?.[0];

  return (
    <div className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-2">
      <div>
        {image && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#fffdf8] p-3 shadow-[0_20px_45px_rgba(91,51,57,.14)]">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="text-center md:text-left">
        {memory.eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-wine/50">
            {memory.eyebrow}
          </p>
        )}

        <h2 className="mt-3 font-display text-4xl italic text-wine">
          {memory.title}
        </h2>

        <p className="mt-5 text-sm leading-7 text-ink/65">
          {memory.message}
        </p>

        {memory.interaction === "drag" && (
          <div className="mt-8 flex justify-center md:justify-start">
            <DraggableMemoryPhoto
              memory={memory}
              reducedMotion={reducedMotion}
              onComplete={onInteractionComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailsLayout({
  memory,
  reducedMotion,
  onInteractionComplete,
}: LayoutProps) {
  return (
    <div className="mx-auto w-full max-w-4xl text-center">
      {memory.eyebrow && (
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-wine/50">
          {memory.eyebrow}
        </p>
      )}

      <h2 className="mt-3 font-display text-4xl italic text-wine sm:text-5xl">
        {memory.title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-ink/65">
        {memory.message}
      </p>

      {memory.details && memory.details.length > 0 && (
        <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
          {memory.details.map((detail) => (
            <div
              key={detail}
              className="rounded-xl border border-wine/10 bg-white/60 px-5 py-4 text-sm text-ink/65"
            >
              {detail}
            </div>
          ))}
        </div>
      )}

      {memory.interaction === "keepsake" && (
        <div className="mt-8">
          <MemoryKeepsake
            memory={memory}
            reducedMotion={reducedMotion}
            onComplete={onInteractionComplete}
          />
        </div>
      )}
    </div>
  );
}

function NoteLayout({
  memory,
  reducedMotion,
  onInteractionComplete,
}: LayoutProps) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-sm border border-wine/10 bg-[#fffaf4] p-8 shadow-[0_20px_45px_rgba(91,51,57,.1)] sm:p-12">
        {memory.eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-wine/50">
            {memory.eyebrow}
          </p>
        )}

        <h2 className="mt-3 font-display text-4xl italic text-wine">
          {memory.title}
        </h2>

        <p className="mt-5 text-sm leading-8 text-ink/65">
          {memory.message}
        </p>

        {memory.note && (
          <p className="handwritten mt-6 text-lg leading-7 text-ink/55">
            {memory.note}
          </p>
        )}

        {memory.interaction === "keepsake" && (
          <div className="mt-8 flex justify-center">
            <MemoryKeepsake
              memory={memory}
              reducedMotion={reducedMotion}
              onComplete={onInteractionComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FinalLayout({
  memory,
}: {
  memory: TimelineMemory;
  reducedMotion: boolean;
}) {
  const image = memory.images?.[0];

  return (
    <div className="mx-auto w-full max-w-5xl text-center">
      {memory.eyebrow && (
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-wine/50">
          {memory.eyebrow}
        </p>
      )}

      <h2 className="mt-3 font-display text-4xl italic text-wine sm:text-5xl">
        {memory.title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-ink/65">
        {memory.message}
      </p>

      {image && (
        <div className="mx-auto mt-8 max-w-md rotate-1 rounded-sm bg-[#fffdf8] p-3 pb-12 shadow-[0_20px_45px_rgba(91,51,57,.14)]">
          <div className="aspect-[4/5] overflow-hidden bg-[#f2e7dc]">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </div>

          <p className="handwritten mt-3 text-base text-ink/55">
            {memory.note ?? "still becoming ♡"}
          </p>
        </div>
      )}
    </div>
  );
}

function HeroPlaceholder({
  memory,
}: {
  memory: TimelineMemory;
}) {
  const image = memory.images?.[0];

  if (!image) {
    return (
      <div className="flex h-[300px] w-[260px] items-center justify-center rounded-sm border border-dashed border-wine/20 bg-white/40 text-sm text-ink/40">
        no photograph yet ♡
      </div>
    );
  }

  return (
    <div className="relative w-[min(72vw,310px)] rotate-1 rounded-sm bg-[#fffdf8] p-3 pb-10 shadow-[0_18px_35px_rgba(91,51,57,.14)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2e7dc]">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="handwritten absolute bottom-2 left-0 right-0 text-center text-base text-ink/55">
        {memory.title}
      </p>
    </div>
  );
}