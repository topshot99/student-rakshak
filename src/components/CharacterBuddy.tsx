"use client";

import { motion } from "framer-motion";

export function CharacterBuddy({ mood }: { mood: number }) {
  const face = mood >= 7 ? "😊" : mood >= 5 ? "🙂" : "😟";

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
      className="relative h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-[#7fd3ff] via-[#9af2d4] to-[#ffe58a] shadow-[0_15px_35px_rgba(0,0,0,0.14)] sm:h-28 sm:w-28"
      aria-label="Wellness buddy"
    >
      <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">
        {face}
      </div>
    </motion.div>
  );
}

