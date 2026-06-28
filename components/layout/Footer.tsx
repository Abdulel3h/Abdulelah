import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Monogram } from "@/components/ui/Monogram";
import { Separator } from "@/components/ui/separator";
import { quickLinks, siteConfig } from "@/data/site";

const profileLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
  { label: "GitHub", href: siteConfig.social.github, icon: Github }
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#030712]/78">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="container-shell pt-14">
        <div className="premium-panel p-6 sm:p-8 lg:p-10">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow mb-5">Let&apos;s build something</p>
              <h2 className="max-w-3xl font-display text-3xl font-medium leading-tight text-paper sm:text-4xl">
                Have an idea worth building?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-paper-dim">
                I&apos;m open to product collaborations, AI work, and good problems
                worth solving. Tell me what you&apos;re building.
              </p>
            </div>
            <Button asChild variant="gold" className="w-full sm:w-auto">
              <Link href="/contact">
                Start a conversation
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link
            href="/"
            className="focus-ring group inline-flex items-center gap-2.5 rounded"
            aria-label="Abdulelah Alkhathami — home"
          >
            <Monogram className="h-6 w-auto text-accent transition-colors group-hover:text-accent-soft" />
            <span className="font-display text-lg font-medium tracking-tight text-paper">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-2 text-sm text-paper-dim" lang="ar">
            {siteConfig.arabicName}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-paper-dim">
            Designing and building intelligent products — from AI agents and RAG
            systems to Arabic AI — across education, security, sustainability,
            fintech, and legal tech.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full text-sm font-medium text-sky-200 transition hover:text-white"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {siteConfig.email}
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Quick links</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded text-sm text-slate-400 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Profiles</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {profileLinks.map((profile) => {
              const Icon = profile.icon;

              return (
                <a
                  key={profile.label}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "text-slate-300"
                  })}
                  aria-label={`${profile.label} profile`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {profile.label}
                </a>
              );
            })}
          </div>
          <Separator className="my-6" />
          <p className="mt-6 text-xs text-slate-500">
            Copyright {new Date().getFullYear()} {siteConfig.name}{" "}
            (<span lang="ar">{siteConfig.arabicName}</span>). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
