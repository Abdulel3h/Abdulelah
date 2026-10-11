import type { Metadata } from "next";
import { locale as localeParam } from "next/root-params";
import { SearchButton } from "@/components/layout/SearchButton";
import { Status } from "@/components/site/pages/Status";
import { siteConfig } from "@/data/site";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

async function currentLocale(): Promise<Locale> {
  try {
    const value = await localeParam();

    return isLocale(value) ? value : "en";
  } catch {
    return "en";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const dict = getDictionary(locale);
  const name = locale === "ar" ? siteConfig.arabicName : siteConfig.name;

  return {
    title: { absolute: `${dict.notFound.metaTitle} | ${name}` },
    robots: { index: false, follow: true }
  };
}

export default async function NotFound() {
  const locale = await currentLocale();
  const t = getDictionary(locale).notFound;

  return (
    <Status
      id="not-found-title"
      locale={locale}
      mark="404"
      kicker={t.eyebrow}
      title={t.title}
      lede={t.body}
      links={[
        { label: t.links.home, href: "/" },
        { label: t.links.projects, href: "/projects" },
        { label: t.links.about, href: "/about" },
        { label: t.links.contact, href: "/contact" }
      ]}
    >
      <div className="mt-8">
        <SearchButton label={t.search} />
      </div>
    </Status>
  );
}
