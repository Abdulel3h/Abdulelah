"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Monogram } from "@/components/ui/Monogram";
import {
  NeuralOrbit,
  NeuralSignalBridge
} from "@/components/visuals/NeuralOrbit";
import { duration, ease, spring } from "@/lib/motion";
import { siteConfig } from "@/data/site";

const recognition = [
  "7 products shipped",
  "Top 30 · SDAIA × Microsoft",
  "Google Cloud × KFUPM",
  "University of Bisha"
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), spring.tilt);
  const rotateY = useSpring(useMotionValue(0), spring.tilt);
  const orbitX = useSpring(useMotionValue(0), spring.tilt);
  const orbitY = useSpring(useMotionValue(0), spring.tilt);

  function handlePointer(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const section = sectionRef.current;
    const light = lightRef.current;
    if (section && light) {
      const rect = section.getBoundingClientRect();
      light.style.setProperty("--px", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      light.style.setProperty("--py", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      light.style.opacity = "1";
    }

    const portrait = portraitRef.current;
    if (portrait) {
      const rect = portrait.getBoundingClientRect();
      const dx = Math.max(
        -0.65,
        Math.min(0.65, (event.clientX - (rect.left + rect.width / 2)) / rect.width)
      );
      const dy = Math.max(
        -0.65,
        Math.min(0.65, (event.clientY - (rect.top + rect.height / 2)) / rect.height)
      );
      rotateY.set(dx * 3.4);
      rotateX.set(dy * -3.4);
      orbitX.set(dx * 10);
      orbitY.set(dy * 8);
    }
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
    orbitX.set(0);
    orbitY.set(0);
    if (lightRef.current) lightRef.current.style.opacity = "0";
  }

  const reveal = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: ease.out }
        };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointer}
      onPointerLeave={handleLeave}
      className="container-shell relative grid min-h-[calc(100svh-4rem)] items-center gap-12 overflow-hidden pb-20 pt-14 sm:overflow-visible sm:pt-16 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-4 lg:pb-24 lg:pt-20"
    >
      <div
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(460px circle at var(--px, 50%) var(--py, 50%), rgba(34,227,197,0.105), transparent 62%), radial-gradient(300px circle at calc(var(--px, 50%) + 9%) calc(var(--py, 50%) + 8%), rgba(200,255,84,0.045), transparent 68%)"
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] top-[12%] h-px bg-gradient-to-r from-transparent via-[#22e3c5]/20 to-transparent"
      />

      <NeuralSignalBridge />

      <div className="relative order-1 lg:order-1">
        <motion.p {...reveal(0)} className="eyebrow mb-7">
          Riyadh, Saudi Arabia · Available for select work
        </motion.p>

        <motion.h1
          {...reveal(0.06)}
          className="relative z-20 font-display font-medium leading-[0.88] tracking-[-0.035em] text-paper"
          style={{ fontSize: "clamp(3rem, 8.1vw, 6.9rem)" }}
        >
          <span className="block">Abdulelah</span>
          <span className="block whitespace-nowrap text-paper/85">Alkhathami</span>
        </motion.h1>

        <motion.p
          {...reveal(0.14)}
          className="relative z-40 mt-8 max-w-xl text-lg leading-8 text-paper-dim sm:text-xl"
        >
          I design and build{" "}
          <span className="font-display italic text-paper">intelligent products</span>{" "}
          — where software, AI, and considered design meet. I turn messy,
          real-world problems into systems people actually use.
        </motion.p>

        <motion.div
          {...reveal(0.22)}
          className="relative z-40 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic className="w-full sm:w-auto">
            <ButtonLink href="/projects" showArrow className="w-full">
              View my work
            </ButtonLink>
          </Magnetic>
          <ButtonLink href="/resume" variant="secondary" showArrow className="w-full sm:w-auto">
            Résumé
          </ButtonLink>
          <ButtonLink href="/about" variant="ghost" showArrow className="w-full sm:w-auto">
            My story
          </ButtonLink>
        </motion.div>

        <motion.div {...reveal(0.3)} className="relative z-40 mt-12">
          <div className="accent-rule max-w-xl" />
          <div className="mt-5 flex max-w-xl flex-wrap items-center gap-x-4 gap-y-2 text-sm text-paper-dim">
            {recognition.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-4">
                {index > 0 ? (
                  <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
                ) : null}
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.3 : duration.slower, delay: 0.08, ease: ease.out }}
        style={reduceMotion ? undefined : { x: orbitX, y: orbitY }}
        className="relative z-10 order-2 mx-auto w-full max-w-[340px] py-7 sm:max-w-[410px] lg:-ml-10 lg:order-2 lg:max-w-[500px] lg:py-0"
      >
        <div className="absolute right-[4%] top-[4%] z-40 hidden items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#8fa8a1] sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8ff54]/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c8ff54]" />
          </span>
          Neural orbit · live
        </div>

        <NeuralOrbit>
          <motion.div
            ref={portraitRef}
            style={
              reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1000 }
            }
            className="relative h-full w-full transform-gpu [transform-style:preserve-3d]"
          >
            <motion.div
              initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0 round 1.75rem)" }}
              animate={{ clipPath: "inset(0 0 0% 0 round 1.75rem)" }}
              transition={{ duration: 1.05, delay: reduceMotion ? 0 : 0.72, ease: ease.out }}
              className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/[0.16] bg-[#f4f3ef] shadow-[0_38px_90px_-35px_rgba(0,0,0,0.95)]"
            >
              <Image
                src={siteConfig.assets.profileImage}
                alt="Portrait of Abdulelah Alkhathami"
                fill
                priority
                sizes="(max-width: 1024px) 82vw, 470px"
                className="object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(135deg,rgba(70,246,255,0.06),transparent_36%,transparent_70%,rgba(59,101,255,0.10))]"
              />
              {!reduceMotion ? (
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e8fbff]/80 to-transparent shadow-[0_0_22px_rgba(70,246,255,0.8)]"
                  initial={{ top: "-4%", opacity: 0 }}
                  animate={{ top: "104%", opacity: [0, 0.85, 0.85, 0] }}
                  transition={{ duration: 1.25, delay: 1.25, ease: "linear" }}
                />
              ) : null}
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -12, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.65, delay: reduceMotion ? 0 : 1.6, ease: ease.out }}
              className="absolute -bottom-3 -left-3 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#040b09]/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl sm:-left-5"
            >
              <Monogram className="h-5 w-auto text-[#c8ff54]" />
              <span className="leading-tight">
                <span className="block font-display text-sm text-[#f4fff9]">
                  Abdulelah Alkhathami
                </span>
                <span lang="ar" className="mt-0.5 block text-xs text-[#8fa8a1]">
                  عبدالإله الخثعمي
                </span>
              </span>
            </motion.div>
          </motion.div>
        </NeuralOrbit>
      </motion.div>
    </section>
  );
}
