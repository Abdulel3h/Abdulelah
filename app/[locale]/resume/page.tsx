import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Resume } from "@/components/site/pages/Resume";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).resume;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/resume" });
}

export default async function ResumePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.resume, path: "/resume" }
          ],
          locale
        )}
      />
      <Resume locale={locale} />
    </>
  );
}
