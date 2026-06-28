"use client";

import { useEffect, useState } from "react";

export type ViewedProject = { slug: string; name: string; category: string };

type SessionState = {
  projects: ViewedProject[];
  resumeViewed: boolean;
};

const STORAGE_KEY = "abdulelah:visit";
const EMPTY: SessionState = { projects: [], resumeViewed: false };

let state: SessionState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    // sessionStorage unavailable — stay in-memory only for this visit.
  }
}

function commit(next: SessionState) {
  state = next;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence failures; memory is best-effort and visit-only.
  }
  listeners.forEach((listener) => listener());
}

export function recordProjectView(project: ViewedProject) {
  hydrate();
  if (state.projects.some((entry) => entry.slug === project.slug)) return;
  commit({ ...state, projects: [...state.projects, project] });
}

export function recordResumeView() {
  hydrate();
  if (state.resumeViewed) return;
  commit({ ...state, resumeViewed: true });
}

/**
 * Reads the current visit's memory. Returns the empty state on the server and
 * the first client render (no hydration mismatch), then fills in after mount.
 * `ready` lets callers wait until the real visit state is known.
 */
export function useSession() {
  const [snapshot, setSnapshot] = useState<SessionState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    setSnapshot(state);
    setReady(true);
    const listener = () => setSnapshot(state);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { projects: snapshot.projects, resumeViewed: snapshot.resumeViewed, ready };
}
