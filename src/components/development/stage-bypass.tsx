"use client";

export type DevelopmentStage = 1 | 2 | 3 | 4 | 5;

type StageBypassProps = {
  currentStage: DevelopmentStage;
  onJump: (stage: DevelopmentStage) => void;
};

/**
 * Development-only navigation for quickly reaching unfinished stages.
 * The parent also guards this component with NODE_ENV so no handler is
 * mounted in production. This local guard makes accidental reuse inert.
 */
export function StageBypass({ currentStage, onJump }: StageBypassProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <aside className="fixed bottom-2 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-ink/10 bg-paper/90 px-2 py-1 shadow-lg backdrop-blur" aria-label="Development stage navigation">
      <div className="flex items-center gap-0.5">
        <span className="px-1.5 text-[8px] font-bold uppercase tracking-widest text-ink/35" aria-hidden="true">Dev</span>
        {([1, 2, 3, 4, 5] as const).map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => onJump(stage)}
            aria-label={`Jump to Stage ${stage}`}
            aria-pressed={currentStage === stage}
            className={`grid size-7 place-items-center rounded-full text-[10px] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-wine ${
              currentStage === stage ? "bg-wine text-white" : "text-ink/50 hover:bg-blush/45"
            }`}
          >
            {stage}
          </button>
        ))}
      </div>
    </aside>
  );
}
