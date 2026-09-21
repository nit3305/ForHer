"use client";

import { motion, useReducedMotion } from "motion/react";

export function EntranceDoodles() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Flower */}
      <motion.div
        className="entrance-doodle entrance-flower"
        initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: -5 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        ✿
      </motion.div>

      {/* Heart */}
      <motion.div
        className="entrance-doodle entrance-heart entrance-heart-one"
        initial={reduced ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        ♡
      </motion.div>

      {/* Small flower */}
      <motion.div
        className="entrance-doodle entrance-flower entrance-flower-two"
        initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: 4 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        ✿
      </motion.div>

      {/* Small heart */}
      <motion.div
        className="entrance-doodle entrance-heart entrance-heart-two"
        initial={reduced ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65, duration: 0.6 }}
      >
        ♡
      </motion.div>

      {/* Tiny bow */}
      <motion.div
        className="entrance-doodle entrance-bow"
        initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: 5 }}
        transition={{ delay: 0.75, duration: 0.6 }}
      >
        ୨୧
      </motion.div>

      {/* Tiny sparkles */}
      <span className="entrance-sparkle sparkle-one">✦</span>
      <span className="entrance-sparkle sparkle-two">✧</span>
      <span className="entrance-sparkle sparkle-three">˚</span>
      <span className="entrance-sparkle sparkle-four">♡</span>
    </div>
  );
}