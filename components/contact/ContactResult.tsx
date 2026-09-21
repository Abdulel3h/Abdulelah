import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { localizeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Result page for the contact form's no-JavaScript fallback (never indexed). */
export function ContactResult({ locale, outcome }: { locale: Locale; outcome: "sent" | "failed" }) {
  const dict = getDictionary(locale);
  const t = dict.contactResult;
  const sent = outcome === "sent";

  return (
    <section className="container-shell flex min-h-[60svh] flex-col justify-center py-20" aria-labelledby="result-title">
      <p className="eyebrow mb-6">{dict.contact.eyebrow}</p>
      <h1 id="result-title" className="font-display text-4xl font-medium leading-tight text-paper sm:text-5xl">
        {sent ? t.sentTitle : t.failedTitle}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-paper-dim">{sent ? t.sentBody : t.failedBody}</p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href={localizeHref(sent ? "/" : "/contact", locale)}
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-ink-900 transition hover:bg-accent-soft"
        >
          {sent ? t.home : t.backToForm}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
        {!sent ? (
          <a
            href={`mailto:${siteConfig.email}`}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-paper transition hover:text-accent-soft"
          >
            <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
            <span dir="ltr">{siteConfig.email}</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
