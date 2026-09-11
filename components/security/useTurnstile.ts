"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile, loaded lazily and executed on demand.
 *
 * The widget is rendered in "interaction-only" mode, so a normal visitor never
 * sees anything: it resolves silently and only draws a challenge when
 * Cloudflare actually wants one. The token it produces is meaningless on its
 * own — the server verifies it with Cloudflare before trusting the request.
 *
 * With NEXT_PUBLIC_TURNSTILE_SITE_KEY unset the hook is inert and the site
 * falls back to honeypot plus rate limiting.
 */

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_TIMEOUT_MS = 15_000;

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

let scriptPromise: Promise<TurnstileApi | null> | null = null;

function loadTurnstile() {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  scriptPromise ??= new Promise<TurnstileApi | null>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    const script = existingScript ?? document.createElement("script");

    script.addEventListener("load", () => resolve(window.turnstile ?? null));
    script.addEventListener("error", () => resolve(null));

    if (!existingScript) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

export function useTurnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const resolveTokenRef = useRef<((token: string | null) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const settle = useCallback((token: string | null) => {
    const resolve = resolveTokenRef.current;

    resolveTokenRef.current = null;
    resolve?.(token);
  }, []);

  const getToken = useCallback(async () => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current) {
      return null;
    }

    const turnstile = await loadTurnstile();

    if (!turnstile || !containerRef.current) {
      return null;
    }

    // Only one challenge can be in flight; abandon any previous waiter.
    settle(null);

    const tokenPromise = new Promise<string | null>((resolve) => {
      resolveTokenRef.current = resolve;
    });

    if (widgetIdRef.current) {
      turnstile.reset(widgetIdRef.current);
    } else {
      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: "interaction-only",
        execution: "execute",
        callback: (token: string) => settle(token),
        "error-callback": () => settle(null),
        "expired-callback": () => settle(null),
        "timeout-callback": () => settle(null)
      });
    }

    if (widgetIdRef.current) {
      turnstile.execute(widgetIdRef.current);
    }

    const timeout = setTimeout(() => settle(null), TOKEN_TIMEOUT_MS);

    try {
      return await tokenPromise;
    } finally {
      clearTimeout(timeout);
    }
  }, [settle]);

  return {
    containerRef,
    getToken,
    isEnabled: Boolean(TURNSTILE_SITE_KEY)
  };
}
