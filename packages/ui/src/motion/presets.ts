import type { MotionProps } from "motion/react";

export const buttonTap: MotionProps = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.1, type: "spring", stiffness: 500, damping: 30 },
};

export const messageEnter: MotionProps = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

export const fadeInUpFast: MotionProps = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

export const typingDotKeyframes = {
  initial: { y: 0, opacity: 0.3 },
  animate: {
    y: [0, -3, 0],
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};
