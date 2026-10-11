import type { Metadata } from "next";
import { Contact } from "@/components/site/pages/Contact";
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

  return <Contact locale={locale} />;
}
