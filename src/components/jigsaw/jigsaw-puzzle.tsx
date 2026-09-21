"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { motionDurations, motionEasings, motionSprings } from "@/lib/motion";
import { createJigsawPieces, JIGSAW_TAB_DEPTH, type JigsawPieceDefinition } from "./jigsaw-geometry";
import { JigsawPieceGraphic } from "./jigsaw-piece-graphic";

type JigsawPuzzleProps = { onContinue: () => void };

function boardPieceStyle(piece: JigsawPieceDefinition, rows: number, columns: number) {
  return {
    left: `${((piece.column - JIGSAW_TAB_DEPTH) / columns) * 100}%`,
    top: `${((piece.row - JIGSAW_TAB_DEPTH) / rows) * 100}%`,
    width: `${((1 + JIGSAW_TAB_DEPTH * 2) / columns) * 100}%`,
    height: `${((1 + JIGSAW_TAB_DEPTH * 2) / rows) * 100}%`,
  };
}

function targetMetrics(piece: JigsawPieceDefinition, board: DOMRect, rows: number, columns: number) {
  const width = board.width / columns;
  const height = board.height / rows;
  const left = board.left + piece.column * width;
  const top = board.top + piece.row * height;
  return { left, top, right: left + width, bottom: top + height, width, height, centerX: left + width / 2, centerY: top + height / 2 };
}

function overlapRatio(pieceRect: DOMRect, target: ReturnType<typeof targetMetrics>) {
  const width = Math.max(0, Math.min(pieceRect.right, target.right) - Math.max(pieceRect.left, target.left));
  const height = Math.max(0, Math.min(pieceRect.bottom, target.bottom) - Math.max(pieceRect.top, target.top));
  const overlap = width * height;
  return overlap / Math.max(1, Math.min(pieceRect.width * pieceRect.height, target.width * target.height));
}

