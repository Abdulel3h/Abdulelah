"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A replay only starts once the previous activation has mostly played out.
const REPLAY_GAP_MS = 3400;

/**
 * A stage for the travelling signal: the brass signal passes through the
 * `data-beat` parts inside it (see the beat-* helpers in globals.css). The
 * server renders it at rest, so without JavaScript nothing changes. The
 * client plays one activation when the stage is first seen, then rests; a
 * mouse entering it (or its `[data-pipeline-trigger]`) or a new `replayKey`
 * plays it again. Reduced motion never plays it.
 */
export function PipelineStage({
  children,
  as: Tag = "div",
  className,
  style,
  replayOnHover = true,
  replayKey,
  threshold = 0.4,
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel
}: {
  children: ReactNode;
  as?: "div" | "article" | "ol" | "aside";
  className?: string;
  style?: CSSProperties;
  replayOnHover?: boolean;
  replayKey?: string;
  threshold?: number;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const seen = useRef(false);
  const lastPlay = useRef(Number.NEGATIVE_INFINITY);

  const play = useCallback((force = false) => {
    const stage = ref.current;

    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const now = performance.now();

    if (!force && now - lastPlay.current < REPLAY_GAP_MS) return;

    lastPlay.current = now;
    // Back to rest, flush styles, then play: this restarts every animation.
    stage.dataset.pipeline = "rest";
    void stage.offsetWidth;
    stage.dataset.pipeline = "play";
  }, []);

  // One activation the first time the stage is properly in view.
  useEffect(() => {
    const stage = ref.current;

    if (!stage || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold - 0.01)) return;

        seen.current = true;
        observer.disconnect();
        play(true);
      },
      { threshold }
    );

    observer.observe(stage);

    return () => observer.disconnect();
  }, [play, threshold]);

  // Mouse hover replays it. The trigger is looked up again when replayKey
  // changes, because the content (and its trigger) may have been replaced.
  useEffect(() => {
    const stage = ref.current;

    if (!replayOnHover || !stage) return;

    const target = stage.querySelector<HTMLElement>("[data-pipeline-trigger]") ?? stage;

    function handleEnter(event: PointerEvent) {
      if (event.pointerType === "mouse" && seen.current) play();
    }

    target.addEventListener("pointerenter", handleEnter);

    return () => target.removeEventListener("pointerenter", handleEnter);
  }, [play, replayOnHover, replayKey]);

  // New content after the first activation plays straight away.
  useEffect(() => {
    if (seen.current) play(true);
  }, [play, replayKey]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      data-pipeline="rest"
      className={cn("pipeline", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
