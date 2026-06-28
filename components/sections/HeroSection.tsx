"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Download, Sparkles } from "lucide-react";
import { AISystemDiagram } from "@/components/visuals/AISystemDiagram";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { siteConfig } from "@/data/site";

const proofItems = [
  "6+ AI Projects",
  "Top 30 SDAIA x Microsoft",
  "4+ National Hackathons / Programs",
  "Google Cloud AI Project",
  "Local AI System Leader"
];

export function HeroSection() {
  return (
    <section className="container-shell grid min-h-[calc(100svh-4rem)] items-center gap-12 pb-14 pt-16 sm:pb-16 sm:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:pb-20 lg:pt-24">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="badge mb-6 border-sky-300/20 bg-sky-300/10 text-sky-100"
        >
          <Sparkles className="mr-2 h-3.5 w-3.5 text-sky-200" aria-hidden="true" />
          AI Engineer &middot; LLM Applications &middot; Cloud AI &middot; Riyadh, Saudi Arabia
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          Building intelligent <span className="gradient-text">AI systems</span> that turn real-world problems into{" "}
          <span className="gradient-text">scalable digital solutions.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg"
        >
          I am Abdulelah Alkhathami, an Information Systems graduate focused on
          NLP, LLM applications, RAG-style assistants, AI automation concepts,
          Cloud AI, and applied AI projects across education, digital security,
          sustainability, fintech, legal tech, and immersive learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <ButtonLink href="/projects" showArrow className="w-full sm:w-auto">
            View My Projects
          </ButtonLink>
          <ButtonLink
            href={siteConfig.resumes.engineer}
            variant="secondary"
            download
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Resume
          </ButtonLink>
          <ButtonLink href="/journey" variant="ghost" showArrow className="w-full sm:w-auto">
            Explore AI Journey
          </ButtonLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
          aria-label="Credibility highlights"
        >
          {proofItems.map((item) => (
            <span key={item} className="flex items-center rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-medium text-slate-200 backdrop-blur-xl">
              <BadgeCheck className="mr-2 h-3.5 w-3.5 text-sky-200" aria-hidden="true" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.12 }}
        className="relative lg:pl-4"
      >
        <AISystemDiagram />
      </motion.div>
    </section>
  );
}
