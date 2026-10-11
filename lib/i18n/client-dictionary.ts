import type { Dictionary } from "@/lib/i18n/dictionaries";

/** The slice of the dictionary that client components need (serializable). */
export type ClientDictionary = Pick<Dictionary, "common" | "nav" | "search" | "agent" | "readingPath" | "error">;

export function pickClientDictionary(dict: Dictionary): ClientDictionary {
  return {
    common: dict.common,
    nav: dict.nav,
    search: dict.search,
    agent: dict.agent,
    readingPath: dict.readingPath,
    error: dict.error
  };
}
