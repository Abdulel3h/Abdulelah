import type { Metadata } from "next";
import { ContactResult } from "@/components/contact/ContactResult";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);

  return { title: getDictionary(locale).contactResult.failedTitle, robots: { index: false, follow: false } };
}

export default async function ContactFailedPage({ params }: Props) {
  return <ContactResult locale={await resolveLocale(params)} outcome="failed" />;
}
