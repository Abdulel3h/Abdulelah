"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getDirection, localizeHref, type Locale } from "@/lib/i18n/config";
import type { ClientDictionary } from "@/lib/i18n/client-dictionary";

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: ClientDictionary;
  /** Locale-aware href for a locale-free internal route. */
  href: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children
}: {
  locale: Locale;
  dictionary: ClientDictionary;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider
      value={{
        locale,
        dir: getDirection(locale),
        t: dictionary,
        href: (path: string) => localizeHref(path, locale)
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useI18n must be used inside LocaleProvider");
  }

  return context;
}
