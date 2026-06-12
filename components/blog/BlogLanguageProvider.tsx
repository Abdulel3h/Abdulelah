"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode
} from "react";
import type { BlogLanguage } from "@/data/blog.ar";

const STORAGE_KEY = "blogLanguage";

type Listener = () => void;

const listeners = new Set<Listener>();

let cachedLanguage: BlogLanguage | null = null;

function readPreferredLanguage(): BlogLanguage {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === "ar" || stored === "en") {
      return stored;
    }
  } catch {
    // localStorage can be unavailable (private mode); fall through.
  }

  return window.navigator.language?.toLowerCase().startsWith("ar")
    ? "ar"
    : "en";
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): BlogLanguage {
  if (cachedLanguage === null) {
    cachedLanguage = readPreferredLanguage();
  }

  return cachedLanguage;
}

// The server always renders English; the stored or browser preference is
// applied on the client right after hydration.
function getServerSnapshot(): BlogLanguage {
  return "en";
}

function storeLanguage(next: BlogLanguage) {
  cachedLanguage = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Persisting the preference is best-effort only.
  }

  listeners.forEach((listener) => listener());
}

type BlogLanguageContextValue = {
  language: BlogLanguage;
  isArabic: boolean;
  setLanguage: (language: BlogLanguage) => void;
};

const BlogLanguageContext = createContext<BlogLanguageContextValue | null>(null);

export function BlogLanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setLanguage = useCallback((next: BlogLanguage) => {
    storeLanguage(next);
  }, []);

  return (
    <BlogLanguageContext.Provider
      value={{ language, isArabic: language === "ar", setLanguage }}
    >
      {children}
    </BlogLanguageContext.Provider>
  );
}

export function useBlogLanguage() {
  const context = useContext(BlogLanguageContext);

  if (!context) {
    throw new Error("useBlogLanguage must be used within BlogLanguageProvider");
  }

  return context;
}
