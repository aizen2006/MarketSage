import type { MotionProps } from "motion/react";

/** Micro interaction (0.12s) — hover lift, small feedback */
export const microTransition = {
  duration: 0.12,
  ease: [0.16, 1, 0.3, 1] as const,
};

/** Macro transition (0.28–0.45s) — appear, panel open */
export const macroTransition = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const macroTransitionSlow = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as const,
};

/** Respect prefers-reduced-motion: use instant or minimal duration */
export function getReducedMotionTransition(
  defaultTransition: { duration: number; ease: readonly number[] },
) {
  if (typeof window === "undefined") return defaultTransition;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return prefersReduced
    ? { duration: 0.01, ease: defaultTransition.ease }
    : defaultTransition;
}

export const buttonTap: MotionProps = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.1, type: "spring", stiffness: 500, damping: 30 },
};

/** Hover lift (scale 1.01) — cards, tiles; restrained for Linear/Vercel style */
export const hoverLift: MotionProps = {
  whileHover: { scale: 1.01 },
  transition: microTransition,
};

export const messageEnter: MotionProps = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: macroTransition,
};

export const fadeInUpFast: MotionProps = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

/** Staggered list entrance — use with staggerChildren */
export const staggerContainer: MotionProps = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  },
};

export const staggerItem: MotionProps = {
  variants: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: macroTransition,
    },
  },
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
