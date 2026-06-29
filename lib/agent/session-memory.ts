"use client";

import { useSyncExternalStore } from "react";

export type ViewedProject = { slug: string; name: string; category: string };

type SessionState = {
  projects: ViewedProject[];
  resumeViewed: boolean;
  /** False on the server and until sessionStorage has been read on the client. */
  ready: boolean;
};

const STORAGE_KEY = "abdulelah:visit";
const EMPTY: SessionState = { projects: [], resumeViewed: false, ready: false };

let state: SessionState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function persist() {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        projects: state.projects,
        resumeViewed: state.resumeViewed
      })
    );
  } catch {
    // sessionStorage unavailable — stay in-memory for this visit only.
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  let next: SessionState = { projects: [], resumeViewed: false, ready: true };
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SessionState>;
      next = {
        projects: parsed.projects ?? [],
        resumeViewed: parsed.resumeViewed ?? false,
        ready: true
      };
    }
  } catch {
    // ignore malformed storage.
  }
  state = next;
  notify();
}

export function recordProjectView(project: ViewedProject) {
  hydrate();
  if (state.projects.some((entry) => entry.slug === project.slug)) return;
  state = { ...state, projects: [...state.projects, project], ready: true };
  persist();
  notify();
}

export function recordResumeView() {
  hydrate();
  if (state.resumeViewed) return;
  state = { ...state, resumeViewed: true, ready: true };
  persist();
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  hydrate();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

/**
 * Reads the current visit's memory. Returns the empty state on the server and
 * the first client render (no hydration mismatch), then fills in from
 * sessionStorage after mount. `ready` lets callers wait for real state.
 */
export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
