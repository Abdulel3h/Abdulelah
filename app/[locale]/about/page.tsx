import type { Metadata } from "next";
import { About } from "@/components/site/pages/About";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).about;

  return createPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription, path: "/about" });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);

  return <About locale={locale} />;
}
