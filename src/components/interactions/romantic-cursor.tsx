"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export function RomanticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let x = -40;
    let y = -40;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      if (frame) return;

      frame = requestAnimationFrame(() => {
        const node = cursorRef.current;

        if (node) {
          node.style.left = `${x}px`;
          node.style.top = `${y}px`;
          node.dataset.visible = "true";
        }

        frame = 0;
      });
    };

    const down = () => {
      if (cursorRef.current) {
        cursorRef.current.dataset.pressed = "true";
      }
    };

    const up = () => {
      if (cursorRef.current) {
        cursorRef.current.dataset.pressed = "false";
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);

      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={cursorRef}
      className="romantic-cursor"
      aria-hidden="true"
    >
      <span className="romantic-cursor-heart">♡</span>
      <span className="romantic-cursor-sparkle">✦</span>
    </div>,
    document.body,
  );
}