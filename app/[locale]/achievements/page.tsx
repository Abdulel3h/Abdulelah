import type { Metadata } from "next";
import { Achievements } from "@/components/site/pages/Achievements";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).achievements;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/achievements" });
}

export default async function AchievementsPage({ params }: Props) {
  const locale = await resolveLocale(params);

  return <Achievements locale={locale} />;
}
