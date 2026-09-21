import type { Metadata } from "next";
import Link from "next/link";
import { locale as localeParam } from "next/root-params";
import { ArrowUpRight } from "lucide-react";
import { SearchButton } from "@/components/layout/SearchButton";
import { siteConfig } from "@/data/site";
import { isLocale, localizeHref, type Locale } from "@/lib/i18n/config";
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
  const links = [
    { label: t.links.home, href: "/" },
    { label: t.links.projects, href: "/projects" },
    { label: t.links.about, href: "/about" },
    { label: t.links.contact, href: "/contact" }
  ];

  return (
    <section className="container-shell flex min-h-[72svh] flex-col justify-center py-20" aria-labelledby="not-found-title">
      <p className="eyebrow mb-6">{t.eyebrow}</p>
      <h1
        id="not-found-title"
        className="font-display text-5xl font-medium leading-[1] tracking-[-0.01em] text-paper sm:text-6xl lg:text-7xl"
      >
        {t.title} <span className="italic text-paper/70">{t.titleAccent}</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-paper-dim">{t.body}</p>
      <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={localizeHref(link.href, locale)}
              className="focus-ring group inline-flex min-h-11 items-center gap-1.5 rounded text-base font-medium text-paper transition-colors hover:text-accent-soft"
            >
              {link.label}
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </li>
        ))}
        <li>
          <SearchButton label={t.search} />
        </li>
      </ul>
    </section>
  );
}
