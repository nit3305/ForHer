import { relationshipConfig } from "@/config/relationship";

export function StageIndicator({ activeStage = 0 }: { activeStage?: number }) {
  return (
    <nav aria-label="Journey progress" className="flex items-center justify-center gap-2 sm:gap-3">
      {relationshipConfig.stages.map((stage, index) => (
        <div className="flex items-center gap-2 sm:gap-3" key={stage}>
          <span
            aria-current={index === activeStage ? "step" : undefined}
            className={`grid size-7 place-items-center rounded-full border text-[10px] font-bold tracking-widest ${
              index <= activeStage ? "border-wine bg-wine text-white" : "border-rose/25 text-rose/50"
            }`}
          >
            {index + 1}
          </span>
          {index < relationshipConfig.stages.length - 1 && <span className="h-px w-4 bg-rose/20 sm:w-8" />}
        </div>
      ))}
    </nav>
  );
}
