"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignatureMonogram } from "@/components/ui/SignatureMonogram";
import { openCompanion } from "@/lib/agent/companion";
import { siteConfig } from "@/data/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const primary = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Résumé", href: "/resume" },
  { label: "Contact", href: "/contact" }
];

const secondary = [
  { label: "Notes", href: "/blog" },
  { label: "Achievements", href: "/achievements" },
  { label: "Skills", href: "/skills" }
];

const socials = [
  { label: "GitHub", href: siteConfig.social.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin }
];

export function MobileMenu() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function close() {
    setOpen(false);
  }

  function askGuide() {
    setOpen(false);
    openCompanion({
      prompt:
        "Give me the 30-second summary of Abdulelah for someone who's hiring.",
      send: true
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-paper transition hover:border-accent/40 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[60] bg-ink-900/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
            >
              <motion.div
                className="fixed inset-0 z-[61] flex flex-col overflow-y-auto overscroll-contain bg-[#0a0a0b] px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] pt-[calc(env(safe-area-inset-top)+1.25rem)]"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: reduce ? 0.2 : 0.34, ease: ease.out }}
              >
                <Dialog.Title className="sr-only">
                  Abdulelah Alkhathami — menu
                </Dialog.Title>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <SignatureMonogram play className="h-6 w-auto text-accent" />
                    <span className="font-display text-base font-medium tracking-tight text-paper">
                      Abdulelah Alkhathami
                    </span>
                  </span>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/10 text-paper-dim transition hover:text-paper"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="mt-10" aria-label="Primary">
                  {primary.map((link, index) => {
                    const active = isActive(link.href);

                    return (
                      <motion.div
                        key={link.href}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: reduce ? 0 : 0.08 + index * 0.05,
                          ease: ease.out
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group flex items-center gap-4 rounded-2xl py-3 pl-3 pr-4 transition-colors",
                            active
                              ? "bg-accent/[0.10] text-paper"
                              : "text-paper/80 active:bg-white/[0.03]"
                          )}
                        >
                          <span
                            className={cn(
                              "font-display text-sm tabular-nums",
                              active ? "text-accent" : "text-paper-faint"
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-3xl font-medium leading-none">
                            {link.label}
                          </span>
                          {active ? (
                            <span
                              className="ml-auto h-2 w-2 rounded-full bg-accent"
                              aria-hidden="true"
                            />
                          ) : (
                            <ArrowUpRight
                              className="ml-auto h-5 w-5 text-paper-faint"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <p className="eyebrow mb-4">Here for hiring?</p>
                  <div className="flex flex-col">
                    <Link
                      href="/projects"
                      onClick={close}
                      className="focus-ring group flex items-center justify-between border-b border-white/[0.07] py-3 text-paper transition-colors hover:text-accent"
                    >
                      View the strongest work
                      <ArrowUpRight className="h-4 w-4 text-accent-soft" aria-hidden="true" />
                    </Link>
                    <Link
                      href="/resume"
                      onClick={close}
                      className="focus-ring group flex items-center justify-between border-b border-white/[0.07] py-3 text-paper transition-colors hover:text-accent"
                    >
                      Résumé &amp; CVs
                      <ArrowUpRight className="h-4 w-4 text-accent-soft" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={askGuide}
                      className="focus-ring group flex items-center justify-between py-3 text-left text-paper transition-colors hover:text-accent"
                    >
                      Get the 30-second guide
                      <SignatureMonogram className="h-3.5 w-auto text-accent-soft" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-2.5">
                  {secondary.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className="focus-ring rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-center text-sm font-medium text-paper-dim transition-colors hover:border-accent/30 hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/contact"
                  onClick={close}
                  className="focus-ring mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent text-base font-semibold text-ink-900 shadow-[0_18px_50px_rgba(201,167,92,0.18)] transition active:scale-[0.99]"
                >
                  Start a conversation
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </Link>

                <div className="mt-auto flex items-center justify-between pt-10">
                  <div className="flex gap-3">
                    {socials.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/10 text-paper-dim transition hover:border-accent/35 hover:text-paper"
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                  <span lang="ar" className="font-display text-lg text-paper-dim">
                    عبدالإله الخثعمي
                  </span>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
