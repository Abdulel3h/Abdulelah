import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { quickLinks, siteConfig } from "@/data/site";

const profileLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
  { label: "GitHub", href: siteConfig.social.github, icon: Github }
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#030712]/78">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
      <div className="container-shell pt-14">
        <div className="premium-panel p-6 sm:p-8">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="badge mb-4 border-gold/25 bg-gold/10 text-amber-100">
                AI Portfolio Platform
              </p>
              <h2 className="max-w-3xl text-2xl font-semibold text-white sm:text-3xl">
                Explore my work in AI, cloud, and intelligent systems.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Building practical, context-aware AI systems for real-world impact.
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/projects">
                View case studies
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="focus-ring rounded text-lg font-semibold">
            <span className="gradient-text">{siteConfig.name}</span>
          </Link>
          <p className="mt-1 text-sm text-slate-400" lang="ar">
            {siteConfig.arabicName}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Building practical, context-aware AI systems for real-world impact
            across NLP, LLMs, Cloud AI, education, security, sustainability,
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
