"use client";

import { motion } from "motion/react";
import { Icon } from "./Icon";

export function TypingIndicator() {
  return (
    <div className="flex w-full gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#F8A24A] text-white shadow-[0_4px_12px_rgba(242,106,31,0.3)]">
        <Icon name="auto_awesome" className="text-[17px]" />
      </div>
      <div className="flex items-center gap-1.5 rounded-[16px_16px_16px_4px] border border-border-subtle bg-bg-surface px-4 py-4">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-accent"
            initial={{ y: 0, opacity: 0.4 }}
            animate={{ y: [0, -2, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
