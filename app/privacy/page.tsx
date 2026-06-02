import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Notice",
  description:
    "A concise privacy notice for the Abdulelah AI portfolio, contact form, and Agent Abdulelah.",
  path: "/privacy"
});

const privacyPoints = [
  "This portfolio collects contact form submissions only when a visitor chooses to send a message.",
  "A contact message may include a name, email address, company, selected intent, and message content.",
  "Agent contact intent and message text are evaluated deterministically to suggest a follow-up priority. Private contact messages are not sent to DeepSeek.",
  "Agent Abdulelah may process visitor questions to answer portfolio-related queries.",
  "API keys and server-side credentials are never exposed to the browser.",
  "Contact messages are sent to Abdulelah's email using Resend.",
  "Agent Abdulelah is limited to Abdulelah Alkhathami's public portfolio context.",
  "Please do not submit sensitive personal, financial, medical, legal, or confidential information."
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="A clear, privacy-first portfolio notice."
        subtitle="This portfolio keeps data collection limited and uses visitor messages only when someone intentionally reaches out."
      />
      <section className="container-shell section-space">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <article className="premium-panel p-6 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-white">Privacy notice</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The site is designed to support portfolio exploration and direct contact
              while keeping data handling focused and understandable.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">What to know</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-300">
              {privacyPoints.map((point) => (
                <li key={point} className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-5">
              <h2 className="text-base font-semibold text-white">Agent session memory</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Agent Abdulelah may remember recent messages during the current browser
                session to answer follow-up questions. This temporary memory is not
                stored permanently by the site and can be cleared with the Clear chat
                button. Contact form submissions are handled separately and are only
                sent when you submit the form.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-gold/25 bg-gold/10 p-5">
              <p className="text-sm leading-7 text-amber-100">
                For privacy questions, contact Abdulelah directly.
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="focus-ring mt-3 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-white transition hover:text-amber-100"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
