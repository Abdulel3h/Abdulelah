"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink, Github, Linkedin, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { contactLink, navLinks, siteConfig } from "@/data/site";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const moreLinks = [
  { label: "Blog / Insights", href: "/blog" },
  { label: "AI Journey", href: "/journey" }
];

const profileLinks = [
  { label: "GitHub", href: siteConfig.social.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin }
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isMoreActive = moreLinks.some((link) => isActive(link.href));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/72 backdrop-blur-2xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />
      <nav className="container-shell flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring group flex items-center gap-2 rounded-full text-sm font-semibold"
          aria-label="Go to home"
          onClick={() => setIsOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-sky-300/25 bg-sky-300/10 text-sky-200 shadow-glow transition group-hover:border-sky-300/50">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="gradient-text">{siteConfig.brand}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring group relative rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white",
                isActive(link.href) && "text-white"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-sky-300 to-violet-300 transition group-hover:scale-x-100",
                  isActive(link.href) && "scale-x-100"
                )}
              />
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "focus-ring group relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white",
                  isMoreActive && "text-white"
                )}
                aria-label="Open more navigation links"
              >
                More
                <ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" aria-hidden="true" />
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-sky-300 to-violet-300 transition group-hover:scale-x-100",
                    isMoreActive && "scale-x-100"
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(isActive(link.href) && "bg-white/[0.06] text-white")}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="hidden items-center gap-3 xl:flex">
            <CommandMenu />
            <div className="flex items-center gap-2">
              {profileLinks.map((profile) => {
                const Icon = profile.icon;

                return (
                  <Tooltip key={profile.href}>
                    <TooltipTrigger asChild>
                      <a
                        href={profile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "icon",
                          className: "text-slate-300"
                        })}
                        aria-label={`${profile.label} profile`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{profile.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
          <Button asChild variant="gold">
            <Link href={contactLink.href}>{contactLink.label}</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="h-screen max-h-screen overflow-hidden p-0 supports-[height:100dvh]:h-dvh supports-[height:100dvh]:max-h-dvh"
          >
            <div className="h-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-6 [-webkit-overflow-scrolling:touch]">
              <SheetHeader className="pr-12">
                <SheetTitle>{siteConfig.brand}</SheetTitle>
                <SheetDescription>
                  Navigate Abdulelah&apos;s AI projects, skills, resume, and contact details.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-8 grid gap-2">
                {[...navLinks, ...moreLinks].map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "focus-ring rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white",
                        isActive(link.href) && "bg-white/10 text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href={contactLink.href}
                    className={buttonVariants({
                      variant: "gold",
                      className: "mt-3 w-full"
                    })}
                  >
                    {contactLink.label}
                  </Link>
                </SheetClose>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-3">
                {profileLinks.map((profile) => {
                  const Icon = profile.icon;

                  return (
                    <a
                      key={profile.href}
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-sky-300/35 hover:text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4 text-sky-200" aria-hidden="true" />
                        {profile.label}
                      </span>
                      <ExternalLink className="h-4 w-4 text-slate-500" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
