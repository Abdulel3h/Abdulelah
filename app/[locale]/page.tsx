import type { Metadata } from "next";
import { Home } from "@/components/site/home/Home";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return createPageMetadata({
    locale,
    title: dict.home.metaTitle,
    description: dict.home.metaDescription,
    path: "/",
    absoluteTitle: true
  });
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);

  return <Home locale={locale} />;
}
