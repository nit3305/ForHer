"use client";

import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  PanInfo,
  useReducedMotion,
} from "motion/react";

import { relationshipConfig } from "@/config/relationship";
import {
  motionDurations,
  motionEasings,
  motionSprings,
} from "@/lib/motion";
import {
  createJigsawPieces,
  JIGSAW_TAB_DEPTH,
  type JigsawPieceDefinition,
} from "./jigsaw-geometry";
import { JigsawPieceGraphic } from "./jigsaw-piece-graphic";

type JigsawPuzzleProps = {
  onContinue: () => void;
};

function boardPieceStyle(
  piece: JigsawPieceDefinition,
  rows: number,
  columns: number,
) {
  return {
    left: `${((piece.column - JIGSAW_TAB_DEPTH) / columns) * 100}%`,
    top: `${((piece.row - JIGSAW_TAB_DEPTH) / rows) * 100}%`,
    width: `${((1 + JIGSAW_TAB_DEPTH * 2) / columns) * 100}%`,
    height: `${((1 + JIGSAW_TAB_DEPTH * 2) / rows) * 100}%`,
  };
}

function targetMetrics(
  piece: JigsawPieceDefinition,
  board: DOMRect,
  rows: number,
  columns: number,
) {
  const width = board.width / columns;
  const height = board.height / rows;

  const left = board.left + piece.column * width;
  const top = board.top + piece.row * height;

  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2,
  };
}

function overlapRatio(
  pieceRect: DOMRect,
  target: ReturnType<typeof targetMetrics>,
) {
  const width = Math.max(
    0,
    Math.min(pieceRect.right, target.right) -
    Math.max(pieceRect.left, target.left),
  );

  const height = Math.max(
    0,
    Math.min(pieceRect.bottom, target.bottom) -
    Math.max(pieceRect.top, target.top),
  );

  const overlap = width * height;

  return (
    overlap /
    Math.max(
      1,
      Math.min(pieceRect.width * pieceRect.height, target.width * target.height),
    )
  );
}

