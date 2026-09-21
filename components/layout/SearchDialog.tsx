"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { ArrowUpRight, Download, FileText, Github, Mail, MessageCircle, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type MutableRefObject } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { siteConfig } from "@/data/site";
import { openCompanion } from "@/lib/agent/companion";
import { trackEvent } from "@/lib/analytics";
import type { SearchIndexItem } from "@/lib/search-index";
import { restoreFocus } from "@/lib/ui-events";

type ActionId = "guide" | "cv-engineer" | "cv-specialist" | "github" | "email";

type Entry = {
  id: string;
  group: "pages" | "projects" | "notes" | "actions";
  label: string;
  hint?: string;
  keywords: string;
  href?: string;
  action?: ActionId;
  icon?: "file" | "download" | "github" | "mail" | "guide";
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

/**
 * Site-wide search as a modal combobox (cmdk provides the combobox, listbox
 * and option roles with aria-activedescendant; Radix provides the modal
 * dialog, focus trap and inert background). Focus returns to whatever opened
 * it — the Search button, the mobile menu button, or the element that was
 * focused when Ctrl/⌘ K was pressed.
 */
export default function SearchDialog({
  index,
  open,
  onOpenChange,
  returnFocusRef,
  initialQuery = "",
  onReady
}: {
  index: SearchIndexItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: MutableRefObject<HTMLElement | null>;
  initialQuery?: string;
  onReady?: () => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    onReady?.();
  }, [onReady]);
  const setOpen = onOpenChange;

  const entries = useMemo<Entry[]>(() => {
    const indexed: Entry[] = index.map((item) => ({
      id: item.id,
      group: item.group,
      label: item.label,
      hint: item.hint,
      keywords: item.keywords,
      icon: item.group === "notes" ? "file" : undefined,
      href: item.href
    }));

    const actions: Entry[] = [
      {
        id: "action-guide",
        group: "actions",
        label: t.search.actions.askGuide,
        keywords: "ask guide agent ai chat assistant اسأل الدليل",
        icon: "guide",
        action: "guide"
      },
      {
        id: "action-cv-engineer",
        group: "actions",
        label: t.search.actions.engineerCv,
        keywords: "cv resume engineer download pdf سيرة",
        icon: "download",
        action: "cv-engineer"
      },
      {
        id: "action-cv-specialist",
        group: "actions",
        label: t.search.actions.specialistCv,
        keywords: "cv resume specialist download pdf سيرة",
        icon: "download",
        action: "cv-specialist"
      },
      {
        id: "action-github",
        group: "actions",
        label: t.search.actions.github,
        keywords: "github code repositories source كود",
        icon: "github",
        action: "github"
      },
      {
        id: "action-email",
        group: "actions",
        label: t.search.actions.email,
        keywords: "email contact mail بريد تواصل",
        icon: "mail",
        action: "email"
      }
    ];

    return [...indexed, ...actions];
  }, [index, t]);

  const results = useMemo(() => {
    const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);

    if (!terms.length) {
      return entries;
    }

    return entries.filter((entry) => {
      const haystack = normalize(`${entry.label} ${entry.hint ?? ""} ${entry.keywords}`);

      return terms.every((term) => haystack.includes(term));
    });
  }, [entries, query]);

  function download(file: string, cv: "engineer" | "specialist") {
    trackEvent("cv_downloaded", { cv, source: "search" });
    const link = document.createElement("a");

    link.href = file;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function choose(entry: Entry) {
    setOpen(false);
    setQuery("");

    if (entry.href) {
      // Navigation moves focus to the new page instead of back to the trigger.
      returnFocusRef.current = null;
      router.push(entry.href);
      return;
    }

    switch (entry.action) {
      case "guide": {
        const returnTo = returnFocusRef.current;

        returnFocusRef.current = null;
        openCompanion({ returnFocusTo: returnTo });
        break;
      }
      case "cv-engineer":
        download(siteConfig.resumes.engineer, "engineer");
        break;
      case "cv-specialist":
        download(siteConfig.resumes.specialist, "specialist");
        break;
      case "github":
        window.open(siteConfig.social.github, "_blank", "noopener,noreferrer");
        break;
      case "email":
        window.location.assign(`mailto:${siteConfig.email}`);
        break;
    }
  }

  const groups: Entry["group"][] = ["pages", "projects", "notes", "actions"];

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-[70] bg-ink-900/75 backdrop-blur-sm" />
        <DialogPrimitive.Content
          aria-describedby="site-search-description"
          className="dialog-sheet fixed inset-x-3 top-[10vh] z-[71] mx-auto flex max-h-[80vh] max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/[0.12] bg-ink-900 shadow-glow sm:inset-x-6"
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef.current;

            returnFocusRef.current = null;

            if (target) {
              event.preventDefault();

              if (!restoreFocus(target)) {
                document.getElementById("main-content")?.focus();
              }
            }
          }}
        >
          <DialogPrimitive.Title className="sr-only">{t.search.title}</DialogPrimitive.Title>
          <DialogPrimitive.Description id="site-search-description" className="sr-only">
            {t.search.description}
          </DialogPrimitive.Description>

          <CommandPrimitive
            shouldFilter={false}
            loop
            label={t.search.title}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex items-center gap-3 border-b border-white/10 ps-5 pe-3 focus-within:border-accent/60">
              <Search className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <CommandPrimitive.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                dir="auto"
                aria-label={t.search.inputLabel}
                placeholder={t.search.placeholder}
                className="h-14 w-full min-w-0 bg-transparent text-base text-paper outline-none placeholder:text-paper-faint"
              />
              <DialogPrimitive.Close
                className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full text-paper-dim transition hover:text-paper"
                aria-label={t.search.close}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>

            <CommandPrimitive.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              <CommandPrimitive.Empty className="px-4 py-8 text-center text-sm text-paper-dim">
                {t.search.empty}
              </CommandPrimitive.Empty>
              {groups.map((group) => {
                const items = results.filter((entry) => entry.group === group);

                if (!items.length) return null;

                return (
                  <CommandPrimitive.Group
                    key={group}
                    heading={t.search.groups[group]}
                    className="px-1 pb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-paper-faint"
                  >
                    {items.map((entry) => (
                      <CommandPrimitive.Item
                        key={entry.id}
                        value={entry.id}
                        onSelect={() => choose(entry)}
                        className="flex min-h-12 cursor-pointer select-none items-center justify-between gap-3 rounded-2xl border border-transparent px-3 py-2 text-sm text-paper outline-none data-[selected=true]:border-accent/40 data-[selected=true]:bg-white/[0.07]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <EntryIcon icon={entry.icon} />
                          <span className="min-w-0">
                            <span className="block truncate" dir="auto">
                              {entry.label}
                            </span>
                            {entry.hint ? (
                              <span className="block truncate text-xs text-paper-dim" dir="auto">
                                {entry.hint}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-paper-faint rtl:-scale-x-100" aria-hidden="true" />
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                );
              })}
            </CommandPrimitive.List>

            <p className="border-t border-white/10 px-5 py-3 text-xs text-paper-dim">{t.search.tip}</p>
          </CommandPrimitive>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function EntryIcon({ icon }: { icon: Entry["icon"] }) {
  const className = "h-4 w-4 shrink-0 text-accent";

  if (icon === "download") return <Download className={className} aria-hidden="true" />;
  if (icon === "github") return <Github className={className} aria-hidden="true" />;
  if (icon === "mail") return <Mail className={className} aria-hidden="true" />;
  if (icon === "guide") return <MessageCircle className={className} aria-hidden="true" />;
  if (icon === "file") return <FileText className={className} aria-hidden="true" />;

  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />;
}
