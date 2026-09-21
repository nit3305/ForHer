"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { relationshipConfig } from "@/config/relationship";
import { motionDurations, motionEasings, motionSprings } from "@/lib/motion";

type TriviaCardProps = { onComplete: () => void };

export function TriviaCard({ onComplete }: TriviaCardProps) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const question = relationshipConfig.trivia[index];

  function submit(event: FormEvent) {
    event.preventDefault();
    const matches = value.trim().toLocaleLowerCase() === question.answer.toLocaleLowerCase();
    if (!matches) {
      setError(true);
      return;
    }
    setConfirmed(true);
    window.setTimeout(() => {
      if (index === relationshipConfig.trivia.length - 1) return onComplete();
      setIndex((current) => current + 1);
      setValue("");
      setError(false);
      setConfirmed(false);
    }, reducedMotion ? 80 : 360);
  }

  return (
    <motion.div layout className="paper-note w-full">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-rose">Memory {index + 1}</p>
          <p className="mt-1 font-display text-2xl text-wine">A tiny test of us</p>
        </div>
        <p className="text-xs tracking-widest text-ink/45">{index + 1} / {relationshipConfig.trivia.length}</p>
      </div>
      <div className="mb-8 flex gap-2" aria-hidden="true">
        {relationshipConfig.trivia.map((item, itemIndex) => (
          <motion.span key={item.id} className="h-1 flex-1 origin-left rounded-full bg-blush/55" animate={{ scaleX: itemIndex <= index ? 1 : .18, backgroundColor: itemIndex <= index ? "#bd6e7c" : "#ecd0d0" }} transition={{ duration: reducedMotion ? .08 : motionDurations.standard, ease: motionEasings.enter }} />
        ))}
      </div>
      <motion.form
          key={question.id}
          onSubmit={submit}
          initial={{ opacity: 0, x: reducedMotion ? 0 : 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reducedMotion ? .1 : motionDurations.standard, ease: motionEasings.enter }}
        >
          <label htmlFor="memory-answer" className="block font-display text-3xl leading-tight text-ink sm:text-4xl">{question.prompt}</label>
          <motion.div className="relative" animate={error ? { x: reducedMotion ? 0 : [0, -4, 3, -2, 0] } : confirmed ? { scale: reducedMotion ? 1 : [1, 1.012, 1] } : { x: 0, scale: 1 }} transition={error || confirmed ? { duration: .28, ease: motionEasings.move } : motionSprings.tactile}>
            <input id="memory-answer" autoFocus autoComplete="off" inputMode={question.inputMode} value={value} disabled={confirmed} onChange={(event) => { setValue(event.target.value); setError(false); setConfirmed(false); }} placeholder={question.placeholder} aria-describedby="answer-note" className={`mt-8 w-full border-b bg-transparent px-1 py-3 text-lg outline-none transition-colors placeholder:text-ink/25 ${confirmed ? "border-rose text-wine" : error ? "border-red-500 text-red-800" : "border-rose/35 focus:border-wine"}`} />
            <motion.span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-left bg-rose" initial={{ scaleX: 0 }} animate={{ scaleX: confirmed ? 1 : 0 }} transition={{ duration: reducedMotion ? .08 : .32, ease: motionEasings.enter }} />
          </motion.div>
          <div id="answer-note" aria-live="polite" className="mt-3 min-h-5 text-xs text-ink/45">{error ? relationshipConfig.playfulness.triviaIncorrect : confirmed ? relationshipConfig.playfulness.triviaCorrect : question.hint}</div>
          <button type="submit" disabled={!value.trim() || confirmed} className="paper-button mt-8 flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-bold tracking-wide text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine disabled:cursor-not-allowed disabled:opacity-35">
            {confirmed ? "Remembered" : "Remember this"} <span className="cinematic-arrow" aria-hidden="true">→</span>
          </button>
      </motion.form>
    </motion.div>
  );
}
