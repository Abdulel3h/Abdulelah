import type { Metadata } from "next";
import { Skills } from "@/components/site/pages/Skills";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).skills;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/skills" });
}

export default async function SkillsPage({ params }: Props) {
  const locale = await resolveLocale(params);

  return <Skills locale={locale} />;
}
