"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Github, Linkedin } from "lucide-react";
import { contactLink, navLinks, siteConfig } from "@/data/site";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Monogram } from "@/components/ui/Monogram";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const moreLinks = [
  { label: "Achievements", href: "/achievements" },
  { label: "Skills", href: "/skills" },
  { label: "Notes", href: "/blog" }
];

const profileLinks = [
  { label: "GitHub", href: siteConfig.social.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin }
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isMoreActive = moreLinks.some((link) => isActive(link.href));

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0a0a0b]/85 px-4 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-lg sm:bg-[#0a0a0b]/72 sm:px-5 sm:backdrop-blur-2xl md:px-6 lg:gap-4 lg:rounded-3xl">
        <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <Link
          href="/"
          className="focus-ring group flex items-center gap-2.5 rounded-full"
          aria-label="Abdulelah Alkhathami — home"
        >
          <Monogram className="h-6 w-auto text-accent transition-colors group-hover:text-accent-soft" />
          <span className="font-display text-[0.98rem] font-medium tracking-tight text-paper">
            Abdulelah <span className="hidden sm:inline">Alkhathami</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring group relative rounded-full px-3 py-2 text-sm font-medium text-paper-dim transition hover:text-paper",
                isActive(link.href) && "text-paper"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent/30 transition group-hover:scale-x-100",
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
                  "focus-ring group relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-paper-dim transition hover:text-paper",
                  isMoreActive && "text-paper"
                )}
                aria-label="Open more navigation links"
              >
                More
                <ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" aria-hidden="true" />
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent/30 transition group-hover:scale-x-100",
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
                    className={cn(isActive(link.href) && "bg-white/[0.06] text-paper")}
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
                          className: "text-paper-dim"
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

        <MobileMenu />
      </nav>
    </header>
  );
}
