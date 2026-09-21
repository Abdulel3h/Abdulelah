"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Labels = { copy: string; copied: string; failed: string; aria: string };

export function CopyEmailButton({ email, labels }: { email: string; labels: Labels }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function copyWithFallback(value: string) {
    const textarea = document.createElement("textarea");

    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.insetInlineStart = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  async function copyEmail() {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      copied = copyWithFallback(email);
    }

    setState(copied ? "copied" : "failed");
    if (copied) trackEvent("email_copied");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  }

  return (
    <>
      <button
        type="button"
        onClick={copyEmail}
        aria-label={labels.aria}
        className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 text-sm font-semibold text-paper transition hover:border-accent/40"
      >
        {state === "copied" ? (
          <Check className="h-4 w-4 text-accent" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {state === "copied" ? labels.copied : labels.copy}
      </button>
      <span role="status" aria-live="polite" className={state === "failed" ? "ms-3 text-sm text-paper-dim" : "sr-only"}>
        {state === "copied" ? labels.copied : state === "failed" ? labels.failed : ""}
      </span>
    </>
  );
}
