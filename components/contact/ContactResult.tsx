import { Ltr } from "@/components/site/primitives";
import { Status } from "@/components/site/pages/Status";
import { siteConfig } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Result page for the contact form's no-JavaScript fallback (never indexed). */
export function ContactResult({ locale, outcome }: { locale: Locale; outcome: "sent" | "failed" }) {
  const dict = getDictionary(locale);
  const t = dict.contactResult;
  const sent = outcome === "sent";

  return (
    <Status
      id="result-title"
      locale={locale}
      kicker={dict.contact.eyebrow}
      title={sent ? t.sentTitle : t.failedTitle}
      lede={sent ? t.sentBody : t.failedBody}
      links={sent ? [{ label: t.home, href: "/" }] : [{ label: t.backToForm, href: "/contact" }]}
    >
      {!sent ? (
        <a
          href={`mailto:${siteConfig.email}`}
          className="ds-link focus-ring mt-6 inline-flex min-h-11 items-center self-start rounded text-[1.1rem] text-paper"
        >
          <Ltr>{siteConfig.email}</Ltr>
        </a>
      ) : null}
    </Status>
  );
}
