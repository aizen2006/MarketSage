import type { MotionProps } from "motion/react";

export const buttonTap: MotionProps = {
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, type: "spring", stiffness: 400, damping: 25 },
};

export const messageEnter: MotionProps = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] },
};

export const fadeInUpFast: MotionProps = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.18 },
};

export const typingDotKeyframes = {
  initial: { y: 0, opacity: 0.4 },
  animate: {
    y: [0, -2, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

