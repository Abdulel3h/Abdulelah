import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Abdulelah Alkhathami — for roles, collaborations, hackathons, or just to talk about something you're building.",
  path: "/contact"
});

const channels = [
  {
    label: "LinkedIn",
    value: "in/abdulelah-alkhathami",
    href: siteConfig.social.linkedin
  },
  {
    label: "GitHub",
    value: "@Abdulel3h",
    href: siteConfig.social.github
  }
];

export default function ContactPage() {
  return (
    <>
      <section className="container-shell pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Contact</p>
          <h1 className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl">
            Let&apos;s build something.
            <span className="block text-paper/55">Tell me what you&apos;re making.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">
            Hiring, collaborating, or just curious — I read everything that comes
            in, and I usually reply within a day or two.
          </p>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-paper-faint">
              The direct line
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="focus-ring mt-4 block font-display text-2xl text-paper transition-colors hover:text-accent sm:text-3xl"
            >
              {siteConfig.email}
            </a>
            <div className="mt-5">
              <CopyEmailButton email={siteConfig.email} />
            </div>

            <ul className="mt-12 border-t border-white/[0.08]">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring group flex items-baseline justify-between gap-6 border-b border-white/[0.08] py-4"
                  >
                    <span className="text-paper">{channel.label}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-paper-dim transition-colors group-hover:text-accent">
                      {channel.value}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-6 border-b border-white/[0.08] py-4">
                <span className="text-paper">Based in</span>
                <span className="text-sm text-paper-dim">{siteConfig.location}</span>
              </li>
            </ul>

            <p className="mt-8 text-sm leading-7 text-paper-dim">
              In a hurry? Ask{" "}
              <span className="text-paper">Agent Abdulelah</span> in the corner — it
              knows my work and can point you to the right project or the right CV.
            </p>
          </div>

          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-paper-faint">
              Or write me a note
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