export function JigsawPuzzle({ onContinue }: JigsawPuzzleProps) {
  const config = relationshipConfig.puzzle;
  const pieces = useMemo(() => createJigsawPieces(config.rows, config.columns), [config.rows, config.columns]);
  const [placedIds, setPlacedIds] = useState<Set<number>>(() => new Set());
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hintedId, setHintedId] = useState<number | null>(null);
  const [hintStrength, setHintStrength] = useState<0 | 1 | 2>(0);
  const [magnetizedId, setMagnetizedId] = useState<number | null>(null);
  const [placementMessage, setPlacementMessage] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [merged, setMerged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const hintCursor = useRef(0);
  const hintTimer = useRef<number | null>(null);
  const completionTimers = useRef<number[]>([]);
  const dragOrigin = useRef<{ pieceId: number; left: number; top: number; width: number; height: number } | null>(null);
  const pieceNodes = useRef(new Map<number, HTMLButtonElement>());
  const reducedMotion = useReducedMotion() ?? false;
  const totalPieces = pieces.length;
  const loosePieces = pieces.filter((piece) => !placedIds.has(piece.id));
  const guidedId = hintedId ?? magnetizedId ?? selectedId;

  const placePiece = useCallback((pieceId: number) => {
    setPlacedIds((current) => {
      if (current.has(pieceId)) return current;
      const next = new Set(current);
      next.add(pieceId);
      return next;
    });
    setSelectedId(null);
    setHintedId(null);
    setHintStrength(0);
    setMagnetizedId(null);
    setPlacementMessage("");
  }, []);

  useEffect(() => {
    if (placedIds.size !== totalPieces || completed) return;
    const after = (delay: number, action: () => void) => {
      const timer = window.setTimeout(action, reducedMotion ? 20 : delay);
      completionTimers.current.push(timer);
    };
    after(260, () => setCompleted(true));
    after(880, () => setMerged(true));
    after(1480, () => setShowSuccess(true));
  }, [completed, placedIds.size, reducedMotion, totalPieces]);

  useEffect(() => () => {
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    completionTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function isNearTarget(piece: JigsawPieceDefinition, pieceRect: DOMRect, multiplier = 1) {
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return false;
    const target = targetMetrics(piece, board, config.rows, config.columns);
    const centerX = pieceRect.left + pieceRect.width / 2;
    const centerY = pieceRect.top + pieceRect.height / 2;
    const distance = Math.hypot(centerX - target.centerX, centerY - target.centerY);
    const snapRadius = Math.max(56, target.width * config.snapRadiusRatio) * multiplier;
    return distance <= snapRadius || overlapRatio(pieceRect, target) >= 0.18;
  }

  function draggedRect(pieceId: number, info: PanInfo) {
    const origin = dragOrigin.current;
    if (!origin || origin.pieceId !== pieceId) return null;
    return {
      left: origin.left + info.offset.x,
      top: origin.top + info.offset.y,
      width: origin.width,
      height: origin.height,
    } as DOMRect;
  }

  function handleDrag(piece: JigsawPieceDefinition, info: PanInfo) {
    const rect = draggedRect(piece.id, info);
    if (!rect) return;
    const near = isNearTarget(piece, rect, 1.55);
    setMagnetizedId((current) => near ? piece.id : current === piece.id ? null : current);
  }

  function handleDragEnd(piece: JigsawPieceDefinition, info: PanInfo) {
    setDraggingId(null);
    setMagnetizedId(null);
    const rect = draggedRect(piece.id, info);
    dragOrigin.current = null;
    if (rect && isNearTarget(piece, rect)) placePiece(piece.id);
  }

  function selectPiece(pieceId: number) {
    setSelectedId(pieceId);
    setPlacementMessage(config.selectionHint);
  }

  function handleBoardPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (selectedId === null || placedIds.has(selectedId)) return;
    const board = boardRef.current?.getBoundingClientRect();
    const piece = pieces.find((candidate) => candidate.id === selectedId);
    if (!board || !piece) return;
    const target = targetMetrics(piece, board, config.rows, config.columns);
    const distance = Math.hypot(event.clientX - target.centerX, event.clientY - target.centerY);
    const radius = Math.max(64, target.width * config.snapRadiusRatio * 1.25);
    if (distance <= radius) placePiece(piece.id);
    else setPlacementMessage("A little closer to the glowing spot ♡");
  }

  function requestHint() {
    if (loosePieces.length === 0) return;
    const activeHint = hintedId === null ? null : loosePieces.find((piece) => piece.id === hintedId);
    const next = activeHint ?? loosePieces[hintCursor.current % loosePieces.length];
    if (!activeHint) hintCursor.current += 1;
    setHintedId(next.id);
    setSelectedId(next.id);
    setHintStrength(activeHint ? 2 : 1);
    setPlacementMessage(activeHint ? config.strongerHintMessage : config.hintMessage);
    document.querySelector(`[data-jigsaw-piece="${next.id}"]`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => {
      setHintedId(null);
      setHintStrength(0);
      setPlacementMessage("");
    }, 6500);
  }

  function beginPreview() {
    if (!completed) setPreviewing(true);
  }

  function endPreview() {
    setPreviewing(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-[760px]">
      <div className="mb-5 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.28em] text-rose">The picture</p>
          <h2 className="font-display text-3xl leading-tight text-wine">Piece by piece</h2>
        </div>
        <div className="min-w-24 text-right" aria-live="polite">
          <p className="font-display text-2xl leading-none text-wine">{placedIds.size} / {totalPieces} ♡</p>
        </div>
      </div>

      <div ref={workspaceRef} className="relative">
        <motion.div
          ref={boardRef}
          className="sticky top-2 z-20 mx-auto aspect-square w-full max-w-[460px] overflow-visible rounded-[1.1rem] border border-white/80 bg-blush/30 shadow-[0_18px_42px_rgba(91,51,57,.12)] md:relative md:top-auto"
          animate={{ boxShadow: merged ? "0 12px 30px rgba(91,51,57,.10)" : "0 22px 55px rgba(91,51,57,.14)" }}
          transition={{ duration: reducedMotion ? 0 : motionDurations.emotional, ease: motionEasings.cinematic }}
          role="button"
          tabIndex={selectedId === null ? -1 : 0}
          onPointerDown={handleBoardPointerDown}
          onKeyDown={(event) => {
            if (selectedId !== null && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              placePiece(selectedId);
            }
          }}
          aria-label={`${config.rows} by ${config.columns} jigsaw puzzle using ${config.imageAlt}. ${placedIds.size} of ${totalPieces} pieces placed.`}
          aria-describedby="jigsaw-help jigsaw-live-help"
        >
          <div className="absolute inset-[3.5%] rounded-xl bg-paper/50" aria-hidden="true" />
          <Image src={config.imageSrc} alt="" fill sizes="(max-width: 640px) 92vw, 460px" className={`pointer-events-none rounded-[1.1rem] object-cover transition-opacity duration-200 ${hintedId !== null ? "opacity-[.16]" : "opacity-[.055]"}`} aria-hidden="true" />
          <AnimatePresence initial={false}>
            {pieces.map((piece) => placedIds.has(piece.id) && (
              <motion.div
                layoutId={`jigsaw-piece-${piece.id}`}
                key={`placed-${piece.id}`}
                className="pointer-events-none absolute"
                style={boardPieceStyle(piece, config.rows, config.columns)}
                initial={reducedMotion ? false : { scale: 1.055 }}
                animate={{ scale: 1, opacity: merged ? 0 : 1 }}
                transition={reducedMotion ? { duration: 0 } : motionSprings.settle}
              >
                <JigsawPieceGraphic piece={piece} rows={config.rows} columns={config.columns} imageSrc={config.imageSrc} instance="board" seamsVisible={!completed} />
                {!completed && !reducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[22%] rounded-full bg-[#fff0bd]/65 mix-blend-screen"
                    initial={{ opacity: 0.8, scale: 0.65 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: motionDurations.standard, ease: motionEasings.enter }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {guidedId !== null && !placedIds.has(guidedId) && (() => {
            const guidedPiece = pieces.find((piece) => piece.id === guidedId);
            const stronglyGuided = hintedId === guidedId || magnetizedId === guidedId;
            return guidedPiece ? (
              <motion.div
                data-jigsaw-target={guidedId}
                className={`pointer-events-none absolute z-30 ${stronglyGuided ? "drop-shadow-[0_0_13px_rgba(184,95,114,.62)]" : "opacity-55"}`}
                style={boardPieceStyle(guidedPiece, config.rows, config.columns)}
                initial={{ opacity: 0 }} animate={{ opacity: 1, scale: hintStrength === 2 ? 1.045 : 1 }} exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : .2, ease: motionEasings.enter }}
              >
                <JigsawPieceGraphic piece={guidedPiece} rows={config.rows} columns={config.columns} instance="hint" outlineOnly highlighted={stronglyGuided} />
              </motion.div>
            ) : null;
          })()}
          <motion.div className="absolute inset-0 overflow-hidden rounded-[1.35rem]" initial={false} animate={{ opacity: merged || previewing ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : merged ? motionDurations.emotional : motionDurations.standard, ease: motionEasings.cinematic }} aria-hidden={!merged}>
            <Image src={config.imageSrc} alt={merged ? config.imageAlt : "Completed photograph preview"} fill sizes="(max-width: 640px) 92vw, 500px" className="object-cover" priority />
          </motion.div>
        </motion.div>

        <p id="jigsaw-live-help" aria-live="polite" className="mx-auto min-h-8 max-w-md px-3 pt-2 text-center font-display text-sm italic text-rose">{placementMessage}</p>

        <motion.div animate={{ opacity: previewing || completed ? 0.22 : 1 }} transition={{ duration: reducedMotion ? 0 : motionDurations.standard }} className="relative z-10 mt-5">
          <div className="rounded-[1.1rem] border border-rose/15 bg-white/35">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-[.24em] text-rose">Loose pieces</span>
                <span className="mt-1 block text-[11px] text-ink/45">Tap one or drag it toward the board.</span>
              </span>
              <span className="rounded-full bg-white/60 px-3 py-1 text-[9px] font-bold uppercase tracking-[.18em] text-wine">{loosePieces.length} left</span>
            </div>
          <div className="grid grid-cols-4 gap-x-1 gap-y-3 border-t border-rose/10 p-2.5 min-[22.5rem]:grid-cols-5 sm:gap-x-3 sm:gap-y-4 sm:p-5 md:grid-cols-8 md:gap-x-2 md:gap-y-3" aria-label="Loose jigsaw piece tray">
            {loosePieces.map((piece) => (
              <motion.button
                layoutId={`jigsaw-piece-${piece.id}`}
                key={piece.id}
                type="button"
                ref={(node) => {
                  if (node) pieceNodes.current.set(piece.id, node);
                  else pieceNodes.current.delete(piece.id);
                }}
                data-jigsaw-piece={piece.id}
                aria-label={`Photo piece ${piece.id + 1}. Drag it to the board, or press Enter to place it with the keyboard.`}
                aria-pressed={selectedId === piece.id}
                onClick={() => selectPiece(piece.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    placePiece(piece.id);
                  }
                }}
                drag={!completed && !previewing}
                dragConstraints={workspaceRef}
                dragElastic={0.08}
                dragMomentum={false}
                dragSnapToOrigin
                onDragStart={() => {
                  const rect = pieceNodes.current.get(piece.id)?.getBoundingClientRect();
                  if (!rect) return;
                  dragOrigin.current = { pieceId: piece.id, left: rect.left, top: rect.top, width: rect.width, height: rect.height };
                  setDraggingId(piece.id);
                  setSelectedId(piece.id);
                  setPlacementMessage(config.selectionHint);
                }}
                onDrag={(_event, info) => handleDrag(piece, info)}
                onDragEnd={(_event, info) => handleDragEnd(piece, info)}
                animate={{ rotate: draggingId === piece.id || reducedMotion ? 0 : piece.restingRotation, y: hintedId === piece.id && !reducedMotion ? -7 : 0, opacity: hintedId !== null && hintedId !== piece.id ? .32 : 1, scale: hintedId === piece.id && hintStrength === 2 && !reducedMotion ? 1.08 : 1 }}
                whileDrag={reducedMotion ? { zIndex: 50 } : { scale: 1.08, rotate: 0, zIndex: 50 }}
                transition={reducedMotion ? { duration: 0 } : motionSprings.tactile}
                className={`jigsaw-drag-piece relative z-10 aspect-square min-h-14 min-w-14 w-full scroll-mt-[330px] cursor-grab touch-none overflow-visible rounded-lg focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine active:cursor-grabbing md:scroll-mt-0 ${draggingId === piece.id ? "drop-shadow-[0_10px_12px_rgba(91,51,57,.28)]" : ""} ${selectedId === piece.id ? "ring-2 ring-rose/55 ring-offset-2 ring-offset-paper" : ""} ${hintedId === piece.id ? "ring-2 ring-rose ring-offset-4 ring-offset-paper" : ""}`}
              >
                <JigsawPieceGraphic piece={piece} rows={config.rows} columns={config.columns} imageSrc={config.imageSrc} instance="tray" />
              </motion.button>
            ))}
          </div>
          </div>
        </motion.div>
      </div>

      <motion.div className="mt-5 flex items-center justify-between gap-3" animate={{ opacity: completed ? 0 : 1 }}>
        {config.showPreview && (
          <button
            type="button"
            onPointerDown={beginPreview}
            onPointerUp={endPreview}
            onPointerCancel={endPreview}
            onPointerLeave={endPreview}
            onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") beginPreview(); }}
            onKeyUp={(event) => { if (event.key === " " || event.key === "Enter") endPreview(); }}
            disabled={completed}
            className="min-h-11 flex-1 rounded-full border border-rose/25 bg-white/45 px-4 text-xs font-bold text-wine hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine disabled:opacity-40"
          >
            {config.previewLabel}
          </button>
        )}
        {config.showHints && (
          <button type="button" onClick={requestHint} disabled={completed} className="min-h-11 rounded-full border border-rose/25 bg-white/45 px-5 text-xs font-bold text-wine hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine disabled:opacity-40">
            {config.hintLabel}
          </button>
        )}
      </motion.div>
      <p id="jigsaw-help" className="mt-3 text-center text-[10px] leading-4 text-ink/40">{config.selectionHint} Keyboard: focus a piece and press Enter or Space.</p>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 14, filter: reducedMotion ? "blur(0px)" : "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: reducedMotion ? 0.1 : motionDurations.reveal, ease: motionEasings.enter }} className="pt-7 text-center" aria-live="polite">
            <p className="font-display text-3xl italic text-wine">{config.successMessage}</p>
            <button type="button" onClick={onContinue} className="mt-5 rounded-full bg-wine px-8 py-4 text-sm font-bold text-white shadow-[0_14px_35px_rgba(127,57,72,.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">
              {config.continueButtonLabel} <span className="cinematic-arrow" aria-hidden="true">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
