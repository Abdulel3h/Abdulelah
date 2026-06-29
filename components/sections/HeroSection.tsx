"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Monogram } from "@/components/ui/Monogram";
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
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      rotateY.set(dx * 8);
      rotateX.set(dy * -8);
    }
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
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
      className="container-shell relative grid min-h-[calc(100svh-4rem)] items-center gap-14 pb-16 pt-14 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pb-24 lg:pt-20"
    >
      <div
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(440px circle at var(--px, 50%) var(--py, 50%), rgba(201,167,92,0.10), transparent 62%)"
        }}
      />

      <div className="relative z-10 order-1 lg:order-1">
        <motion.p {...reveal(0)} className="eyebrow mb-7">
          Riyadh, Saudi Arabia · Available for select work
        </motion.p>

        <motion.h1
          {...reveal(0.06)}
          className="font-display font-medium leading-[0.92] tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(2.9rem, 7.5vw, 5.75rem)" }}
        >
          Abdulelah
          <span className="block text-paper/85">Alkhathami</span>
        </motion.h1>

        <motion.p
          {...reveal(0.14)}
          className="mt-8 max-w-xl text-lg leading-8 text-paper-dim sm:text-xl"
        >
          I design and build{" "}
          <span className="font-display italic text-paper">intelligent products</span>{" "}
          — where software, AI, and considered design meet. I turn messy,
          real-world problems into systems people actually use.
        </motion.p>

        <motion.div
          {...reveal(0.22)}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic className="w-full sm:w-auto">
            <ButtonLink href="/projects" showArrow className="w-full">
              View my work
            </ButtonLink>
          </Magnetic>
          <ButtonLink href="/about" variant="ghost" showArrow className="w-full sm:w-auto">
            My story
          </ButtonLink>
          <ButtonLink
            href={siteConfig.resumes.engineer}
            variant="secondary"
            download
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            CV
          </ButtonLink>
        </motion.div>

        <motion.div {...reveal(0.3)} className="mt-12">
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
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.3 : duration.slower, ease: ease.out }}
        className="relative z-10 order-2 mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:order-2 lg:max-w-[440px]"
      >
        <motion.div
          ref={portraitRef}
          style={
            reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }
          }
          className="relative transform-gpu [transform-style:preserve-3d]"
        >
          <div
            className="absolute -inset-6 -z-10 rounded-[2.75rem]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,167,92,0.14), transparent 75%)"
            }}
            aria-hidden="true"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/[0.14] shadow-glow">
            <Image
              src={siteConfig.assets.profileImage}
              alt="Portrait of Abdulelah Alkhathami"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 440px"
              className="object-cover object-top"
            />
          </div>

          <div className="absolute -bottom-4 -left-3 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0a0a0b]/90 px-4 py-2.5 backdrop-blur-xl sm:-left-5">
            <Monogram className="h-5 w-auto text-accent" />
            <span className="leading-tight">
              <span className="block font-display text-sm text-paper">
                Abdulelah Alkhathami
              </span>
              <span lang="ar" className="mt-0.5 block text-xs text-paper-dim">
                عبدالإله الخثعمي
              </span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
