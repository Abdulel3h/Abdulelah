import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { CompanionCue } from "@/components/agent/CompanionCue";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { siteConfig } from "@/data/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).contact;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/contact" });
}

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.contact;
  const channels = [
    { label: dict.nav.linkedin, value: "in/abdulelah-alkhathami", href: siteConfig.social.linkedin },
    { label: dict.nav.github, value: "@Abdulel3h", href: siteConfig.social.github }
  ];

  return (
    <>
      <section className="container-shell pt-14 sm:pt-20 lg:pt-24" aria-labelledby="contact-title">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <h1
            id="contact-title"
            className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-paper sm:text-5xl lg:text-6xl"
          >
            {t.title}
            <span className="block text-paper/70">{t.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper-dim">{t.intro}</p>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-paper-dim">{t.directLine}</h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="focus-ring mt-4 inline-flex min-h-11 items-center gap-3 rounded font-display text-2xl text-paper transition-colors hover:text-accent-soft sm:text-3xl"
            >
              <Mail className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
              <span dir="ltr">{siteConfig.email}</span>
            </a>
            <div className="mt-4">
              <CopyEmailButton
                email={siteConfig.email}
                labels={{
                  copy: dict.common.copy,
                  copied: dict.common.copied,
                  failed: dict.common.copyFailed,
                  aria: dict.common.copyEmail
                }}
              />
            </div>

            <h2 className="mt-12 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-paper-dim">
              {t.channelsLabel}
            </h2>
            <ul className="mt-3 border-t border-white/[0.08]">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring group flex min-h-14 items-center justify-between gap-6 border-b border-white/[0.08] py-3"
                  >
                    <span className="text-paper">{channel.label}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-paper-dim transition-colors group-hover:text-accent-soft">
                      <span dir="ltr">{channel.value}</span>
                      <ArrowUpRight className="external-mark" aria-hidden="true" />
                      <span className="sr-only">({dict.common.opensInNewTab})</span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex min-h-14 items-center justify-between gap-6 border-b border-white/[0.08] py-3">
                <span className="text-paper">{t.basedIn}</span>
                <span className="text-sm text-paper-dim">{dict.common.location}</span>
              </li>
            </ul>

            <div className="mt-10">
              <CompanionCue
                title={t.guideButton}
                body={t.guideNote}
                prompt={dict.nav.guideSummaryPrompt}
                cta={dict.agent.launcher}
              />
            </div>
          </div>

          <div id="contact-form">
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-paper-dim">{t.formLabel}</h2>
            <p className="mt-2 text-xs text-paper-dim">{t.form.requiredHint}</p>
            <div className="mt-5">
              <ContactForm copy={t.form} locale={locale} email={siteConfig.email} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
