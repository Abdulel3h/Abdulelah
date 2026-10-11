import type { Metadata } from "next";
import { Privacy } from "@/components/site/pages/Privacy";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).privacy;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/privacy" });
}

export default async function PrivacyPage({ params }: Props) {
  const locale = await resolveLocale(params);

  return <Privacy locale={locale} />;
}
