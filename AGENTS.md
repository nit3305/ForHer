# ForHer — Permanent Project Principles

## Product vision

- This is an intimate, handcrafted romantic experience—not a landing page, dashboard, SaaS product, or generic template.
- Preserve the normal journey: Heart PIN → 5×5 Draggable Jigsaw → four Memory pages → six Love Notes → three-song/timer/photo-strip finale → Love Letter. Trivia remains isolated but is not a production prerequisite.
- Stage 2 is a true 5×5, 25-piece interlocking jigsaw. Preserve complementary shared edges, flat outer boundaries, free pointer/touch dragging, keyboard completion, forgiving snapping, preview/hint controls, and the unified-photo completion settle. Do not reintroduce square tiles, move counts, or sliding-puzzle assumptions.
- Stages 1 through 5 are complete. Stage 5 is the ending; never add a Stage 6.
- Optimize for one meaningful thing on screen at a time. Default content stays deliberately restrained: four memories, six reasons, three songs, and three photo-booth images.
- Never invent personal relationship facts. Put all unknown content behind tasteful, clearly labelled placeholders.

## Content architecture

- Keep personal content, dates, answers, captions, image paths, letter copy, and playlist settings in `src/config/relationship.ts` (or focused config files imported there as the project grows).
- UI components must consume configuration rather than embedding personal copy.
- The secret PIN is currently client-side and is ceremonial, not secure authentication. Do not represent it as security.

## Visual direction

- Aim for a cute handmade romantic gift: intimate, tactile, warm, imperfect, and quietly playful. It should feel like opening a decorated keepsake box rather than viewing a cinematic portfolio.
- Favor ivory paper, baby pink, peach, faded rose and restrained wine accents; combine expressive serif typography with sparing handwritten annotations, paper edges, tape, stamps, pressed flowers, and tiny doodles.
- Avoid neon gradients, glassy tech dashboards, excessive cards, stock illustrations, generic hero layouts, and decorative clutter.
- Motion should communicate progress and emotion. Respect `prefers-reduced-motion`.
- Playfulness comes from a few clear direct interactions—drag, flip, pull, scratch, hold, and uncover—not a different minigame or decoration on every screen. Keep the final letter increasingly still.
- Design mobile-first, then expand gracefully for tablet and desktop.

## Engineering principles

- Use Next.js App Router, React, TypeScript in strict mode, Tailwind CSS, and Motion for React.
- Keep components small and focused. Separate configuration, experience state, stage components, and reusable visual primitives.
- Prefer semantic HTML, visible focus states, descriptive labels, keyboard operation, and useful live regions.
- Avoid unnecessary dependencies and abstractions. Favor local state unless persistence is explicitly required.
- For pointer-heavy interactions, use Motion values, refs, canvas, and capped DOM effects; preserve touch scrolling and always provide keyboard-accessible reveal fallbacks.
- Preserve Vercel compatibility. Never make Framer a runtime or build requirement.
- After meaningful changes, run lint, TypeScript checking, and a production build. Fix warnings that signal real quality or accessibility issues.
- Do not expose surprises: document placeholder values and customization points in the handoff.
- Keep `src/components/development/stage-bypass.tsx` development-only. Never remove its production guards or connect it to production progression.

## Motion language

- Reuse the tokens and variants in `src/lib/motion.ts`; do not scatter arbitrary durations or default easing strings through components.
- Use motion for feedback, orientation, continuity, and emotional pacing. Repeated controls stay fast; major reveals may breathe.
- The recurring motif is a handmade keepsake box: diary lock in Stage 1, paper worktable in Stage 2, scrapbook in Stage 3, box of notes in Stage 4, and a layered gift bundle in Stage 5.
- Animate transform and opacity by default. Treat filter/clip-path as short, one-shot reveal tools. Never animate layout properties such as top, left, width, or height.
- Fine-pointer depth must remain tiny and must be disabled for touch, coarse pointers, and reduced motion.
- Reduced motion preserves sequencing with short opacity changes while removing parallax, depth, drifting atmosphere, and large spatial movement.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