export function JigsawPuzzle({ onContinue }: JigsawPuzzleProps) {
  const config = relationshipConfig.puzzle;

  const pieces = useMemo(
    () => createJigsawPieces(config.rows, config.columns),
    [config.rows, config.columns],
  );

  const [placedIds, setPlacedIds] = useState<Set<number>>(
    () => new Set(),
  );

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [magnetizedId, setMagnetizedId] = useState<number | null>(null);
  const [placementMessage, setPlacementMessage] = useState("");

  const [previewing, setPreviewing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [merged, setMerged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const completionTimers = useRef<number[]>([]);

  const dragOrigin = useRef<{
    pieceId: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const pieceNodes = useRef(
    new Map<number, HTMLButtonElement>(),
  );

  const reducedMotion = useReducedMotion() ?? false;

  const totalPieces = pieces.length;

  const loosePieces = pieces.filter(
    (piece) => !placedIds.has(piece.id),
  );

  const placePiece = useCallback((pieceId: number) => {
    setPlacedIds((current) => {
      if (current.has(pieceId)) return current;

      const next = new Set(current);
      next.add(pieceId);

      return next;
    });

    setSelectedId(null);
    setMagnetizedId(null);
    setPlacementMessage("");
  }, []);

  useEffect(() => {
    if (placedIds.size !== totalPieces || completed) return;

    const after = (delay: number, action: () => void) => {
      const timer = window.setTimeout(
        action,
        reducedMotion ? 20 : delay,
      );

      completionTimers.current.push(timer);
    };

    after(260, () => setCompleted(true));
    after(880, () => setMerged(true));
    after(1480, () => setShowSuccess(true));
  }, [
    completed,
    placedIds.size,
    reducedMotion,
    totalPieces,
  ]);

  useEffect(() => {
    return () => {
      completionTimers.current.forEach((timer) =>
        window.clearTimeout(timer),
      );
    };
  }, []);

  function isNearTarget(
    piece: JigsawPieceDefinition,
    pieceRect: DOMRect,
    multiplier = 1,
  ) {
    const board = boardRef.current?.getBoundingClientRect();

    if (!board) return false;

    const target = targetMetrics(
      piece,
      board,
      config.rows,
      config.columns,
    );

    const centerX =
      pieceRect.left + pieceRect.width / 2;

    const centerY =
      pieceRect.top + pieceRect.height / 2;

    const distance = Math.hypot(
      centerX - target.centerX,
      centerY - target.centerY,
    );

    const snapRadius =
      Math.max(56, target.width * config.snapRadiusRatio) *
      multiplier;

    return (
      distance <= snapRadius ||
      overlapRatio(pieceRect, target) >= 0.18
    );
  }

  function draggedRect(
    pieceId: number,
    info: PanInfo,
  ) {
    const origin = dragOrigin.current;

    if (
      !origin ||
      origin.pieceId !== pieceId
    ) {
      return null;
    }

    return {
      left: origin.left + info.offset.x,
      top: origin.top + info.offset.y,
      width: origin.width,
      height: origin.height,
    } as DOMRect;
  }

  function handleDrag(
    piece: JigsawPieceDefinition,
    info: PanInfo,
  ) {
    const rect = draggedRect(piece.id, info);

    if (!rect) return;

    const near = isNearTarget(
      piece,
      rect,
      1.55,
    );

    setMagnetizedId((current) =>
      near
        ? piece.id
        : current === piece.id
          ? null
          : current,
    );
  }

  function handleDragEnd(
    piece: JigsawPieceDefinition,
    info: PanInfo,
  ) {
    setDraggingId(null);
    setMagnetizedId(null);

    const rect = draggedRect(
      piece.id,
      info,
    );

    dragOrigin.current = null;

    if (
      rect &&
      isNearTarget(piece, rect)
    ) {
      placePiece(piece.id);
    }
  }

  function selectPiece(pieceId: number) {
    setSelectedId(pieceId);
    setPlacementMessage(
      "now tap where you think it belongs ♡",
    );
  }

  function handleBoardPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (
      selectedId === null ||
      placedIds.has(selectedId)
    ) {
      return;
    }

    const board =
      boardRef.current?.getBoundingClientRect();

    const piece = pieces.find(
      (candidate) =>
        candidate.id === selectedId,
    );

    if (!board || !piece) return;

    const target = targetMetrics(
      piece,
      board,
      config.rows,
      config.columns,
    );

    const distance = Math.hypot(
      event.clientX - target.centerX,
      event.clientY - target.centerY,
    );

    const radius =
      Math.max(64, target.width * config.snapRadiusRatio * 1.25);

    if (distance <= radius) {
      placePiece(piece.id);
    } else {
      setPlacementMessage(
        "a little closer ♡",
      );
    }
  }

  function beginPreview() {
    if (!completed) {
      setPreviewing(true);
    }
  }

  function endPreview() {
    setPreviewing(false);
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reducedMotion
          ? 0.12
          : motionDurations.reveal,
        ease: motionEasings.enter,
      }}
      className="mx-auto w-full max-w-[760px]"
    >
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-rose">
            a little memory
          </p>

          <h2 className="mt-1 font-display text-3xl leading-tight text-wine sm:text-4xl">
            Piece by piece
          </h2>
        </div>

        <motion.div
          key={placedIds.size}
          initial={
            reducedMotion
              ? false
              : {
                opacity: 0,
                y: -5,
                scale: 0.9,
              }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          className="text-right"
          aria-live="polite"
        >
          <p className="font-display text-xl text-wine/70">
            {placedIds.size}
            <span className="text-wine/30">
              {" "}
              / {totalPieces}
            </span>
          </p>
        </motion.div>
      </div>

      <div
        ref={workspaceRef}
        className="relative"
      >
        {/* Physical puzzle board */}
        <motion.div
          ref={boardRef}
          className="relative mx-auto aspect-square w-full max-w-[470px] rounded-[1.45rem] border border-white/90 bg-[#ead3cd] p-[3.5%] shadow-[0_20px_55px_rgba(91,51,57,.15)]"
          animate={{
            y:
              completed && !reducedMotion
                ? -2
                : 0,
            rotate:
              completed && !reducedMotion
                ? 0.15
                : 0,
            boxShadow:
              merged
                ? "0 15px 35px rgba(91,51,57,.10)"
                : "0 22px 55px rgba(91,51,57,.15)",
          }}
          transition={{
            duration: reducedMotion
              ? 0
              : motionDurations.emotional,
            ease: motionEasings.cinematic,
          }}
          role="button"
          tabIndex={
            selectedId === null
              ? -1
              : 0
          }
          onPointerDown={
            handleBoardPointerDown
          }
          onKeyDown={(event) => {
            if (
              selectedId !== null &&
              (event.key === "Enter" ||
                event.key === " ")
            ) {
              event.preventDefault();
              placePiece(selectedId);
            }
          }}
          aria-label={`${config.rows} by ${config.columns} jigsaw puzzle. ${placedIds.size} of ${totalPieces} pieces placed.`}
          aria-describedby="jigsaw-help"
        >
          {/* Board inner paper */}
          <div
            className="absolute inset-[3.5%] rounded-[1.05rem] bg-paper shadow-[inset_0_0_0_1px_rgba(255,255,255,.45)]"
            aria-hidden="true"
          />

          {/* Very faint image underneath */}
          <Image
            src={config.imageSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 92vw, 470px"
            className="pointer-events-none rounded-[1.05rem] object-cover opacity-[.045]"
            aria-hidden="true"
          />

          {/* Placed pieces */}
          <AnimatePresence initial={false}>
            {pieces.map(
              (piece) =>
                placedIds.has(piece.id) && (
                  <motion.div
                    layoutId={`jigsaw-piece-${piece.id}`}
                    key={`placed-${piece.id}`}
                    className="pointer-events-none absolute"
                    style={boardPieceStyle(
                      piece,
                      config.rows,
                      config.columns,
                    )}
                    initial={
                      reducedMotion
                        ? false
                        : {
                          scale: 1.06,
                          rotate:
                            piece.restingRotation *
                            0.35,
                        }
                    }
                    animate={{
                      scale: 1,
                      rotate: 0,
                      opacity: merged
                        ? 0
                        : 1,
                    }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : motionSprings.paperSettle
                    }
                  >
                    <JigsawPieceGraphic
                      piece={piece}
                      rows={config.rows}
                      columns={config.columns}
                      imageSrc={
                        config.imageSrc
                      }
                      instance="board"
                      seamsVisible={
                        !completed
                      }
                    />

                    {!completed &&
                      !reducedMotion && (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-[24%] rounded-full bg-[#fff0bd]/50 mix-blend-screen"
                          initial={{
                            opacity: 0.7,
                            scale: 0.5,
                          }}
                          animate={{
                            opacity: 0,
                            scale: 1.4,
                          }}
                          transition={{
                            duration:
                              motionDurations.standard,
                            ease:
                              motionEasings.enter,
                          }}
                        />
                      )}
                  </motion.div>
                ),
            )}
          </AnimatePresence>

          {/* Completed photograph */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[1.2rem]"
            initial={false}
            animate={{
              opacity:
                merged || previewing
                  ? 1
                  : 0,
              scale:
                merged && !reducedMotion
                  ? 1
                  : 0.985,
            }}
            transition={{
              duration: reducedMotion
                ? 0
                : motionDurations.emotional,
              ease: motionEasings.cinematic,
            }}
            aria-hidden={!merged}
          >
            <Image
              src={config.imageSrc}
              alt={
                merged
                  ? config.imageAlt
                  : "Completed photograph preview"
              }
              fill
              sizes="(max-width: 640px) 92vw, 470px"
              className="object-cover"
              priority
            />

            {!reducedMotion && merged && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0.28 }}
                animate={{ opacity: 0 }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                }}
                aria-hidden="true"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Instruction */}
        <motion.p
          id="jigsaw-live-help"
          aria-live="polite"
          className="mx-auto min-h-8 max-w-md px-3 pt-3 text-center font-display text-sm italic text-rose"
          animate={{
            opacity:
              completed
                ? 0
                : 1,
          }}
        >
          {placementMessage ||
            (selectedId !== null
              ? "find its little home ♡"
              : "pick up a piece")}
        </motion.p>

        {/* Loose pieces */}
        <motion.div
          animate={{
            opacity:
              completed
                ? 0
                : 1,
            y:
              completed && !reducedMotion
                ? 12
                : 0,
          }}
          transition={{
            duration: reducedMotion
              ? 0.1
              : motionDurations.standard,
          }}
          className="relative z-10 mt-3"
        >
          <div className="relative rounded-[1.25rem] border border-white/75 bg-[#f8e8df]/70 px-3 py-4 shadow-[0_12px_30px_rgba(91,51,57,.07)] sm:px-5">
            {/* tiny paper label */}
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="font-display text-sm italic text-wine/70">
                little pieces
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-rose/55">
                pick one up
              </span>
            </div>

            <div
              className="grid grid-cols-4 gap-2 min-[22.5rem]:grid-cols-5 sm:grid-cols-6 md:grid-cols-8"
              aria-label="Loose jigsaw pieces"
            >
              {loosePieces.map(
                (piece) => (
                  <motion.button
                    layoutId={`jigsaw-piece-${piece.id}`}
                    key={piece.id}
                    type="button"
                    ref={(node) => {
                      if (node) {
                        pieceNodes.current.set(
                          piece.id,
                          node,
                        );
                      } else {
                        pieceNodes.current.delete(
                          piece.id,
                        );
                      }
                    }}
                    data-jigsaw-piece={
                      piece.id
                    }
                    aria-label={`Puzzle piece ${piece.id + 1}.`}
                    aria-pressed={
                      selectedId === piece.id
                    }
                    onClick={() =>
                      selectPiece(
                        piece.id,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                        "Enter" ||
                        event.key ===
                        " "
                      ) {
                        event.preventDefault();
                        placePiece(
                          piece.id,
                        );
                      }
                    }}
                    drag={
                      !completed &&
                      !previewing
                    }
                    dragConstraints={
                      workspaceRef
                    }
                    dragElastic={0.08}
                    dragMomentum={false}
                    dragSnapToOrigin
                    onDragStart={() => {
                      const node = pieceNodes.current.get(piece.id);

                      if (!node) return;

                      const rect = node.getBoundingClientRect();

                      dragOrigin.current = {
                        pieceId: piece.id,
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                      };

                      setDraggingId(piece.id);

                      // Keep selection for accessibility/instructions,
                      // but don't let selection visually reposition the piece.
                      setSelectedId(piece.id);

                      setPlacementMessage("take it to the board ♡");
                    }}
                    onDrag={(
                      _event,
                      info,
                    ) =>
                      handleDrag(
                        piece,
                        info,
                      )
                    }
                    onDragEnd={(
                      _event,
                      info,
                    ) =>
                      handleDragEnd(
                        piece,
                        info,
                      )
                    }
                    animate={{
                      // IMPORTANT:
                      // Never change the piece's transform when dragging begins.
                      // Changing rotation/scale here makes the grabbed point move.
                      rotate: piece.restingRotation,
                      y: 0,
                      scale: 1,

                      opacity:
                        selectedId !== null &&
                          selectedId !== piece.id
                          ? 0.5
                          : 1,
                    }}
                    whileDrag={{
                      zIndex: 50,
                    }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : motionSprings.tactile
                    }
                    className={`jigsaw-drag-piece relative z-10 aspect-square min-h-14 min-w-14 w-full touch-none select-none overflow-visible rounded-lg cursor-grab active:cursor-grabbing focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine ${piece.id
                      ? "drop-shadow-[0_12px_14px_rgba(91,51,57,.30)]"
                      : ""
                      } ${selectedId ===
                        piece.id
                        ? "drop-shadow-[0_6px_10px_rgba(91,51,57,.16)]"
                        : ""
                      }`}
                  >
                    <JigsawPieceGraphic
                      piece={piece}
                      rows={
                        config.rows
                      }
                      columns={
                        config.columns
                      }
                      imageSrc={
                        config.imageSrc
                      }
                      instance="tray"
                    />
                  </motion.button>
                ),
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview */}
      <motion.div
        animate={{
          opacity:
            completed ? 0 : 1,
        }}
        className="mt-4 flex justify-center"
      >
        {config.showPreview && (
          <button
            type="button"
            onPointerDown={
              beginPreview
            }
            onPointerUp={
              endPreview
            }
            onPointerCancel={
              endPreview
            }
            onPointerLeave={
              endPreview
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                " " ||
                event.key ===
                "Enter"
              ) {
                beginPreview();
              }
            }}
            onKeyUp={(event) => {
              if (
                event.key ===
                " " ||
                event.key ===
                "Enter"
              ) {
                endPreview();
              }
            }}
            disabled={completed}
            className="min-h-10 rounded-full border border-rose/20 bg-white/35 px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-wine/65 transition hover:bg-white/60 disabled:opacity-30"
          >
            {config.previewLabel}
          </button>
        )}
      </motion.div>

      <p
        id="jigsaw-help"
        className="mt-3 text-center text-[9px] leading-4 text-ink/30"
      >
        drag a piece toward the picture · or tap a piece and its home
      </p>

      {/* Completion */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion
                ? 0
                : 18,
              filter:
                reducedMotion
                  ? "blur(0px)"
                  : "blur(5px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration:
                reducedMotion
                  ? 0.1
                  : motionDurations.reveal,
              ease: motionEasings.enter,
            }}
            className="pt-8 text-center"
            aria-live="polite"
          >
            <p className="font-display text-3xl italic text-wine">
              {config.successMessage}
            </p>

            <p className="mt-2 text-xs text-ink/40">
              you found the whole picture ♡
            </p>

            <button
              type="button"
              onClick={onContinue}
              className="mt-5 rounded-full bg-wine px-8 py-4 text-sm font-bold text-white shadow-[0_14px_35px_rgba(127,57,72,.22)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
            >
              {config.continueButtonLabel}
              {" "}
              <span
                className="cinematic-arrow"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}