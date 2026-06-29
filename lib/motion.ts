/**
 * The site's motion system — one calm, premium language.
 *
 * Import these tokens instead of hardcoding curves, durations, or spring
 * configs, so every reveal, transition, hover, and pointer interaction feels
 * like it came from the same hand. Reduced-motion is handled at each call site
 * (and globally in globals.css), so these describe the *expressive* state only.
 */

/** Easing curves. `out` is the primary voice — a soft, confident ease-out. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const
};

/** Duration scale (seconds). Keep motion in this range — nothing slower drags. */
export const duration = {
  fast: 0.3,
  base: 0.45,
  slow: 0.7,
  slower: 0.9
};

/** Spring configs for pointer-driven motion. */
export const spring = {
  /** Magnetic buttons / pointer-follow. */
  magnetic: { stiffness: 220, damping: 18, mass: 0.4 },
  /** Gentle 3D tilt (hero portrait). */
  tilt: { stiffness: 150, damping: 18, mass: 0.5 }
};

/** Standard viewport config for scroll reveals. */
export const revealViewport = { once: true, margin: "-80px" } as const;
