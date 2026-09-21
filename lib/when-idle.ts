/**
 * Runs `task` once the page has loaded and the main thread is idle — used to
 * prefetch on-demand UI (search, guide, mobile menu) after the first paint.
 * Returns a cleanup function for effects.
 */
export function whenIdle(task: () => void, delayMs = 2500) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let idleHandle: number | undefined;
  let timer: number | undefined;

  const schedule = () => {
    timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleHandle = window.requestIdleCallback(() => task(), { timeout: 4000 });
      } else {
        task();
      }
    }, delayMs);
  };

  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
  }

  return () => {
    window.removeEventListener("load", schedule);
    if (timer) window.clearTimeout(timer);
    if (idleHandle !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
  };
}
