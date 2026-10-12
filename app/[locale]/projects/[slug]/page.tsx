import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { CaseStudy } from "@/components/site/work/CaseStudy";
import { getProject, projectSlugs } from "@/data/projects";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Unknown slugs render the localized not-found page (404) on the server.
export const dynamicParams = true;

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = getProject(slug, locale);

  if (!project) {
    return { title: getDictionary(locale).caseStudy.notFoundTitle, robots: { index: false } };
  }

  return createPageMetadata({
    locale,
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: "article",
    keywords: [project.name, ...(project.altName ? [project.altName] : []), project.domain, ...project.technologies]
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const project = getProject(slug, locale);

  if (!project) {
    notFound();
  }

  const structuredData = (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.projects, path: "/projects" },
            { name: project.name, path: `/projects/${project.slug}` }
          ],
          locale
        )}
      />
      <JsonLd data={projectJsonLd(project, locale)} />
    </>
  );

  return (
    <>
      {structuredData}
      <CaseStudy project={project} locale={locale} />
    </>
  );
}
