import { Globe2, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { globalPulseItems } from "@/data/globalPulse";
import { getBlogText, globalPulseItemsAr, type BlogLanguage } from "@/data/blog.ar";
import { cn } from "@/lib/utils";

export function GlobalPulse({ language = "en" }: { language?: BlogLanguage }) {
  const isArabic = language === "ar";
  const text = getBlogText(language);
  const items =
    isArabic && globalPulseItemsAr.length === globalPulseItems.length
      ? globalPulseItemsAr
      : globalPulseItems;

  return (
    <section
      dir={isArabic ? "rtl" : undefined}
      lang={isArabic ? "ar" : undefined}
      className={cn("section-space section-band", isArabic && "blog-arabic")}
    >
      <div className="container-shell">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="violet">
              <Radio className="me-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {text.pulseBadge}
            </Badge>
          </div>
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
            {text.pulseTitle}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">{text.pulseBody}</p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="glass-card rounded-2xl p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-violet-300/25 bg-violet-400/10 text-violet-100">
                <Globe2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <Badge variant="muted" className="mt-6">
                {item.category}
              </Badge>
              <h3 className="mt-4 text-xl font-semibold leading-8 text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.summary}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {text.curatedSignal}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
