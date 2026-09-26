"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";

/**
 * The portrait with a gentle, mouse-only 3D tilt (plain CSS transforms). It
 * renders at full opacity from the first paint; only a transform-based CSS
 * entrance plays, so it can never delay or hide content.
 */
export function HeroPortrait({
  src,
  alt,
  name,
  arabicName
}: {
  src: string;
  alt: string;
  name: string;
  arabicName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointer(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current;

    if (!element || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = element.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

    element.style.transform = `perspective(900px) rotateX(${(dy * -8).toFixed(2)}deg) rotateY(${(dx * 8).toFixed(2)}deg)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      className="decor-enter relative z-10 mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[420px]"
      onPointerMove={handlePointer}
      onPointerLeave={reset}
    >
      <div ref={ref} className="relative transform-gpu transition-transform duration-500 ease-out [transform-style:preserve-3d]">
        <div
          className="absolute -inset-3 -z-10 rounded-[2.75rem] sm:-inset-6"
          style={{ background: "radial-gradient(closest-side, rgba(201,167,92,0.14), transparent 75%)" }}
          aria-hidden="true"
        />
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/[0.14] shadow-glow">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 420px"
            className="object-cover object-top"
          />
        </div>

        <div className="absolute -bottom-4 start-[-0.75rem] flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0a0a0b]/90 px-4 py-2.5 backdrop-blur-xl sm:start-[-1.25rem]">
          {/* Same stroke as the static <Monogram> it replaced, so the drawn mark is unchanged. */}
          <SignatureMonogram play strokeWidth={2.4} className="h-5 w-auto text-accent" />
          <span className="leading-tight">
            <span className="block font-display text-sm text-paper" lang="en" dir="ltr">
              {name}
            </span>
            <span lang="ar" dir="rtl" className="mt-0.5 block text-xs text-paper-dim">
              {arabicName}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
