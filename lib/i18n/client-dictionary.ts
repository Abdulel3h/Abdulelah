import type { Dictionary } from "@/lib/i18n/dictionaries";

/** The slice of the dictionary that client components need (serializable). */
export type ClientDictionary = Pick<
  Dictionary,
  | "common"
  | "language"
  | "nav"
  | "search"
  | "status"
  | "evidenceType"
  | "projectFacts"
  | "agent"
  | "readingPath"
  | "error"
>;

export function pickClientDictionary(dict: Dictionary): ClientDictionary {
  return {
    common: dict.common,
    language: dict.language,
    nav: dict.nav,
    search: dict.search,
    status: dict.status,
    evidenceType: dict.evidenceType,
    projectFacts: dict.projectFacts,
    agent: dict.agent,
    readingPath: dict.readingPath,
    error: dict.error
  };
}
