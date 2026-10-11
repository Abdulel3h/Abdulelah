import { Github, Linkedin } from "lucide-react";
import { CompanionCue } from "@/components/agent/CompanionCue";
import { ContactForm } from "@/components/contact/ContactForm";
import { directional, Ltr, PageHead } from "@/components/site/primitives";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { siteConfig } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteCopy } from "@/lib/i18n/experience";

/**
 * Contact, the fast way first: the address itself, set large and isolated
 * left-to-right, with a copy button; then the two profiles; then a short
 * form for whoever prefers one. The guide is offered for the hurried.
 */
export function Contact({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = siteCopy(locale).contact;
  const { Outward } = directional(locale);
  const channels = [
    { label: "LinkedIn", handle: "in/abdulelah-alkhathami", href: siteConfig.social.linkedin, icon: Linkedin },
    { label: "GitHub", handle: "@Abdulel3h", href: siteConfig.social.github, icon: Github }
  ];

  return (
    <>
      <PageHead id="contact-title" kicker={copy.kicker} title={copy.title} lede={copy.lede} />

      <section
        aria-label={copy.kicker}
        className="ds-shell grid gap-16 pb-[var(--ds-section)] pt-14 lg:grid-cols-12 lg:gap-14 lg:pt-20"
      >
        <div className="lg:col-span-5">
          <h2 className="ds-label">{copy.direct}</h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className="ds-link focus-ring mt-3 inline-block rounded text-[clamp(1.7rem,1.25rem+2vw,2.6rem)] font-medium text-paper"
          >
            <Ltr>{siteConfig.email}</Ltr>
          </a>
          <div className="mt-5">
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

          <h2 className="ds-label mt-14">{copy.elsewhere}</h2>
          <ul className="mt-3 border-t border-white/[0.08]">
            {channels.map((channel) => {
              const Icon = channel.icon;

              return (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring group flex min-h-16 items-center justify-between gap-4 border-b border-white/[0.08] py-3"
                  >
                    <span className="inline-flex items-center gap-3 text-[1.05rem] text-paper">
                      <Icon className="h-4 w-4 text-paper-dim" aria-hidden="true" />
                      <Ltr>{channel.label}</Ltr>
                    </span>
                    <span className="inline-flex items-center gap-2 text-[0.95rem] text-paper-dim transition-colors group-hover:text-accent-soft">
                      <Ltr>{channel.handle}</Ltr>
                      <Outward className="ds-forward h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">({dict.common.opensInNewTab})</span>
                    </span>
                  </a>
                </li>
              );
            })}
            <li className="flex min-h-16 items-center justify-between gap-4 border-b border-white/[0.08] py-3">
              <span className="text-[1.05rem] text-paper">{dict.contact.basedIn}</span>
              <span className="text-[0.95rem] text-paper-dim">{copy.basedIn}</span>
            </li>
          </ul>

          <div className="mt-10">
            <CompanionCue
              title={copy.guideTitle}
              body={copy.guideBody}
              prompt={dict.nav.guideSummaryPrompt}
              cta={dict.agent.launcher}
            />
          </div>
        </div>

        <div id="contact-form" className="scroll-mt-28 lg:col-span-7">
          <h2 className="ds-title text-[1.35rem]">{copy.formTitle}</h2>
          <p className="ds-micro mt-1 text-paper-faint">{dict.contact.form.requiredHint}</p>
          <div className="mt-7">
            <ContactForm copy={dict.contact.form} locale={locale} email={siteConfig.email} />
          </div>
        </div>
      </section>
    </>
  );
}
