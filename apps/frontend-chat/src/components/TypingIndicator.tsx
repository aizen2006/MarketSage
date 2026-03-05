"use client";

import { motion } from "motion/react";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-bg-elevated px-3 py-1 text-[0.7rem] text-fg-soft">
      <span className="h-2 w-2 rounded-full bg-accent" />
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-fg-soft"
            initial={{ y: 0, opacity: 0.4 }}
            animate={{
              y: [0, -2, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            }}
          />
        ))}
      </div>
      <span>Thinking</span>
    </div>
  );
}

